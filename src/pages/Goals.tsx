import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus, X, Check, Flame, Trash2, CheckCircle2, BedDouble, Dumbbell, Brain, Users, Salad, Leaf } from "lucide-react";
import Layout from "@/components/Layout";
import { format, differenceInCalendarDays, subDays, isSameDay, parseISO } from "date-fns";

const categories = [
  { value: "sleep", label: "Sleep", icon: BedDouble, color: "bg-blue-100 text-blue-700" },
  { value: "exercise", label: "Exercise", icon: Dumbbell, color: "bg-green-100 text-green-700" },
  { value: "mindfulness", label: "Mindfulness", icon: Brain, color: "bg-purple-100 text-purple-700" },
  { value: "social", label: "Social", icon: Users, color: "bg-orange-100 text-orange-700" },
  { value: "nutrition", label: "Nutrition", icon: Salad, color: "bg-yellow-100 text-yellow-700" },
  { value: "wellness", label: "General Wellness", icon: Leaf, color: "bg-emerald-100 text-emerald-700" },
];

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: string;
  target_days: number;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

interface HabitLog {
  id: string;
  goal_id: string;
  user_id: string;
  logged_date: string;
  note: string | null;
  created_at: string;
}

const Goals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("wellness");
  const [newTarget, setNewTarget] = useState(7);

  const fetchData = async () => {
    if (!user) return;
    const [gRes, lRes] = await Promise.all([
      supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("habit_logs").select("*").eq("user_id", user.id),
    ]);
    if (gRes.data) setGoals(gRes.data as Goal[]);
    if (lRes.data) setLogs(lRes.data as HabitLog[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleCreateGoal = async () => {
    if (!user || !newTitle.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("goals").insert({
      user_id: user.id,
      title: newTitle,
      description: newDesc || null,
      category: newCategory,
      target_days: newTarget,
    });
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not create goal." });
    } else {
      toast({ title: "Goal created! 🎯" });
      setNewTitle("");
      setNewDesc("");
      setNewCategory("wellness");
      setNewTarget(7);
      setCreating(false);
      fetchData();
    }
  };

  const handleLogToday = async (goalId: string) => {
    if (!user) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const alreadyLogged = logs.some((l) => l.goal_id === goalId && l.logged_date === today);
    if (alreadyLogged) {
      // Un-log
      const log = logs.find((l) => l.goal_id === goalId && l.logged_date === today);
      if (log) {
        await supabase.from("habit_logs").delete().eq("id", log.id);
        setLogs((prev) => prev.filter((l) => l.id !== log.id));
      }
    } else {
      const { data, error } = await supabase.from("habit_logs").insert({
        goal_id: goalId,
        user_id: user.id,
        logged_date: today,
      }).select().single();
      if (!error && data) setLogs((prev) => [...prev, data as HabitLog]);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    await supabase.from("goals").delete().eq("id", id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setLogs((prev) => prev.filter((l) => l.goal_id !== id));
    toast({ title: "Goal removed" });
  };

  const getStreak = (goalId: string): number => {
    const goalLogs = logs
      .filter((l) => l.goal_id === goalId)
      .map((l) => l.logged_date)
      .sort()
      .reverse();
    
    if (goalLogs.length === 0) return 0;
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    
    if (goalLogs[0] !== today && goalLogs[0] !== yesterday) return 0;
    
    let streak = 1;
    let checkDate = goalLogs[0] === today ? subDays(new Date(), 1) : subDays(parseISO(goalLogs[0]), 1);
    
    for (let i = 1; i < goalLogs.length; i++) {
      if (isSameDay(parseISO(goalLogs[i]), checkDate)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getCompletionRate = (goalId: string, targetDays: number): number => {
    const goalLogs = logs.filter((l) => l.goal_id === goalId);
    return Math.min(100, Math.round((goalLogs.length / targetDays) * 100));
  };

  const isLoggedToday = (goalId: string): boolean => {
    const today = format(new Date(), "yyyy-MM-dd");
    return logs.some((l) => l.goal_id === goalId && l.logged_date === today);
  };

  const getCategoryInfo = (cat: string) => categories.find((c) => c.value === cat) || categories[5];

  // Last 7 days for mini calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold flex items-center gap-3">
                <Target className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                Goals & Habits
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Set wellness goals and build healthy daily habits</p>
            </div>
            {!creating && (
              <Button className="rounded-full gap-2 self-start sm:self-auto" onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" /> New Goal
              </Button>
            )}
          </div>
        </motion.div>

        {/* Create goal form */}
        <AnimatePresence>
          {creating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-lg">Create a New Goal</h3>
                    <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <Input
                    placeholder="What do you want to achieve?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="border-0 bg-muted/50 font-display text-lg"
                  />

                  <Textarea
                    placeholder="Why is this important to you? (optional)"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="border-0 bg-muted/50 resize-none min-h-[80px]"
                  />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Category</p>
                    <div className="flex gap-2 flex-wrap">
                      {categories.map((c) => {
                        const CatIcon = c.icon;
                        return (
                          <button
                            key={c.value}
                            onClick={() => setNewCategory(c.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              newCategory === c.value ? "ring-2 ring-primary shadow-sm" : ""
                            } ${c.color}`}
                          >
                            <CatIcon className="w-3.5 h-3.5" />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Target: {newTarget} days</p>
                    <input
                      type="range"
                      min={3}
                      max={90}
                      value={newTarget}
                      onChange={(e) => setNewTarget(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
                    <Button className="rounded-full gap-2" disabled={!newTitle.trim() || saving} onClick={handleCreateGoal}>
                      <Check className="w-4 h-4" /> {saving ? "Creating..." : "Create Goal"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full bg-primary/10 animate-breathe flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
          </div>
        ) : goals.length === 0 && !creating ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">No goals yet</h2>
            <p className="text-muted-foreground mb-6">Set your first wellness goal and start building healthy habits.</p>
            <Button className="rounded-full" onClick={() => setCreating(true)}>Create First Goal</Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal, i) => {
              const catInfo = getCategoryInfo(goal.category);
              const streak = getStreak(goal.id);
              const completion = getCompletionRate(goal.id, goal.target_days);
              const loggedToday = isLoggedToday(goal.id);

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-0 bg-card hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {(() => { const CIcon = catInfo.icon; return (
                              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${catInfo.color}`}>
                                <CIcon className="w-3 h-3" /> {catInfo.label}
                              </span>
                            ); })()}
                            {streak > 0 && (
                              <span className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                <Flame className="w-3 h-3" /> {streak} day streak
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-semibold text-base">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{goal.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant={loggedToday ? "default" : "outline"}
                            size="sm"
                            className={`rounded-full gap-1 ${loggedToday ? "" : ""}`}
                            onClick={() => handleLogToday(goal.id)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {loggedToday ? "Done!" : "Log Today"}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{logs.filter((l) => l.goal_id === goal.id).length} / {goal.target_days} days</span>
                          <span>{completion}%</span>
                        </div>
                        <Progress value={completion} className="h-2" />
                      </div>

                      {/* Mini week calendar */}
                      <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1">
                        {last7Days.map((day) => {
                          const dayStr = format(day, "yyyy-MM-dd");
                          const logged = logs.some((l) => l.goal_id === goal.id && l.logged_date === dayStr);
                          return (
                            <div key={dayStr} className="flex flex-col items-center gap-0.5">
                              <span className="text-[10px] text-muted-foreground">{format(day, "EEE")}</span>
                              <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium transition-all ${
                                  logged ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                                }`}
                              >
                                {format(day, "d")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Goals;

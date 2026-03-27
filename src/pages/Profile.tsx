import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Save, Award, Download, FileText, Trophy, Star, Flame, Heart, Zap, Shield, BookOpen, Brain } from "lucide-react";
import Layout from "@/components/Layout";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

// Badge definitions
const BADGE_DEFS: Record<string, { label: string; description: string; icon: React.ElementType; color: string }> = {
  first_checkin: { label: "First Step", description: "Completed your first self-check", icon: Star, color: "text-yellow-500" },
  five_checkins: { label: "Consistent", description: "Completed 5 self-checks", icon: Flame, color: "text-orange-500" },
  ten_checkins: { label: "Dedicated", description: "Completed 10 self-checks", icon: Trophy, color: "text-amber-600" },
  first_journal: { label: "Storyteller", description: "Wrote your first journal entry", icon: BookOpen, color: "text-blue-500" },
  first_goal: { label: "Goal Setter", description: "Created your first wellness goal", icon: Zap, color: "text-purple-500" },
  three_day_streak: { label: "On a Roll", description: "3-day habit streak", icon: Flame, color: "text-red-500" },
  seven_day_streak: { label: "Unstoppable", description: "7-day habit streak", icon: Shield, color: "text-emerald-500" },
  self_care_explorer: { label: "Explorer", description: "Visited the resources page", icon: Heart, color: "text-pink-500" },
  wellbeing_warrior: { label: "Wellbeing Warrior", description: "Scored 20+ on a self-check", icon: Brain, color: "text-primary" },
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Tables<"assessments">[]>([]);
  const [badges, setBadges] = useState<{ badge_key: string; earned_at: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [pRes, aRes, bRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("assessments").select("*").eq("user_id", user.id).order("date_taken", { ascending: true }),
        supabase.from("user_badges").select("badge_key, earned_at").eq("user_id", user.id),
      ]);
      if (pRes.data) {
        setProfile(pRes.data);
        setDisplayName(pRes.data.display_name || "");
      }
      if (aRes.data) setAssessments(aRes.data);
      if (bRes.data) setBadges(bRes.data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ variant: "destructive", title: "Error", description: "Could not save profile." });
    else toast({ title: "Profile updated!" });
  };

  const exportCSV = () => {
    if (assessments.length === 0) return;
    const headers = "Date,Total,Stress,Mood,Sleep,Social,Academic,Feedback";
    const rows = assessments.map((a) =>
      `${a.date_taken},${a.total_score},${a.stress_score},${a.mood_score},${a.sleep_score},${a.social_score},${a.academic_score},"${a.summary_feedback || ""}"`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindcheck-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report downloaded!" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 rounded-full bg-primary/10 animate-breathe flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-primary" />
            My Profile
          </h1>
        </motion.div>

        <div className="space-y-6">
          {/* Profile settings */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 bg-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <Input value={user?.email || ""} disabled className="bg-muted/30 mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Display Name</Label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="What should we call you?"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Member Since</Label>
                  <p className="text-sm mt-1">{profile ? format(new Date(profile.created_at), "MMMM d, yyyy") : "—"}</p>
                </div>
                <Button className="rounded-full gap-2" onClick={handleSaveProfile} disabled={saving}>
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Export reports */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 bg-card">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Export Your Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download your self-check history as a CSV file. Your data, your choice.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  disabled={assessments.length === 0}
                  onClick={exportCSV}
                >
                  <Download className="w-4 h-4" /> Download CSV ({assessments.length} entries)
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 bg-card">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-honey-deep" /> My Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(BADGE_DEFS).map(([key, def]) => {
                    const earned = badges.find((b) => b.badge_key === key);
                    const Icon = def.icon;
                    return (
                      <div
                        key={key}
                        className={`relative rounded-2xl p-4 text-center transition-all ${
                          earned ? "bg-primary/5 border border-primary/20" : "bg-muted/30 opacity-40"
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${earned ? def.color : "text-muted-foreground"}`} />
                        <p className="text-xs font-display font-semibold">{def.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{def.description}</p>
                        {earned && (
                          <p className="text-[10px] text-primary mt-1">
                            {format(new Date(earned.earned_at), "MMM d")}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

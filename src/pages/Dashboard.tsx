import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Brain, TrendingUp, TrendingDown, Minus, Calendar, Sparkles, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import type { Tables } from "@/integrations/supabase/types";

const quotes = [
  "Every day is a new chance to check in with yourself.",
  "You can't pour from an empty cup — take care of yourself first.",
  "Small steps still move you forward.",
  "It's not about being perfect. It's about being aware.",
  "You're doing better than you think.",
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Tables<"assessments">[]>([]);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [aRes, pRes] = await Promise.all([
        supabase.from("assessments").select("*").eq("user_id", user.id).order("date_taken", { ascending: true }),
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      ]);
      if (aRes.data) setAssessments(aRes.data);
      if (pRes.data) setProfile(pRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const chartData = assessments.map((a) => ({
    date: new Date(a.date_taken).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    total: a.total_score,
    stress: a.stress_score,
    mood: a.mood_score,
    sleep: a.sleep_score,
    social: a.social_score,
    academic: a.academic_score,
  }));

  const latest = assessments[assessments.length - 1];
  const prev = assessments[assessments.length - 2];
  const trend = latest && prev ? latest.total_score - prev.total_score : 0;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Friend";

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 rounded-full bg-primary/10 animate-breathe flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Greeting */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-1">
            Hey, {displayName} <span className="inline-block"><Sparkles className="w-7 h-7 text-honey inline" /></span>
          </h1>
          <p className="text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
          <div className="mt-4 bg-card rounded-2xl p-4 border inline-flex items-center gap-2">
            <Brain className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-sm italic text-muted-foreground">"{quote}"</p>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Button className="rounded-full gap-2" onClick={() => navigate("/self-check")}>
            <Sparkles className="w-4 h-4" /> New Self-Check
          </Button>
          <Button variant="outline" className="rounded-full gap-2" onClick={() => navigate("/resources")}>
            Explore Resources <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {assessments.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">No check-ins yet</h2>
            <p className="text-muted-foreground mb-6">Take your first self-check to start tracking your wellbeing.</p>
            <Button className="rounded-full" onClick={() => navigate("/self-check")}>
              Start First Check-In
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-0 bg-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Latest Score</p>
                  <p className="text-3xl font-display font-bold text-primary">{latest?.total_score}/25</p>
                  <p className="text-xs text-muted-foreground mt-1">{latest?.summary_feedback}</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Trend</p>
                  <div className="flex items-center gap-2">
                    <TrendIcon className={`w-6 h-6 ${trend > 0 ? "text-primary" : trend < 0 ? "text-destructive" : "text-muted-foreground"}`} />
                    <p className="text-xl font-display font-bold">
                      {trend > 0 ? `+${trend}` : trend} pts
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">vs. previous check-in</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Total Check-ins</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent-foreground" />
                    <p className="text-xl font-display font-bold">{assessments.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="border-0 bg-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">Wellbeing Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(160, 30%, 37%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(160, 30%, 37%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 25]} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          fontSize: "13px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(160, 30%, 37%)"
                        strokeWidth={2.5}
                        fill="url(#colorTotal)"
                        dot={{ r: 4, fill: "hsl(160, 30%, 37%)" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent assessments */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Recent Check-ins</h3>
              <div className="space-y-3">
                {[...assessments].reverse().slice(0, 5).map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-0 bg-card hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {new Date(a.date_taken).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </p>
                          <p className="text-xs text-muted-foreground">{a.summary_feedback}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-display font-bold text-primary">{a.total_score}/25</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

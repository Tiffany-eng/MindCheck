import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, ArrowRight, Heart, Sparkles,
  Smile, Meh, Frown, CloudRain, Sun,
  ThumbsUp, ThumbsDown, Moon, MoonStar, CloudMoon, BedDouble, AlarmClockOff,
  Users, UserCheck, UserMinus, UserX, HeartHandshake,
  Dumbbell, BookOpen, AlertTriangle, Brain, Zap,
  type LucideIcon,
} from "lucide-react";
import Layout from "@/components/Layout";
import { checkAndAwardBadges } from "@/hooks/useBadges";

interface QuestionOption {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: number;
}

interface Question {
  id: string;
  category: string;
  text: string;
  subtext: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    id: "stress",
    category: "Stress",
    text: "How stressed have you been feeling lately?",
    subtext: "Think about the past week overall.",
    options: [
      { icon: Sun, iconColor: "text-yellow-500", label: "Very calm", value: 5 },
      { icon: Smile, iconColor: "text-emerald-500", label: "Mostly relaxed", value: 4 },
      { icon: Meh, iconColor: "text-amber-500", label: "A bit tense", value: 3 },
      { icon: CloudRain, iconColor: "text-blue-400", label: "Quite stressed", value: 2 },
      { icon: Zap, iconColor: "text-red-500", label: "Overwhelmed", value: 1 },
    ],
  },
  {
    id: "mood",
    category: "Mood",
    text: "How would you describe your overall mood?",
    subtext: "There's no wrong answer here. Just be honest with yourself.",
    options: [
      { icon: Sun, iconColor: "text-yellow-500", label: "Great", value: 5 },
      { icon: Smile, iconColor: "text-emerald-500", label: "Good", value: 4 },
      { icon: Meh, iconColor: "text-amber-500", label: "Okay", value: 3 },
      { icon: Frown, iconColor: "text-blue-400", label: "Low", value: 2 },
      { icon: CloudRain, iconColor: "text-slate-500", label: "Very low", value: 1 },
    ],
  },
  {
    id: "sleep",
    category: "Sleep",
    text: "How has your sleep been?",
    subtext: "Quality and quantity both matter.",
    options: [
      { icon: Moon, iconColor: "text-indigo-400", label: "Sleeping well", value: 5 },
      { icon: MoonStar, iconColor: "text-blue-400", label: "Pretty good", value: 4 },
      { icon: CloudMoon, iconColor: "text-amber-500", label: "Hit or miss", value: 3 },
      { icon: BedDouble, iconColor: "text-orange-400", label: "Struggling", value: 2 },
      { icon: AlarmClockOff, iconColor: "text-red-500", label: "Barely sleeping", value: 1 },
    ],
  },
  {
    id: "social",
    category: "Social Connection",
    text: "How connected do you feel to others?",
    subtext: "Friends, family, classmates — anyone who matters to you.",
    options: [
      { icon: HeartHandshake, iconColor: "text-pink-500", label: "Very connected", value: 5 },
      { icon: UserCheck, iconColor: "text-emerald-500", label: "Mostly good", value: 4 },
      { icon: Users, iconColor: "text-amber-500", label: "Somewhat", value: 3 },
      { icon: UserMinus, iconColor: "text-blue-400", label: "Quite isolated", value: 2 },
      { icon: UserX, iconColor: "text-slate-500", label: "Very lonely", value: 1 },
    ],
  },
  {
    id: "academic",
    category: "Academic Pressure",
    text: "How manageable does your academic workload feel?",
    subtext: "Including assignments, exams, and deadlines.",
    options: [
      { icon: Dumbbell, iconColor: "text-emerald-500", label: "Very manageable", value: 5 },
      { icon: BookOpen, iconColor: "text-blue-500", label: "Mostly fine", value: 4 },
      { icon: ThumbsUp, iconColor: "text-amber-500", label: "A bit much", value: 3 },
      { icon: AlertTriangle, iconColor: "text-orange-500", label: "Overwhelming", value: 2 },
      { icon: Brain, iconColor: "text-red-500", label: "Can't cope", value: 1 },
    ],
  },
];

const getFeedback = (total: number): { level: string; message: string; color: string } => {
  if (total >= 20) return { level: "Thriving", message: "You seem to be doing well! Keep nurturing your wellbeing with the habits that are working for you.", color: "text-primary" };
  if (total >= 15) return { level: "Managing", message: "You're holding steady, but there might be some areas that could use a little attention. Check out our resources for some self-care ideas.", color: "text-accent-foreground" };
  if (total >= 10) return { level: "Struggling", message: "It looks like things have been tough. Please remember that reaching out for support is a sign of strength, not weakness. You matter.", color: "text-honey-deep" };
  return { level: "In Need of Support", message: "We're concerned about how you're feeling. Please consider reaching out to a counselor or calling a helpline. You don't have to go through this alone.", color: "text-destructive" };
};

const SelfCheck = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentQ = questions[step];
  const progress = ((step + (answers[currentQ?.id] !== undefined ? 1 : 0)) / questions.length) * 100;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    const scores = {
      stress_score: answers.stress || 0,
      mood_score: answers.mood || 0,
      sleep_score: answers.sleep || 0,
      social_score: answers.social || 0,
      academic_score: answers.academic || 0,
      total_score: Object.values(answers).reduce((a, b) => a + b, 0),
    };
    const feedback = getFeedback(scores.total_score);

    const { error } = await supabase.from("assessments").insert({
      user_id: user.id,
      responses: answers as any,
      ...scores,
      summary_feedback: feedback.level,
    });

    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not save your results. Please try again." });
    } else {
      setSubmitted(true);
      const newBadges = await checkAndAwardBadges(user.id);
      if (newBadges.length > 0) {
        toast({ title: `You earned ${newBadges.length} new badge${newBadges.length > 1 ? "s" : ""}!`, description: "Check your profile to see them." });
      }
    }
  };

  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const feedback = getFeedback(total);

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: 2 }}
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-3xl font-display font-bold mb-2">Your Wellbeing Summary</h1>
            <p className="text-muted-foreground mb-8">Thank you for checking in with yourself</p>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="p-8">
                <p className={`text-2xl font-display font-bold mb-2 ${feedback.color}`}>{feedback.level}</p>
                <p className="text-foreground/80 leading-relaxed mb-6">{feedback.message}</p>

                <div className="grid grid-cols-5 gap-3">
                  {questions.map((q) => {
                    const score = answers[q.id] || 0;
                    const pct = (score / 5) * 100;
                    return (
                      <div key={q.id} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">{q.category}</div>
                        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="absolute h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                          />
                        </div>
                        <div className="text-xs font-medium mt-1">{score}/5</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="rounded-full" onClick={() => navigate("/dashboard")}>
                View Dashboard
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => navigate("/resources")}>
                Explore Resources
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">
              Question {step + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-center mb-8">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {currentQ.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">{currentQ.text}</h2>
              <p className="text-muted-foreground text-sm">{currentQ.subtext}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
              {currentQ.options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = answers[currentQ.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? "bg-primary/20" : "bg-muted/60"}`}>
                      <Icon className={`w-5 h-5 ${opt.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium text-foreground/70">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {step < questions.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={answers[currentQ.id] === undefined}
              className="gap-1 rounded-full"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || saving}
              className="gap-1 rounded-full"
            >
              {saving ? "Saving…" : "See Results"} <Heart className="w-4 h-4" />
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          <Heart className="w-3 h-3 inline text-primary mr-1" />
          There are no wrong answers. This is not a diagnosis — just a check-in.
        </p>
      </div>
    </Layout>
  );
};

export default SelfCheck;

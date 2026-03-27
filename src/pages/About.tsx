import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Brain, LineChart, BookOpen, Shield, Heart, Target, Leaf,
  BookOpenCheck, Users, Lock, ArrowRight, Sparkles, Wind, Award,
} from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const services = [
  {
    icon: Brain,
    title: "Self-Check Assessment",
    description: "A quick, private wellbeing check-in covering five key areas — stress, mood, sleep, social connection, and academic pressure. Get a supportive summary with no clinical jargon.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: LineChart,
    title: "Dashboard & Trends",
    description: "Visualise your wellbeing over time with gentle charts and trend indicators. See patterns, celebrate improvements, and spot areas that might need attention.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BookOpenCheck,
    title: "Journal & Mood Diary",
    description: "A private space to write about your thoughts and tag your mood. Reflect on your experiences and track emotional patterns across days and weeks.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Target,
    title: "Goals & Habit Tracking",
    description: "Set personal wellness goals — sleep, exercise, mindfulness, nutrition — and track daily habits with streaks and progress bars to stay motivated.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description: "Discover coping strategies, guided breathing exercises, and professional support services — all curated specifically for university students.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Award,
    title: "Badges & Gamification",
    description: "Earn badges for building healthy habits — completing check-ins, maintaining streaks, and reaching milestones. Small rewards for big efforts.",
    color: "bg-pink-50 text-pink-600",
  },
];

const values = [
  {
    icon: Heart,
    title: "Empathy First",
    description: "Every word, every interaction is designed to feel warm and supportive — never clinical or judgmental.",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    description: "Your data belongs to you. Everything is encrypted and only you can access your personal information.",
  },
  {
    icon: Users,
    title: "Built for Students",
    description: "We understand university life. MindCheck is designed around the unique pressures students face every day.",
  },
  {
    icon: Shield,
    title: "Not a Diagnosis",
    description: "MindCheck is a self-awareness tool, not a medical service. We encourage professional help when needed and always show crisis resources.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-14 md:py-24">
        <div className="hidden sm:block absolute top-10 right-0 w-64 h-64 bg-primary/8 organic-blob animate-breathe" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-80 h-80 bg-accent/15 organic-blob-2 animate-float" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              About MindCheck
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-5">
              A safe space for students to{" "}
              <span className="text-primary italic">check in</span>{" "}
              with their mental wellbeing
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 px-2">
              MindCheck is a private, judgment-free companion designed specifically for university students. 
              We believe that small, regular check-ins can make a big difference in how you understand and 
              care for your mental health — no clinical labels, just honest self-awareness.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-full text-base px-8 gap-2" onClick={() => navigate("/register")}>
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8" onClick={() => navigate("/resources")}>
                Browse Resources
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Why MindCheck Exists</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                University life is exciting — but it can also be overwhelming. Between academic deadlines, 
                social pressures, financial stress, and the challenges of growing up, students often neglect 
                their mental health until things feel unmanageable.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { value: "1 in 3", label: "college students experience significant anxiety" },
                { value: "75%", label: "of mental health conditions begin before age 24" },
                { value: "64%", label: "of students who drop out cite mental health reasons" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="p-4"
                >
                  <p className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-center text-muted-foreground leading-relaxed mt-8 text-sm md:text-base"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              MindCheck was built to bridge that gap — giving students a simple, non-intimidating way to 
              regularly check in with themselves, track their wellbeing, and access helpful resources 
              before things reach a crisis point.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              What MindCheck <span className="text-primary">Offers</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
              Everything you need to understand, track, and improve your wellbeing — all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {services.map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
              >
                <Card className="h-full border-0 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-5 md:p-6">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${s.color}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-base md:text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Our Values</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
              The principles that guide everything we build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border/30">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground text-sm md:text-base">Three simple steps to start caring for your wellbeing.</p>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { step: "1", title: "Create Your Account", desc: "Sign up with your email — it takes less than a minute. Your data is private from the start." },
              { step: "2", title: "Take a Self-Check", desc: "Answer 5 simple questions about how you're feeling. It takes about 2 minutes and there are no wrong answers." },
              { step: "3", title: "Track & Grow", desc: "View your results, track trends over time, journal your thoughts, set goals, and explore helpful resources." },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-display font-semibold text-base md:text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-lg mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 animate-breathe">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Ready to check in with yourself?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              It only takes 3 minutes. Your answers stay private, always.
            </p>
            <Button size="lg" className="rounded-full px-10 gap-2" onClick={() => navigate("/register")}>
              Begin Your Journey <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

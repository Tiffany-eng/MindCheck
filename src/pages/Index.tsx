import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Leaf, Brain, LineChart, BookOpen, Shield, Heart, Sparkles, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const stats = [
  { value: "1 in 3", label: "college students experience significant anxiety" },
  { value: "75%", label: "of mental health conditions begin before age 24" },
  { value: "64%", label: "of students who drop out cite mental health reasons" },
];

const features = [
  {
    icon: Brain,
    title: "Self-Check Assessment",
    description: "Quick, private wellbeing check-in covering stress, mood, sleep, social connection, and academic pressure.",
  },
  {
    icon: LineChart,
    title: "Track Your Journey",
    description: "Visualize your wellbeing over time with beautiful, easy-to-read charts and gentle trend insights.",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description: "Discover coping strategies, breathing exercises, and professional support tailored for students.",
  },
  {
    icon: Shield,
    title: "Private & Safe",
    description: "Your data is yours alone. Everything is encrypted and only you can see your results.",
  },
];

const quotes = [
  { text: "It's okay to not be okay. What matters is that you check in with yourself.", author: "MindCheck" },
  { text: "Mental health is not a destination, it's a process.", author: "Noam Shpancer" },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-14 md:py-32">
        {/* Decorative blobs — hidden on small screens to avoid overflow */}
        <div className="hidden sm:block absolute top-10 -left-20 w-72 h-72 bg-primary/10 organic-blob animate-breathe" />
        <div className="hidden sm:block absolute bottom-0 right-0 w-96 h-96 bg-accent/20 organic-blob-2 animate-float" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 w-48 h-48 bg-sage/10 organic-blob-3 animate-pulse-soft" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4" />
              A safe space for your mind
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-4 md:mb-6">
              How are you{" "}
              <span className="text-primary italic">really</span>{" "}
              feeling today?
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8 max-w-lg mx-auto px-2">
              MindCheck is your private, judgment-free companion for checking in with your mental wellbeing. 
              Built with <Heart className="w-4 h-4 inline text-primary" /> for university students.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-full text-base px-8 gap-2" onClick={() => navigate("/register")}>
                Start Your Check-In <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8" onClick={() => navigate("/resources")}>
                Explore Resources
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 md:py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="text-center p-6"
              >
                <p className="text-3xl md:text-5xl font-display font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-3 md:mb-4">
              Everything you need to{" "}
              <span className="text-primary">check in</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Simple tools designed with care, not clinical coldness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
              >
                <Card className="h-full border-0 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="py-10 md:py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {quotes.map((q, i) => (
              <motion.div
                key={i}
                className={`text-center ${i !== 0 ? "mt-10 pt-10 border-t border-border/50" : ""}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Heart className="w-5 h-5 text-accent mx-auto mb-4" />
                <blockquote className="text-lg md:text-xl font-display italic text-foreground/80 mb-3">
                  "{q.text}"
                </blockquote>
                <cite className="text-sm text-muted-foreground not-italic">— {q.author}</cite>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-lg mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-breathe">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Ready to check in with yourself?
            </h2>
            <p className="text-muted-foreground mb-8">
              It only takes 3 minutes. Your answers stay private, always.
            </p>
            <Button size="lg" className="rounded-full px-10 gap-2" onClick={() => navigate("/register")}>
              Begin Your Journey <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

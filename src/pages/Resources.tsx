import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Wind, BookOpen, Heart, Search, AlertTriangle, Leaf } from "lucide-react";
import Layout from "@/components/Layout";
import type { Tables } from "@/integrations/supabase/types";

const categoryIcons: Record<string, any> = {
  "Coping Strategies": BookOpen,
  "Breathing Exercises": Wind,
  "Support Services": Heart,
  "Crisis Helplines": Phone,
};

const categories = ["All", "Coping Strategies", "Breathing Exercises", "Support Services", "Crisis Helplines"];

// Breathing exercise component
const BreathingExercise = () => {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!active) return;
    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed++;
      setSeconds(elapsed);
      const cycle = elapsed % 12;
      if (cycle < 4) setPhase("inhale");
      else if (cycle < 7) setPhase("hold");
      else setPhase("exhale");
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  const scale = phase === "inhale" ? 1.4 : phase === "hold" ? 1.4 : 1;

  return (
    <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent/10 overflow-hidden">
      <CardContent className="p-8 text-center">
        <h3 className="font-display font-bold text-xl mb-2 flex items-center justify-center gap-2">
          <Wind className="w-5 h-5 text-primary" /> Breathing Exercise
        </h3>
        <p className="text-sm text-muted-foreground mb-6">4-3-5 technique: Breathe in, hold, breathe out.</p>
        
        <div className="flex justify-center mb-6">
          <motion.div
            className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center"
            animate={{ scale: active ? scale : 1 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "hold" ? 0.3 : 5, ease: "easeInOut" }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center"
              animate={{ scale: active ? scale * 0.9 : 1 }}
              transition={{ duration: phase === "inhale" ? 4 : phase === "hold" ? 0.3 : 5, ease: "easeInOut" }}
            >
              <span className="text-lg font-display font-semibold text-primary">
                {!active ? "Ready" : phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : "Breathe Out"}
              </span>
            </motion.div>
          </motion.div>
        </div>

        <Button
          className="rounded-full"
          variant={active ? "outline" : "default"}
          onClick={() => { setActive(!active); setSeconds(0); setPhase("inhale"); }}
        >
          {active ? "Stop" : "Start Breathing"}
        </Button>
        {active && <p className="text-xs text-muted-foreground mt-3">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")} elapsed</p>}
      </CardContent>
    </Card>
  );
};

const Resources = () => {
  const [resources, setResources] = useState<Tables<"resources">[]>([]);
  const [services, setServices] = useState<Tables<"support_services">[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [rRes, sRes] = await Promise.all([
        supabase.from("resources").select("*"),
        supabase.from("support_services").select("*"),
      ]);
      if (rRes.data) setResources(rRes.data);
      if (sRes.data) setServices(sRes.data);
      setLoading(false);
    };
    fetch();
  }, []);

  const emergencyServices = services.filter((s) => s.is_emergency);

  const filteredResources = resources.filter((r) => {
    const matchCat = filter === "All" || r.category === filter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      {/* Emergency banner */}
      {emergencyServices.length > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm flex-wrap justify-center">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-medium">Emergency Support: </span>
            {emergencyServices.map((s, i) => (
              <span key={s.id} className="text-destructive">
                {s.name} ({s.contact_info}){i < emergencyServices.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-2">Resources & Support <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-primary" /></h1>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Tools, techniques, and support to help you feel your best.</p>
        </motion.div>

        {/* Breathing exercise */}
        <div className="mb-10">
          <BreathingExercise />
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Resources grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No resources found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredResources.map((r, i) => {
                const Icon = categoryIcons[r.category] || BookOpen;
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-0 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full group">
                      <CardContent className="p-5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{r.category}</span>
                        <h3 className="font-display font-semibold mt-2 mb-1">{r.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                        {r.content_url && (
                          <a href={r.content_url} target="_blank" rel="noopener" className="text-primary text-sm hover:underline mt-2 inline-block">
                            Learn more →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Support services */}
        {services.filter((s) => !s.is_emergency).length > 0 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-xl mb-4">Support Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.filter((s) => !s.is_emergency).map((s) => (
                <Card key={s.id} className="border-0 bg-card">
                  <CardContent className="p-5">
                    <h3 className="font-display font-semibold">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{s.description}</p>
                    <p className="text-sm font-medium text-primary">{s.contact_info}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Resources;

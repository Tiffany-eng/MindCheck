import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen, Plus, Trash2, Edit3, X, Check,
  Smile, Sun, Meh, Frown, CloudRain, Heart, Moon, Zap,
  type LucideIcon,
} from "lucide-react";
import Layout from "@/components/Layout";
import { format } from "date-fns";

const moods: { icon: LucideIcon; iconColor: string; label: string; value: string }[] = [
  { icon: Sun, iconColor: "text-yellow-500", label: "Happy", value: "happy" },
  { icon: Smile, iconColor: "text-emerald-500", label: "Calm", value: "calm" },
  { icon: Meh, iconColor: "text-amber-500", label: "Neutral", value: "neutral" },
  { icon: Frown, iconColor: "text-blue-400", label: "Sad", value: "sad" },
  { icon: Zap, iconColor: "text-red-500", label: "Frustrated", value: "frustrated" },
  { icon: CloudRain, iconColor: "text-slate-500", label: "Anxious", value: "anxious" },
  { icon: Heart, iconColor: "text-pink-500", label: "Grateful", value: "grateful" },
  { icon: Moon, iconColor: "text-indigo-400", label: "Tired", value: "tired" },
];

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Journal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setEntries(data as JournalEntry[]);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("neutral");
    setComposing(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("journal_entries")
        .update({ title: title || null, content, mood, updated_at: new Date().toISOString() })
        .eq("id", editingId);
      if (error) toast({ variant: "destructive", title: "Error", description: "Could not update entry." });
      else toast({ title: "Entry updated" });
    } else {
      const { error } = await supabase
        .from("journal_entries")
        .insert({ user_id: user.id, title: title || null, content, mood });
      if (error) toast({ variant: "destructive", title: "Error", description: "Could not save entry." });
      else toast({ title: "Entry saved" });
    }

    setSaving(false);
    resetForm();
    fetchEntries();
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title || "");
    setContent(entry.content);
    setMood(entry.mood);
    setComposing(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("journal_entries").delete().eq("id", id);
    if (!error) {
      setEntries((e) => e.filter((entry) => entry.id !== id));
      toast({ title: "Entry deleted" });
    }
  };

  const getMoodIcon = (moodValue: string) => moods.find((m) => m.value === moodValue) || moods[2];

  // Mood distribution for mini-chart
  const moodCounts = moods.map((m) => ({
    ...m,
    count: entries.filter((e) => e.mood === m.value).length,
  })).filter((m) => m.count > 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold flex items-center gap-3">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                My Journal
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">A private space to reflect on your thoughts and feelings</p>
            </div>
            {!composing && (
              <Button className="rounded-full gap-2 self-start sm:self-auto" onClick={() => setComposing(true)}>
                <Plus className="w-4 h-4" /> New Entry
              </Button>
            )}
          </div>

          {/* Mood distribution */}
          {moodCounts.length > 0 && !composing && (
            <Card className="border-0 bg-card mb-6">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Your mood distribution</p>
                <div className="flex gap-3 flex-wrap">
                  {moodCounts.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.value} className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                        <Icon className={`w-4 h-4 ${m.iconColor}`} />
                        <span className="text-xs font-medium text-muted-foreground">{m.count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Compose / Edit form */}
        <AnimatePresence>
          {composing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-lg">
                      {editingId ? "Edit Entry" : "New Journal Entry"}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <Input
                    placeholder="Give it a title (optional)..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-0 bg-muted/50 text-lg font-display"
                  />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">How are you feeling?</p>
                    <div className="flex gap-2 flex-wrap">
                      {moods.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => setMood(m.value)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all ${
                            mood === m.value
                              ? "bg-primary/15 border-2 border-primary shadow-sm"
                              : "bg-muted/50 border-2 border-transparent hover:border-primary/20"
                          }`}
                        >
                          {(() => { const Icon = m.icon; return <Icon className={`w-4 h-4 ${m.iconColor}`} />; })()}
                          <span className="text-xs font-medium">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="Write your thoughts here... There's no judgment, just you and your words."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[160px] border-0 bg-muted/50 resize-none leading-relaxed"
                  />

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                    <Button
                      className="rounded-full gap-2"
                      disabled={!content.trim() || saving}
                      onClick={handleSave}
                    >
                      <Check className="w-4 h-4" />
                      {saving ? "Saving..." : editingId ? "Update" : "Save Entry"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full bg-primary/10 animate-breathe flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
        ) : entries.length === 0 && !composing ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">Your journal is empty</h2>
            <p className="text-muted-foreground mb-6">Start writing to capture your thoughts and feelings.</p>
            <Button className="rounded-full" onClick={() => setComposing(true)}>
              Write First Entry
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-0 bg-card hover:shadow-md transition-shadow group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {(() => { const moodInfo = getMoodIcon(entry.mood); const Icon = moodInfo.icon; return <div className="w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center mt-0.5 shrink-0"><Icon className={`w-4 h-4 ${moodInfo.iconColor}`} /></div>; })()}
                        <div className="flex-1 min-w-0">
                          {entry.title && (
                            <h3 className="font-display font-semibold text-base mb-0.5 truncate">{entry.title}</h3>
                          )}
                          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{entry.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(entry.created_at), "EEEE, MMM d, yyyy • h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Journal;

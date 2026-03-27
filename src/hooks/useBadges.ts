import { supabase } from "@/integrations/supabase/client";

export const checkAndAwardBadges = async (userId: string) => {
  const [aRes, jRes, gRes, lRes, bRes] = await Promise.all([
    supabase.from("assessments").select("id, total_score").eq("user_id", userId),
    supabase.from("journal_entries").select("id").eq("user_id", userId),
    supabase.from("goals").select("id").eq("user_id", userId),
    supabase.from("habit_logs").select("goal_id, logged_date").eq("user_id", userId),
    supabase.from("user_badges").select("badge_key").eq("user_id", userId),
  ]);

  const existingBadges = new Set((bRes.data || []).map((b) => b.badge_key));
  const newBadges: string[] = [];

  const assessments = aRes.data || [];
  const journals = jRes.data || [];
  const goals = gRes.data || [];
  const logs = lRes.data || [];

  // Check-in badges
  if (assessments.length >= 1 && !existingBadges.has("first_checkin")) newBadges.push("first_checkin");
  if (assessments.length >= 5 && !existingBadges.has("five_checkins")) newBadges.push("five_checkins");
  if (assessments.length >= 10 && !existingBadges.has("ten_checkins")) newBadges.push("ten_checkins");

  // High score badge
  if (assessments.some((a) => a.total_score >= 20) && !existingBadges.has("wellbeing_warrior")) {
    newBadges.push("wellbeing_warrior");
  }

  // Journal badge
  if (journals.length >= 1 && !existingBadges.has("first_journal")) newBadges.push("first_journal");

  // Goal badge
  if (goals.length >= 1 && !existingBadges.has("first_goal")) newBadges.push("first_goal");

  // Streak badges - check max streak across all goals
  if (logs.length > 0) {
    const goalGroups: Record<string, string[]> = {};
    logs.forEach((l) => {
      if (!goalGroups[l.goal_id]) goalGroups[l.goal_id] = [];
      goalGroups[l.goal_id].push(l.logged_date);
    });

    let maxStreak = 0;
    Object.values(goalGroups).forEach((dates) => {
      const sorted = [...dates].sort().reverse();
      let streak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const diff = (new Date(sorted[i - 1]).getTime() - new Date(sorted[i]).getTime()) / 86400000;
        if (diff === 1) streak++;
        else break;
      }
      maxStreak = Math.max(maxStreak, streak);
    });

    if (maxStreak >= 3 && !existingBadges.has("three_day_streak")) newBadges.push("three_day_streak");
    if (maxStreak >= 7 && !existingBadges.has("seven_day_streak")) newBadges.push("seven_day_streak");
  }

  // Insert new badges
  if (newBadges.length > 0) {
    await supabase.from("user_badges").insert(
      newBadges.map((key) => ({ user_id: userId, badge_key: key }))
    );
  }

  return newBadges;
};

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const logSession = mutation({
  args: {
    subjectId: v.optional(v.id("subjects")),
    type: v.union(
      v.literal("study"),
      v.literal("revision"),
      v.literal("quiz"),
      v.literal("flashcards"),
    ),
    durationMinutes: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const today = new Date().toISOString().split("T")[0];
    await ctx.db.insert("studySessions", {
      userId: identity.subject as any,
      ...args,
      date: today,
      createdAt: Date.now(),
    });
    // Update streak
    const userDoc = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), identity.subject))
      .first();
    if (userDoc) {
      const lastDate = userDoc.lastStudyDate;
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      let newStreak = userDoc.studyStreak || 0;
      if (lastDate === today) {
        // Already studied today, no change
      } else if (lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      await ctx.db.patch(userDoc._id, {
        studyStreak: newStreak,
        lastStudyDate: today,
      });
    }
  },
});

export const getSessions = query({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    if (args.date) {
      const date = args.date;
      return await ctx.db
        .query("studySessions")
        .withIndex("by_user_date", (q) =>
          q
            .eq("userId", identity.subject as any)
            .eq("date", date),
        )
        .collect();
    }
    return await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      return {
        totalMinutes: 0,
        todayMinutes: 0,
        weekMinutes: 0,
        streak: 0,
        totalSessions: 0,
      };
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];
    const todayMinutes = sessions
      .filter((s) => s.date === today)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    const weekMinutes = sessions
      .filter((s) => s.date >= weekAgo)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalMinutes = sessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );
    const userDoc = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), identity.subject))
      .first();
    return {
      totalMinutes,
      todayMinutes,
      weekMinutes,
      streak: userDoc?.studyStreak || 0,
      totalSessions: sessions.length,
    };
  },
});

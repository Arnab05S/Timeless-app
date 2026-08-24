import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("quizzes")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subjectId: v.optional(v.id("subjects")),
    uploadId: v.optional(v.id("uploads")),
    topic: v.optional(v.string()),
    questionCount: v.number(),
    questions: v.array(
      v.object({
        question: v.string(),
        type: v.union(v.literal("mcq"), v.literal("tf"), v.literal("short_answer")),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
      }),
    ),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("quizzes", {
      userId: identity.subject as any,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const submitResult = mutation({
  args: {
    quizId: v.id("quizzes"),
    score: v.number(),
    totalQuestions: v.number(),
    correctCount: v.number(),
    answers: v.array(
      v.object({
        questionIndex: v.number(),
        userAnswer: v.string(),
        isCorrect: v.boolean(),
      }),
    ),
    weakTopics: v.optional(v.array(v.string())),
    aiFeedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("quizResults", {
      userId: identity.subject as any,
      ...args,
      completedAt: Date.now(),
    });
  },
});

export const getResults = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizResults")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();
  },
});

export const getRecentResults = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
    results.sort((a, b) => b.completedAt - a.completedAt);
    return results.slice(0, args.limit ?? 10);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { totalQuizzes: 0, avgScore: 0, recentTrend: [] };
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
    if (results.length === 0) {
      return { totalQuizzes: 0, avgScore: 0, recentTrend: [] };
    }
    const avgScore =
      results.reduce((sum, r) => sum + (r.correctCount / r.totalQuestions) * 100, 0) /
      results.length;
    const recentTrend = results
      .sort((a, b) => a.completedAt - b.completedAt)
      .slice(-10)
      .map((r) => ({
        date: new Date(r.completedAt).toISOString().split("T")[0],
        score: Math.round((r.correctCount / r.totalQuestions) * 100),
      }));
    return {
      totalQuizzes: results.length,
      avgScore: Math.round(avgScore),
      recentTrend,
    };
  },
});

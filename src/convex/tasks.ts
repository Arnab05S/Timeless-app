import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("tasks")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", identity.subject as any).eq("scheduledDate", args.date),
      )
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
  },
});

export const getUpcoming = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const today = new Date().toISOString().split("T")[0];
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
    return tasks
      .filter(
        (t) => t.scheduledDate >= today && t.status !== "completed",
      )
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
      .slice(0, args.limit);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("study"),
      v.literal("assignment"),
      v.literal("exam"),
      v.literal("homework"),
      v.literal("revision"),
      v.literal("personal"),
    ),
    subjectId: v.optional(v.id("subjects")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    scheduledDate: v.string(),
    scheduledTime: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("tasks", {
      userId: identity.subject as any,
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("study"),
        v.literal("assignment"),
        v.literal("exam"),
        v.literal("homework"),
        v.literal("revision"),
        v.literal("personal"),
      ),
    ),
    subjectId: v.optional(v.id("subjects")),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    ),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("skipped"),
      ),
    ),
    scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Task not found");
    const patch: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) patch[key] = value;
    }
    if (updates.status === "completed") {
      patch.completedAt = Date.now();
    }
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Smart schedule: get tasks for today + calculate study time
export const todaySummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { tasks: [], totalMinutes: 0, completedMinutes: 0 };
    const today = new Date().toISOString().split("T")[0];
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", identity.subject as any).eq("scheduledDate", today),
      )
      .collect();
    const totalMinutes = tasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
    const completedMinutes = tasks
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
    return { tasks, totalMinutes, completedMinutes };
  },
});

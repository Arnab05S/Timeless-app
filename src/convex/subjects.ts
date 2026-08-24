import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("subjects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    icon: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal(1), v.literal(2), v.literal(3))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("subjects", {
      userId: identity.subject as any,
      ...args,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

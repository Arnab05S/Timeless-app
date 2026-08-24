import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject as any;
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("_id"), userId)).first();
    return user ?? null;
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    dailyStudyHours: v.optional(v.number()),
    preferredStudyTime: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as any;
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("_id"), userId)).first();
    if (user) {
      await ctx.db.patch(user._id, args);
    }
  },
});

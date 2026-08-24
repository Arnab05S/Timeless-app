import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("uploads")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subject: v.optional(v.string()),
    topic: v.optional(v.string()),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("uploads", {
      userId: identity.subject as any,
      ...args,
      status: "uploading",
      createdAt: Date.now(),
    });
  },
});

export const markReady = mutation({
  args: {
    id: v.id("uploads"),
    summary: v.optional(v.string()),
    keyConcepts: v.optional(v.array(v.string())),
    importantPoints: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, status: "ready" as const });
  },
});

export const remove = mutation({
  args: { id: v.id("uploads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

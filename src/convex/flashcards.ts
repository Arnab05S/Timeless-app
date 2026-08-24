import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listDecks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("flashcardDecks")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
  },
});

export const createDeck = mutation({
  args: {
    title: v.string(),
    subjectId: v.optional(v.id("subjects")),
    uploadId: v.optional(v.id("uploads")),
    cardCount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("flashcardDecks", {
      userId: identity.subject as any,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getDeckCards = query({
  args: { deckId: v.id("flashcardDecks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flashcards")
      .withIndex("by_deck", (q) => q.eq("deckId", args.deckId))
      .collect();
  },
});

export const getDueCards = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const now = Date.now();
    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .collect();
    const due = cards.filter(
      (c) => !c.nextReview || c.nextReview <= now,
    );
    due.sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0));
    return due.slice(0, args.limit ?? 20);
  },
});

export const createCards = mutation({
  args: {
    deckId: v.id("flashcardDecks"),
    cards: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
        difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const now = Date.now();
    for (const card of args.cards) {
      await ctx.db.insert("flashcards", {
        userId: identity.subject as any,
        deckId: args.deckId,
        ...card,
        known: false,
        reviewCount: 0,
        createdAt: now,
      });
    }
  },
});

export const markCard = mutation({
  args: {
    cardId: v.id("flashcards"),
    known: v.boolean(),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");
    const nextReview = args.known
      ? Date.now() + 3 * 24 * 60 * 60 * 1000 // 3 days
      : Date.now() + 1 * 24 * 60 * 60 * 1000; // 1 day
    await ctx.db.patch(args.cardId, {
      known: args.known,
      reviewCount: card.reviewCount + 1,
      lastReviewed: Date.now(),
      nextReview,
    });
  },
});

export const deleteDeck = mutation({
  args: { deckId: v.id("flashcardDecks") },
  handler: async (ctx, args) => {
    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_deck", (q) => q.eq("deckId", args.deckId))
      .collect();
    for (const card of cards) {
      await ctx.db.delete(card._id);
    }
    await ctx.db.delete(args.deckId);
  },
});

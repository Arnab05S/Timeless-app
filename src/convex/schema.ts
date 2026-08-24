import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      // Timeless profile fields
      onboardingCompleted: v.optional(v.boolean()),
      dailyStudyHours: v.optional(v.number()),
      preferredStudyTime: v.optional(v.string()),
      studyStreak: v.optional(v.number()),
      lastStudyDate: v.optional(v.string()),
    }).index("email", ["email"]),

    // Subjects the user is studying
    subjects: defineTable({
      userId: v.id("users"),
      name: v.string(),
      color: v.string(),
      icon: v.optional(v.string()),
      difficulty: v.optional(v.union(v.literal(1), v.literal(2), v.literal(3))),
    }).index("by_user", ["userId"]),

    // Tasks, assignments, exams
    tasks: defineTable({
      userId: v.id("users"),
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
      status: v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("skipped"),
      ),
      scheduledDate: v.string(), // YYYY-MM-DD
      scheduledTime: v.optional(v.string()), // HH:mm
      durationMinutes: v.optional(v.number()),
      deadline: v.optional(v.string()),
      completedAt: v.optional(v.number()),
      createdAt: v.number(),
    }).index("by_user_date", ["userId", "scheduledDate"])
      .index("by_user", ["userId"])
      .index("by_user_status", ["userId", "status"]),

    // Uploaded study materials
    uploads: defineTable({
      userId: v.id("users"),
      title: v.string(),
      subject: v.optional(v.string()),
      topic: v.optional(v.string()),
      fileName: v.string(),
      fileType: v.string(),
      fileSize: v.number(),
      storageId: v.optional(v.string()),
      status: v.union(v.literal("uploading"), v.literal("processing"), v.literal("ready"), v.literal("error")),
      summary: v.optional(v.string()),
      keyConcepts: v.optional(v.array(v.string())),
      importantPoints: v.optional(v.array(v.string())),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Flashcard decks
    flashcardDecks: defineTable({
      userId: v.id("users"),
      title: v.string(),
      subjectId: v.optional(v.id("subjects")),
      uploadId: v.optional(v.id("uploads")),
      cardCount: v.number(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Individual flashcards
    flashcards: defineTable({
      userId: v.id("users"),
      deckId: v.id("flashcardDecks"),
      question: v.string(),
      answer: v.string(),
      difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
      known: v.optional(v.boolean()),
      reviewCount: v.number(),
      lastReviewed: v.optional(v.number()),
      nextReview: v.optional(v.number()),
      createdAt: v.number(),
    }).index("by_deck", ["deckId"])
      .index("by_user", ["userId"])
      .index("by_user_next_review", ["userId", "nextReview"]),

    // Quiz definitions
    quizzes: defineTable({
      userId: v.id("users"),
      title: v.string(),
      subjectId: v.optional(v.id("subjects")),
      uploadId: v.optional(v.id("uploads")),
      topic: v.optional(v.string()),
      questionCount: v.number(),
      questions: v.array(v.object({
        question: v.string(),
        type: v.union(v.literal("mcq"), v.literal("tf"), v.literal("short_answer")),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
      })),
      difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Quiz results/attempts
    quizResults: defineTable({
      userId: v.id("users"),
      quizId: v.id("quizzes"),
      score: v.number(),
      totalQuestions: v.number(),
      correctCount: v.number(),
      answers: v.array(v.object({
        questionIndex: v.number(),
        userAnswer: v.string(),
        isCorrect: v.boolean(),
      })),
      weakTopics: v.optional(v.array(v.string())),
      aiFeedback: v.optional(v.string()),
      completedAt: v.number(),
    }).index("by_user", ["userId"])
      .index("by_quiz", ["quizId"]),

    // Study sessions log
    studySessions: defineTable({
      userId: v.id("users"),
      subjectId: v.optional(v.id("subjects")),
      type: v.union(
        v.literal("study"),
        v.literal("revision"),
        v.literal("quiz"),
        v.literal("flashcards"),
      ),
      durationMinutes: v.number(),
      date: v.string(),
      notes: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_user_date", ["userId", "date"])
      .index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;

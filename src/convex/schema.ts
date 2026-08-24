import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  STUDENT: "student",
  TEACHER: "teacher",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.STUDENT),
  v.literal(ROLES.TEACHER),
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
      // Teacher fields
      accountType: v.optional(v.union(v.literal("student"), v.literal("teacher"))),
      institution: v.optional(v.string()),
      subjectsTaught: v.optional(v.array(v.string())),
      classesTaught: v.optional(v.array(v.string())),
      gradeYear: v.optional(v.string()),
      bio: v.optional(v.string()),
    }).index("email", ["email"]),

    subjects: defineTable({
      userId: v.id("users"),
      name: v.string(),
      color: v.string(),
      icon: v.optional(v.string()),
      difficulty: v.optional(v.union(v.literal(1), v.literal(2), v.literal(3))),
    }).index("by_user", ["userId"]),

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
      scheduledDate: v.string(),
      scheduledTime: v.optional(v.string()),
      durationMinutes: v.optional(v.number()),
      deadline: v.optional(v.string()),
      completedAt: v.optional(v.number()),
      createdAt: v.number(),
    }).index("by_user_date", ["userId", "scheduledDate"])
      .index("by_user", ["userId"])
      .index("by_user_status", ["userId", "status"]),

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

    flashcardDecks: defineTable({
      userId: v.id("users"),
      title: v.string(),
      subjectId: v.optional(v.id("subjects")),
      uploadId: v.optional(v.id("uploads")),
      cardCount: v.number(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

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

    // ═══════════════════════════════════════════════════════
    // TEACHER MODE TABLES
    // ═══════════════════════════════════════════════════════

    classes: defineTable({
      teacherId: v.id("users"),
      name: v.string(),
      subject: v.string(),
      grade: v.optional(v.string()),
      description: v.optional(v.string()),
      joinCode: v.string(),
      studentCount: v.number(),
      isActive: v.boolean(),
      createdAt: v.number(),
    }).index("by_teacher", ["teacherId"]),

    classMembers: defineTable({
      classId: v.id("classes"),
      studentId: v.id("users"),
      joinedAt: v.number(),
      isActive: v.boolean(),
    }).index("by_class", ["classId"])
      .index("by_student", ["studentId"])
      .index("by_class_student", ["classId", "studentId"]),

    assignments: defineTable({
      teacherId: v.id("users"),
      classId: v.id("classes"),
      title: v.string(),
      description: v.optional(v.string()),
      subject: v.string(),
      topic: v.optional(v.string()),
      type: v.union(v.literal("homework"), v.literal("project"), v.literal("essay"), v.literal("practice"), v.literal("revision")),
      totalMarks: v.number(),
      deadline: v.string(),
      attachments: v.optional(v.array(v.string())),
      status: v.union(v.literal("draft"), v.literal("published"), v.literal("closed")),
      createdAt: v.number(),
    }).index("by_teacher", ["teacherId"])
      .index("by_class", ["classId"]),

    assignmentSubmissions: defineTable({
      assignmentId: v.id("assignments"),
      studentId: v.id("users"),
      classId: v.id("classes"),
      status: v.union(v.literal("pending"), v.literal("submitted"), v.literal("graded"), v.literal("late")),
      grade: v.optional(v.number()),
      feedback: v.optional(v.string()),
      aiFeedback: v.optional(v.string()),
      submittedAt: v.optional(v.number()),
      gradedAt: v.optional(v.number()),
    }).index("by_assignment", ["assignmentId"])
      .index("by_student", ["studentId"])
      .index("by_class", ["classId"]),

    teacherQuizzes: defineTable({
      teacherId: v.id("users"),
      classId: v.id("classes"),
      title: v.string(),
      subject: v.string(),
      topic: v.optional(v.string()),
      difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
      totalMarks: v.number(),
      timeLimitMinutes: v.number(),
      questions: v.array(v.object({
        question: v.string(),
        type: v.union(v.literal("mcq"), v.literal("tf"), v.literal("short_answer")),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        marks: v.number(),
        difficulty: v.optional(v.string()),
      })),
      status: v.union(v.literal("draft"), v.literal("published"), v.literal("active"), v.literal("closed")),
      publishedAt: v.optional(v.number()),
      deadline: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_teacher", ["teacherId"])
      .index("by_class", ["classId"]),

    quizAttempts: defineTable({
      quizId: v.id("teacherQuizzes"),
      studentId: v.id("users"),
      classId: v.id("classes"),
      score: v.number(),
      totalMarks: v.number(),
      correctCount: v.number(),
      totalQuestions: v.number(),
      answers: v.array(v.object({
        questionIndex: v.number(),
        userAnswer: v.string(),
        isCorrect: v.boolean(),
        marks: v.number(),
      })),
      aiFeedback: v.optional(v.string()),
      startedAt: v.number(),
      completedAt: v.optional(v.number()),
    }).index("by_quiz", ["quizId"])
      .index("by_student", ["studentId"])
      .index("by_class", ["classId"]),

    announcements: defineTable({
      teacherId: v.id("users"),
      classId: v.id("classes"),
      title: v.string(),
      content: v.string(),
      type: v.union(v.literal("exam"), v.literal("homework"), v.literal("update"), v.literal("revision"), v.literal("general")),
      priority: v.union(v.literal("normal"), v.literal("important"), v.literal("urgent")),
      createdAt: v.number(),
    }).index("by_teacher", ["teacherId"])
      .index("by_class", ["classId"]),

    revisionPlans: defineTable({
      teacherId: v.id("users"),
      classId: v.id("classes"),
      title: v.string(),
      subject: v.string(),
      startDate: v.string(),
      endDate: v.string(),
      days: v.array(v.object({
        date: v.string(),
        topic: v.string(),
        activity: v.string(),
        durationMinutes: v.number(),
        completed: v.boolean(),
      })),
      createdAt: v.number(),
    }).index("by_teacher", ["teacherId"])
      .index("by_class", ["classId"]),

    classPerformance: defineTable({
      classId: v.id("classes"),
      subject: v.string(),
      topic: v.string(),
      averageScore: v.number(),
      totalStudents: v.number(),
      assessedStudents: v.number(),
      date: v.string(),
      createdAt: v.number(),
    }).index("by_class", ["classId"])
      .index("by_class_subject", ["classId", "subject"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ═══════════════════════════════════════════════════════
// USER ROLE
// ═══════════════════════════════════════════════════════

export const setAccountType = mutation({
  args: {
    accountType: v.union(v.literal("student"), v.literal("teacher")),
    institution: v.optional(v.string()),
    subjectsTaught: v.optional(v.array(v.string())),
    classesTaught: v.optional(v.array(v.string())),
    gradeYear: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as any;
    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), userId)).first();
    if (user) {
      await ctx.db.patch(user._id, {
        accountType: args.accountType,
        role: args.accountType === "teacher" ? "teacher" : "student",
        institution: args.institution,
        subjectsTaught: args.subjectsTaught,
        classesTaught: args.classesTaught,
        gradeYear: args.gradeYear,
      });
    }
  },
});

// ═══════════════════════════════════════════════════════
// CLASSES
// ═══════════════════════════════════════════════════════

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export const createClass = mutation({
  args: {
    name: v.string(),
    subject: v.string(),
    grade: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as any;
    return await ctx.db.insert("classes", {
      teacherId: userId,
      ...args,
      joinCode: generateJoinCode(),
      studentCount: 0,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const listClasses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("classes")
      .withIndex("by_teacher", (q) => q.eq("teacherId", identity.subject as any))
      .collect();
  },
});

export const getClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.classId);
  },
});

export const updateClass = mutation({
  args: {
    classId: v.id("classes"),
    name: v.optional(v.string()),
    subject: v.optional(v.string()),
    grade: v.optional(v.string()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { classId, ...updates } = args;
    await ctx.db.patch(classId, updates);
  },
});

export const joinClass = mutation({
  args: { joinCode: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as any;

    // Find class by join code
    const allClasses = await ctx.db.query("classes").collect();
    const cls = allClasses.find((c) => c.joinCode === args.joinCode && c.isActive);
    if (!cls) throw new Error("Invalid join code");

    // Check if already joined
    const existing = await ctx.db
      .query("classMembers")
      .withIndex("by_class_student", (q) =>
        q.eq("classId", cls._id).eq("studentId", userId),
      )
      .first();
    if (existing) throw new Error("Already joined this class");

    // Add member
    await ctx.db.insert("classMembers", {
      classId: cls._id,
      studentId: userId,
      joinedAt: Date.now(),
      isActive: true,
    });

    // Update student count
    await ctx.db.patch(cls._id, { studentCount: cls.studentCount + 1 });

    return cls;
  },
});

export const getClassMembers = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("classMembers")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();

    const membersWithDetails = await Promise.all(
      members.map(async (m) => {
        const student = await ctx.db.get(m.studentId);
        return { ...m, student };
      })
    );
    return membersWithDetails;
  },
});

export const removeMember = mutation({
  args: { classId: v.id("classes"), studentId: v.id("users") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("classMembers")
      .withIndex("by_class_student", (q) =>
        q.eq("classId", args.classId).eq("studentId", args.studentId),
      )
      .first();
    if (members) {
      await ctx.db.patch(members._id, { isActive: false });
      const cls = await ctx.db.get(args.classId);
      if (cls) await ctx.db.patch(args.classId, { studentCount: Math.max(0, cls.studentCount - 1) });
    }
  },
});

// ═══════════════════════════════════════════════════════
// TEACHER QUIZZES
// ═══════════════════════════════════════════════════════

export const createQuiz = mutation({
  args: {
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
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("teacherQuizzes", {
      teacherId: identity.subject as any,
      ...args,
      publishedAt: args.status === "published" ? Date.now() : undefined,
      createdAt: Date.now(),
    });
  },
});

export const listTeacherQuizzes = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teacherQuizzes")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

export const updateQuiz = mutation({
  args: {
    quizId: v.id("teacherQuizzes"),
    title: v.optional(v.string()),
    questions: v.optional(v.array(v.object({
      question: v.string(),
      type: v.union(v.literal("mcq"), v.literal("tf"), v.literal("short_answer")),
      options: v.optional(v.array(v.string())),
      correctAnswer: v.string(),
      explanation: v.optional(v.string()),
      marks: v.number(),
      difficulty: v.optional(v.string()),
    }))),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("active"), v.literal("closed"))),
    totalMarks: v.optional(v.number()),
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { quizId, ...updates } = args;
    const patch: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) patch[key] = value;
    }
    if (updates.status === "published") patch.publishedAt = Date.now();
    await ctx.db.patch(quizId, patch);
  },
});

// ═══════════════════════════════════════════════════════
// ASSIGNMENTS
// ═══════════════════════════════════════════════════════

export const createAssignment = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("assignments", {
      teacherId: identity.subject as any,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listAssignments = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assignments")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

export const getAssignmentStats = query({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("assignmentSubmissions")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", args.assignmentId))
      .collect();
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) return { submitted: 0, pending: 0, late: 0, graded: 0 };

    const members = await ctx.db
      .query("classMembers")
      .withIndex("by_class", (q) => q.eq("classId", assignment.classId))
      .collect();
    const activeStudents = members.filter((m) => m.isActive).length;

    return {
      submitted: submissions.filter((s) => s.status === "submitted").length,
      pending: activeStudents - submissions.length,
      late: submissions.filter((s) => s.status === "late").length,
      graded: submissions.filter((s) => s.status === "graded").length,
      total: activeStudents,
    };
  },
});

// ═══════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════

export const createAnnouncement = mutation({
  args: {
    classId: v.id("classes"),
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("exam"), v.literal("homework"), v.literal("update"), v.literal("revision"), v.literal("general")),
    priority: v.union(v.literal("normal"), v.literal("important"), v.literal("urgent")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("announcements", {
      teacherId: identity.subject as any,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listAnnouncements = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

// ═══════════════════════════════════════════════════════
// TEACHER DASHBOARD STATS
// ═══════════════════════════════════════════════════════

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { totalStudents: 0, activeClasses: 0, pendingAssignments: 0, avgPerformance: 0, completionRate: 0 };
    const userId = identity.subject as any;

    const classes = await ctx.db
      .query("classes")
      .withIndex("by_teacher", (q) => q.eq("teacherId", userId))
      .collect();

    let totalStudents = 0;
    for (const cls of classes) {
      totalStudents += cls.studentCount;
    }

    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_teacher", (q) => q.eq("teacherId", userId))
      .collect();

    const pendingAssignments = assignments.filter((a) => a.status === "published").length;

    const quizzes = await ctx.db
      .query("teacherQuizzes")
      .withIndex("by_teacher", (q) => q.eq("teacherId", userId))
      .collect();

    return {
      totalStudents,
      activeClasses: classes.filter((c) => c.isActive).length,
      pendingAssignments,
      avgPerformance: 72,
      completionRate: 78,
      totalQuizzes: quizzes.length,
    };
  },
});

// ═══════════════════════════════════════════════════════
// CLASS PERFORMANCE
// ═══════════════════════════════════════════════════════

export const getClassPerformance = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();

    if (attempts.length === 0) {
      return {
        avgScore: 0,
        totalAttempts: 0,
        topicMastery: [],
        recentTrend: [],
      };
    }

    const avgScore = Math.round(
      attempts.reduce((sum, a) => sum + (a.score / a.totalMarks) * 100, 0) / attempts.length
    );

    const recentTrend = attempts
      .sort((a, b) => (a.completedAt ?? a.startedAt) - (b.completedAt ?? b.startedAt))
      .slice(-10)
      .map((a) => ({
        date: new Date(a.completedAt ?? a.startedAt).toISOString().split("T")[0],
        score: Math.round((a.score / a.totalMarks) * 100),
      }));

    return {
      avgScore,
      totalAttempts: attempts.length,
      topicMastery: [
        { topic: "Kinematics", mastery: 86 },
        { topic: "Newton's Laws", mastery: 78 },
        { topic: "Work & Energy", mastery: 71 },
        { topic: "Momentum", mastery: 63 },
        { topic: "Rotational Motion", mastery: 49 },
      ],
      recentTrend,
    };
  },
});

// ═══════════════════════════════════════════════════════
// REVISION PLANS
// ═══════════════════════════════════════════════════════

export const createRevisionPlan = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("revisionPlans", {
      teacherId: identity.subject as any,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listRevisionPlans = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("revisionPlans")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

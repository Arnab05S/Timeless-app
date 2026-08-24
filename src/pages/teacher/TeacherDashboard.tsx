import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Users, BookOpen, FileText, BarChart3, Sparkles, ArrowRight,
  Clock, Target, TrendingUp, AlertTriangle, CheckCircle2, Sun, Moon, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

const aiInsights = [
  { type: "warning", icon: AlertTriangle, text: "58% of Class 11A struggled with Thermodynamics in the latest quiz.", action: "Review Class Performance" },
  { type: "alert", icon: Clock, text: "12 students have not completed this week's revision activities.", action: "Send Reminder" },
  { type: "positive", icon: TrendingUp, text: "Class performance in Newton's Laws improved by 14% this week.", action: null },
  { type: "suggestion", icon: Sparkles, text: "Consider scheduling a revision session for Rotational Motion — only 49% mastery.", action: "Create Revision Plan" },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const stats = useQuery(api.teacher.getDashboardStats);
  const classes = useQuery(api.teacher.listClasses);

  const overviewCards = [
    { icon: Users, label: "Total Students", value: stats?.totalStudents ?? 0, color: "sky" },
    { icon: BookOpen, label: "Active Classes", value: stats?.activeClasses ?? 0, color: "emerald" },
    { icon: FileText, label: "Active Quizzes", value: stats?.totalQuizzes ?? 0, color: "amber" },
    { icon: BarChart3, label: "Avg Performance", value: `${stats?.avgPerformance ?? 0}%`, color: "violet" },
  ];

  return (
    <div className="px-6 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className={cn("mt-1", isDark ? "text-white/35" : "text-slate-500")}>
              {classes && classes.length > 0
                ? `${classes.length} active class${classes.length > 1 ? "es" : ""} · ${stats?.totalStudents ?? 0} students`
                : "Set up your first class to get started"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.1, rotate: isDark ? 180 : 0 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme}
              className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer", isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-200/60 hover:bg-slate-200 text-slate-500")}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06d6a0] to-[#0ea5e9] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
              {user?.name?.[0]?.toUpperCase() || "T"}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {overviewCards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.06}>
              <motion.div className="glass-card p-4 hover-glow" whileHover={{ y: -3 }}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3",
                  card.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                  card.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                  card.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                  card.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                )}>
                  <card.icon className={cn("w-4 h-4",
                    card.color === "sky" && "text-sky-500",
                    card.color === "emerald" && "text-emerald-500",
                    card.color === "amber" && "text-amber-500",
                    card.color === "violet" && "text-violet-500",
                  )} />
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-white/35" : "text-slate-500")}>{card.label}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Quick Actions */}
        <Reveal className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Zap, label: "Create Quiz", sub: "AI-generated questions", color: "amber", route: "/teacher/create" },
              { icon: FileText, label: "New Assignment", sub: "Set deadline & marks", color: "sky", route: "/teacher/create" },
              { icon: BookOpen, label: "Upload Material", sub: "PDFs, notes, slides", color: "violet", route: "/teacher/create" },
              { icon: Target, label: "New Class", sub: "Invite students", color: "emerald", route: "/teacher/classes" },
            ].map((action, i) => (
              <Reveal key={action.label} delay={i * 0.06}>
                <motion.button whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.route)} className="glass-card p-4 text-left hover-glow">
                  <motion.div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                    action.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                    action.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                    action.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                    action.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                  )} whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.3 }}>
                    <action.icon className={cn("w-5 h-5",
                      action.color === "sky" && "text-sky-500",
                      action.color === "amber" && "text-amber-500",
                      action.color === "emerald" && "text-emerald-500",
                      action.color === "violet" && "text-violet-500",
                    )} />
                  </motion.div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className={cn("text-[10px] mt-0.5", isDark ? "text-white/25" : "text-slate-400")}>{action.sub}</p>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* AI Insights */}
        <Reveal className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-100 to-emerald-50 dark:from-sky-500/20 dark:to-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold">AI Class Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className={cn("glass-card px-5 py-4 flex items-start gap-3", "hover-lift")}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  insight.type === "warning" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                  insight.type === "alert" && (isDark ? "bg-red-500/10" : "bg-red-100"),
                  insight.type === "positive" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                  insight.type === "suggestion" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                )}>
                  <insight.icon className={cn("w-4 h-4",
                    insight.type === "warning" && "text-amber-500",
                    insight.type === "alert" && "text-red-500",
                    insight.type === "positive" && "text-emerald-500",
                    insight.type === "suggestion" && "text-sky-500",
                  )} />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-white/60" : "text-slate-600")}>{insight.text}</p>
                  {insight.action && (
                    <Button size="sm" variant="link" className={cn("p-0 h-auto mt-1 text-xs", isDark ? "text-sky-400" : "text-sky-600")}
                      onClick={() => navigate("/teacher/analytics")}>
                      {insight.action} <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Classes Overview */}
        {classes && classes.length > 0 && (
          <Reveal className="mb-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Classes</h3>
              <Button variant="ghost" size="sm" className={cn("text-xs cursor-pointer", isDark ? "text-white/40 hover:text-white" : "text-slate-500 hover:text-slate-900")}
                onClick={() => navigate("/teacher/classes")}>
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classes.slice(0, 4).map((cls) => (
                <motion.div key={cls._id} whileHover={{ y: -2 }} className="glass-card px-5 py-4 flex items-center gap-4 hover-glow cursor-pointer"
                  onClick={() => navigate(`/teacher/classes/${cls._id}`)}>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    isDark ? "bg-emerald-500/10" : "bg-emerald-100")}>
                    <BookOpen className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{cls.name}</p>
                    <p className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>
                      {cls.subject} · {cls.studentCount} students · Code: {cls.joinCode}
                    </p>
                  </div>
                  <ArrowRight className={cn("w-4 h-4 shrink-0", isDark ? "text-white/15" : "text-slate-300")} />
                </motion.div>
              ))}
            </div>
          </Reveal>
        )}
      </motion.div>
    </div>
  );
}

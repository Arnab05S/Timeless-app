import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Clock,
  Flame,
  Target,
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Plus,
  FileText,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function RevealSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const todaySummary = useQuery(api.tasks.todaySummary);
  const studyStats = useQuery(api.studySessions.getStats);
  const upcomingTasks = useQuery(api.tasks.getUpcoming, { limit: 5 });
  const subjects = useQuery(api.subjects.list);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning ☀️";
    if (hour < 17) return "Good afternoon 🌤";
    return "Good evening 🌙";
  };

  const totalTasks = todaySummary?.tasks.length ?? 0;
  const completedTasks = todaySummary?.tasks.filter((t) => t.status === "completed").length ?? 0;
  const totalMinutes = todaySummary?.totalMinutes ?? 0;
  const completedMinutes = todaySummary?.completedMinutes ?? 0;
  const progress = totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;
  const streak = studyStats?.streak ?? 0;
  const todayMinutes = studyStats?.todayMinutes ?? 0;

  const stats = [
    { icon: Target, label: "Tasks Today", value: totalTasks, sub: `${completedTasks} completed`, color: "sky" },
    { icon: Flame, label: "Study Streak", value: `${streak}d`, sub: streak > 0 ? "Maintaining" : "Start today", color: "amber" },
    { icon: Clock, label: "Study Time", value: todayMinutes > 0 ? `${todayMinutes}m` : "0m", sub: `${totalMinutes}m total`, color: "emerald" },
    { icon: TrendingUp, label: "Completion", value: `${progress}%`, sub: "of today's schedule", color: "violet" },
  ];

  return (
    <div className="px-6 pt-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}</h1>
              <p className={cn("mt-1", isDark ? "text-white/35" : "text-slate-500")}>
                Here's your study plan for today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: isDark ? 180 : 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer",
                  isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-200/60 hover:bg-slate-200 text-slate-500",
                )}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06d6a0] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-sky-500/20">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Onboarding */}
        {subjects && subjects.length === 0 && (
          <RevealSection className="mb-6">
            <motion.div
              className={cn(
                "glass-card p-6 border-2",
                isDark
                  ? "bg-sky-500/[0.03] border-sky-500/20"
                  : "bg-sky-50 border-sky-200",
              )}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0ea5e9]/20 to-[#06d6a0]/20 flex items-center justify-center shrink-0"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-[#0ea5e9] dark:text-[#38bdf8]" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1">Welcome to Timeless</h3>
                  <p className={cn("text-sm mb-3", isDark ? "text-white/40" : "text-slate-500")}>
                    Start by adding your subjects. Timeless will create a personalized study plan for you.
                  </p>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold text-xs cursor-pointer shadow-lg shadow-sky-500/20"
                      onClick={() => navigate("/app/profile")}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add Your First Subject
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </RevealSection>
        )}

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, i) => (
            <RevealSection key={stat.label} delay={i * 0.06}>
              <motion.div
                className="glass-card p-4 hover-glow"
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center mb-3",
                    stat.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                    stat.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                    stat.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                    stat.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                  )}
                >
                  <stat.icon
                    className={cn(
                      "w-4 h-4",
                      stat.color === "sky" && "text-[#0ea5e9] dark:text-[#38bdf8]",
                      stat.color === "amber" && "text-[#f59e0b] dark:text-[#ffd166]",
                      stat.color === "emerald" && "text-[#06d6a0]",
                      stat.color === "violet" && "text-[#8b5cf6] dark:text-[#a78bfa]",
                    )}
                  />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-white/35" : "text-slate-500")}>{stat.label}</p>
                <p className={cn("text-[10px] mt-0.5", isDark ? "text-white/20" : "text-slate-400")}>{stat.sub}</p>
              </motion.div>
            </RevealSection>
          ))}
        </motion.div>

        {/* Progress */}
        {totalTasks > 0 && (
          <RevealSection className="mb-6">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Daily Progress</h3>
                <span className={cn("text-xs", isDark ? "text-white/25" : "text-slate-400")}>
                  {completedTasks}/{totalTasks} tasks
                </span>
              </div>
              <div className={cn("w-full h-2.5 rounded-full", isDark ? "bg-white/5" : "bg-slate-200/60")}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="h-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0]"
                />
              </div>
            </div>
          </RevealSection>
        )}

        {/* AI Recommendation */}
        <RevealSection className="mb-6">
          <motion.div className="glass-card p-5" whileHover={{ scale: 1.005 }}>
            <div className="flex items-start gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9]/20 to-[#06d6a0]/20 flex items-center justify-center shrink-0 mt-0.5"
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-[#0ea5e9] dark:text-[#38bdf8]" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1">AI Recommendation</h3>
                <p className={cn("text-sm leading-relaxed", isDark ? "text-white/40" : "text-slate-500")}>
                  {subjects && subjects.length > 0
                    ? `${subjects.length} subject${subjects.length > 1 ? "s" : ""} configured. Begin a revision session or take a quick assessment to reinforce your understanding.`
                    : "Add your subjects and exam dates to receive personalized study recommendations."}
                </p>
                <div className="flex gap-2 mt-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className={cn(
                        "text-xs cursor-pointer",
                        isDark ? "bg-sky-500/10 text-[#38bdf8] hover:bg-sky-500/20" : "bg-sky-100 text-sky-700 hover:bg-sky-200",
                      )}
                      onClick={() => navigate("/app/learn/flashcards")}
                    >
                      <Brain className="w-3.5 h-3.5 mr-1.5" />
                      Review Flashcards
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className={cn(
                        "text-xs cursor-pointer",
                        isDark ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-amber-100 text-amber-700 hover:bg-amber-200",
                      )}
                      onClick={() => navigate("/app/learn/quiz")}
                    >
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Quick Quiz
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </RevealSection>

        {/* Today's Tasks */}
        <RevealSection className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <Button
              variant="ghost"
              size="sm"
              className={cn("text-xs cursor-pointer", isDark ? "text-white/35 hover:text-white" : "text-slate-500 hover:text-slate-900")}
              onClick={() => navigate("/app/schedule")}
            >
              Full schedule <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          {!todaySummary || todaySummary.tasks.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3", isDark ? "bg-white/5" : "bg-slate-100")}>
                <CalendarDaysIcon className={cn("w-6 h-6", isDark ? "text-white/15" : "text-slate-300")} />
              </div>
              <p className={cn("text-sm mb-3", isDark ? "text-white/25" : "text-slate-400")}>No tasks scheduled for today</p>
              <Button
                size="sm"
                className={cn("text-xs cursor-pointer", isDark ? "bg-sky-500/10 text-[#38bdf8] hover:bg-sky-500/20" : "bg-sky-100 text-sky-700 hover:bg-sky-200")}
                onClick={() => navigate("/app/schedule")}
              >
                <Target className="w-3.5 h-3.5 mr-1.5" />Add your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySummary.tasks.map((task, i) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn("glass-card-light px-4 py-3 flex items-center gap-3", "hover-lift cursor-default")}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      task.status === "completed" ? "bg-emerald-500" : task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-amber-500" : "bg-sky-500",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", task.status === "completed" && "line-through opacity-40")}>
                      {task.title}
                    </p>
                    <p className={cn("text-[10px]", isDark ? "text-white/20" : "text-slate-400")}>
                      {task.scheduledTime && `${task.scheduledTime} · `}{task.durationMinutes && `${task.durationMinutes}m`}
                    </p>
                  </div>
                  {task.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </motion.div>
              ))}
            </div>
          )}
        </RevealSection>

        {/* Quick Actions */}
        <RevealSection className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Target, label: "Plan My Day", sub: "Schedule study sessions", color: "sky", route: "/app/schedule" },
              { icon: Zap, label: "Rapid Quiz", sub: "Test understanding in 10 min", color: "amber", route: "/app/learn/quiz" },
              { icon: Brain, label: "Flashcards", sub: "Review with spaced repetition", color: "emerald", route: "/app/learn/flashcards" },
              { icon: FileText, label: "Upload PDF", sub: "AI will analyze your material", color: "violet", route: "/app/learn/upload" },
            ].map((action, i) => (
              <RevealSection key={action.label} delay={i * 0.06}>
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.route)}
                  className="glass-card p-4 text-left hover-glow"
                >
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                      action.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                      action.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                      action.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                      action.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                    )}
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <action.icon
                      className={cn(
                        "w-5 h-5",
                        action.color === "sky" && "text-[#0ea5e9] dark:text-[#38bdf8]",
                        action.color === "amber" && "text-[#f59e0b] dark:text-[#ffd166]",
                        action.color === "emerald" && "text-[#06d6a0]",
                        action.color === "violet" && "text-[#8b5cf6] dark:text-[#a78bfa]",
                      )}
                    />
                  </motion.div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className={cn("text-[10px] mt-0.5", isDark ? "text-white/25" : "text-slate-400")}>{action.sub}</p>
                </motion.button>
              </RevealSection>
            ))}
          </div>
        </RevealSection>

        {/* Upcoming */}
        {upcomingTasks && upcomingTasks.length > 0 && (
          <RevealSection className="mb-6 pb-4">
            <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
            <div className="space-y-2">
              {upcomingTasks.slice(0, 3).map((task, i) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card-light px-4 py-3 flex items-center gap-3 hover-lift"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isDark ? "bg-sky-500/10" : "bg-sky-100")}>
                    <BookOpen className="w-4 h-4 text-[#0ea5e9] dark:text-[#38bdf8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className={cn("text-[10px]", isDark ? "text-white/20" : "text-slate-400")}>Due {task.scheduledDate}</p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      task.priority === "high" && (isDark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-600"),
                      task.priority === "medium" && (isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-600"),
                      task.priority === "low" && (isDark ? "bg-sky-500/10 text-sky-400" : "bg-sky-100 text-sky-600"),
                    )}
                  >
                    {task.priority}
                  </span>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        )}
      </motion.div>
    </div>
  );
}

function CalendarDaysIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  );
}

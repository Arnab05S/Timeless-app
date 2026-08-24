import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const todaySummary = useQuery(api.tasks.todaySummary);
  const studyStats = useQuery(api.studySessions.getStats);
  const upcomingTasks = useQuery(api.tasks.getUpcoming, { limit: 5 });
  const subjects = useQuery(api.subjects.list);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const totalTasks = todaySummary?.tasks.length ?? 0;
  const completedTasks = todaySummary?.tasks.filter(
    (t) => t.status === "completed",
  ).length ?? 0;
  const totalMinutes = todaySummary?.totalMinutes ?? 0;
  const completedMinutes = todaySummary?.completedMinutes ?? 0;
  const progress = totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;
  const streak = studyStats?.streak ?? 0;
  const todayMinutes = studyStats?.todayMinutes ?? 0;

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
              <h1 className="text-3xl font-bold tracking-tight">
                {getGreeting()}
              </h1>
              <p className="text-white/35 mt-1">
                Here is your study plan for today
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#06d6a0] flex items-center justify-center text-[#050a18] font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
            </div>
          </div>
        </motion.div>

        {/* Welcome Onboarding (if no subjects) */}
        {subjects && subjects.length === 0 && (
          <motion.div variants={fadeUp} className="mb-6">
            <div className="glass-card p-6 bg-gradient-to-r from-[#38bdf8]/5 to-[#06d6a0]/5 border-[#38bdf8]/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#38bdf8]/20 to-[#06d6a0]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-[#38bdf8]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1">Welcome to Timeless</h3>
                  <p className="text-sm text-white/40 mb-3">
                    Start by adding your subjects. Timeless will use this to create a personalized study plan for you.
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold text-xs cursor-pointer"
                    onClick={() => navigate("/app/profile")}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Your First Subject
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Row */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              icon: Target,
              label: "Tasks Today",
              value: totalTasks,
              sub: `${completedTasks} completed`,
              color: "#38bdf8",
            },
            {
              icon: Flame,
              label: "Study Streak",
              value: `${streak}d`,
              sub: streak > 0 ? "Maintaining" : "Start today",
              color: "#ffd166",
            },
            {
              icon: Clock,
              label: "Study Time",
              value: todayMinutes > 0 ? `${todayMinutes}m` : "0m",
              sub: `${totalMinutes}m total logged`,
              color: "#06d6a0",
            },
            {
              icon: TrendingUp,
              label: "Completion",
              value: `${progress}%`,
              sub: "of today's schedule",
              color: "#a78bfa",
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: stat.color }}
                />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-white/35 mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Today's Progress */}
        {totalTasks > 0 && (
          <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Daily Progress</h3>
              <span className="text-xs text-white/25">
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#06d6a0]"
              />
            </div>
          </motion.div>
        )}

        {/* AI Recommendation */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8]/20 to-[#06d6a0]/20 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">AI Recommendation</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {subjects && subjects.length > 0
                  ? `${subjects.length} subject${subjects.length > 1 ? "s" : ""} configured. Begin a revision session or take a quick assessment to reinforce your understanding.`
                  : "Add your subjects and exam dates to receive personalized study recommendations."}
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 text-xs cursor-pointer"
                  onClick={() => navigate("/app/learn/flashcards")}
                >
                  <Brain className="w-3.5 h-3.5 mr-1.5" />
                  Review Flashcards
                </Button>
                <Button
                  size="sm"
                  className="bg-[#ffd166]/10 text-[#ffd166] hover:bg-[#ffd166]/20 text-xs cursor-pointer"
                  onClick={() => navigate("/app/learn/quiz")}
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Quick Assessment
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/35 hover:text-white text-xs cursor-pointer"
              onClick={() => navigate("/app/schedule")}
            >
              Full schedule <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          {!todaySummary || todaySummary.tasks.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <CalendarDaysIcon className="w-6 h-6 text-white/15" />
              </div>
              <p className="text-sm text-white/25 mb-3">No tasks scheduled for today</p>
              <Button
                size="sm"
                className="bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 text-xs cursor-pointer"
                onClick={() => navigate("/app/schedule")}
              >
                <Target className="w-3.5 h-3.5 mr-1.5" />
                Add your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySummary.tasks.map((task) => (
                <div
                  key={task._id}
                  className="glass-card-light px-4 py-3 flex items-center gap-3"
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      task.status === "completed"
                        ? "bg-[#06d6a0]"
                        : task.priority === "high"
                          ? "bg-[#ef476f]"
                          : task.priority === "medium"
                            ? "bg-[#ffd166]"
                            : "bg-[#38bdf8]",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        task.status === "completed" && "line-through text-white/25",
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="text-[10px] text-white/20">
                      {task.scheduledTime && `${task.scheduledTime} · `}
                      {task.durationMinutes && `${task.durationMinutes}m`}
                    </p>
                  </div>
                  {task.status === "completed" && (
                    <CheckCircle2 className="w-4 h-4 text-[#06d6a0] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/app/schedule")}
              className="glass-card p-4 text-left group hover:border-[#38bdf8]/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 flex items-center justify-center mb-3 group-hover:bg-[#38bdf8]/15 transition-colors">
                <Target className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <p className="text-sm font-medium">Plan My Day</p>
              <p className="text-[10px] text-white/25 mt-0.5">
                Schedule study sessions
              </p>
            </button>
            <button
              onClick={() => navigate("/app/learn/quiz")}
              className="glass-card p-4 text-left group hover:border-[#ffd166]/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ffd166]/10 flex items-center justify-center mb-3 group-hover:bg-[#ffd166]/15 transition-colors">
                <Zap className="w-5 h-5 text-[#ffd166]" />
              </div>
              <p className="text-sm font-medium">Rapid Quiz</p>
              <p className="text-[10px] text-white/25 mt-0.5">
                Test understanding in 10 minutes
              </p>
            </button>
            <button
              onClick={() => navigate("/app/learn/flashcards")}
              className="glass-card p-4 text-left group hover:border-[#06d6a0]/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#06d6a0]/10 flex items-center justify-center mb-3 group-hover:bg-[#06d6a0]/15 transition-colors">
                <Brain className="w-5 h-5 text-[#06d6a0]" />
              </div>
              <p className="text-sm font-medium">Flashcards</p>
              <p className="text-[10px] text-white/25 mt-0.5">
                Review with spaced repetition
              </p>
            </button>
            <button
              onClick={() => navigate("/app/learn/upload")}
              className="glass-card p-4 text-left group hover:border-[#a78bfa]/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center mb-3 group-hover:bg-[#a78bfa]/15 transition-colors">
                <FileText className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <p className="text-sm font-medium">Upload PDF</p>
              <p className="text-[10px] text-white/25 mt-0.5">
                AI will analyze your material
              </p>
            </button>
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        {upcomingTasks && upcomingTasks.length > 0 && (
          <motion.div variants={fadeUp} className="mb-6 pb-4">
            <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
            <div className="space-y-2">
              {upcomingTasks.slice(0, 3).map((task) => (
                <div
                  key={task._id}
                  className="glass-card-light px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-[10px] text-white/20">
                      Due {task.scheduledDate}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      task.priority === "high"
                        ? "bg-[#ef476f]/10 text-[#ef476f]"
                        : task.priority === "medium"
                          ? "bg-[#ffd166]/10 text-[#ffd166]"
                          : "bg-[#38bdf8]/10 text-[#38bdf8]",
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function CalendarDaysIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

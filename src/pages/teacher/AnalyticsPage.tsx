import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, Target, Sparkles, AlertTriangle, Sun, Moon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

const topicMastery = [
  { topic: "Kinematics", mastery: 86, color: "#06d6a0" },
  { topic: "Newton's Laws", mastery: 78, color: "#0ea5e9" },
  { topic: "Work & Energy", mastery: 71, color: "#f59e0b" },
  { topic: "Momentum", mastery: 63, color: "#f97316" },
  { topic: "Rotational Motion", mastery: 49, color: "#ef4444" },
];

const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({ day, avg: Math.floor(Math.random() * 20 + 65) }));

export default function AnalyticsPage() {
  const { isDark, toggleTheme } = useTheme();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={cn("rounded-xl px-3 py-2 text-xs border", isDark ? "bg-[#0a1128] border-white/[0.08]" : "bg-white border-slate-200 shadow-lg")}>
        <p className={cn("mb-1", isDark ? "text-white/40" : "text-slate-400")}>{label}</p>
        {payload.map((entry: any, i: number) => <p key={i} className="font-medium" style={{ color: entry.color }}>{entry.value}%</p>)}
      </div>
    );
  };

  return (
    <div className="px-6 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Class performance and AI insights</p>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: isDark ? 180 : 0 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme}
            className={cn("w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-200/60 hover:bg-slate-200 text-slate-500")}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: BarChart3, label: "Avg Score", value: "72%", color: "sky" },
            { icon: Users, label: "Active Students", value: "89", color: "emerald" },
            { icon: Target, label: "Quizzes Taken", value: "156", color: "amber" },
            { icon: TrendingUp, label: "Improvement", value: "+12%", color: "violet" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <motion.div className="glass-card p-4 hover-glow" whileHover={{ y: -3 }}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3",
                  stat.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                  stat.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                  stat.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                  stat.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                )}>
                  <stat.icon className={cn("w-4 h-4", `text-${stat.color}-500`)} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-white/35" : "text-slate-500")}>{stat.label}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Topic Mastery */}
        <Reveal className="mb-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Topic Mastery</h3>
            <div className="space-y-4">
              {topicMastery.map((topic, i) => (
                <motion.div key={topic.topic} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{topic.topic}</span>
                      {topic.mastery >= 80 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : topic.mastery < 60 ? <TrendingDown className="w-3 h-3 text-red-500" /> : null}
                    </div>
                    <span className={cn("text-sm font-medium", topic.mastery >= 80 ? "text-emerald-500" : topic.mastery < 60 ? "text-red-500" : isDark ? "text-white/50" : "text-slate-500")}>{topic.mastery}%</span>
                  </div>
                  <div className={cn("w-full h-2.5 rounded-full", isDark ? "bg-white/5" : "bg-slate-200/60")}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${topic.mastery}%` }} viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }} className="h-full rounded-full" style={{ backgroundColor: topic.color }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Weekly Performance Chart */}
        <Reveal className="mb-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Weekly Class Average</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)"} />
                  <XAxis dataKey="day" tick={{ fill: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[50, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" fill={isDark ? "#38bdf8" : "#0ea5e9"} radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        {/* AI Insights */}
        <Reveal className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-100 to-emerald-50 dark:from-sky-500/20 dark:to-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-500" />
            </div>
            <h3 className="text-sm font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: AlertTriangle, text: "Rotational Motion has the lowest class mastery at 49%. Consider a focused review session.", type: "warning" },
              { icon: TrendingUp, text: "Class performance in Kinematics improved 12% over the last three assessments.", type: "positive" },
              { icon: Users, text: "8 students have missed the last two revision activities.", type: "alert" },
              { icon: Sparkles, text: "Schedule a 20-minute revision session on Rotational Motion — AI can generate practice questions.", type: "suggestion" },
            ].map((insight, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className={cn("glass-card px-5 py-4 flex items-start gap-3 hover-lift")}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  insight.type === "warning" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                  insight.type === "positive" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                  insight.type === "alert" && (isDark ? "bg-red-500/10" : "bg-red-100"),
                  insight.type === "suggestion" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                )}>
                  <insight.icon className={cn("w-4 h-4",
                    insight.type === "warning" && "text-amber-500",
                    insight.type === "positive" && "text-emerald-500",
                    insight.type === "alert" && "text-red-500",
                    insight.type === "suggestion" && "text-sky-500",
                  )} />
                </div>
                <p className={cn("text-sm leading-relaxed", isDark ? "text-white/50" : "text-slate-600")}>{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </motion.div>
    </div>
  );
}

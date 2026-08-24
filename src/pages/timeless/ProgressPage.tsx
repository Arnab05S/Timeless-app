import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Flame, Target, TrendingUp, TrendingDown, Trophy } from "lucide-react";
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

function CustomTooltip({ active, payload, label }: any) {
  const { isDark } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className={cn("rounded-xl px-3 py-2 text-xs border", isDark ? "bg-[#0a1128] border-white/[0.08] text-white" : "bg-white border-slate-200 text-slate-900 shadow-lg")}>
      <p className={cn("mb-1", isDark ? "text-white/40" : "text-slate-400")}>{label}</p>
      {payload.map((entry: any, i: number) => <p key={i} className="font-medium" style={{ color: entry.color }}>{entry.value}{entry.dataKey === "score" ? "%" : " min"}</p>)}
    </div>
  );
}

function getWeeklyData() {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({ day, hours: Math.floor(Math.random() * 4 + 0.5) }));
}

function statBg(color: string, isDark: boolean) {
  const map: Record<string, string> = {
    amber: isDark ? "bg-amber-500/10" : "bg-amber-100",
    sky: isDark ? "bg-sky-500/10" : "bg-sky-100",
    emerald: isDark ? "bg-emerald-500/10" : "bg-emerald-100",
    violet: isDark ? "bg-violet-500/10" : "bg-violet-100",
  };
  return map[color] || "";
}

function statColor(color: string) {
  const map: Record<string, string> = {
    amber: "text-amber-500",
    sky: "text-sky-500",
    emerald: "text-emerald-500",
    violet: "text-violet-500",
  };
  return map[color] || "";
}

export default function ProgressPage() {
  const { isDark } = useTheme();
  const studyStats = useQuery(api.studySessions.getStats);
  const quizStats = useQuery(api.quizzes.getStats);
  const streak = studyStats?.streak ?? 0;
  const totalMinutes = studyStats?.totalMinutes ?? 0;
  const weekMinutes = studyStats?.weekMinutes ?? 0;
  const totalSessions = studyStats?.totalSessions ?? 0;
  const totalQuizCount = quizStats?.totalQuizzes ?? 0;
  const avgScore = quizStats?.avgScore ?? 0;
  const trendData = quizStats?.recentTrend ?? [];
  const weeklyData = getWeeklyData();

  const overviewStats = [
    { icon: Flame, label: "Study Streak", value: `${streak}d`, sub: "Keep it going!", color: "amber" },
    { icon: Clock, label: "Total Study Time", value: `${Math.round(totalMinutes / 60)}h`, sub: `${totalMinutes}m total`, color: "sky" },
    { icon: Target, label: "Sessions", value: totalSessions, sub: "All time", color: "emerald" },
    { icon: Trophy, label: "Avg Quiz Score", value: `${avgScore}%`, sub: `${totalQuizCount} quizzes`, color: "violet" },
  ];

  const subjectPerformance = [
    { subject: "Physics", score: 78, trend: "up" as const },
    { subject: "Math", score: 65, trend: "down" as const },
    { subject: "Chemistry", score: 82, trend: "up" as const },
  ];

  const tickColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  const gridColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";
  const barColor = isDark ? "#38bdf8" : "#0ea5e9";

  return (
    <div className="px-6 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
          <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Track your learning journey</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {overviewStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <motion.div className="glass-card p-4 hover-glow" whileHover={{ y: -3 }}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3", statBg(stat.color, isDark))}>
                  <stat.icon className={cn("w-4 h-4", statColor(stat.color))} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-white/40" : "text-slate-500")}>{stat.label}</p>
                <p className={cn("text-[10px] mt-0.5", isDark ? "text-white/25" : "text-slate-400")}>{stat.sub}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mb-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Weekly Study Time</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="hours" fill={barColor} radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        {trendData.length > 0 && (
          <Reveal className="mb-6">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold mb-4">Quiz Performance</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="quizGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="score" stroke="#06d6a0" fill="url(#quizGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal className="mb-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Subject Performance</h3>
            <div className="space-y-4">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      {subject.trend === "up" ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                    </div>
                    <span className={cn("text-sm font-medium", isDark ? "text-white/50" : "text-slate-500")}>{subject.score}%</span>
                  </div>
                  <div className={cn("w-full h-2.5 rounded-full", isDark ? "bg-white/5" : "bg-slate-200/60")}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${subject.score}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full" style={{ background: subject.score >= 80 ? "linear-gradient(90deg, #06d6a0, #0ea5e9)" : subject.score >= 60 ? "linear-gradient(90deg, #f59e0b, #0ea5e9)" : "linear-gradient(90deg, #ef4444, #f59e0b)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mb-6">
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-sky-500/10" : "bg-sky-100")}><Clock className="w-5 h-5 text-sky-500" /></div>
              <div><h3 className="text-sm font-semibold">This Week</h3><p className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>{Math.round(weekMinutes / 60)}h {weekMinutes % 60}m studied</p></div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} className="text-center">
                  <p className={cn("text-[10px] mb-1", isDark ? "text-white/20" : "text-slate-400")}>{day}</p>
                  <div className="w-full aspect-square rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: i < new Date().getDay() ? (isDark ? "rgba(56,189,248,0.15)" : "rgba(14,165,233,0.08)") : (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)") }}>
                    {i < new Date().getDay() && <span className="text-[9px] font-medium text-slate-500">{Math.floor(Math.random() * 3 + 1)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mb-20">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-3">AI Insights</h3>
            <div className="space-y-3">
              {[
                { icon: TrendingUp, text: "Your Physics scores improved from 62% to 78%. Keep up the revision!", color: "emerald" },
                { icon: TrendingDown, text: "Math needs attention — scores dropped below 70%. Try two 20-minute sessions this week.", color: "red" },
                { icon: Flame, text: `You've studied ${weekMinutes}m this week. Aim for 10 hours to maintain your streak!`, color: "amber" },
              ].map((insight, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className={cn("flex items-start gap-3 rounded-xl p-3", isDark ? "bg-white/[0.02]" : "bg-slate-50")}>
                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    insight.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                    insight.color === "red" && (isDark ? "bg-red-500/10" : "bg-red-100"),
                    insight.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                  )}>
                    <insight.icon className={cn("w-3 h-3",
                      insight.color === "emerald" && "text-emerald-500",
                      insight.color === "red" && "text-red-500",
                      insight.color === "amber" && "text-amber-500",
                    )} />
                  </div>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-white/40" : "text-slate-600")}>{insight.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </motion.div>
    </div>
  );
}

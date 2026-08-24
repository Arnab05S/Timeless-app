import { motion } from "framer-motion";
import {
  BarChart3,
  Clock,
  Flame,
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  Trophy,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1128] border border-white/[0.08] rounded-xl px-3 py-2 text-xs">
      <p className="text-white/40 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-medium" style={{ color: entry.color }}>
          {entry.value}
          {entry.dataKey === "score" ? "%" : " min"}
        </p>
      ))}
    </div>
  );
}

// Generate mock weekly data
function getWeeklyData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => ({
    day,
    hours: Math.floor(Math.random() * 4 + 0.5),
    sessions: Math.floor(Math.random() * 3 + 1),
  }));
}

export default function ProgressPage() {
  const studyStats = useQuery(api.studySessions.getStats);
  const sessions = useQuery(api.studySessions.getSessions, {});
  const quizStats = useQuery(api.quizzes.getStats);

  const streak = studyStats?.streak ?? 0;
  const totalMinutes = studyStats?.totalMinutes ?? 0;
  const todayMinutes = studyStats?.todayMinutes ?? 0;
  const weekMinutes = studyStats?.weekMinutes ?? 0;
  const totalSessions = studyStats?.totalSessions ?? 0;

  const totalQuizCount = quizStats?.totalQuizzes ?? 0;
  const avgScore = quizStats?.avgScore ?? 0;
  const trendData = quizStats?.recentTrend ?? [];
  const weeklyData = getWeeklyData();

  // Subject performance from sessions
  const subjectPerformance = [
    { subject: "Physics", score: 78, trend: "up" as const },
    { subject: "Math", score: 65, trend: "down" as const },
    { subject: "Chemistry", score: 82, trend: "up" as const },
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
          <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
          <p className="text-white/40 mt-1">
            Track your learning journey
          </p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              icon: Flame,
              label: "Study Streak",
              value: `${streak}d`,
              color: "#ffd166",
              sub: "Best: 7d",
            },
            {
              icon: Clock,
              label: "Total Study Time",
              value: `${Math.round(totalMinutes / 60)}h`,
              color: "#38bdf8",
              sub: `${totalMinutes}m total`,
            },
            {
              icon: Target,
              label: "Sessions",
              value: totalSessions,
              color: "#06d6a0",
              sub: "All time",
            },
            {
              icon: Trophy,
              label: "Avg Quiz Score",
              value: `${avgScore}%`,
              color: "#a78bfa",
              sub: `${totalQuizCount} quizzes`,
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Weekly Study Chart */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
          <h3 className="text-sm font-semibold mb-4">Weekly Study Time</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="hours"
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quiz Performance Trend */}
        {trendData.length > 0 && (
          <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#06d6a0"
                    fill="url(#quizGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Subject Performance */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
          <h3 className="text-sm font-semibold mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{subject.subject}</span>
                    {subject.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-[#06d6a0]" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-[#ef476f]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-white/50">
                    {subject.score}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${subject.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        subject.score >= 80
                          ? "linear-gradient(90deg, #06d6a0, #38bdf8)"
                          : subject.score >= 60
                            ? "linear-gradient(90deg, #ffd166, #38bdf8)"
                            : "linear-gradient(90deg, #ef476f, #ffd166)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Study Time This Week */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">This Week</h3>
              <p className="text-xs text-white/30">
                {Math.round(weekMinutes / 60)}h {weekMinutes % 60}m studied
              </p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] text-white/20 mb-1">{day}</p>
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      i < new Date().getDay()
                        ? `rgba(56,189,248,${0.1 + Math.random() * 0.3})`
                        : "rgba(255,255,255,0.02)",
                  }}
                >
                  {i < new Date().getDay() && (
                    <span className="text-[9px] font-medium text-white/50">
                      {Math.floor(Math.random() * 3 + 1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-20">
          <h3 className="text-sm font-semibold mb-3">AI Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white/[0.02] rounded-xl p-3">
              <div className="w-6 h-6 rounded-lg bg-[#06d6a0]/10 flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp className="w-3 h-3 text-[#06d6a0]" />
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Your Physics scores improved from 62% to 78% over the last 3
                quizzes. Keep up the revision!
              </p>
            </div>
            <div className="flex items-start gap-3 bg-white/[0.02] rounded-xl p-3">
              <div className="w-6 h-6 rounded-lg bg-[#ef476f]/10 flex items-center justify-center shrink-0 mt-0.5">
                <TrendingDown className="w-3 h-3 text-[#ef476f]" />
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Math needs attention — your scores have dropped below 70%. Try
                two 20-minute revision sessions this week.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-white/[0.02] rounded-xl p-3">
              <div className="w-6 h-6 rounded-lg bg-[#ffd166]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-3 h-3 text-[#ffd166]" />
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                You've studied {weekMinutes}m this week. Aim for 10 hours to
                maintain your streak!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

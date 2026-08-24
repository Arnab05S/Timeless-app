import { motion } from "framer-motion";
import {
  Clock,
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  FileText,
  BarChart3,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/app");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#050a18] text-white overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.06)_0%,transparent_70%)] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,214,160,0.04)_0%,transparent_70%)] animate-float-delay" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_70%)] animate-float" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-5"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#06d6a0] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#050a18]" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-semibold tracking-tight">Timeless</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white/50 hover:text-white hover:bg-white/5 cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
            <Button
              className="bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold hover:opacity-90 cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#38bdf8]/20 bg-[#38bdf8]/5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-xs font-medium text-[#38bdf8] tracking-wide uppercase">
              AI-Powered Study Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Precision time management
            <br />
            <span className="text-gradient-brand">for serious students.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed"
          >
            Timeless is an intelligent study platform that schedules your day,
            transforms your materials into revision and quizzes, and adapts to
            your learning patterns — so every minute counts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold text-base px-8 py-6 h-auto rounded-2xl hover:opacity-90 cursor-pointer glow-sm"
              onClick={() => navigate("/auth")}
            >
              Start Building Your Schedule
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white/50 hover:text-white hover:bg-white/5 px-8 py-6 h-auto rounded-2xl cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              Explore as Guest
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              Unified study infrastructure,{" "}
              <span className="text-gradient-brand">one platform</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-white/35 text-lg max-w-xl mx-auto"
            >
              Calendar, flashcards, quizzes, and material analysis — built into a single intelligent system.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Smart Scheduler - Large */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 glass-card p-8 group hover:border-[#38bdf8]/20 transition-all duration-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 flex items-center justify-center mb-4 group-hover:bg-[#38bdf8]/15 transition-colors">
                    <Target className="w-6 h-6 text-[#38bdf8]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Intelligent Scheduling</h3>
                  <p className="text-white/35 leading-relaxed max-w-md">
                    Input your exams, deadlines, and available hours. The scheduler
                    builds a realistic plan and reorganizes when priorities shift.
                  </p>
                </div>
                <div className="hidden md:flex flex-col gap-2 items-end">
                  <div className="px-3 py-1.5 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] text-xs font-medium">
                    Mathematics Exam — 5 days
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#ffd166]/10 text-[#ffd166] text-xs font-medium">
                    Physics Final — 10 days
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#06d6a0]/10 text-[#06d6a0] text-xs font-medium">
                    3h available today
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Flashcards */}
            <motion.div
              variants={fadeUp}
              className="glass-card p-8 group hover:border-[#06d6a0]/20 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#06d6a0]/10 flex items-center justify-center mb-4 group-hover:bg-[#06d6a0]/15 transition-colors">
                <Brain className="w-6 h-6 text-[#06d6a0]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Flashcards</h3>
              <p className="text-white/35 leading-relaxed text-sm">
                Automatically generate flashcards from any material, with spaced repetition to optimize retention.
              </p>
            </motion.div>

            {/* Quiz */}
            <motion.div
              variants={fadeUp}
              className="glass-card p-8 group hover:border-[#ffd166]/20 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#ffd166]/10 flex items-center justify-center mb-4 group-hover:bg-[#ffd166]/15 transition-colors">
                <Zap className="w-6 h-6 text-[#ffd166]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapid Assessment</h3>
              <p className="text-white/35 leading-relaxed text-sm">
                Focused 10-minute quizzes that measure comprehension and surface weak areas instantly.
              </p>
            </motion.div>

            {/* Material Analysis - Large */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 glass-card p-8 group hover:border-[#a78bfa]/20 transition-all duration-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#a78bfa]/10 flex items-center justify-center mb-4 group-hover:bg-[#a78bfa]/15 transition-colors">
                    <FileText className="w-6 h-6 text-[#a78bfa]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Material Analysis</h3>
                  <p className="text-white/35 leading-relaxed max-w-md">
                    Upload lecture notes, textbooks, or PDFs. AI extracts key concepts,
                    identifies important formulas, and generates structured study material.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-32 rounded-xl bg-[#a78bfa]/5 border border-[#a78bfa]/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[#a78bfa]/30" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16"
            >
              Operational in{" "}
              <span className="text-gradient-brand">three steps</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Configure your workspace",
                  desc: "Define your subjects, exam dates, and available study windows. Timeless builds your initial schedule.",
                  icon: BookOpen,
                  color: "#38bdf8",
                },
                {
                  step: "02",
                  title: "Feed your materials",
                  desc: "Upload PDFs, lecture notes, or textbooks. The system extracts key concepts and organizes them for study.",
                  icon: FileText,
                  color: "#06d6a0",
                },
                {
                  step: "03",
                  title: "Execute and iterate",
                  desc: "Follow AI-generated daily plans, take rapid quizzes, and review flashcards — all adapted to your progress.",
                  icon: Brain,
                  color: "#ffd166",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  className="relative glass-card p-8"
                >
                  <span
                    className="text-6xl font-bold absolute top-6 right-6 opacity-5"
                    style={{ color: item.color }}
                  >
                    {item.step}
                  </span>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/35 leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Preview */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-4"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12"
            >
              Context-aware{" "}
              <span className="text-gradient-brand">intelligent guidance</span>
            </motion.h2>

            {[
              "Thermodynamics has not been reviewed in 6 days. Allocating 20 minutes for focused revision.",
              "Physics quiz performance improved from 62% to 78% over the last three attempts. Momentum is strong.",
              "45 minutes available before your next commitment. Chemistry revision recommended for optimal scheduling.",
            ].map((msg, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="glass-card-light px-6 py-4 rounded-2xl text-left text-white/50 text-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#06d6a0] flex items-center justify-center mt-0.5 shrink-0">
                    <Sparkles className="w-3 h-3 text-[#050a18]" />
                  </div>
                  <span className="leading-relaxed">{msg}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { value: "2.5x", label: "More efficient study allocation" },
              { value: "40%", label: "Improvement in topic retention" },
              { value: "85%", label: "Students complete daily goals" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-3xl font-bold text-gradient-brand">{stat.value}</div>
                <div className="text-sm text-white/30 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Reduce decision overhead.{" "}
              <span className="text-gradient-brand">Maximize output.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/35 text-lg mb-10 max-w-xl mx-auto"
            >
              Deploy an intelligent study system that adapts to your schedule, your materials, and your progress.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold text-base px-10 py-6 h-auto rounded-2xl hover:opacity-90 cursor-pointer glow-sm"
                onClick={() => navigate("/auth")}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#06d6a0] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#050a18]" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-white/40">Timeless</span>
          </div>
          <p className="text-xs text-white/20">Precision time management for serious students.</p>
        </div>
      </footer>
    </div>
  );
}

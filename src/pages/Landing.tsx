import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  Clock,
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  FileText,
  Sun,
  Moon,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

/* ─── Reusable animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Scroll-triggered section wrapper ─── */
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Tilt card ─── */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        rotateX: -3,
        rotateY: 5,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      style={{ perspective: 800 }}
      className={cn(
        "transition-shadow duration-300 hover-lift",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/app");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div
      className={cn(
        "min-h-screen overflow-hidden transition-colors duration-500",
        isDark ? "bg-[#050a18] text-white" : "bg-[#f0f4f8] text-slate-900",
      )}
    >
      {/* ─── Ambient Orbs ─── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full animate-float ambient-orb-1" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full animate-float-delay ambient-orb-2" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full animate-float ambient-orb-3" />
      </div>

      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 px-6 py-5"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#06d6a0] flex items-center justify-center shadow-lg shadow-sky-500/20 dark:shadow-sky-500/10">
              <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Timeless</span>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer",
                isDark
                  ? "bg-white/5 hover:bg-white/10 text-white/50"
                  : "bg-slate-200/60 hover:bg-slate-200 text-slate-500",
              )}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <Button
              variant="ghost"
              className={cn(
                "cursor-pointer",
                isDark
                  ? "text-white/70 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              )}
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
            <Button
              className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold hover:opacity-90 cursor-pointer shadow-lg shadow-sky-500/20 dark:shadow-sky-500/10"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative z-10 px-6 pt-12 pb-20 md:pt-20 md:pb-28">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border",
              isDark
                ? "border-sky-500/20 bg-sky-500/5"
                : "border-sky-300/40 bg-sky-50",
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9] dark:text-[#38bdf8]" />
            <span className="text-xs font-medium text-[#0ea5e9] dark:text-[#38bdf8] tracking-wide uppercase">
              AI-Powered Study Companion
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Master your time.
            <br />
            <span className="text-gradient-brand">Master your learning.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className={cn(
              "mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed",
              isDark ? "text-white/50" : "text-slate-500",
            )}
          >
            Timeless plans your study day, creates quizzes, generates flashcards,
            and adapts to your progress — so you learn faster with less effort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold text-base px-8 py-6 h-auto rounded-2xl hover:opacity-95 cursor-pointer glow-sm shadow-xl shadow-sky-500/15"
                onClick={() => navigate("/auth")}
              >
                Start Planning Your Study
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "px-8 py-6 h-auto rounded-2xl cursor-pointer",
                  isDark
                    ? "border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                    : "border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                )}
                onClick={() => navigate("/auth")}
              >
                Try as Guest
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Feature Bento Grid ─── */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to{" "}
              <span className="text-gradient-brand">study smarter</span>
            </h2>
            <p
              className={cn(
                "mt-4 text-lg max-w-xl mx-auto",
                isDark ? "text-white/40" : "text-slate-500",
              )}
            >
              One app that replaces your calendar, flashcards, quiz maker, and study planner.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Smart Scheduler */}
            <RevealSection className="md:col-span-2">
              <TiltCard
                className={cn(
                  "glass-card p-8 group hover-glow",
                  isDark
                    ? "hover:border-sky-500/20"
                    : "hover:border-sky-300/40",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <motion.div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                        isDark ? "bg-sky-500/10" : "bg-sky-100",
                      )}
                      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Target className="w-6 h-6 text-[#0ea5e9] dark:text-[#38bdf8]" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">AI Smart Scheduler</h3>
                    <p className={cn("leading-relaxed max-w-md", isDark ? "text-white/40" : "text-slate-500")}>
                      Enter your exams, deadlines, and available hours. The AI creates a realistic study plan and reorganizes when life happens.
                    </p>
                  </div>
                  <div className="hidden md:flex flex-col gap-2 items-end">
                    {[
                      { text: "Math Exam — 5 days", color: "sky" },
                      { text: "Physics — 10 days", color: "amber" },
                      { text: "3h available today", color: "emerald" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium",
                          item.color === "sky" && (isDark ? "bg-sky-500/10 text-[#38bdf8]" : "bg-sky-100 text-sky-700"),
                          item.color === "amber" && (isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700"),
                          item.color === "emerald" && (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"),
                        )}
                      >
                        {item.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </RevealSection>

            {/* Flashcards */}
            <RevealSection delay={0.1}>
              <TiltCard
                className={cn(
                  "glass-card p-8 group hover-glow",
                  isDark ? "hover:border-emerald-500/20" : "hover:border-emerald-300/40",
                )}
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                    isDark ? "bg-emerald-500/10" : "bg-emerald-100",
                  )}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Brain className="w-6 h-6 text-[#06d6a0]" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">AI Flashcards</h3>
                <p className={cn("leading-relaxed text-sm", isDark ? "text-white/40" : "text-slate-500")}>
                  Upload any material. AI generates smart flashcards with spaced repetition.
                </p>
              </TiltCard>
            </RevealSection>

            {/* Quiz */}
            <RevealSection delay={0.15}>
              <TiltCard
                className={cn(
                  "glass-card p-8 group hover-glow",
                  isDark ? "hover:border-amber-500/20" : "hover:border-amber-300/40",
                )}
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                    isDark ? "bg-amber-500/10" : "bg-amber-100",
                  )}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Zap className="w-6 h-6 text-[#f59e0b] dark:text-[#ffd166]" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">10-Minute Quiz</h3>
                <p className={cn("leading-relaxed text-sm", isDark ? "text-white/40" : "text-slate-500")}>
                  Quick AI-powered quizzes that test your understanding and identify weak areas.
                </p>
              </TiltCard>
            </RevealSection>

            {/* PDF Analysis */}
            <RevealSection delay={0.2}>
              <TiltCard
                className={cn(
                  "glass-card p-8 group hover-glow md:col-span-2",
                  isDark ? "hover:border-violet-500/20" : "hover:border-violet-300/40",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <motion.div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                        isDark ? "bg-violet-500/10" : "bg-violet-100",
                      )}
                      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <FileText className="w-6 h-6 text-[#8b5cf6] dark:text-[#a78bfa]" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">PDF Study Material</h3>
                    <p className={cn("leading-relaxed max-w-md", isDark ? "text-white/40" : "text-slate-500")}>
                      Upload lecture notes, textbooks, or PDFs. AI extracts key concepts, creates summaries, and generates study material.
                    </p>
                  </div>
                  <motion.div
                    className="hidden md:block"
                    animate={{ rotateY: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div
                      className={cn(
                        "w-24 h-32 rounded-xl flex items-center justify-center border",
                        isDark
                          ? "bg-violet-500/5 border-violet-500/10"
                          : "bg-violet-50 border-violet-200/60",
                      )}
                    >
                      <FileText
                        className={cn(
                          "w-8 h-8",
                          isDark ? "text-violet-500/30" : "text-violet-300",
                        )}
                      />
                    </div>
                  </motion.div>
                </div>
              </TiltCard>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your AI study assistant in{" "}
              <span className="text-gradient-brand">3 steps</span>
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Set up your subjects",
                desc: "Tell Timeless about your exams, deadlines, and available study hours.",
                icon: BookOpen,
                color: "sky",
              },
              {
                step: "02",
                title: "Upload your material",
                desc: "Add PDFs, notes, or textbooks. AI extracts key concepts and organizes them.",
                icon: FileText,
                color: "emerald",
              },
              {
                step: "03",
                title: "Study with AI guidance",
                desc: "Get personalized quizzes, flashcards, and daily plans that adapt to your progress.",
                icon: Brain,
                color: "amber",
              },
            ].map((item, i) => (
              <RevealSection key={item.step} delay={i * 0.12}>
                <TiltCard className="relative glass-card p-8">
                  <span
                    className={cn(
                      "text-7xl font-bold absolute top-4 right-6 opacity-[0.04] dark:opacity-[0.06]",
                      isDark ? "text-white" : "text-slate-900",
                    )}
                  >
                    {item.step}
                  </span>
                  <motion.div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                      item.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                      item.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                      item.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                    )}
                    whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <item.icon
                      className={cn(
                        "w-6 h-6",
                        item.color === "sky" && "text-[#0ea5e9] dark:text-[#38bdf8]",
                        item.color === "emerald" && "text-[#06d6a0]",
                        item.color === "amber" && "text-[#f59e0b] dark:text-[#ffd166]",
                      )}
                    />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className={cn("leading-relaxed text-sm", isDark ? "text-white/40" : "text-slate-500")}>
                    {item.desc}
                  </p>
                </TiltCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Proof / AI Examples ─── */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <RevealSection className="text-center mb-12">
            <div className="flex flex-wrap justify-center gap-10 mb-12">
              {[
                { value: "2.5x", label: "More efficient studying" },
                { value: "40%", label: "Better retention" },
                { value: "85%", label: "Students hit their goals" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-gradient-brand">
                    {stat.value}
                  </div>
                  <div
                    className={cn(
                      "text-sm mt-1",
                      isDark ? "text-white/40" : "text-slate-500",
                    )}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </RevealSection>

          <div className="space-y-4">
            {[
              "You haven't revised Thermodynamics in 6 days. Spend 20 minutes reviewing it today.",
              "Your Physics quiz score improved from 62% to 78%. Keep going!",
              "You have 45 minutes available before dinner. Want to revise Chemistry?",
            ].map((msg, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <motion.div
                  className={cn(
                    "glass-card-light px-6 py-4 rounded-2xl text-left text-sm flex items-start gap-3",
                    isDark ? "text-white/60" : "text-slate-600",
                  )}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0",
                      "bg-gradient-to-br from-[#0ea5e9] to-[#06d6a0]",
                    )}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="leading-relaxed">{msg}</span>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <RevealSection>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Stop planning. Start{" "}
              <span className="text-gradient-brand">mastering.</span>
            </h2>
            <p
              className={cn(
                "text-lg mb-10 max-w-xl mx-auto",
                isDark ? "text-white/40" : "text-slate-500",
              )}
            >
              Join thousands of students who use Timeless to study smarter, not harder.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold text-base px-10 py-6 h-auto rounded-2xl hover:opacity-95 cursor-pointer glow-md shadow-xl shadow-sky-500/15"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        className={cn(
          "relative z-10 border-t px-6 py-8",
          isDark ? "border-white/5" : "border-slate-200/60",
        )}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06d6a0] flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                isDark ? "text-white/50" : "text-slate-500",
              )}
            >
              Timeless
            </span>
          </div>
          <p
            className={cn(
              "text-xs",
              isDark ? "text-white/30" : "text-slate-400",
            )}
          >
            Master your time. Master your learning.
          </p>
        </div>
      </footer>
    </div>
  );
}

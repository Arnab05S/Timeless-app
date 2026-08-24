import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Zap, FileText, Upload, Target, BookOpen, Brain, ArrowRight, X, Loader2, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

const createOptions = [
  { icon: Zap, label: "Create Quiz", sub: "AI-generated or manual questions", color: "amber", type: "quiz" as const },
  { icon: FileText, label: "Create Assignment", sub: "Set deadline, marks, and distribute", color: "sky", type: "assignment" as const },
  { icon: Upload, label: "Upload Material", sub: "PDFs, slides, and study resources", color: "violet", type: "upload" as const },
  { icon: Target, label: "Create Revision Plan", sub: "AI-powered revision schedule", color: "emerald", type: "revision" as const },
  { icon: BookOpen, label: "Lesson Plan", sub: "AI-assisted lesson structure", color: "rose", type: "lesson" as const },
  { icon: Brain, label: "Generate Flashcards", sub: "From topics or uploaded material", color: "cyan", type: "flashcards" as const },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizForm, setQuizForm] = useState({ subject: "Physics", topic: "", difficulty: "medium", questions: "10" });

  const classes = useQuery(api.teacher.listClasses);
  const createQuiz = useMutation(api.teacher.createQuiz);
  const createAssignment = useMutation(api.teacher.createAssignment);

  const handleGenerate = async (type: string) => {
    setActiveType(type);
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
  };

  const inputCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400");
  const selectCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white" : "bg-white border-slate-200 text-slate-900");
  const selectContentCls = cn(isDark ? "bg-[#0a1128] border-white/[0.08]" : "bg-white border-slate-200");

  return (
    <div className="px-6 pt-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create</h1>
            <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Generate quizzes, assignments, and materials with AI</p>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: isDark ? 180 : 0 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme}
            className={cn("w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-200/60 hover:bg-slate-200 text-slate-500")}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>
        </motion.div>

        {/* Create Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {createOptions.map((opt, i) => (
            <Reveal key={opt.type} delay={i * 0.06}>
              <motion.button whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleGenerate(opt.type)} className="glass-card p-5 text-left hover-glow">
                <motion.div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                  opt.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                  opt.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"),
                  opt.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                  opt.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                  opt.color === "rose" && (isDark ? "bg-rose-500/10" : "bg-rose-100"),
                  opt.color === "cyan" && (isDark ? "bg-cyan-500/10" : "bg-cyan-100"),
                )} whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.3 }}>
                  <opt.icon className={cn("w-6 h-6",
                    opt.color === "amber" && "text-amber-500",
                    opt.color === "sky" && "text-sky-500",
                    opt.color === "emerald" && "text-emerald-500",
                    opt.color === "violet" && "text-violet-500",
                    opt.color === "rose" && "text-rose-500",
                    opt.color === "cyan" && "text-cyan-500",
                  )} />
                </motion.div>
                <h3 className="text-base font-semibold mb-1">{opt.label}</h3>
                <p className={cn("text-xs leading-relaxed", isDark ? "text-white/40" : "text-slate-500")}>{opt.sub}</p>
              </motion.button>
            </Reveal>
          ))}
        </div>

        {/* Quick Quiz Creation Panel */}
        {activeType === "quiz" && (
          <Reveal>
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />AI Quiz Generator
                </h3>
                <button onClick={() => setActiveType(null)} className={cn("w-8 h-8 rounded-full flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/30 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-700")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Class</label>
                  <Select>
                    <SelectTrigger className={selectCls}><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent className={selectContentCls}>
                      {classes?.map((c) => <SelectItem key={c._id} value={c._id} className={isDark ? "text-white/60" : "text-slate-600"}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Topic</label>
                  <Input value={quizForm.topic} onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value })} placeholder="e.g., Thermodynamics" className={inputCls} />
                </div>
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Difficulty</label>
                  <Select value={quizForm.difficulty} onValueChange={(v) => setQuizForm({ ...quizForm, difficulty: v })}>
                    <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentCls}>
                      {["easy", "medium", "hard"].map((d) => <SelectItem key={d} value={d} className={isDark ? "text-white/60" : "text-slate-600"}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Questions</label>
                  <Select value={quizForm.questions} onValueChange={(v) => setQuizForm({ ...quizForm, questions: v })}>
                    <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentCls}>
                      {["5", "10", "15", "20"].map((n) => <SelectItem key={n} value={n} className={isDark ? "text-white/60" : "text-slate-600"}>{n} questions</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white font-semibold py-5 h-auto rounded-2xl cursor-pointer shadow-lg shadow-amber-500/15"
                  onClick={() => handleGenerate("quiz-process")}>
                  {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-5 h-5 mr-2" />Generate Quiz with AI</>}
                </Button>
              </motion.div>
            </div>
          </Reveal>
        )}

        {/* Quick Assignment Creation Panel */}
        {activeType === "assignment" && (
          <Reveal>
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-500" />Create Assignment
                </h3>
                <button onClick={() => setActiveType(null)} className={cn("w-8 h-8 rounded-full flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/30 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-700")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Class</label>
                    <Select>
                      <SelectTrigger className={selectCls}><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent className={selectContentCls}>
                        {classes?.map((c) => <SelectItem key={c._id} value={c._id} className={isDark ? "text-white/60" : "text-slate-600"}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Type</label>
                    <Select defaultValue="homework">
                      <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                      <SelectContent className={selectContentCls}>
                        {["homework", "project", "essay", "practice", "revision"].map((t) => <SelectItem key={t} value={t} className={isDark ? "text-white/60" : "text-slate-600"}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Title</label>
                  <Input placeholder="e.g., Newton's Laws Problem Set" className={inputCls} />
                </div>
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Description</label>
                  <Textarea placeholder="Assignment details..." className={cn(inputCls, "min-h-[80px]")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Total Marks</label>
                    <Input type="number" placeholder="100" className={inputCls} />
                  </div>
                  <div>
                    <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Deadline</label>
                    <Input type="datetime-local" className={inputCls} />
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold py-5 h-auto rounded-2xl cursor-pointer shadow-lg shadow-sky-500/15">
                    <FileText className="w-5 h-5 mr-2" />Create & Distribute
                  </Button>
                </motion.div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Clock, Check, X, Sparkles, RotateCcw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const demoQuiz = [
  { question: "What is the SI unit of force?", type: "mcq" as const, options: ["Joule", "Newton", "Watt", "Pascal"], correctAnswer: "Newton", explanation: "The Newton (N) is the SI unit of force, defined as kg⋅m/s²." },
  { question: "F = ma is Newton's Second Law of Motion.", type: "tf" as const, options: ["True", "False"], correctAnswer: "True", explanation: "Newton's Second Law states that force equals mass times acceleration." },
  { question: "What is the acceleration due to gravity on Earth (approx)?", type: "mcq" as const, options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.2 m/s²"], correctAnswer: "9.8 m/s²", explanation: "The standard acceleration due to gravity is approximately 9.8 m/s²." },
  { question: "Which quantity remains constant in uniform circular motion?", type: "mcq" as const, options: ["Velocity", "Speed", "Acceleration", "None"], correctAnswer: "Speed", explanation: "In uniform circular motion, speed remains constant while velocity changes direction." },
  { question: "Momentum is a vector quantity.", type: "tf" as const, options: ["True", "False"], correctAnswer: "True", explanation: "Momentum (p = mv) is a vector because it has both magnitude and direction." },
  { question: "What is the formula for kinetic energy?", type: "mcq" as const, options: ["mgh", "½mv²", "mv", "F·d"], correctAnswer: "½mv²", explanation: "Kinetic energy is given by KE = ½mv²." },
  { question: "Newton's Third Law: every action has an equal and opposite ___.", type: "mcq" as const, options: ["Force", "Reaction", "Motion", "Impulse"], correctAnswer: "Reaction", explanation: "For every action, there is an equal and opposite reaction." },
  { question: "The unit of work and energy is the same.", type: "tf" as const, options: ["True", "False"], correctAnswer: "True", explanation: "Both work and energy are measured in Joules (J)." },
  { question: "What is impulse equal to?", type: "mcq" as const, options: ["Mass × velocity", "Force × time", "Mass × acceleration", "Energy / time"], correctAnswer: "Force × time", explanation: "Impulse (J) = Force × time interval = Δp (change in momentum)." },
  { question: "In which motion does an object follow a curved path under gravity only?", type: "mcq" as const, options: ["Linear motion", "Circular motion", "Projectile motion", "Oscillatory motion"], correctAnswer: "Projectile motion", explanation: "Projectile motion follows a parabolic path under gravity alone." },
];

type QuizState = "setup" | "active" | "results";

export default function QuizPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [state, setState] = useState<QuizState>("setup");
  const [subject, setSubject] = useState("physics");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions] = useState(demoQuiz);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionIndex: number; userAnswer: string; isCorrect: boolean }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCurrentQ(0); setSelectedAnswer(null); setAnswers([]);
    setIsGenerating(false); setState("active");
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQ].correctAnswer;
    const newAnswers = [...answers, { questionIndex: currentQ, userAnswer: answer, isCorrect }];
    setAnswers(newAnswers);
    setTimeout(() => { setSelectedAnswer(null); if (currentQ < questions.length - 1) setCurrentQ((q) => q + 1); else setState("results"); }, 1200);
  };

  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / questions.length) * 100);
  const getFeedback = () => percentage >= 90 ? "Outstanding! You have an excellent understanding." : percentage >= 70 ? "Great job! You understand the core concepts well." : percentage >= 50 ? "Good effort! Focus on revising the concepts you found challenging." : "Keep practicing! Review the fundamental concepts and try again.";

  const selectCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white" : "bg-white border-slate-200 text-slate-900");
  const selectContentCls = cn(isDark ? "bg-[#0a1128] border-white/[0.08]" : "bg-white border-slate-200");

  // Results
  if (state === "results") {
    return (
      <div className="px-6 pt-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="8" />
                <motion.circle cx="60" cy="60" r="54" fill="none" stroke={percentage >= 70 ? "#06d6a0" : percentage >= 50 ? "#f59e0b" : "#ef4444"} strokeWidth="8" strokeLinecap="round" strokeDasharray={339.292}
                  initial={{ strokeDashoffset: 339.292 }} animate={{ strokeDashoffset: 339.292 - (339.292 * percentage) / 100 }} transition={{ duration: 1.5, delay: 0.3 }} transform="rotate(-90 60 60)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{percentage}%</span>
                <span className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>{score}/{questions.length}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{percentage >= 70 ? "Great work! 🎉" : percentage >= 50 ? "Good effort! 💪" : "Keep practicing! 📚"}</h2>
            <p className={cn("max-w-md mx-auto mb-8", isDark ? "text-white/40" : "text-slate-500")}>{getFeedback()}</p>
            {answers.filter((a) => !a.isCorrect).length > 0 && (
              <div className="glass-card p-5 mb-6 text-left">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" />Areas to Review</h3>
                <div className="space-y-3">
                  {answers.filter((a) => !a.isCorrect).map((a, i) => (
                    <div key={i} className={cn("rounded-xl p-3", isDark ? "bg-red-500/5 border border-red-500/10" : "bg-red-50 border border-red-100")}>
                      <p className={cn("text-xs font-medium mb-1", isDark ? "text-red-400" : "text-red-600")}>Q{a.questionIndex + 1}: {questions[a.questionIndex].question}</p>
                      <p className={cn("text-xs", isDark ? "text-white/40" : "text-slate-500")}>{questions[a.questionIndex].explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="glass-card p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", isDark ? "from-sky-500/20 to-emerald-500/20" : "from-sky-100 to-emerald-50")}>
                  <Sparkles className={cn("w-4 h-4", isDark ? "text-[#38bdf8]" : "text-[#0ea5e9]")} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">AI Feedback</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-white/40" : "text-slate-500")}>{getFeedback()}</p>
                  {percentage < 80 && <p className={cn("text-xs mt-2", isDark ? "text-white/30" : "text-slate-400")}>💡 Try reviewing flashcards on this topic before your next quiz.</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" className={cn("cursor-pointer", isDark ? "border-white/10 text-white/60 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900")} onClick={() => navigate("/app/learn")}>Back to Learn</Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold cursor-pointer shadow-lg shadow-sky-500/15" onClick={() => { setState("setup"); setCurrentQ(0); setAnswers([]); }}>
                  <RotateCcw className="w-4 h-4 mr-1.5" />Try Again
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active quiz
  if (state === "active") {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;
    return (
      <div className="px-6 pt-6 min-h-[calc(100vh-5rem)] flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setState("setup")} className={cn("text-sm cursor-pointer flex items-center gap-1", isDark ? "text-white/40 hover:text-white" : "text-slate-500 hover:text-slate-900")}><ArrowLeft className="w-4 h-4" /> Exit</button>
              <div className="flex items-center gap-3">
                <span className={cn("text-xs flex items-center gap-1", isDark ? "text-white/30" : "text-slate-400")}><Clock className="w-3 h-3" />~{questions.length - currentQ} min</span>
                <span className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>{currentQ + 1}/{questions.length}</span>
              </div>
            </div>
            <div className={cn("w-full h-1.5 rounded-full", isDark ? "bg-white/5" : "bg-slate-200/60")}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#f59e0b]" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center py-8">
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full uppercase", isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700")}>{q.type === "tf" ? "True/False" : "Multiple Choice"}</span>
                <h2 className={cn("text-xl md:text-2xl font-semibold leading-relaxed mt-4 mb-8", isDark ? "text-white" : "text-slate-900")}>{q.question}</h2>
                <div className="space-y-3">
                  {q.options?.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = option === q.correctAnswer;
                    const showResult = selectedAnswer !== null;
                    return (
                      <motion.button key={option} whileHover={!selectedAnswer ? { scale: 1.01 } : {}} whileTap={!selectedAnswer ? { scale: 0.99 } : {}}
                        onClick={() => !selectedAnswer && handleAnswer(option)} disabled={selectedAnswer !== null}
                        className={cn("w-full text-left px-5 py-4 rounded-2xl border transition-all cursor-pointer",
                          showResult && isCorrectAnswer ? (isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-700")
                            : showResult && isSelected && !isCorrectAnswer ? (isDark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-300 text-red-600")
                              : isDark ? "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] text-white/60" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700",
                        )}>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                            showResult && isCorrectAnswer ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-200 text-emerald-700")
                              : showResult && isSelected && !isCorrectAnswer ? (isDark ? "bg-red-500/20 text-red-400" : "bg-red-200 text-red-600")
                                : isDark ? "bg-white/5 text-white/30" : "bg-slate-100 text-slate-400",
                          )}>
                            {showResult && isCorrectAnswer ? <Check className="w-4 h-4" /> : showResult && isSelected && !isCorrectAnswer ? <X className="w-4 h-4" /> : option[0]}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {selectedAnswer && q.explanation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 glass-card-light p-4 rounded-2xl">
                    <p className={cn("text-xs leading-relaxed", isDark ? "text-white/40" : "text-slate-500")}>💡 {q.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Setup
  return (
    <div className="px-6 pt-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/app/learn")} className={cn("w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/40 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900")}><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">10-Minute Quiz</h1>
            <p className={cn("text-sm", isDark ? "text-white/40" : "text-slate-500")}>Test your knowledge quickly</p>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card p-6 mb-6">
            <motion.div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", isDark ? "bg-amber-500/10" : "bg-amber-100")} whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.3 }}>
              <Zap className={cn("w-7 h-7", isDark ? "text-[#ffd166]" : "text-[#f59e0b]")} />
            </motion.div>
            <h2 className="text-lg font-semibold mb-4">Configure Your Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                  <SelectContent className={selectContentCls}>
                    {["physics", "math", "chemistry", "biology"].map((s) => <SelectItem key={s} value={s} className={isDark ? "text-white/60" : "text-slate-600"}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Difficulty</label>
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((d) => (
                    <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => setDifficulty(d)}
                      className={cn("flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize border",
                        difficulty === d
                          ? isDark ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-300"
                          : isDark ? "bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/50" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600",
                      )}>{d}</motion.button>
                  ))}
                </div>
              </div>
              <div className="glass-card-light p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Clock className={cn("w-5 h-5", isDark ? "text-[#38bdf8]" : "text-[#0ea5e9]")} />
                  <div><p className="text-sm font-medium">~10 minutes</p><p className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>10 questions · Mix of MCQ & True/False</p></div>
                </div>
              </div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white font-semibold py-6 h-auto rounded-2xl text-base cursor-pointer shadow-lg shadow-amber-500/15" onClick={handleStartQuiz} disabled={isGenerating}>
              {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating Quiz...</> : <><Zap className="w-5 h-5 mr-2" />Start Quiz</>}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

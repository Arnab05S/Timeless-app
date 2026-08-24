import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Clock,
  Check,
  X,
  Sparkles,
  RotateCcw,
  Loader2,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

// Demo quiz data
const demoQuiz = [
  {
    question: "What is the SI unit of force?",
    type: "mcq" as const,
    options: ["Joule", "Newton", "Watt", "Pascal"],
    correctAnswer: "Newton",
    explanation:
      "The Newton (N) is the SI unit of force, defined as kg⋅m/s².",
  },
  {
    question: "F = ma is Newton's Second Law of Motion.",
    type: "tf" as const,
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "Newton's Second Law states that force equals mass times acceleration.",
  },
  {
    question: "What is the acceleration due to gravity on Earth (approx)?",
    type: "mcq" as const,
    options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.2 m/s²"],
    correctAnswer: "9.8 m/s²",
    explanation: "The standard acceleration due to gravity is approximately 9.8 m/s².",
  },
  {
    question: "Which quantity remains constant in uniform circular motion?",
    type: "mcq" as const,
    options: ["Velocity", "Speed", "Acceleration", "None of the above"],
    correctAnswer: "Speed",
    explanation:
      "In uniform circular motion, speed remains constant while velocity changes direction.",
  },
  {
    question: "Momentum is a vector quantity.",
    type: "tf" as const,
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "Momentum (p = mv) is a vector because it has both magnitude and direction.",
  },
  {
    question: "What is the formula for kinetic energy?",
    type: "mcq" as const,
    options: ["mgh", "½mv²", "mv", "F·d"],
    correctAnswer: "½mv²",
    explanation: "Kinetic energy is given by KE = ½mv².",
  },
  {
    question: "According to Newton's Third Law, every action has an equal and opposite ___.",
    type: "mcq" as const,
    options: ["Force", "Reaction", "Motion", "Impulse"],
    correctAnswer: "Reaction",
    explanation:
      "Newton's Third Law: For every action, there is an equal and opposite reaction.",
  },
  {
    question: "The unit of work and energy is the same.",
    type: "tf" as const,
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Both work and energy are measured in Joules (J).",
  },
  {
    question: "What is impulse equal to?",
    type: "mcq" as const,
    options: [
      "Mass × velocity",
      "Force × time",
      "Mass × acceleration",
      "Energy / time",
    ],
    correctAnswer: "Force × time",
    explanation: "Impulse (J) = Force × time interval = Δp (change in momentum).",
  },
  {
    question: "In which motion does an object follow a curved path under gravity only?",
    type: "mcq" as const,
    options: [
      "Linear motion",
      "Circular motion",
      "Projectile motion",
      "Oscillatory motion",
    ],
    correctAnswer: "Projectile motion",
    explanation:
      "Projectile motion follows a parabolic path under the influence of gravity alone.",
  },
];

type QuizState = "setup" | "active" | "results";

export default function QuizPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<QuizState>("setup");
  const [subject, setSubject] = useState("physics");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState(demoQuiz);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    { questionIndex: number; userAnswer: string; isCorrect: boolean }[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setQuestions(demoQuiz);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setIsGenerating(false);
    setState("active");
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQ].correctAnswer;
    const newAnswers = [
      ...answers,
      { questionIndex: currentQ, userAnswer: answer, isCorrect },
    ];
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        setState("results");
      }
    }, 1200);
  };

  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / questions.length) * 100);

  const getFeedback = () => {
    if (percentage >= 90)
      return "Outstanding! You have an excellent understanding of this topic.";
    if (percentage >= 70)
      return "Great job! You understand the core concepts well. Review the areas you missed for mastery.";
    if (percentage >= 50)
      return "Good effort! You have a basic understanding. Focus on revising the concepts you found challenging.";
    return "Keep practicing! Review the fundamental concepts and try again.";
  };

  const getWeakAreas = () =>
    answers
      .filter((a) => !a.isCorrect)
      .map((a) => questions[a.questionIndex].explanation)
      .slice(0, 3);

  // Results view
  if (state === "results") {
    return (
      <div className="px-6 pt-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            {/* Score circle */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={
                    percentage >= 70
                      ? "#06d6a0"
                      : percentage >= 50
                        ? "#ffd166"
                        : "#ef476f"
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={339.292}
                  initial={{ strokeDashoffset: 339.292 }}
                  animate={{
                    strokeDashoffset:
                      339.292 - (339.292 * percentage) / 100,
                  }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{percentage}%</span>
                <span className="text-xs text-white/30">
                  {score}/{questions.length}
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {percentage >= 70
                ? "Great work! 🎉"
                : percentage >= 50
                  ? "Good effort! 💪"
                  : "Keep practicing! 📚"}
            </h2>
            <p className="text-white/40 max-w-md mx-auto mb-8">
              {getFeedback()}
            </p>

            {/* Review wrong answers */}
            {answers.filter((a) => !a.isCorrect).length > 0 && (
              <div className="glass-card p-5 mb-6 text-left">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#ffd166]" />
                  Areas to Review
                </h3>
                <div className="space-y-3">
                  {answers
                    .filter((a) => !a.isCorrect)
                    .map((a, i) => (
                      <div
                        key={i}
                        className="bg-[#ef476f]/5 border border-[#ef476f]/10 rounded-xl p-3"
                      >
                        <p className="text-xs font-medium text-[#ef476f] mb-1">
                          Q{a.questionIndex + 1}: {questions[a.questionIndex].question}
                        </p>
                        <p className="text-xs text-white/40">
                          {questions[a.questionIndex].explanation}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* AI Feedback */}
            <div className="glass-card p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#38bdf8]/20 to-[#06d6a0]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">AI Feedback</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {getFeedback()}
                  </p>
                  {percentage < 80 && (
                    <p className="text-xs text-white/30 mt-2">
                      💡 Try reviewing flashcards on this topic before your next
                      quiz.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white cursor-pointer"
                onClick={() => navigate("/app/learn")}
              >
                Back to Learn
              </Button>
              <Button
                className="bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold cursor-pointer"
                onClick={() => {
                  setState("setup");
                  setCurrentQ(0);
                  setAnswers([]);
                }}
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Try Again
              </Button>
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
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setState("setup")}
                className="text-white/40 hover:text-white text-sm cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Exit
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{questions.length - currentQ} min
                </span>
                <span className="text-xs text-white/30">
                  {currentQ + 1}/{questions.length}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#ffd166]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-medium text-[#ffd166] bg-[#ffd166]/10 px-2 py-0.5 rounded-full uppercase">
                    {q.type === "tf" ? "True/False" : q.type === "mcq" ? "Multiple Choice" : "Short Answer"}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-semibold leading-relaxed mb-8">
                  {q.question}
                </h2>

                <div className="space-y-3">
                  {q.options?.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === q.correctAnswer;
                    const showResult = selectedAnswer !== null;

                    return (
                      <button
                        key={option}
                        onClick={() => !selectedAnswer && handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={cn(
                          "w-full text-left px-5 py-4 rounded-2xl border transition-all cursor-pointer",
                          showResult && isCorrect
                            ? "bg-[#06d6a0]/10 border-[#06d6a0]/30 text-[#06d6a0]"
                            : showResult && isSelected && !isCorrect
                              ? "bg-[#ef476f]/10 border-[#ef476f]/30 text-[#ef476f]"
                              : isSelected
                                ? "bg-[#38bdf8]/10 border-[#38bdf8]/30"
                                : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] text-white/60",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                              showResult && isCorrect
                                ? "bg-[#06d6a0]/20 text-[#06d6a0]"
                                : showResult && isSelected && !isCorrect
                                  ? "bg-[#ef476f]/20 text-[#ef476f]"
                                  : "bg-white/5 text-white/30",
                            )}
                          >
                            {showResult && isCorrect ? (
                              <Check className="w-4 h-4" />
                            ) : showResult && isSelected && !isCorrect ? (
                              <X className="w-4 h-4" />
                            ) : (
                              option[0]
                            )}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation after answering */}
                {selectedAnswer && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 glass-card-light p-4 rounded-2xl"
                  >
                    <p className="text-xs text-white/40 leading-relaxed">
                      💡 {q.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Setup view
  return (
    <div className="px-6 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/app/learn")}
            className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              10-Minute Quiz
            </h1>
            <p className="text-sm text-white/40">Test your knowledge quickly</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Quiz Setup Card */}
          <div className="glass-card p-6 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#ffd166]/10 flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-[#ffd166]" />
            </div>
            <h2 className="text-lg font-semibold mb-4">
              Configure Your Quiz
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/30 mb-1.5 block">
                  Subject
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a1128] border-white/[0.08]">
                    <SelectItem value="physics" className="text-white/60">Physics</SelectItem>
                    <SelectItem value="math" className="text-white/60">Mathematics</SelectItem>
                    <SelectItem value="chemistry" className="text-white/60">Chemistry</SelectItem>
                    <SelectItem value="biology" className="text-white/60">Biology</SelectItem>
                    <SelectItem value="general" className="text-white/60">General Knowledge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-white/30 mb-1.5 block">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize",
                        difficulty === d
                          ? "bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30"
                          : "bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/50",
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card-light p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#38bdf8]" />
                  <div>
                    <p className="text-sm font-medium">~10 minutes</p>
                    <p className="text-[10px] text-white/25">
                      10 questions · Mix of MCQ & True/False
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[#ffd166] to-[#ef476f] text-[#050a18] font-semibold py-6 h-auto rounded-2xl text-base cursor-pointer"
            onClick={handleStartQuiz}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Start Quiz
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}



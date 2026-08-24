import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Zap, Upload, Sparkles, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function LearnPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const decks = useQuery(api.flashcards.listDecks);
  const quizzes = useQuery(api.quizzes.list);
  const uploads = useQuery(api.uploads.list);

  return (
    <div className="px-6 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
          <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Study smarter with AI-powered tools</p>
        </div>

        <Reveal className="mb-8">
          <h2 className="text-lg font-semibold mb-4">AI Study Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Brain, label: "Flashcards", desc: "AI-generated flashcards with spaced repetition. Flip, swipe, and master.", color: "emerald", count: decks?.length ?? 0, countLabel: "decks", route: "/app/learn/flashcards" },
              { icon: Zap, label: "10-Minute Quiz", desc: "Quick AI-powered quizzes to test understanding and find weak areas.", color: "amber", count: quizzes?.length ?? 0, countLabel: "quizzes taken", route: "/app/learn/quiz" },
              { icon: Upload, label: "Upload PDF", desc: "Upload study material and let AI extract key concepts and summaries.", color: "violet", count: uploads?.length ?? 0, countLabel: "materials", route: "/app/learn/upload" },
            ].map((tool, i) => (
              <Reveal key={tool.label} delay={i * 0.1}>
                <motion.button whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(tool.route)} className="glass-card p-6 text-left hover-glow">
                  <motion.div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                    tool.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                    tool.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"),
                    tool.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                  )} whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.3 }}>
                    <tool.icon className={cn("w-6 h-6",
                      tool.color === "emerald" && "text-[#06d6a0]",
                      tool.color === "amber" && "text-[#f59e0b] dark:text-[#ffd166]",
                      tool.color === "violet" && "text-[#8b5cf6] dark:text-[#a78bfa]",
                    )} />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-1">{tool.label}</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-white/40" : "text-slate-500")}>{tool.desc}</p>
                  <div className={cn("flex items-center gap-1.5 mt-3 text-xs font-medium",
                    tool.color === "emerald" && "text-[#06d6a0]",
                    tool.color === "amber" && "text-[#f59e0b] dark:text-[#ffd166]",
                    tool.color === "violet" && "text-[#8b5cf6] dark:text-[#a78bfa]",
                  )}>
                    <span>{tool.count} {tool.countLabel}</span><ArrowRight className="w-3 h-3" />
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {decks && decks.length > 0 && (
          <Reveal className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Flashcard Decks</h2>
              <Button variant="ghost" size="sm" className={cn("text-xs cursor-pointer", isDark ? "text-white/40 hover:text-white" : "text-slate-500 hover:text-slate-900")} onClick={() => navigate("/app/learn/flashcards")}>
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {decks.slice(0, 4).map((deck) => (
                <motion.div key={deck._id} whileHover={{ y: -2 }} className="glass-card-light px-4 py-3 flex items-center gap-3 cursor-pointer hover-glow" onClick={() => navigate("/app/learn/flashcards")}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isDark ? "bg-emerald-500/10" : "bg-emerald-100")}>
                    <Brain className="w-5 h-5 text-[#06d6a0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{deck.title}</p>
                    <p className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>{deck.cardCount} cards</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        )}

        {uploads && uploads.length > 0 && (
          <Reveal className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Uploaded Materials</h2>
              <Button variant="ghost" size="sm" className={cn("text-xs cursor-pointer", isDark ? "text-white/40 hover:text-white" : "text-slate-500 hover:text-slate-900")} onClick={() => navigate("/app/learn/upload")}>
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {uploads.slice(0, 3).map((upload) => (
                <div key={upload._id} className="glass-card-light px-4 py-3 flex items-center gap-3 hover-lift">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isDark ? "bg-violet-500/10" : "bg-violet-100")}>
                    <FileText className="w-5 h-5 text-[#8b5cf6] dark:text-[#a78bfa]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{upload.title}</p>
                    <p className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>
                      {upload.subject || "General"} · {upload.status === "ready" ? <span className="text-emerald-500">Ready</span> : <span className="text-amber-500">Processing</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {(!decks || decks.length === 0) && (!uploads || uploads.length === 0) && (
          <Reveal>
            <div className="glass-card p-10 text-center">
              <Sparkles className={cn("w-8 h-8 mx-auto mb-3", isDark ? "text-white/15" : "text-slate-300")} />
              <p className={cn("text-sm mb-1", isDark ? "text-white/30" : "text-slate-400")}>Start learning with AI</p>
              <p className={cn("text-xs mb-4", isDark ? "text-white/20" : "text-slate-400")}>Upload study material or create flashcards to get started.</p>
              <div className="flex justify-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className={cn("text-xs cursor-pointer", isDark ? "bg-violet-500/10 text-[#a78bfa] hover:bg-violet-500/20" : "bg-violet-100 text-violet-700 hover:bg-violet-200")} onClick={() => navigate("/app/learn/upload")}>
                    <Upload className="w-3.5 h-3.5 mr-1.5" />Upload PDF
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className={cn("text-xs cursor-pointer", isDark ? "bg-emerald-500/10 text-[#06d6a0] hover:bg-emerald-500/20" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200")} onClick={() => navigate("/app/learn/flashcards")}>
                    <Brain className="w-3.5 h-3.5 mr-1.5" />Create Flashcards
                  </Button>
                </motion.div>
              </div>
            </div>
          </Reveal>
        )}
      </motion.div>
    </div>
  );
}

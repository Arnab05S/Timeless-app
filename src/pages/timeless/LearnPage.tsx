import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  FileText,
  BookOpen,
  Upload,
  Sparkles,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LearnPage() {
  const navigate = useNavigate();
  const decks = useQuery(api.flashcards.listDecks);
  const quizzes = useQuery(api.quizzes.list);
  const uploads = useQuery(api.uploads.list);

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
          <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
          <p className="text-white/40 mt-1">
            Study smarter with AI-powered tools
          </p>
        </motion.div>

        {/* AI Features */}
        <motion.div variants={fadeUp} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">AI Study Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flashcards */}
            <motion.button
              variants={fadeUp}
              onClick={() => navigate("/app/learn/flashcards")}
              className="glass-card p-6 text-left group hover:border-[#06d6a0]/20 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#06d6a0]/10 flex items-center justify-center mb-4 group-hover:bg-[#06d6a0]/15 transition-colors">
                <Brain className="w-6 h-6 text-[#06d6a0]" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Flashcards</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                AI-generated flashcards with spaced repetition. Flip, swipe,
                and master.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-[#06d6a0] text-xs font-medium">
                <span>{decks?.length ?? 0} decks</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>

            {/* Quiz */}
            <motion.button
              variants={fadeUp}
              onClick={() => navigate("/app/learn/quiz")}
              className="glass-card p-6 text-left group hover:border-[#ffd166]/20 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#ffd166]/10 flex items-center justify-center mb-4 group-hover:bg-[#ffd166]/15 transition-colors">
                <Zap className="w-6 h-6 text-[#ffd166]" />
              </div>
              <h3 className="text-lg font-semibold mb-1">10-Minute Quiz</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Quick AI-powered quizzes to test your understanding and find
                weak areas.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-[#ffd166] text-xs font-medium">
                <span>{quizzes?.length ?? 0} quizzes taken</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>

            {/* Upload */}
            <motion.button
              variants={fadeUp}
              onClick={() => navigate("/app/learn/upload")}
              className="glass-card p-6 text-left group hover:border-[#a78bfa]/20 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#a78bfa]/10 flex items-center justify-center mb-4 group-hover:bg-[#a78bfa]/15 transition-colors">
                <Upload className="w-6 h-6 text-[#a78bfa]" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Upload PDF</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Upload study material and let AI extract key concepts, summaries,
                and flashcards.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-[#a78bfa] text-xs font-medium">
                <span>{uploads?.length ?? 0} materials</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Flashcard Decks */}
        {decks && decks.length > 0 && (
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Flashcard Decks</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/40 hover:text-white text-xs cursor-pointer"
                onClick={() => navigate("/app/learn/flashcards")}
              >
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {decks.slice(0, 4).map((deck) => (
                <div
                  key={deck._id}
                  className="glass-card-light px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-[#06d6a0]/20 transition-all"
                  onClick={() => navigate("/app/learn/flashcards")}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#06d6a0]/10 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-[#06d6a0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{deck.title}</p>
                    <p className="text-[10px] text-white/25">
                      {deck.cardCount} cards
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Uploads */}
        {uploads && uploads.length > 0 && (
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Uploaded Materials</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/40 hover:text-white text-xs cursor-pointer"
                onClick={() => navigate("/app/learn/upload")}
              >
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {uploads.slice(0, 3).map((upload) => (
                <div
                  key={upload._id}
                  className="glass-card-light px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#a78bfa]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{upload.title}</p>
                    <p className="text-[10px] text-white/25">
                      {upload.subject || "General"} ·{" "}
                      {upload.status === "ready" ? (
                        <span className="text-[#06d6a0]">Ready</span>
                      ) : (
                        <span className="text-[#ffd166]">Processing</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {(!decks || decks.length === 0) &&
          (!uploads || uploads.length === 0) && (
            <motion.div variants={fadeUp} className="glass-card p-10 text-center">
              <Sparkles className="w-8 h-8 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/30 mb-1">Start learning with AI</p>
              <p className="text-xs text-white/20 mb-4">
                Upload study material or create flashcards to get personalized
                recommendations.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  size="sm"
                  className="bg-[#a78bfa]/10 text-[#a78bfa] hover:bg-[#a78bfa]/20 text-xs cursor-pointer"
                  onClick={() => navigate("/app/learn/upload")}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload PDF
                </Button>
                <Button
                  size="sm"
                  className="bg-[#06d6a0]/10 text-[#06d6a0] hover:bg-[#06d6a0]/20 text-xs cursor-pointer"
                  onClick={() => navigate("/app/learn/flashcards")}
                >
                  <Brain className="w-3.5 h-3.5 mr-1.5" />
                  Create Flashcards
                </Button>
              </div>
            </motion.div>
          )}
      </motion.div>
    </div>
  );
}

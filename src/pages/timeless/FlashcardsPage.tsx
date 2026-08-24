import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, Plus, X, Check, RotateCcw, ChevronRight, Sparkles, Loader2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const demoCards = [
  { question: "What is Newton's Second Law of Motion?", answer: "F = ma — The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.", difficulty: "medium" as const },
  { question: "What is the derivative of sin(x)?", answer: "cos(x)", difficulty: "easy" as const },
  { question: "What is the principle of conservation of energy?", answer: "Energy cannot be created or destroyed, only transformed from one form to another.", difficulty: "medium" as const },
  { question: "What is the photoelectric equation?", answer: "E = hf - φ, where h is Planck's constant, f is frequency, and φ is the work function.", difficulty: "hard" as const },
  { question: "What is the ideal gas law?", answer: "PV = nRT, where P is pressure, V is volume, n is moles, R is gas constant, T is temperature.", difficulty: "easy" as const },
];

export default function FlashcardsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [deckTitle, setDeckTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cards, setCards] = useState(demoCards);

  const decks = useQuery(api.flashcards.listDecks);
  const createDeck = useMutation(api.flashcards.createDeck);
  const createCards = useMutation(api.flashcards.createCards);

  const currentCard = cards[currentCardIndex];

  const handleGenerateDeck = async () => {
    if (!deckTitle.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    const newDeck = await createDeck({ title: deckTitle.trim(), cardCount: demoCards.length });
    await createCards({ deckId: newDeck, cards: demoCards.map((c) => ({ question: c.question, answer: c.answer, difficulty: c.difficulty })) });
    setIsGenerating(false); setShowCreate(false); setDeckTitle("");
  };

  const handleKnow = () => { setKnownCount((c) => c + 1); goNext(); };
  const handleDontKnow = () => { setUnknownCount((c) => c + 1); goNext(); };
  const goNext = () => { setFlipped(false); setTimeout(() => { if (currentCardIndex < cards.length - 1) setCurrentCardIndex((i) => i + 1); else { setStudyMode(false); setCurrentCardIndex(0); } }, 200); };
  const startStudy = () => { setStudyMode(true); setCurrentCardIndex(0); setFlipped(false); setKnownCount(0); setUnknownCount(0); };

  const inputCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400");
  const selectCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white" : "bg-white border-slate-200 text-slate-900");
  const selectContentCls = cn(isDark ? "bg-[#0a1128] border-white/[0.08]" : "bg-white border-slate-200");

  // Study Mode
  if (studyMode) {
    return (
      <div className="px-6 pt-6 min-h-[calc(100vh-5rem)] flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setStudyMode(false)} className={cn("text-sm cursor-pointer flex items-center gap-1", isDark ? "text-white/40 hover:text-white" : "text-slate-500 hover:text-slate-900")}>
                <ArrowLeft className="w-4 h-4" /> Exit
              </button>
              <span className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>{currentCardIndex + 1}/{cards.length}</span>
            </div>
            <div className={cn("w-full h-1.5 rounded-full", isDark ? "bg-white/5" : "bg-slate-200/60")}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0]" animate={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-8">
            <motion.div className="w-full max-w-md aspect-[3/4] relative cursor-pointer" onClick={() => setFlipped(!flipped)} style={{ perspective: 1000 }}>
              <AnimatePresence mode="wait">
                <motion.div key={flipped ? "back" : "front"} initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className={cn("absolute inset-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl",
                    isDark ? "shadow-black/20" : "shadow-slate-900/5",
                  )}>
                  <span className={cn("text-[10px] font-medium uppercase tracking-wider mb-4", isDark ? "text-white/20" : "text-slate-400")}>{flipped ? "Answer" : "Question"}</span>
                  <p className="text-lg md:text-xl font-medium leading-relaxed">{currentCard?.[flipped ? "answer" : "question"]}</p>
                  {!flipped && <p className={cn("text-xs mt-auto pt-4", isDark ? "text-white/20" : "text-slate-400")}>Tap to reveal answer</p>}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 pb-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="lg" variant="outline" className="w-20 h-20 rounded-2xl border-red-300 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer" onClick={handleDontKnow}>
                <X className="w-8 h-8" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="lg" variant="outline" className={cn("w-16 h-16 rounded-2xl cursor-pointer", isDark ? "border-white/10 text-white/40 hover:text-white" : "border-slate-200 text-slate-400 hover:text-slate-700")} onClick={() => setFlipped(!flipped)}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="lg" className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 cursor-pointer" onClick={handleKnow}>
                <Check className="w-8 h-8" />
              </Button>
            </motion.div>
          </div>
          <div className="flex justify-center gap-6 pb-6">
            <span className="text-xs text-emerald-500">Known: {knownCount}</span>
            <span className="text-xs text-red-500">Learning: {unknownCount}</span>
          </div>
        </div>
      </div>
    );
  }

  // Deck List Mode
  return (
    <div className="px-6 pt-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/app/learn")} className={cn("w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/40 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900")}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
              <p className={cn("text-sm", isDark ? "text-white/40" : "text-slate-500")}>Study with AI-powered spaced repetition</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-[#06d6a0] to-[#0ea5e9] text-white font-semibold text-sm cursor-pointer shadow-lg shadow-emerald-500/15" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-1.5" />New Deck
            </Button>
          </motion.div>
        </div>

        <motion.div whileHover={{ y: -2 }} className="glass-card p-6 mb-6 cursor-pointer hover-glow" onClick={startStudy}>
          <div className="flex items-center gap-4">
            <motion.div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06d6a0]/20 to-[#0ea5e9]/20 flex items-center justify-center" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles className="w-7 h-7 text-[#06d6a0]" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Quick Study Session</h3>
              <p className={cn("text-sm", isDark ? "text-white/40" : "text-slate-500")}>Practice with {cards.length} cards · ~5 min</p>
            </div>
            <ChevronRight className={cn("w-5 h-5", isDark ? "text-white/20" : "text-slate-300")} />
          </div>
        </motion.div>

        {decks && decks.length > 0 ? (
          <div className="space-y-3">
            {decks.map((deck) => (
              <motion.div key={deck._id} whileHover={{ y: -2 }} className="glass-card-light px-5 py-4 flex items-center gap-4 cursor-pointer hover-glow" onClick={startStudy}>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isDark ? "bg-emerald-500/10" : "bg-emerald-100")}>
                  <Brain className="w-6 h-6 text-[#06d6a0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{deck.title}</p>
                  <p className={cn("text-xs", isDark ? "text-white/25" : "text-slate-400")}>{deck.cardCount} cards</p>
                </div>
                <Button size="sm" className={cn("text-xs cursor-pointer", isDark ? "bg-emerald-500/10 text-[#06d6a0] hover:bg-emerald-500/20" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200")}>Study</Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center">
            <Brain className={cn("w-8 h-8 mx-auto mb-3", isDark ? "text-white/15" : "text-slate-300")} />
            <p className={cn("text-sm mb-1", isDark ? "text-white/30" : "text-slate-400")}>No flashcard decks yet</p>
            <p className={cn("text-xs", isDark ? "text-white/20" : "text-slate-400")}>Create a deck or use the quick study session above.</p>
          </div>
        )}

        {/* Create Deck Modal */}
        <AnimatePresence>
          {showCreate && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowCreate(false)} />
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-0 left-0 right-0 z-50 p-4">
                <div className={cn("max-w-lg mx-auto rounded-3xl p-6 shadow-2xl", isDark ? "bg-[#0a1128] border border-white/[0.08]" : "bg-white border border-slate-200")}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold">Create Flashcard Deck</h3>
                    <button onClick={() => setShowCreate(false)} className={cn("w-8 h-8 rounded-full flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/30 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-700")}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Topic or subject</label>
                      <Input value={deckTitle} onChange={(e) => setDeckTitle(e.target.value)} placeholder="e.g., Newton's Laws of Motion" className={inputCls} autoFocus />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Cards</label>
                        <Select defaultValue="10">
                          <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                          <SelectContent className={selectContentCls}>
                            {[5, 10, 15, 20].map((n) => <SelectItem key={n} value={String(n)} className={isDark ? "text-white/60" : "text-slate-600"}>{n} cards</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Difficulty</label>
                        <Select defaultValue="medium">
                          <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                          <SelectContent className={selectContentCls}>
                            {["Easy", "Medium", "Hard"].map((d) => <SelectItem key={d} value={d.toLowerCase()} className={isDark ? "text-white/60" : "text-slate-600"}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-[#06d6a0] to-[#0ea5e9] text-white font-semibold cursor-pointer shadow-lg shadow-emerald-500/15" onClick={handleGenerateDeck} disabled={!deckTitle.trim() || isGenerating}>
                        {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate with AI</>}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

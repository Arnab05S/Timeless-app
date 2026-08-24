import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Plus,
  X,
  Check,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";

// Demo flashcard data for when user has no decks
const demoCards = [
  {
    question: "What is Newton's Second Law of Motion?",
    answer: "F = ma — The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.",
    difficulty: "medium" as const,
  },
  {
    question: "What is the derivative of sin(x)?",
    answer: "cos(x)",
    difficulty: "easy" as const,
  },
  {
    question: "What is the principle of conservation of energy?",
    answer: "Energy cannot be created or destroyed, only transformed from one form to another. The total energy in an isolated system remains constant.",
    difficulty: "medium" as const,
  },
  {
    question: "What is the photoelectric equation?",
    answer: "E = hf - φ, where h is Planck's constant, f is frequency, and φ is the work function.",
    difficulty: "hard" as const,
  },
  {
    question: "What is the ideal gas law?",
    answer: "PV = nRT, where P is pressure, V is volume, n is moles, R is gas constant, T is temperature.",
    difficulty: "easy" as const,
  },
];

export default function FlashcardsPage() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);

  // Create form state
  const [deckTitle, setDeckTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cards, setCards] = useState(demoCards);

  const decks = useQuery(api.flashcards.listDecks);
  const createDeck = useMutation(api.flashcards.createDeck);
  const createCards = useMutation(api.flashcards.createCards);

  const currentCards = cards;
  const currentCard = currentCards[currentCardIndex];

  const handleGenerateDeck = async () => {
    if (!deckTitle.trim()) return;
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2000));
    const newDeck = await createDeck({
      title: deckTitle.trim(),
      cardCount: demoCards.length,
    });
    await createCards({
      deckId: newDeck,
      cards: demoCards.map((c) => ({
        question: c.question,
        answer: c.answer,
        difficulty: c.difficulty,
      })),
    });
    setCards(demoCards);
    setIsGenerating(false);
    setShowCreate(false);
    setDeckTitle("");
  };

  const handleKnow = () => {
    setKnownCount((c) => c + 1);
    goNext();
  };

  const handleDontKnow = () => {
    setUnknownCount((c) => c + 1);
    goNext();
  };

  const goNext = () => {
    setFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < currentCards.length - 1) {
        setCurrentCardIndex((i) => i + 1);
      } else {
        setStudyMode(false);
        setCurrentCardIndex(0);
      }
    }, 200);
  };

  const startStudy = (deckCards?: typeof demoCards) => {
    if (deckCards) setCards(deckCards);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setFlipped(false);
    setKnownCount(0);
    setUnknownCount(0);
  };

  const progress = studyMode
    ? ((currentCardIndex + 1) / currentCards.length) * 100
    : 0;

  // Study Mode
  if (studyMode) {
    return (
      <div className="px-6 pt-6 min-h-[calc(100vh-5rem)] flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setStudyMode(false)}
                className="text-white/40 hover:text-white text-sm cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Exit
              </button>
              <span className="text-xs text-white/30">
                {currentCardIndex + 1}/{currentCards.length}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#06d6a0]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div
              className="w-full max-w-md aspect-[3/4] relative cursor-pointer perspective-1000"
              onClick={() => setFlipped(!flipped)}
              style={{ perspective: "1000px" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={flipped ? "back" : "front"}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-[10px] font-medium text-white/20 uppercase tracking-wider mb-4">
                    {flipped ? "Answer" : "Question"}
                  </span>
                  <p className="text-lg md:text-xl font-medium leading-relaxed">
                    {currentCard?.[flipped ? "answer" : "question"]}
                  </p>
                  {!flipped && (
                    <p className="text-xs text-white/20 mt-auto pt-4">
                      Tap to reveal answer
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pb-4">
            <Button
              size="lg"
              variant="outline"
              className="w-20 h-20 rounded-2xl border-[#ef476f]/30 text-[#ef476f] hover:bg-[#ef476f]/10 cursor-pointer"
              onClick={handleDontKnow}
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-2xl border-white/10 text-white/40 hover:text-white cursor-pointer"
              onClick={() => setFlipped(!flipped)}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="w-20 h-20 rounded-2xl bg-[#06d6a0]/20 text-[#06d6a0] hover:bg-[#06d6a0]/30 cursor-pointer"
              onClick={handleKnow}
            >
              <Check className="w-8 h-8" />
            </Button>
          </div>

          {/* Score display */}
          <div className="flex justify-center gap-6 pb-6">
            <span className="text-xs text-[#06d6a0]">
              Known: {knownCount}
            </span>
            <span className="text-xs text-[#ef476f]">
              Learning: {unknownCount}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Deck List Mode
  return (
    <div className="px-6 pt-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/app/learn")}
              className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
              <p className="text-sm text-white/40">
                Study with AI-powered spaced repetition
              </p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-[#06d6a0] to-[#38bdf8] text-[#050a18] font-semibold text-sm cursor-pointer"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Deck
          </Button>
        </div>

        {/* Study all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 cursor-pointer hover:border-[#06d6a0]/20 transition-all"
          onClick={() => startStudy()}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06d6a0]/20 to-[#38bdf8]/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#06d6a0]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Quick Study Session</h3>
              <p className="text-sm text-white/40">
                Practice with {currentCards.length} cards · ~5 min
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20" />
          </div>
        </motion.div>

        {/* Decks */}
        {decks && decks.length > 0 ? (
          <div className="space-y-3">
            {decks.map((deck) => (
              <div
                key={deck._id}
                className="glass-card-light px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-[#06d6a0]/15 transition-all"
                onClick={() => startStudy()}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#06d6a0]/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#06d6a0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{deck.title}</p>
                  <p className="text-xs text-white/25 mt-0.5">
                    {deck.cardCount} cards
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#06d6a0]/10 text-[#06d6a0] hover:bg-[#06d6a0]/20 text-xs cursor-pointer"
                >
                  Study
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center">
            <Brain className="w-8 h-8 text-white/15 mx-auto mb-3" />
            <p className="text-sm text-white/30 mb-1">No flashcard decks yet</p>
            <p className="text-xs text-white/20 mb-4">
              Create a deck or use the quick study session above.
            </p>
          </div>
        )}

        {/* Create Deck Modal */}
        <AnimatePresence>
          {showCreate && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setShowCreate(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4"
              >
                <div className="max-w-lg mx-auto bg-[#0a1128] border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold">
                      Create Flashcard Deck
                    </h3>
                    <button
                      onClick={() => setShowCreate(false)}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/30 mb-1.5 block">
                        Topic or subject
                      </label>
                      <Input
                        value={deckTitle}
                        onChange={(e) => setDeckTitle(e.target.value)}
                        placeholder="e.g., Newton's Laws of Motion"
                        className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/30 mb-1.5 block">
                        Number of cards
                      </label>
                      <Select defaultValue="10">
                        <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a1128] border-white/[0.08]">
                          <SelectItem value="5" className="text-white/60">5 cards</SelectItem>
                          <SelectItem value="10" className="text-white/60">10 cards</SelectItem>
                          <SelectItem value="15" className="text-white/60">15 cards</SelectItem>
                          <SelectItem value="20" className="text-white/60">20 cards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-white/30 mb-1.5 block">
                        Difficulty
                      </label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a1128] border-white/[0.08]">
                          <SelectItem value="easy" className="text-white/60">Easy</SelectItem>
                          <SelectItem value="medium" className="text-white/60">Medium</SelectItem>
                          <SelectItem value="hard" className="text-white/60">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-[#06d6a0] to-[#38bdf8] text-[#050a18] font-semibold cursor-pointer"
                      onClick={handleGenerateDeck}
                      disabled={!deckTitle.trim() || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
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

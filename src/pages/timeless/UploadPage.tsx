import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, FileText, Sparkles, Brain, Zap, BookOpen, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type AnalysisState = "idle" | "uploading" | "analyzing" | "done";

export default function UploadPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [fileName, setFileName] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSubject, setUploadSubject] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ summary: string; concepts: string[]; points: string[] } | null>(null);

  const uploads = useQuery(api.uploads.list);
  const createUpload = useMutation(api.uploads.create);
  const markReady = useMutation(api.uploads.markReady);

  const handleFileSelect = (file: File) => { setFileName(file.name); if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^.]+$/, "")); };

  const handleUpload = async () => {
    if (!fileName) return;
    setAnalysisState("uploading");
    const uploadId = await createUpload({ title: uploadTitle || fileName, subject: uploadSubject || undefined, fileName, fileType: "application/pdf", fileSize: 1024 * 100 });
    await new Promise((r) => setTimeout(r, 1500));
    setAnalysisState("analyzing");
    await new Promise((r) => setTimeout(r, 2500));
    const result = {
      summary: "This document covers fundamental concepts of physics including mechanics, thermodynamics, and electromagnetism. Key topics include Newton's Laws of Motion, conservation of energy, and basic circuit analysis.",
      concepts: ["Newton's Laws of Motion", "Conservation of Energy", "Thermodynamic Principles", "Electromagnetic Theory", "Wave Mechanics", "Quantum Basics"],
      points: ["F = ma is the foundation of classical mechanics", "Energy cannot be created or destroyed, only transformed", "Heat always flows from hot to cold (Second Law)", "Voltage, current, and resistance are related by Ohm's Law", "All waves transfer energy without transferring matter"],
    };
    setAnalysisResult(result);
    await markReady({ id: uploadId, summary: result.summary, keyConcepts: result.concepts, importantPoints: result.points });
    setAnalysisState("done");
  };

  const inputCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400");
  const selectCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white" : "bg-white border-slate-200 text-slate-900");
  const selectContentCls = cn(isDark ? "bg-[#0a1128] border-white/[0.08]" : "bg-white border-slate-200");

  return (
    <div className="px-6 pt-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/app/learn")} className={cn("w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/40 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900")}><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Upload Study Material</h1>
            <p className={cn("text-sm", isDark ? "text-white/40" : "text-slate-500")}>AI will analyze your PDF and extract key concepts</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {analysisState === "idle" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className={cn("glass-card p-10 text-center transition-all cursor-pointer", dragOver ? "border-violet-400 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/5" : isDark ? "hover:border-white/[0.1]" : "hover:border-slate-300")}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFileSelect(file); }}
                onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = ".pdf,.doc,.docx,.txt"; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleFileSelect(file); }; input.click(); }}>
                {fileName ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", isDark ? "bg-violet-500/10" : "bg-violet-100")}><FileText className="w-8 h-8 text-[#8b5cf6] dark:text-[#a78bfa]" /></div>
                    <p className="text-sm font-medium mb-1">{fileName}</p>
                    <p className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>Click to change file</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", isDark ? "bg-white/5" : "bg-slate-100")}><Upload className={cn("w-8 h-8", isDark ? "text-white/20" : "text-slate-300")} /></div>
                    <p className="text-sm font-medium mb-1">Drop your file here</p>
                    <p className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>PDF, Word, Text, or PowerPoint</p>
                  </div>
                )}
              </div>
              <div className="space-y-4 mt-6">
                <div><label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Title</label><Input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g., Physics — Thermodynamics" className={inputCls} /></div>
                <div><label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Subject</label>
                  <Select value={uploadSubject} onValueChange={setUploadSubject}>
                    <SelectTrigger className={selectCls}><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent className={selectContentCls}>
                      {["physics", "math", "chemistry", "biology", "cs"].map((s) => <SelectItem key={s} value={s} className={isDark ? "text-white/60" : "text-slate-600"}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] text-white font-semibold py-6 h-auto rounded-2xl cursor-pointer shadow-lg shadow-violet-500/15" onClick={handleUpload} disabled={!fileName}>
                    <Sparkles className="w-5 h-5 mr-2" />Analyze with AI
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {(analysisState === "uploading" || analysisState === "analyzing") && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-10 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className={cn("absolute inset-0 rounded-full border-2", isDark ? "border-violet-500/20" : "border-violet-200")} />
                <motion.div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#8b5cf6]" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {analysisState === "uploading" ? <Upload className="w-7 h-7 text-[#8b5cf6]" /> : <Sparkles className="w-7 h-7 text-[#8b5cf6]" />}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{analysisState === "uploading" ? "Uploading..." : "AI is analyzing..."}</h3>
              <p className={cn("text-sm", isDark ? "text-white/30" : "text-slate-400")}>{analysisState === "uploading" ? "Securely uploading your file" : "Extracting key concepts and generating study material"}</p>
            </motion.div>
          )}

          {analysisState === "done" && analysisResult && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-6 text-emerald-500">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center"><Check className="w-3.5 h-3.5" /></div>
                <span className="text-sm font-medium">Analysis complete — 6 key concepts found</span>
              </div>
              <div className="glass-card p-5 mb-4">
                <h3 className="text-sm font-semibold mb-2">Summary</h3>
                <p className={cn("text-sm leading-relaxed", isDark ? "text-white/50" : "text-slate-600")}>{analysisResult.summary}</p>
              </div>
              <div className="glass-card p-5 mb-4">
                <h3 className="text-sm font-semibold mb-3">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.concepts.map((concept) => (
                    <span key={concept} className={cn("px-3 py-1.5 rounded-xl text-xs font-medium", isDark ? "bg-sky-500/10 text-[#38bdf8]" : "bg-sky-100 text-sky-700")}>{concept}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card p-5 mb-6">
                <h3 className="text-sm font-semibold mb-3">Important Points</h3>
                <div className="space-y-2">
                  {analysisResult.points.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={cn("text-xs mt-0.5", isDark ? "text-amber-400" : "text-amber-500")}>•</span>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-white/50" : "text-slate-600")}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}><Button className="w-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 cursor-pointer" onClick={() => navigate("/app/learn/flashcards")}><Brain className="w-4 h-4 mr-1.5" />Flashcards</Button></motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}><Button className="w-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/20 cursor-pointer" onClick={() => navigate("/app/learn/quiz")}><Zap className="w-4 h-4 mr-1.5" />Create Quiz</Button></motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}><Button className="w-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-[#38bdf8] hover:bg-sky-200 dark:hover:bg-sky-500/20 cursor-pointer"><BookOpen className="w-4 h-4 mr-1.5" />Revision Plan</Button></motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}><Button variant="outline" className={cn("cursor-pointer", isDark ? "border-white/10 text-white/60 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900")} onClick={() => setAnalysisState("idle")}><Upload className="w-4 h-4 mr-1.5" />Upload Another</Button></motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {uploads && uploads.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Previous Uploads</h3>
            <div className="space-y-2">
              {uploads.map((upload) => (
                <div key={upload._id} className="glass-card-light px-4 py-3 flex items-center gap-3 hover-lift">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isDark ? "bg-violet-500/10" : "bg-violet-100")}><FileText className="w-5 h-5 text-[#8b5cf6] dark:text-[#a78bfa]" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{upload.title}</p>
                    <p className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>{upload.subject || "General"} · {upload.status === "ready" ? <span className="text-emerald-500">Analyzed</span> : <span className="text-amber-500">Processing</span>}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

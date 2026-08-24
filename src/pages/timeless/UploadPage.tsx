import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  Brain,
  Zap,
  BookOpen,
  Loader2,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";

type AnalysisState = "idle" | "uploading" | "analyzing" | "done";

export default function UploadPage() {
  const navigate = useNavigate();
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [fileName, setFileName] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSubject, setUploadSubject] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    concepts: string[];
    points: string[];
  } | null>(null);

  const uploads = useQuery(api.uploads.list);
  const createUpload = useMutation(api.uploads.create);
  const markReady = useMutation(api.uploads.markReady);

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!fileName) return;
    setAnalysisState("uploading");

    // Create upload record
    const uploadId = await createUpload({
      title: uploadTitle || fileName,
      subject: uploadSubject || undefined,
      fileName,
      fileType: "application/pdf",
      fileSize: 1024 * 100, // Mock size
    });

    await new Promise((r) => setTimeout(r, 1500));
    setAnalysisState("analyzing");

    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 2500));

    const result = {
      summary:
        "This document covers fundamental concepts of physics including mechanics, thermodynamics, and electromagnetism. Key topics include Newton's Laws of Motion, conservation of energy, and basic circuit analysis.",
      concepts: [
        "Newton's Laws of Motion",
        "Conservation of Energy",
        "Thermodynamic Principles",
        "Electromagnetic Theory",
        "Wave Mechanics",
        "Quantum Basics",
      ],
      points: [
        "F = ma is the foundation of classical mechanics",
        "Energy cannot be created or destroyed, only transformed",
        "Heat always flows from hot to cold (Second Law of Thermodynamics)",
        "Voltage, current, and resistance are related by Ohm's Law",
        "All waves transfer energy without transferring matter",
      ],
    };

    setAnalysisResult(result);
    await markReady({
      id: uploadId,
      summary: result.summary,
      keyConcepts: result.concepts,
      importantPoints: result.points,
    });
    setAnalysisState("done");
  };

  const resetUpload = () => {
    setAnalysisState("idle");
    setFileName("");
    setUploadTitle("");
    setUploadSubject("");
    setAnalysisResult(null);
  };

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
              Upload Study Material
            </h1>
            <p className="text-sm text-white/40">
              AI will analyze your PDF and extract key concepts
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Idle - Upload */}
          {analysisState === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Upload zone */}
              <div
                className={`glass-card p-10 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-[#a78bfa]/40 bg-[#a78bfa]/5"
                    : "hover:border-white/[0.1]"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileSelect(file);
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".pdf,.doc,.docx,.txt,.ppt,.pptx";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleFileSelect(file);
                  };
                  input.click();
                }}
              >
                {fileName ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-[#a78bfa]/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-[#a78bfa]" />
                    </div>
                    <p className="text-sm font-medium mb-1">{fileName}</p>
                    <p className="text-xs text-white/30">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-sm font-medium mb-1">
                      Drop your file here
                    </p>
                    <p className="text-xs text-white/30">
                      PDF, Word, Text, or PowerPoint
                    </p>
                  </>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">
                    Title
                  </label>
                  <Input
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g., Physics — Thermodynamics"
                    className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">
                    Subject (optional)
                  </label>
                  <Select value={uploadSubject} onValueChange={setUploadSubject}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a1128] border-white/[0.08]">
                      <SelectItem value="physics" className="text-white/60">Physics</SelectItem>
                      <SelectItem value="math" className="text-white/60">Mathematics</SelectItem>
                      <SelectItem value="chemistry" className="text-white/60">Chemistry</SelectItem>
                      <SelectItem value="biology" className="text-white/60">Biology</SelectItem>
                      <SelectItem value="cs" className="text-white/60">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#a78bfa] to-[#38bdf8] text-white font-semibold py-6 h-auto rounded-2xl cursor-pointer"
                  onClick={handleUpload}
                  disabled={!fileName}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze with AI
                </Button>
              </div>
            </motion.div>
          )}

          {/* Uploading / Analyzing */}
          {(analysisState === "uploading" || analysisState === "analyzing") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-10 text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#a78bfa]/20" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#a78bfa]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {analysisState === "uploading" ? (
                    <Upload className="w-7 h-7 text-[#a78bfa]" />
                  ) : (
                    <Sparkles className="w-7 h-7 text-[#a78bfa]" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {analysisState === "uploading"
                  ? "Uploading..."
                  : "AI is analyzing your material..."}
              </h3>
              <p className="text-sm text-white/30">
                {analysisState === "uploading"
                  ? "Securely uploading your file"
                  : "Extracting key concepts and generating study material"}
              </p>
            </motion.div>
          )}

          {/* Done - Results */}
          {analysisState === "done" && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Success badge */}
              <div className="flex items-center gap-2 mb-6 text-[#06d6a0]">
                <div className="w-6 h-6 rounded-full bg-[#06d6a0]/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium">
                  Analysis complete — 6 key concepts found
                </span>
              </div>

              {/* Summary */}
              <div className="glass-card p-5 mb-4">
                <h3 className="text-sm font-semibold mb-2">Summary</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Key Concepts */}
              <div className="glass-card p-5 mb-4">
                <h3 className="text-sm font-semibold mb-3">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="px-3 py-1.5 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] text-xs font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Important Points */}
              <div className="glass-card p-5 mb-6">
                <h3 className="text-sm font-semibold mb-3">Important Points</h3>
                <div className="space-y-2">
                  {analysisResult.points.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2"
                    >
                      <span className="text-[#ffd166] text-xs mt-0.5">•</span>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  className="bg-[#06d6a0]/10 text-[#06d6a0] hover:bg-[#06d6a0]/20 cursor-pointer"
                  onClick={() => navigate("/app/learn/flashcards")}
                >
                  <Brain className="w-4 h-4 mr-1.5" />
                  Generate Flashcards
                </Button>
                <Button
                  className="bg-[#ffd166]/10 text-[#ffd166] hover:bg-[#ffd166]/20 cursor-pointer"
                  onClick={() => navigate("/app/learn/quiz")}
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  Create Quiz
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  className="bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Create Revision Plan
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 text-white/60 hover:text-white cursor-pointer"
                  onClick={resetUpload}
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous uploads */}
        {uploads && uploads.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Previous Uploads</h3>
            <div className="space-y-2">
              {uploads.map((upload) => (
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
                        <span className="text-[#06d6a0]">Analyzed</span>
                      ) : (
                        <span className="text-[#ffd166]">Processing</span>
                      )}
                    </p>
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

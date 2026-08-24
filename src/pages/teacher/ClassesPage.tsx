import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { Plus, X, BookOpen, Users, Copy, Check, ArrowRight, Hash, Sun, Moon, QrCode, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function ClassesPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [className_, setClassName] = useState("");
  const [classSubject, setClassSubject] = useState("");
  const [classGrade, setClassGrade] = useState("");

  const classes = useQuery(api.teacher.listClasses);
  const createClass = useMutation(api.teacher.createClass);
  const updateClass = useMutation(api.teacher.updateClass);

  const handleCreateClass = async () => {
    if (!className_.trim() || !classSubject.trim()) return;
    await createClass({ name: className_.trim(), subject: classSubject.trim(), grade: classGrade || undefined });
    setClassName(""); setClassSubject(""); setClassGrade(""); setShowCreate(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const inputCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400");

  return (
    <div className="px-6 pt-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
            <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Manage your classes and students</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.1, rotate: isDark ? 180 : 0 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme}
              className={cn("w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-200/60 hover:bg-slate-200 text-slate-500")}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold text-sm cursor-pointer shadow-lg shadow-sky-500/15" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-1.5" />New Class
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {classes?.map((cls, i) => (
            <Reveal key={cls._id} delay={i * 0.06}>
              <motion.div className="glass-card p-5 hover-glow" whileHover={{ y: -3 }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isDark ? "bg-emerald-500/10" : "bg-emerald-100")}>
                      <BookOpen className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{cls.name}</h3>
                      <p className={cn("text-xs", isDark ? "text-white/30" : "text-slate-500")}>{cls.subject}{cls.grade ? ` · Grade ${cls.grade}` : ""}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium", isDark ? "bg-sky-500/10 text-sky-400" : "bg-sky-100 text-sky-700")}>
                    <Users className="w-3.5 h-3.5" />{cls.studentCount} students
                  </div>
                  <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium",
                    isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700")}>
                    <Hash className="w-3.5 h-3.5" />
                    <span>{cls.joinCode}</span>
                    <button onClick={() => copyCode(cls.joinCode)} className="ml-1 cursor-pointer">
                      {copied === cls.joinCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className={cn("text-xs cursor-pointer flex-1", isDark ? "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20" : "bg-sky-100 text-sky-700 hover:bg-sky-200")}
                    onClick={() => navigate(`/teacher/classes/${cls._id}`)}>
                    View Class <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button size="sm" variant="outline" className={cn("text-xs cursor-pointer", isDark ? "border-white/10 text-white/40" : "border-slate-200 text-slate-500")}
                    onClick={() => updateClass({ classId: cls._id, isActive: false })}>
                    Archive
                  </Button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {classes && classes.length === 0 && (
          <Reveal>
            <div className="glass-card p-12 text-center">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", isDark ? "bg-white/5" : "bg-slate-100")}>
                <BookOpen className={cn("w-8 h-8", isDark ? "text-white/15" : "text-slate-300")} />
              </div>
              <h3 className="text-lg font-semibold mb-2">No classes yet</h3>
              <p className={cn("text-sm mb-4", isDark ? "text-white/30" : "text-slate-400")}>Create your first class to start teaching with AI.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold cursor-pointer shadow-lg shadow-sky-500/15" onClick={() => setShowCreate(true)}>
                  <Plus className="w-4 h-4 mr-2" />Create First Class
                </Button>
              </motion.div>
            </div>
          </Reveal>
        )}

        {/* Create Class Modal */}
        <AnimatePresence>
          {showCreate && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowCreate(false)} />
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-0 left-0 right-0 z-50 p-4">
                <div className={cn("max-w-lg mx-auto rounded-3xl p-6 shadow-2xl", isDark ? "bg-[#0a1128] border border-white/[0.08]" : "bg-white border border-slate-200")}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold">Create New Class</h3>
                    <button onClick={() => setShowCreate(false)} className={cn("w-8 h-8 rounded-full flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/30 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-700")}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Class name</label>
                      <Input value={className_} onChange={(e) => setClassName(e.target.value)} placeholder="e.g., Class 11A — Physics" className={inputCls} autoFocus />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Subject</label>
                        <Input value={classSubject} onChange={(e) => setClassSubject(e.target.value)} placeholder="e.g., Physics" className={inputCls} />
                      </div>
                      <div>
                        <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Grade (optional)</label>
                        <Input value={classGrade} onChange={(e) => setClassGrade(e.target.value)} placeholder="e.g., 11" className={inputCls} />
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold cursor-pointer shadow-lg shadow-sky-500/15"
                        onClick={handleCreateClass} disabled={!className_.trim() || !classSubject.trim()}>
                        <Plus className="w-4 h-4 mr-2" />Create Class
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

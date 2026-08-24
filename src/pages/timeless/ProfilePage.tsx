import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { User, LogOut, BookOpen, Plus, X, Clock, Moon, Sun, Bell, Shield, ChevronRight, Palette, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

const subjectColors = ["#0ea5e9", "#06d6a0", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#fb923c", "#34d399"];
const colorBg: Record<string, Record<string, string>> = {
  sky: { dark: "bg-sky-500/10", light: "bg-sky-100" }, emerald: { dark: "bg-emerald-500/10", light: "bg-emerald-100" },
  amber: { dark: "bg-amber-500/10", light: "bg-amber-100" }, violet: { dark: "bg-violet-500/10", light: "bg-violet-100" },
};

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectColor, setSubjectColor] = useState(subjectColors[0]);

  const subjects = useQuery(api.subjects.list);
  const createSubject = useMutation(api.subjects.create);
  const removeSubject = useMutation(api.subjects.remove);
  const studyStats = useQuery(api.studySessions.getStats);

  const handleSignOut = async () => { await signOut(); navigate("/"); };
  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    await createSubject({ name: subjectName.trim(), color: subjectColor });
    setSubjectName(""); setSubjectColor(subjectColors[0]); setShowAddSubject(false);
  };

  const totalHours = Math.round((studyStats?.totalMinutes ?? 0) / 60);
  const inputCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400");

  const settings = [
    { icon: Clock, label: "Daily Study Goal", value: "2 hours", color: "sky" },
    { icon: Bell, label: "Notifications", value: "Enabled", color: "emerald" },
    { icon: Moon, label: "Theme", value: isDark ? "Dark" : "Light", color: "violet", action: toggleTheme },
    { icon: Palette, label: "Style", value: "Calm Futurism", color: "amber" },
    { icon: Shield, label: "Privacy", value: "", color: "slate" },
  ];

  return (
    <div className="px-6 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Manage your account and subjects</p>
        </div>

        {/* Profile Card */}
        <Reveal className="mb-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#06d6a0] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/20">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user?.name || "Student"}</h2>
                <p className={cn("text-sm", isDark ? "text-white/30" : "text-slate-500")}>{user?.email || "Guest user"}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={cn("text-xs flex items-center gap-1", isDark ? "text-white/25" : "text-slate-400")}><Clock className="w-3 h-3" />{totalHours}h studied</span>
                  <span className={cn("text-xs flex items-center gap-1", isDark ? "text-white/25" : "text-slate-400")}><BookOpen className="w-3 h-3" />{subjects?.length ?? 0} subjects</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Switch to Teacher */}
        <Reveal className="mb-6" delay={0.05}>
          <motion.div whileHover={{ y: -2 }} className="glass-card p-5 cursor-pointer hover-glow" onClick={() => navigate("/teacher")}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-emerald-500/10" : "bg-emerald-100")}>
                <GraduationCap className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Switch to Teacher Mode</p>
                <p className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>Manage classes, create quizzes, and track student performance</p>
              </div>
              <ArrowRight className={cn("w-4 h-4", isDark ? "text-white/15" : "text-slate-300")} />
            </div>
          </motion.div>
        </Reveal>

        {/* Subjects */}
        <Reveal className="mb-6" delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Subjects</h3>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" className={cn("text-xs cursor-pointer", isDark ? "bg-sky-500/10 text-[#38bdf8] hover:bg-sky-500/20" : "bg-sky-100 text-sky-700 hover:bg-sky-200")} onClick={() => setShowAddSubject(true)}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />Add
              </Button>
            </motion.div>
          </div>
          <div className="space-y-2">
            {subjects?.map((subject) => (
              <motion.div key={subject._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card-light px-4 py-3 flex items-center gap-3 hover-lift">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                <span className="text-sm font-medium flex-1">{subject.name}</span>
                <button onClick={() => removeSubject({ id: subject._id })} className={cn("transition-colors cursor-pointer", isDark ? "text-white/15 hover:text-red-400" : "text-slate-300 hover:text-red-500")}><X className="w-3.5 h-3.5" /></button>
              </motion.div>
            ))}
            {subjects && subjects.length === 0 && (
              <div className="glass-card p-6 text-center">
                <BookOpen className={cn("w-6 h-6 mx-auto mb-2", isDark ? "text-white/15" : "text-slate-300")} />
                <p className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>No subjects yet. Add your first subject.</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Settings */}
        <Reveal className="mb-6" delay={0.15}>
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="glass-card overflow-hidden">
            {settings.map((item, i) => (
              <motion.div key={item.label} whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}
                className={cn("flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors", i < settings.length - 1 && "border-b", isDark ? "border-white/[0.03]" : "border-slate-100")}
                onClick={item.action}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", item.color === "sky" && (isDark ? "bg-sky-500/10" : "bg-sky-100"), item.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"), item.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"), item.color === "amber" && (isDark ? "bg-amber-500/10" : "bg-amber-100"), item.color === "slate" && (isDark ? "bg-white/5" : "bg-slate-100"))}>
                  <item.icon className={cn("w-4 h-4", item.color === "sky" && (isDark ? "text-[#38bdf8]" : "text-[#0ea5e9]"), item.color === "emerald" && "text-[#06d6a0]", item.color === "violet" && (isDark ? "text-[#a78bfa]" : "text-[#8b5cf6]"), item.color === "amber" && (isDark ? "text-[#ffd166]" : "text-[#f59e0b]"), item.color === "slate" && (isDark ? "text-white/40" : "text-slate-500"))} />
                </div>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.value && <span className={cn("text-xs", isDark ? "text-white/25" : "text-slate-400")}>{item.value}</span>}
                <ChevronRight className={cn("w-4 h-4", isDark ? "text-white/15" : "text-slate-300")} />
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Sign out */}
        <Reveal className="mb-20" delay={0.2}>
          <Button variant="outline" className={cn("w-full cursor-pointer", isDark ? "border-white/[0.06] text-white/40 hover:text-red-400 hover:border-red-500/20" : "border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200")} onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </Reveal>
      </motion.div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowAddSubject(false)} />
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className={cn("max-w-lg mx-auto rounded-3xl p-6 shadow-2xl", isDark ? "bg-[#0a1128] border border-white/[0.08]" : "bg-white border border-slate-200")}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Add Subject</h3>
                <button onClick={() => setShowAddSubject(false)} className={cn("w-8 h-8 rounded-full flex items-center justify-center cursor-pointer", isDark ? "bg-white/5 text-white/30 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-700")}><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Subject name</label>
                  <Input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g., Mathematics" className={inputCls} autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleAddSubject(); }} />
                </div>
                <div>
                  <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Color</label>
                  <div className="flex gap-2">
                    {subjectColors.map((color) => (
                      <motion.button key={color} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setSubjectColor(color)}
                        className={cn("w-8 h-8 rounded-xl transition-all cursor-pointer", subjectColor === color ? (isDark ? "ring-2 ring-offset-2 ring-offset-[#0a1128]" : "ring-2 ring-offset-2 ring-offset-white") : "opacity-50 hover:opacity-80")}
                        style={{ backgroundColor: color, ...(subjectColor === color ? { boxShadow: `0 0 0 2px ${color}40` } : {}) }} />
                    ))}
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold cursor-pointer shadow-lg shadow-sky-500/15" onClick={handleAddSubject} disabled={!subjectName.trim()}>Add Subject</Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

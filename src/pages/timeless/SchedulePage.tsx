import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Plus, X, CheckCircle2, Circle, Clock, Trash2,
  BookOpen, GraduationCap, FileText, Calendar, Sun, Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const taskTypes = [
  { value: "study", label: "Study", icon: BookOpen, color: "sky" },
  { value: "revision", label: "Revision", icon: Clock, color: "emerald" },
  { value: "exam", label: "Exam", icon: GraduationCap, color: "red" },
  { value: "assignment", label: "Assignment", icon: FileText, color: "amber" },
  { value: "homework", label: "Homework", icon: FileText, color: "violet" },
  { value: "personal", label: "Personal", icon: Calendar, color: "slate" },
];

const priorities = [
  { value: "low", label: "Low", color: "sky" },
  { value: "medium", label: "Medium", color: "amber" },
  { value: "high", label: "High", color: "red" },
];

const colorMap: Record<string, Record<string, string>> = {
  sky: { dark: "bg-sky-500/10 text-[#38bdf8]", light: "bg-sky-100 text-sky-700" },
  emerald: { dark: "bg-emerald-500/10 text-emerald-400", light: "bg-emerald-100 text-emerald-700" },
  red: { dark: "bg-red-500/10 text-red-400", light: "bg-red-100 text-red-600" },
  amber: { dark: "bg-amber-500/10 text-amber-400", light: "bg-amber-100 text-amber-700" },
  violet: { dark: "bg-violet-500/10 text-[#a78bfa]", light: "bg-violet-100 text-violet-700" },
  slate: { dark: "bg-white/5 text-white/40", light: "bg-slate-100 text-slate-500" },
};

const prioDot: Record<string, Record<string, string>> = {
  sky: { dark: "bg-sky-400", light: "bg-sky-500" },
  amber: { dark: "bg-amber-400", light: "bg-amber-500" },
  red: { dark: "bg-red-400", light: "bg-red-500" },
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function SchedulePage() {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("study");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDuration, setNewDuration] = useState("30");
  const [newTime, setNewTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const { isDark } = useTheme();

  const todayTasks = useQuery(api.tasks.listByDate, { date: selectedDate });
  const subjects = useQuery(api.subjects.list);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.remove);

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    await createTask({
      title: newTitle.trim(),
      type: newType as any,
      priority: newPriority as any,
      scheduledDate: selectedDate,
      scheduledTime: newTime || undefined,
      durationMinutes: parseInt(newDuration) || 30,
      subjectId: subjects?.[0]?._id,
    });
    setNewTitle(""); setNewType("study"); setNewPriority("medium"); setNewDuration("30"); setNewTime(""); setShowAdd(false);
  };

  const toggleTask = async (task: any) => {
    await updateTask({ id: task._id, status: task.status === "completed" ? "pending" : "completed" });
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], day: d.toLocaleDateString("en", { weekday: "short" }), num: d.getDate(), isToday: d.toISOString().split("T")[0] === getToday() };
  });

  const completedCount = todayTasks?.filter((t) => t.status === "completed").length ?? 0;
  const totalTasks = todayTasks?.length ?? 0;

  const inputCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400");
  const selectCls = cn(isDark ? "bg-white/[0.05] border-white/[0.08] text-white" : "bg-white border-slate-200 text-slate-900");
  const selectContentCls = cn(isDark ? "bg-[#0a1128] border-white/[0.08]" : "bg-white border-slate-200");

  return (
    <div className="px-6 pt-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Plan and track your study time</p>
        </motion.div>

        {/* Week Strip */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hidden pb-2">
          {weekDates.map((d) => (
            <motion.button key={d.date} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(d.date)}
              className={cn(
                "flex flex-col items-center px-4 py-3 rounded-2xl min-w-[60px] transition-all cursor-pointer border",
                selectedDate === d.date
                  ? "bg-gradient-to-b from-sky-100 to-emerald-50 border-sky-300 dark:from-sky-500/20 dark:to-emerald-500/10 dark:border-sky-500/30"
                  : isDark ? "bg-white/[0.03] border-white/[0.04] hover:border-white/[0.08]" : "bg-white border-slate-200/60 hover:border-slate-300",
              )}>
              <span className={cn("text-[10px] font-medium uppercase", isDark ? "text-white/30" : "text-slate-400")}>{d.day}</span>
              <span className={cn("text-lg font-bold mt-1", selectedDate === d.date ? "text-[#0ea5e9] dark:text-[#38bdf8]" : isDark ? "text-white/60" : "text-slate-700")}>{d.num}</span>
              {d.isToday && <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{selectedDate === getToday() ? "Today" : selectedDate}</h2>
            <p className={cn("text-xs", isDark ? "text-white/30" : "text-slate-400")}>{completedCount}/{totalTasks} completed</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold text-sm cursor-pointer shadow-lg shadow-sky-500/15" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-1.5" />Add Task
            </Button>
          </motion.div>
        </div>

        {/* Task List */}
        <div className="space-y-2 mb-6">
          <AnimatePresence mode="popLayout">
            {todayTasks?.map((task) => {
              const tc = colorMap.sky;
              return (
                <motion.div key={task._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                  className="glass-card px-4 py-3 flex items-center gap-3 hover-lift">
                  <button onClick={() => toggleTask(task)} className="cursor-pointer shrink-0">
                    {task.status === "completed" ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className={cn("w-5 h-5", isDark ? "text-white/20 hover:text-white/40" : "text-slate-300 hover:text-slate-500")} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", task.status === "completed" && "line-through opacity-40")}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", tc[isDark ? "dark" : "light"])}>{taskTypes.find((t) => t.value === task.type)?.label || task.type}</span>
                      {task.scheduledTime && <span className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>{task.scheduledTime}</span>}
                      {task.durationMinutes && <span className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>{task.durationMinutes}m</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", prioDot[task.priority === "high" ? "red" : task.priority === "medium" ? "amber" : "sky"][isDark ? "dark" : "light"])} />
                    <button onClick={() => deleteTask({ id: task._id })} className={cn("transition-colors cursor-pointer", isDark ? "text-white/15 hover:text-red-400" : "text-slate-300 hover:text-red-500")}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {todayTasks && todayTasks.length === 0 && !showAdd && (
            <div className="glass-card p-10 text-center">
              <Calendar className={cn("w-8 h-8 mx-auto mb-3", isDark ? "text-white/15" : "text-slate-300")} />
              <p className={cn("text-sm", isDark ? "text-white/30" : "text-slate-400")}>No tasks for this day</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-0 left-0 right-0 z-50 p-4">
              <div className={cn("max-w-lg mx-auto rounded-3xl p-6 shadow-2xl", isDark ? "bg-[#0a1128] border border-white/[0.08]" : "bg-white border border-slate-200 shadow-slate-900/10")}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">Add Task</h3>
                  <button onClick={() => setShowAdd(false)} className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer", isDark ? "bg-white/5 text-white/30 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-700")}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Task name</label>
                    <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Revise Thermodynamics" className={inputCls} autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleAddTask(); }} />
                  </div>
                  <div>
                    <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Type</label>
                    <div className="flex flex-wrap gap-2">
                      {taskTypes.map((type) => (
                        <motion.button key={type.value} whileTap={{ scale: 0.95 }} onClick={() => setNewType(type.value)}
                          className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border", newType === type.value ? `${colorMap[type.color][isDark ? "dark" : "light"]} border-current` : isDark ? "border-white/[0.06] text-white/40 hover:text-white/60" : "border-slate-200 text-slate-400 hover:text-slate-600")}>
                          {type.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Priority</label>
                      <Select value={newPriority} onValueChange={setNewPriority}>
                        <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                        <SelectContent className={selectContentCls}>
                          {priorities.map((p) => <SelectItem key={p.value} value={p.value} className={isDark ? "text-white/60" : "text-slate-600"}>
                            <span className="flex items-center gap-2"><div className={cn("w-2 h-2 rounded-full", prioDot[p.color][isDark ? "dark" : "light"])} />{p.label}</span>
                          </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Duration</label>
                      <Select value={newDuration} onValueChange={setNewDuration}>
                        <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                        <SelectContent className={selectContentCls}>
                          {["15", "30", "45", "60", "90", "120"].map((m) => <SelectItem key={m} value={m} className={isDark ? "text-white/60" : "text-slate-600"}>{m}m</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className={cn("text-xs mb-1.5 block", isDark ? "text-white/30" : "text-slate-400")}>Time</label>
                      <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold cursor-pointer shadow-lg shadow-sky-500/15" onClick={handleAddTask} disabled={!newTitle.trim()}>
                      <Plus className="w-4 h-4 mr-2" />Add Task
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

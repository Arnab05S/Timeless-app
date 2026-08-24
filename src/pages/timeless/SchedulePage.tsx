import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  BookOpen,
  GraduationCap,
  FileText,
  Calendar,
  Loader2,
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
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const taskTypes = [
  { value: "study", label: "Study", icon: BookOpen, color: "#38bdf8" },
  { value: "revision", label: "Revision", icon: Clock, color: "#06d6a0" },
  { value: "exam", label: "Exam", icon: GraduationCap, color: "#ef476f" },
  { value: "assignment", label: "Assignment", icon: FileText, color: "#ffd166" },
  { value: "homework", label: "Homework", icon: FileText, color: "#a78bfa" },
  { value: "personal", label: "Personal", icon: Calendar, color: "#94a3b8" },
];

const priorities = [
  { value: "low", label: "Low", color: "#38bdf8" },
  { value: "medium", label: "Medium", color: "#ffd166" },
  { value: "high", label: "High", color: "#ef476f" },
];

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
    setNewTitle("");
    setNewType("study");
    setNewPriority("medium");
    setNewDuration("30");
    setNewTime("");
    setShowAdd(false);
  };

  const toggleTask = async (task: any) => {
    await updateTask({
      id: task._id,
      status: task.status === "completed" ? "pending" : "completed",
    });
  };

  const getTaskTypeInfo = (type: string) =>
    taskTypes.find((t) => t.value === type) || taskTypes[0];

  const getPriorityInfo = (priority: string) =>
    priorities.find((p) => p.value === priority) || priorities[1];

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en", { weekday: "short" }),
      num: d.getDate(),
      isToday: d.toISOString().split("T")[0] === getToday(),
    };
  });

  const completedCount = todayTasks?.filter((t) => t.status === "completed").length ?? 0;
  const totalTasks = todayTasks?.length ?? 0;

  return (
    <div className="px-6 pt-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-white/40 mt-1">Plan and track your study time</p>
        </div>

        {/* Week Strip */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hidden pb-2">
          {weekDates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={cn(
                "flex flex-col items-center px-4 py-3 rounded-2xl min-w-[60px] transition-all cursor-pointer",
                selectedDate === d.date
                  ? "bg-gradient-to-b from-[#38bdf8]/20 to-[#06d6a0]/10 border border-[#38bdf8]/30"
                  : "bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08]",
              )}
            >
              <span className="text-[10px] font-medium text-white/30 uppercase">
                {d.day}
              </span>
              <span
                className={cn(
                  "text-lg font-bold mt-1",
                  selectedDate === d.date ? "text-[#38bdf8]" : "text-white/60",
                )}
              >
                {d.num}
              </span>
              {d.isToday && (
                <div className="w-1 h-1 rounded-full bg-[#06d6a0] mt-1" />
              )}
            </button>
          ))}
        </div>

        {/* Day Summary */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              {selectedDate === getToday() ? "Today" : selectedDate}
            </h2>
            <p className="text-xs text-white/30">
              {completedCount}/{totalTasks} tasks completed
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold text-sm cursor-pointer"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Task
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-2 mb-6">
          <AnimatePresence mode="popLayout">
            {todayTasks?.map((task) => {
              const typeInfo = getTaskTypeInfo(task.type);
              const prioInfo = getPriorityInfo(task.priority);
              return (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="glass-card px-4 py-3 flex items-center gap-3"
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className="cursor-pointer shrink-0"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#06d6a0]" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/20 hover:text-white/40" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        task.status === "completed" && "line-through text-white/30",
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${typeInfo.color}15`,
                          color: typeInfo.color,
                        }}
                      >
                        {typeInfo.label}
                      </span>
                      {task.scheduledTime && (
                        <span className="text-[10px] text-white/25">
                          {task.scheduledTime}
                        </span>
                      )}
                      {task.durationMinutes && (
                        <span className="text-[10px] text-white/25">
                          {task.durationMinutes}m
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: prioInfo.color }}
                    />
                    <button
                      onClick={() => deleteTask({ id: task._id })}
                      className="text-white/15 hover:text-[#ef476f] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {todayTasks && todayTasks.length === 0 && !showAdd && (
            <div className="glass-card p-10 text-center">
              <Calendar className="w-8 h-8 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/30">No tasks for this day</p>
              <p className="text-xs text-white/20 mt-1">
                Add a task to start planning
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4"
            >
              <div className="max-w-lg mx-auto bg-[#0a1128] border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">Add Task</h3>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/30 mb-1.5 block">
                      Task name
                    </label>
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Revise Thermodynamics"
                      className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddTask();
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/30 mb-1.5 block">
                      Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {taskTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setNewType(type.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer",
                            newType === type.value
                              ? "border-2"
                              : "border border-white/[0.06] text-white/40 hover:text-white/60",
                          )}
                          style={
                            newType === type.value
                              ? {
                                  backgroundColor: `${type.color}15`,
                                  color: type.color,
                                  borderColor: `${type.color}40`,
                                }
                              : undefined
                          }
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-white/30 mb-1.5 block">
                        Priority
                      </label>
                      <Select value={newPriority} onValueChange={setNewPriority}>
                        <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a1128] border-white/[0.08]">
                          {priorities.map((p) => (
                            <SelectItem key={p.value} value={p.value} className="text-white/60">
                              <span className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: p.color }}
                                />
                                {p.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-white/30 mb-1.5 block">
                        Duration
                      </label>
                      <Select value={newDuration} onValueChange={setNewDuration}>
                        <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a1128] border-white/[0.08]">
                          {["15", "30", "45", "60", "90", "120"].map((m) => (
                            <SelectItem key={m} value={m} className="text-white/60">
                              {m}m
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-white/30 mb-1.5 block">
                        Time
                      </label>
                      <Input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="bg-white/[0.05] border-white/[0.08] text-white"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold cursor-pointer"
                    onClick={handleAddTask}
                    disabled={!newTitle.trim()}
                  >
                    {useMutation as unknown ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Task
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

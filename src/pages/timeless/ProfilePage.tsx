import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  BookOpen,
  Plus,
  X,
  Clock,
  Moon,
  Bell,
  Shield,
  ChevronRight,
  Palette,
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
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const subjectColors = [
  "#38bdf8",
  "#06d6a0",
  "#ffd166",
  "#ef476f",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#34d399",
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectColor, setSubjectColor] = useState(subjectColors[0]);

  const subjects = useQuery(api.subjects.list);
  const createSubject = useMutation(api.subjects.create);
  const removeSubject = useMutation(api.subjects.remove);
  const studyStats = useQuery(api.studySessions.getStats);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    await createSubject({
      name: subjectName.trim(),
      color: subjectColor,
    });
    setSubjectName("");
    setSubjectColor(subjectColors[0]);
    setShowAddSubject(false);
  };

  const totalHours = Math.round((studyStats?.totalMinutes ?? 0) / 60);

  return (
    <div className="px-6 pt-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-white/40 mt-1">Manage your account and subjects</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={fadeUp} className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38bdf8] to-[#06d6a0] flex items-center justify-center text-[#050a18] font-bold text-xl">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {user?.name || "Student"}
              </h2>
              <p className="text-sm text-white/30">
                {user?.email || "Guest user"}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-white/25 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {totalHours}h studied
                </span>
                <span className="text-xs text-white/25 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {subjects?.length ?? 0} subjects
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subjects */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Subjects</h3>
            <Button
              size="sm"
              className="bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 text-xs cursor-pointer"
              onClick={() => setShowAddSubject(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {subjects?.map((subject) => (
              <div
                key={subject._id}
                className="glass-card-light px-4 py-3 flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-sm font-medium flex-1">
                  {subject.name}
                </span>
                <button
                  onClick={() => removeSubject({ id: subject._id })}
                  className="text-white/15 hover:text-[#ef476f] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {subjects && subjects.length === 0 && (
              <div className="glass-card p-6 text-center">
                <BookOpen className="w-6 h-6 text-white/15 mx-auto mb-2" />
                <p className="text-xs text-white/30">
                  No subjects yet. Add your first subject to get started.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div variants={fadeUp} className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="glass-card overflow-hidden">
            {[
              {
                icon: Clock,
                label: "Daily Study Goal",
                value: "2 hours",
                color: "#38bdf8",
              },
              {
                icon: Bell,
                label: "Notifications",
                value: "Enabled",
                color: "#06d6a0",
              },
              {
                icon: Moon,
                label: "Dark Mode",
                value: "On",
                color: "#a78bfa",
              },
              {
                icon: Palette,
                label: "Theme",
                value: "Calm Futurism",
                color: "#ffd166",
              },
              {
                icon: Shield,
                label: "Privacy",
                value: "",
                color: "#94a3b8",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer",
                  i < 4 && "border-b border-white/[0.03]",
                )}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <item.icon
                    className="w-4 h-4"
                    style={{ color: item.color }}
                  />
                </div>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.value && (
                  <span className="text-xs text-white/25">{item.value}</span>
                )}
                <ChevronRight className="w-4 h-4 text-white/15" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sign out */}
        <motion.div variants={fadeUp} className="mb-20">
          <Button
            variant="outline"
            className="w-full border-white/[0.06] text-white/40 hover:text-[#ef476f] hover:border-[#ef476f]/20 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </motion.div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowAddSubject(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="max-w-lg mx-auto bg-[#0a1128] border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Add Subject</h3>
                <button
                  onClick={() => setShowAddSubject(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">
                    Subject name
                  </label>
                  <Input
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g., Mathematics"
                    className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubject();
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {subjectColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSubjectColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-xl transition-all cursor-pointer",
                          subjectColor === color
                            ? "ring-2 ring-white/30 scale-110"
                            : "opacity-50 hover:opacity-80",
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#38bdf8] to-[#06d6a0] text-[#050a18] font-semibold cursor-pointer"
                  onClick={handleAddSubject}
                  disabled={!subjectName.trim()}
                >
                  Add Subject
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

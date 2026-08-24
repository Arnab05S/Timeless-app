import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LogOut, Moon, Sun, Bell, Shield, ChevronRight, BookOpen, GraduationCap, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

export default function TeacherProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <div className="px-6 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className={cn("mt-1", isDark ? "text-white/40" : "text-slate-500")}>Teacher account settings</p>
        </div>

        <Reveal className="mb-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06d6a0] to-[#0ea5e9] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
                {user?.name?.[0]?.toUpperCase() || "T"}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user?.name || "Teacher"}</h2>
                <p className={cn("text-sm", isDark ? "text-white/30" : "text-slate-500")}>{user?.email || "teacher@school.edu"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700")}>
                    <GraduationCap className="w-3 h-3 inline mr-1" />Teacher Account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Switch to Student */}
        <Reveal className="mb-6" delay={0.05}>
          <motion.div whileHover={{ y: -2 }} className="glass-card p-5 cursor-pointer hover-glow" onClick={() => navigate("/app")}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-sky-500/10" : "bg-sky-100")}>
                <User className="w-5 h-5 text-sky-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Switch to Student View</p>
                <p className={cn("text-[10px]", isDark ? "text-white/25" : "text-slate-400")}>Access your student dashboard and study tools</p>
              </div>
              <ArrowRight className={cn("w-4 h-4", isDark ? "text-white/15" : "text-slate-300")} />
            </div>
          </motion.div>
        </Reveal>

        {/* Settings */}
        <Reveal className="mb-6" delay={0.1}>
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="glass-card overflow-hidden">
            {[
              { icon: Bell, label: "Notifications", value: "Enabled", color: "emerald" },
              { icon: Moon, label: "Theme", value: isDark ? "Dark" : "Light", color: "violet", action: toggleTheme },
              { icon: Shield, label: "Privacy", value: "", color: "slate" },
            ].map((item, i, arr) => (
              <motion.div key={item.label} whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}
                className={cn("flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors", i < arr.length - 1 && "border-b", isDark ? "border-white/[0.03]" : "border-slate-100")}
                onClick={item.action}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center",
                  item.color === "emerald" && (isDark ? "bg-emerald-500/10" : "bg-emerald-100"),
                  item.color === "violet" && (isDark ? "bg-violet-500/10" : "bg-violet-100"),
                  item.color === "slate" && (isDark ? "bg-white/5" : "bg-slate-100"),
                )}>
                  <item.icon className={cn("w-4 h-4",
                    item.color === "emerald" && "text-emerald-500",
                    item.color === "violet" && "text-violet-500",
                    item.color === "slate" && (isDark ? "text-white/40" : "text-slate-500"),
                  )} />
                </div>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.value && <span className={cn("text-xs", isDark ? "text-white/25" : "text-slate-400")}>{item.value}</span>}
                <ChevronRight className={cn("w-4 h-4", isDark ? "text-white/15" : "text-slate-300")} />
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mb-20" delay={0.15}>
          <Button variant="outline" className={cn("w-full cursor-pointer", isDark ? "border-white/[0.06] text-white/40 hover:text-red-400 hover:border-red-500/20" : "border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200")} onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </Reveal>
      </motion.div>
    </div>
  );
}

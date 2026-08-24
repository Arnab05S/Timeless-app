import { Outlet, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  GraduationCap,
  BarChart3,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { path: "/app", icon: Home, label: "Home" },
  { path: "/app/schedule", icon: CalendarDays, label: "Schedule" },
  { path: "/app/learn", icon: GraduationCap, label: "Learn" },
  { path: "/app/progress", icon: BarChart3, label: "Progress" },
  { path: "/app/profile", icon: User, label: "Profile" },
];

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "min-h-screen overflow-hidden transition-colors duration-500",
        theme === "dark" ? "bg-[#050a18] text-white" : "bg-[#f0f4f8] text-slate-900",
      )}
    >
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={cn(
            "absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full animate-float ambient-orb-1",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full animate-float-delay ambient-orb-2",
          )}
        />
        <div
          className={cn(
            "absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full animate-float ambient-orb-3",
          )}
        />
      </div>

      <div className="relative z-10 min-h-screen pb-24">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-lg px-4 pb-4">
          <div
            className={cn(
              "flex items-center justify-around rounded-2xl px-2 py-2 shadow-2xl transition-colors duration-300",
              theme === "dark"
                ? "bg-[#0a1128]/90 backdrop-blur-xl border border-white/[0.06] shadow-black/30"
                : "bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-slate-900/5",
            )}
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative",
                    active
                      ? theme === "dark"
                        ? "text-[#38bdf8]"
                        : "text-[#0ea5e9]"
                      : theme === "dark"
                        ? "text-white/30 hover:text-white/50"
                        : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={cn(
                        "absolute inset-0 rounded-xl transition-colors duration-300",
                        theme === "dark" ? "bg-[#38bdf8]/10" : "bg-[#0ea5e9]/10",
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="text-[10px] font-medium relative z-10">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

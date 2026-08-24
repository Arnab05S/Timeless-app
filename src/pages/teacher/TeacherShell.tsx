import { Outlet, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Plus, BarChart3, User } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/teacher/classes", icon: Users, label: "Classes" },
  { path: "/teacher/create", icon: Plus, label: "Create" },
  { path: "/teacher/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/teacher/profile", icon: User, label: "Profile" },
];

export default function TeacherShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/teacher") return location.pathname === "/teacher";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "min-h-screen overflow-hidden transition-colors duration-500",
        theme === "dark" ? "bg-[#050a18] text-white" : "bg-[#f0f4f8] text-slate-900",
      )}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full animate-float ambient-orb-1" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full animate-float-delay ambient-orb-2" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full animate-float ambient-orb-3" />
      </div>

      <div className="relative z-10 min-h-screen pb-24">
        <Outlet />
      </div>

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
              const isCreate = item.label === "Create";
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative",
                    isCreate && active
                      ? theme === "dark" ? "text-[#06d6a0]" : "text-[#059669]"
                      : active
                        ? theme === "dark" ? "text-[#38bdf8]" : "text-[#0ea5e9]"
                        : theme === "dark" ? "text-white/30 hover:text-white/50" : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="teacher-nav"
                      className={cn(
                        "absolute inset-0 rounded-xl transition-colors duration-300",
                        isCreate
                          ? theme === "dark" ? "bg-[#06d6a0]/10" : "bg-emerald-50"
                          : theme === "dark" ? "bg-[#38bdf8]/10" : "bg-sky-50",
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isCreate ? (
                    <div className={cn(
                      "w-10 h-10 -mt-4 rounded-xl flex items-center justify-center shadow-lg",
                      "bg-gradient-to-br from-[#0ea5e9] to-[#06d6a0] text-white",
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <item.icon className="w-5 h-5 relative z-10" />
                  )}
                  <span className={cn("text-[10px] font-medium relative z-10", isCreate && "-mt-1")}>
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

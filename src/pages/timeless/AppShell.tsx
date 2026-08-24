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

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#050a18] text-white overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.06)_0%,transparent_70%)] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,214,160,0.04)_0%,transparent_70%)] animate-float-delay" />
      </div>

      <div className="relative z-10 min-h-screen pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-lg px-4 pb-4">
          <div className="flex items-center justify-around rounded-2xl bg-[#0a1128]/90 backdrop-blur-xl border border-white/[0.06] px-2 py-2 shadow-2xl shadow-black/30">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative cursor-pointer",
                    active
                      ? "text-[#38bdf8]"
                      : "text-white/30 hover:text-white/50",
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-[#38bdf8]/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
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

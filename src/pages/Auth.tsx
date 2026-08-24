import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2, Mail, UserX, Clock, Sun, Moon, GraduationCap, BookOpen } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/app",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | "otp" | "roleSelect">("signIn");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingRole, setIsSettingRole] = useState(false);

  const setAccountType = useMutation(api.users.setAccountType);

  useEffect(() => {
    if (!authLoading && isAuthenticated && step !== "roleSelect") {
      setStep("roleSelect");
    }
  }, [authLoading, isAuthenticated, step]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const emailVal = formData.get("email") as string;
      setEmail(emailVal);
      await signIn("email-otp", formData);
      setStep("otp");
      setIsLoading(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep("roleSelect");
    } catch {
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      setStep("roleSelect");
    } catch (error) {
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (role: "student" | "teacher") => {
    setIsSettingRole(true);
    try {
      await setAccountType({ accountType: role });
      navigate(role === "teacher" ? "/teacher" : redirect);
    } catch {
      // If the mutation fails (e.g. user record not created yet), just navigate
      navigate(role === "teacher" ? "/teacher" : redirect);
    }
  };

  const inputClasses = cn(
    "transition-colors duration-200",
    isDark
      ? "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-sky-500/30"
      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500/30",
  );

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500",
        isDark ? "bg-[#050a18]" : "bg-[#f0f4f8]",
      )}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full animate-float ambient-orb-1" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full animate-float-delay ambient-orb-2" />
      </div>

      {/* Theme toggle */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: isDark ? 180 : 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={cn(
          "fixed top-5 right-5 z-50 w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer",
          isDark
            ? "bg-white/5 hover:bg-white/10 text-white/50"
            : "bg-slate-200/60 hover:bg-slate-200 text-slate-500",
        )}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[400px] px-6"
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#06d6a0] flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/20"
            onClick={() => navigate("/")}
          >
            <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ═══ Role Selection ═══ */}
          {step === "roleSelect" && (
            <motion.div
              key="roleSelect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                className={cn(
                  "rounded-3xl shadow-2xl transition-colors duration-300",
                  isDark
                    ? "border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-black/20"
                    : "border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-slate-900/5",
                )}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className={cn("text-xl", isDark ? "text-white" : "text-slate-900")}>
                    Welcome to Timeless
                  </CardTitle>
                  <CardDescription className={cn(isDark ? "text-white/40" : "text-slate-500")}>
                    How will you be using Timeless?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect("student")}
                    disabled={isSettingRole}
                    className={cn(
                      "w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer",
                      isDark
                        ? "bg-sky-500/[0.04] border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-500/[0.08]"
                        : "bg-sky-50 border-sky-200 hover:border-sky-400 hover:bg-sky-100",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        isDark ? "bg-sky-500/15" : "bg-sky-200",
                      )}>
                        <BookOpen className={cn("w-6 h-6", isDark ? "text-[#38bdf8]" : "text-sky-600")} />
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-base font-semibold", isDark ? "text-white" : "text-slate-900")}>I'm a Student</p>
                        <p className={cn("text-xs mt-0.5", isDark ? "text-white/35" : "text-slate-500")}>
                          Plan my study time, take quizzes, review flashcards
                        </p>
                      </div>
                      <ArrowRight className={cn("w-4 h-4 shrink-0", isDark ? "text-white/20" : "text-slate-400")} />
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect("teacher")}
                    disabled={isSettingRole}
                    className={cn(
                      "w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer",
                      isDark
                        ? "bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/[0.08]"
                        : "bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        isDark ? "bg-emerald-500/15" : "bg-emerald-200",
                      )}>
                        <GraduationCap className={cn("w-6 h-6", isDark ? "text-[#06d6a0]" : "text-emerald-600")} />
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-base font-semibold", isDark ? "text-white" : "text-slate-900")}>I'm a Teacher</p>
                        <p className={cn("text-xs mt-0.5", isDark ? "text-white/35" : "text-slate-500")}>
                          Manage classes, create quizzes, track student performance
                        </p>
                      </div>
                      <ArrowRight className={cn("w-4 h-4 shrink-0", isDark ? "text-white/20" : "text-slate-400")} />
                    </div>
                  </motion.button>

                  {isSettingRole && (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                      <span className={cn("text-xs", isDark ? "text-white/40" : "text-slate-500")}>Setting up your account...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ═══ Sign In ═══ */}
          {step === "signIn" && (
            <motion.div
              key="signIn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                className={cn(
                  "rounded-3xl shadow-2xl transition-colors duration-300",
                  isDark
                    ? "border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-black/20"
                    : "border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-slate-900/5",
                )}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className={cn("text-xl", isDark ? "text-white" : "text-slate-900")}>
                    Welcome to Timeless
                  </CardTitle>
                  <CardDescription className={cn(isDark ? "text-white/40" : "text-slate-500")}>
                    Enter your email to get started
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className={cn("absolute left-3 top-3 h-4 w-4", isDark ? "text-white/30" : "text-slate-400")} />
                        <Input
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          className={cn("pl-9", inputClasses)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white hover:opacity-90 shrink-0 shadow-lg shadow-sky-500/20"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className={cn("w-full border-t", isDark ? "border-white/[0.06]" : "border-slate-200")} />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className={cn("px-3", isDark ? "bg-[#0a1128] text-white/30" : "bg-[#f0f4f8] text-slate-400")}>
                            or
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full mt-4 cursor-pointer",
                          isDark
                            ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06]"
                            : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                        )}
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Continue as Guest
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            </motion.div>
          )}

          {/* ═══ OTP Verification ═══ */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                className={cn(
                  "rounded-3xl shadow-2xl transition-colors duration-300",
                  isDark
                    ? "border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-black/20"
                    : "border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-slate-900/5",
                )}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className={cn("text-xl", isDark ? "text-white" : "text-slate-900")}>
                    Check your email
                  </CardTitle>
                  <CardDescription className={cn(isDark ? "text-white/40" : "text-slate-500")}>
                    We've sent a code to {email}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="pb-4">
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="code" value={otp} />
                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                            const form = (e.target as HTMLElement).closest("form");
                            if (form) form.requestSubmit();
                          }
                        }}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={cn(
                                isDark
                                  ? "bg-white/[0.05] border-white/[0.08] text-white"
                                  : "bg-slate-100 border-slate-200 text-slate-900",
                              )}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}
                    <p className={cn("text-sm text-center mt-4", isDark ? "text-white/30" : "text-slate-400")}>
                      Didn't receive a code?{" "}
                      <Button variant="link" className="p-0 h-auto text-[#0ea5e9] dark:text-[#38bdf8]" onClick={() => setStep("signIn")}>
                        Try again
                      </Button>
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col gap-2 px-6 pb-6">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#06d6a0] text-white font-semibold hover:opacity-90 cursor-pointer shadow-lg shadow-sky-500/20"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                      ) : (
                        <>Verify code <ArrowRight className="ml-2 h-4" /></>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep("signIn")}
                      disabled={isLoading}
                      className={cn(
                        "w-full",
                        isDark ? "text-white/40 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                      )}
                    >
                      Use different email
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <p className={cn("text-center text-[10px] mt-6", isDark ? "text-white/20" : "text-slate-400")}>
          Secured by{" "}
          <a href="https://freebuff.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">
            freebuff.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}



export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}

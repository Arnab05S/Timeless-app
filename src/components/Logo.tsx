import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-7 h-7",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

export default function Logo({ size = "md", className }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Timeless"
      className={cn(sizeMap[size], "object-contain", className)}
      onError={(e) => {
        // Fallback: show a gradient circle with T if SVG fails
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
        const parent = target.parentElement;
        if (parent && !parent.querySelector(".logo-fallback")) {
          const fallback = document.createElement("div");
          fallback.className = "logo-fallback bg-gradient-to-br from-[#38bdf8] to-[#818cf8] rounded-xl flex items-center justify-center text-white font-bold";
          fallback.style.width = size === "sm" ? "28px" : size === "md" ? "40px" : size === "lg" ? "56px" : "80px";
          fallback.style.height = fallback.style.width;
          fallback.style.fontSize = size === "sm" ? "14px" : size === "md" ? "18px" : size === "lg" ? "24px" : "32px";
          fallback.textContent = "T";
          parent.appendChild(fallback);
        }
      }}
    />
  );
}

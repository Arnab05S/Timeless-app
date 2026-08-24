import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export default function Logo({ size = "md", className }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Timeless"
      className={cn(sizeMap[size], className)}
    />
  );
}

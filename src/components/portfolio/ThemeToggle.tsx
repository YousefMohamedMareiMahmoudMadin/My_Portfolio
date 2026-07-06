import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full border border-border bg-surface/60 backdrop-blur transition-colors",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-300 ease-out",
          isDark ? "translate-x-7" : "translate-x-1",
        )}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
      <Sun className={cn("absolute left-2 h-3 w-3 transition-opacity", isDark ? "opacity-30" : "opacity-0")} />
      <Moon className={cn("absolute right-2 h-3 w-3 transition-opacity", isDark ? "opacity-0" : "opacity-30")} />
    </button>
  );
}

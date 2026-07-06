import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePortfolioData } from "@/lib/portfolio-store";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "timeline", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function SideNav() {
  const { data } = usePortfolioData();
  const initials = data.profile.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border/50 bg-background/80 px-5 py-3 backdrop-blur-md lg:hidden">
        <a href="#home" className="font-display text-sm font-semibold tracking-tight">
          <span className="text-gradient">{initials}.</span>
          <span className="text-muted-foreground"> / engineer</span>
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            className="rounded-md border border-border p-2 text-foreground"
          >
            <div className="flex h-4 w-5 flex-col justify-between">
              <span
                className={cn(
                  "h-0.5 w-full bg-current transition-transform",
                  open && "translate-y-[7px] rotate-45",
                )}
              />
              <span className={cn("h-0.5 w-full bg-current transition-opacity", open && "opacity-0")} />
              <span
                className={cn(
                  "h-0.5 w-full bg-current transition-transform",
                  open && "-translate-y-[7px] -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="fixed inset-x-0 top-[57px] z-30 border-b border-border bg-background/95 p-6 backdrop-blur-lg lg:hidden">
          <ul className="flex flex-col gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-4 py-3 text-sm font-medium transition-colors",
                    active === s.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Desktop side nav */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col justify-between border-r border-border/60 bg-surface/40 p-8 backdrop-blur-xl lg:flex">
        <div>
          <a href="#home" className="block font-display text-xl font-bold tracking-tight">
            <span className="text-gradient">{data.profile.name}</span>
          </a>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            Backend Architect
          </p>

          <nav className="mt-14">
            <ul className="flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn(
                      "group flex items-center gap-4 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                      active === s.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] transition-colors",
                        active === s.id ? "text-primary" : "text-muted-foreground/60",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={cn(
                        "h-px transition-all",
                        active === s.id
                          ? "w-8 bg-primary"
                          : "w-4 bg-border group-hover:w-6 group-hover:bg-foreground",
                      )}
                    />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-4 text-xs text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for new projects
          </div>
          <p className="font-mono text-[10px]">v2026.07 — built with care</p>
        </div>
      </aside>
    </>
  );
}

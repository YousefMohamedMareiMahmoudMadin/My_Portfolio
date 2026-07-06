import { SectionHeading } from "./Projects";
import { Code2, Boxes, Database, Wrench, type LucideIcon } from "lucide-react";
import { useStackFilter } from "@/lib/filter-store";
import { usePortfolioData, type SkillGroup } from "@/lib/portfolio-store";
import { cn } from "@/lib/utils";

const iconMap: Record<SkillGroup["icon"], LucideIcon> = {
  code: Code2,
  boxes: Boxes,
  database: Database,
  wrench: Wrench,
};

const spans = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "sm:col-span-2 lg:col-span-3",
  "sm:col-span-1 lg:col-span-2",
  "sm:col-span-1 lg:col-span-3",
];

export function Skills() {
  const { data } = usePortfolioData();
  const [filter, setFilter] = useStackFilter();

  const handleClick = (item: string) => {
    setFilter(filter === item ? null : item);
    if (typeof window !== "undefined") {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="skills" className="px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="03 / Toolkit" title="Core competencies" />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Click any technology to instantly filter matching projects. The stack I reach for daily —
          chosen for reliability, ecosystem strength, and clean composition.
        </p>

        <div className="mt-14 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.skillGroups.map((g, idx) => {
            const Icon = iconMap[g.icon] ?? Code2;
            return (
              <div
                key={g.id}
                className={cn(
                  "glass-panel group rounded-xl p-6 transition-colors hover:border-primary/40",
                  spans[idx % spans.length],
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="min-w-0 truncate font-display text-base font-semibold">
                    {g.label}
                  </h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((item) => {
                    const active = filter === item;
                    return (
                      <button
                        key={item}
                        onClick={() => handleClick(item)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 font-mono text-[11px] transition-all",
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border/70 bg-surface/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                        )}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { SectionHeading } from "./Projects";
import { usePortfolioData } from "@/lib/portfolio-store";

export function Timeline() {
  const { data } = usePortfolioData();
  const entries = data.timeline;

  return (
    <section id="timeline" className="px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="04 / Journey" title="Experience & education" />

        <ol className="relative mt-14 border-l border-border pl-8">
          {entries.map((e) => (
            <li key={e.id} className="group relative pb-12 last:pb-0">
              <span className="absolute -left-[37px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <div className="font-mono text-xs uppercase tracking-widest text-primary">
                {e.year}
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold break-words">{e.title}</h3>
              <div className="text-sm text-muted-foreground break-words">{e.org}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { Github, ExternalLink, PlayCircle, Star, GitFork, CircleAlert, Workflow, GaugeCircle, ShieldCheck, Zap, Layers, Clock } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePortfolioData, type Project } from "@/lib/portfolio-store";
import { useRepoMetrics } from "@/lib/github";
import { getProjectBlobUrl, BLOB_EVENT } from "@/lib/video-blob-store";
import { useStackFilter } from "@/lib/filter-store";
import { cn } from "@/lib/utils";

function useProjectVideo(projectId: string, fallbackUrl: string) {
  const [blob, setBlob] = useState<string | undefined>(() => getProjectBlobUrl(projectId));
  useEffect(() => {
    const sync = () => setBlob(getProjectBlobUrl(projectId));
    sync();
    window.addEventListener(BLOB_EVENT, sync);
    return () => window.removeEventListener(BLOB_EVENT, sync);
  }, [projectId]);
  return blob || fallbackUrl;
}

export function Projects() {
  const { data } = usePortfolioData();
  const projects = data.projects;
  const [filter, setFilter] = useStackFilter();

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.stack))).sort(),
    [projects],
  );

  const visible = useMemo(
    () => (filter ? projects.filter((p) => p.stack.includes(filter)) : projects),
    [filter, projects],
  );

  return (
    <section id="projects" className="px-4 py-24 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="02 / Work" title="My projects" />
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground">
          Live repositories with architectural notes and real-time GitHub telemetry. Filter by
          technology to focus on a specific stack.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <FilterChip active={filter === null} onClick={() => setFilter(null)}>
            All
          </FilterChip>
          {allTags.map((tag) => (
            <FilterChip key={tag} active={filter === tag} onClick={() => setFilter(filter === tag ? null : tag)}>
              {tag}
            </FilterChip>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((p) => {
            const isMatch = !filter || p.stack.includes(filter);
            return (
              <div
                key={p.id}
                className={cn(
                  "transition-all duration-500 w-full",
                  isMatch ? "opacity-100" : "pointer-events-none scale-[0.98] opacity-25",
                )}
              >
                <ProjectCard def={p} />
              </div>
            );
          })}
          {visible.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No projects match "{filter}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ def }: { def: Project }) {
  const metrics = useRepoMetrics(def.repo);
  const activeVideo = useProjectVideo(def.id, def.videoUrl);

  return (
    <article className="group glass-panel relative flex h-full animate-fade-in flex-col overflow-hidden rounded-xl transition-all hover:border-primary/40 w-full">
      <div className="flex items-start justify-between gap-4 border-b border-border/60 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base sm:text-lg font-semibold leading-snug">{def.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{def.summary}</p>
        </div>
        <a
          href={def.repo}
          target="_blank"
          rel="noreferrer"
          aria-label="Repository"
          className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>

      <Tabs defaultValue="preview" className="flex flex-1 flex-col w-full">
        <div className="px-4 sm:px-5 pt-4">
          <TabsList className="flex flex-wrap sm:grid w-full h-auto sm:grid-cols-4 gap-1 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="preview" className="flex-1 min-w-[60px] text-[10px] sm:text-[11px] py-1.5">Preview</TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 min-w-[60px] text-[10px] sm:text-[11px] py-1.5">Stats</TabsTrigger>
            <TabsTrigger value="arch" className="flex-1 min-w-[60px] text-[10px] sm:text-[11px] py-1.5">Architecture</TabsTrigger>
            <TabsTrigger value="perf" className="flex-1 min-w-[60px] text-[10px] sm:text-[11px] py-1.5">Performance</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="m-0 flex-1 p-4 sm:p-5 pt-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface-elevated flex items-center justify-center">
            {activeVideo ? (
              isEmbeddable(activeVideo) ? (
                <iframe
                  src={toEmbed(activeVideo)}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={def.title}
                />
              ) : (
                <video key={activeVideo} src={activeVideo} controls playsInline className="absolute inset-0 h-full w-full object-cover" />
              )
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center p-4 text-muted-foreground">
                <PlayCircle className="h-8 w-8 sm:h-10 sm:w-10 opacity-40" />
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
                  Video walk-through — coming soon
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-1 sm:gap-1.5">
            {def.stack.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="border-border/70 bg-surface/40 font-mono text-[9px] sm:text-[10px] font-normal text-muted-foreground"
              >
                {t}
              </Badge>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="m-0 flex-1 p-4 sm:p-5 pt-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <StatCard icon={Star} label="Stars" value={metrics.data?.stars} loading={metrics.isLoading} error={metrics.isError} />
            <StatCard icon={GitFork} label="Forks" value={metrics.data?.forks} loading={metrics.isLoading} error={metrics.isError} />
            <StatCard icon={CircleAlert} label="Open issues" value={metrics.data?.issues} loading={metrics.isLoading} error={metrics.isError} />
            <StatCard
              icon={Clock}
              label="Last commit"
              value={undefined}
              loading={metrics.isLoading}
              error={metrics.isError}
              display={metrics.data?.lastCommit ? relativeTime(metrics.data.lastCommit) : "—"}
            />
          </div>
          <div className="mt-4 rounded-md border border-border/60 bg-surface/40 px-3 py-2 font-mono text-[10px] sm:text-[11px] text-muted-foreground">
            Primary language: <span className="text-foreground">{metrics.data?.language ?? "—"}</span>
          </div>
        </TabsContent>

        <TabsContent value="arch" className="m-0 flex-1 p-4 sm:p-5 pt-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
            <Workflow className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono uppercase tracking-widest break-words max-w-full">{def.architecture}</span>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            {def.flow.map((step, i) => (
              <div key={step + i} className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-[9px] sm:text-[10px] font-semibold text-primary">
                    {i + 1}
                  </div>
                  {i < def.flow.length - 1 && (
                    <div className="mt-1 h-5 sm:h-6 w-px bg-gradient-to-b from-primary/40 to-transparent" />
                  )}
                </div>
                <div className="flex-1 rounded-md border border-border/60 bg-surface/60 px-2.5 py-1.5 sm:px-3 sm:py-2 font-mono text-[10px] sm:text-[11px] break-words">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="perf" className="m-0 flex-1 p-4 sm:p-5 pt-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <PerfBadge icon={GaugeCircle} label="Target latency" value="< 200ms" />
            <PerfBadge icon={ShieldCheck} label="Thread safety" value="Verified" />
            <PerfBadge icon={Zap} label="Collision resistance" value="High" />
            <PerfBadge icon={Layers} label="Clean architecture" value="Compliant" />
          </div>
          <p className="mt-4 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">
            Simulated targets — informed by production benchmarks
          </p>
        </TabsContent>
      </Tabs>

      <div className="border-t border-border/60 p-4 sm:p-5">
        <a
          href={def.repo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface/60 px-4 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Github className="h-3.5 w-3.5" /> View repository
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </div>
    </article>
  );
}

function relativeTime(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const day = 86400_000;
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  if (diff < 30 * day) return `${Math.floor(diff / day)}d ago`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))}mo ago`;
  return `${Math.floor(diff / (365 * day))}y ago`;
}

function isEmbeddable(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function toEmbed(url: string) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  error,
  display,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | undefined;
  loading: boolean;
  error: boolean;
  display?: string;
}) {
  return (
    <div className="rounded-md border border-border/60 bg-surface/40 p-2.5 sm:p-3">
      <div className="mb-1 flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-base sm:text-lg font-semibold">
        {loading ? "…" : error ? "—" : display ?? value ?? 0}
      </div>
    </div>
  );
}

function PerfBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 sm:p-3">
      <div className="mb-1 flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-primary">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-xs sm:text-sm font-semibold">{value}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 sm:px-3 sm:py-1.5 font-mono text-[10px] sm:text-[11px] transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-surface/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </div>
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
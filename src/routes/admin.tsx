import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  usePortfolioData,
  defaultData,
  ADMIN_PASSWORD_KEY,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  type PortfolioData,
  type Project,
} from "@/lib/portfolio-store";
import { setProjectBlobUrl, clearProjectBlobUrl, getProjectBlobUrl } from "@/lib/video-blob-store";
import { getCvTelemetry, type CvTelemetry } from "@/lib/cv-telemetry";
import { setCvBlob, clearCvBlob, getCvBlob, CV_BLOB_EVENT } from "@/lib/cv-blob-store";
import type { SkillGroup, TimelineEntry } from "@/lib/portfolio-store";
import { ArrowLeft, LogOut, Save, RotateCcw, Plus, Trash2, BarChart3, Upload, Download, FileText, GraduationCap, Layers } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const swalTheme = () => ({
  background: getComputedStyle(document.documentElement).getPropertyValue("--background")
    ? "hsl(var(--background))"
    : undefined,
  color: "hsl(var(--foreground))",
  confirmButtonColor: "hsl(var(--primary))",
  cancelButtonColor: "hsl(var(--muted))",
});

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAuthed(window.sessionStorage.getItem(ADMIN_PASSWORD_KEY) === "1");
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL && pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, "1");
      setAuthed(true);
      setErr("");
      Swal.fire({ ...swalTheme(), title: "Welcome back", icon: "success", timer: 1200, showConfirmButton: false });
    } else {
      setErr("Invalid credentials");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
    setAuthed(false);
    setEmail("");
    setPwd("");
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm glass-panel">
          <CardHeader>
            <CardTitle className="font-display">Admin access</CardTitle>
            <p className="text-xs text-muted-foreground">Local dashboard — this browser only.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={login} className="space-y-4">
              <div>
                <Label htmlFor="em">Email</Label>
                <Input
                  id="em"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="pwd">Password</Label>
                <Input
                  id="pwd"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="mt-2"
                />
                {err && <p className="mt-1.5 text-xs text-destructive">{err}</p>}
              </div>
              <Button type="submit" className="w-full">Sign in</Button>
              <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-primary">
                Back to portfolio
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Dashboard onLogout={logout} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { data, setData } = usePortfolioData();
  const [draft, setDraft] = useState<PortfolioData>(data);

  useEffect(() => setDraft(data), [data]);

  const save = () => {
    setData(draft);
    Swal.fire({ ...swalTheme(), title: "Changes saved", icon: "success", timer: 1400, showConfirmButton: false });
  };

  const reset = async () => {
    const res = await Swal.fire({
      ...swalTheme(),
      title: "Reset to defaults?",
      text: "This clears all saved changes.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reset",
    });
    if (res.isConfirmed) {
      setData(defaultData);
      setDraft(defaultData);
      Swal.fire({ ...swalTheme(), title: "Reset complete", icon: "success", timer: 1200, showConfirmButton: false });
    }
  };

  const addProject = () => {
    const p: Project = {
      id: `project-${Date.now()}`,
      title: "New Project",
      summary: "",
      architecture: "",
      stack: [],
      repo: "",
      flow: [],
      videoUrl: "",
    };
    setDraft({ ...draft, projects: [...draft.projects, p] });
  };

  const updateProject = (id: string, patch: Partial<Project>) => {
    setDraft({
      ...draft,
      projects: draft.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const deleteProject = async (id: string) => {
    const res = await Swal.fire({
      ...swalTheme(),
      title: "Delete project?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (res.isConfirmed) {
      setDraft({ ...draft, projects: draft.projects.filter((p) => p.id !== id) });
    }
  };

  // Skill group mutators
  const addSkillGroup = () => {
    const g: SkillGroup = {
      id: `sg-${Date.now()}`,
      label: "New group",
      icon: "code",
      items: [],
    };
    setDraft({ ...draft, skillGroups: [...draft.skillGroups, g] });
  };
  const updateSkillGroup = (id: string, patch: Partial<SkillGroup>) => {
    setDraft({
      ...draft,
      skillGroups: draft.skillGroups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });
  };
  const deleteSkillGroup = async (id: string) => {
    const res = await Swal.fire({
      ...swalTheme(),
      title: "Delete skill group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (res.isConfirmed) setDraft({ ...draft, skillGroups: draft.skillGroups.filter((g) => g.id !== id) });
  };

  // Timeline mutators
  const addTimeline = () => {
    const t: TimelineEntry = {
      id: `t-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: "New entry",
      org: "",
      detail: "",
      kind: "work",
    };
    setDraft({ ...draft, timeline: [...draft.timeline, t] });
  };
  const updateTimeline = (id: string, patch: Partial<TimelineEntry>) => {
    setDraft({
      ...draft,
      timeline: draft.timeline.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };
  const deleteTimeline = async (id: string) => {
    const res = await Swal.fire({
      ...swalTheme(),
      title: "Delete timeline entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (res.isConfirmed) setDraft({ ...draft, timeline: draft.timeline.filter((t) => t.id !== id) });
  };


  const totalProjects = draft.projects.length;
  const totalStackTags = new Set(draft.projects.flatMap((p) => p.stack)).size;
  const totalSkills = draft.skillGroups.reduce((n, g) => n + g.items.length, 0);
  const totalTimeline = draft.timeline.length;
  const withVideo = draft.projects.filter((p) => p.videoUrl).length;
  const withRepo = draft.projects.filter((p) => p.repo).length;

  const stackCounts = Object.entries(
    draft.projects
      .flatMap((p) => p.stack)
      .reduce<Record<string, number>>((acc, s) => ({ ...acc, [s]: (acc[s] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...stackCounts.map(([, c]) => c));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-display text-lg font-semibold">Admin Dashboard</h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Local storage — this browser only
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" variant="ghost" onClick={onLogout}>
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Button>
            <Button size="sm" onClick={save}>
              <Save className="h-3.5 w-3.5" /> Save changes
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        {/* Analytics */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Projects" value={totalProjects} />
              <Stat label="Skills" value={totalSkills} />
              <Stat label="Timeline entries" value={totalTimeline} />
              <Stat label="Unique tech tags" value={totalStackTags} />
              <Stat label="With repo link" value={withRepo} />
              <CvStat />
            </div>
            {stackCounts.length > 0 && (
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tech-stack distribution
                </div>
                <div className="space-y-1.5">
                  {stackCounts.slice(0, 8).map(([tag, count]) => (
                    <div key={tag} className="flex items-center gap-3">
                      <div className="w-32 truncate font-mono text-xs">{tag}</div>
                      <div className="h-2 flex-1 overflow-hidden rounded bg-surface/40">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <div className="w-6 text-right font-mono text-[10px] text-muted-foreground">
                        {count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display">Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input
                value={draft.profile.name}
                onChange={(e) => setDraft({ ...draft, profile: { ...draft.profile, name: e.target.value } })}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={draft.profile.email}
                onChange={(e) => setDraft({ ...draft, profile: { ...draft.profile, email: e.target.value } })}
              />
            </Field>
            <Field label="Professional title" className="sm:col-span-2">
              <Input
                value={draft.profile.title}
                onChange={(e) => setDraft({ ...draft, profile: { ...draft.profile, title: e.target.value } })}
              />
            </Field>
            <Field label="Summary" className="sm:col-span-2">
              <Textarea
                rows={4}
                value={draft.profile.summary}
                onChange={(e) => setDraft({ ...draft, profile: { ...draft.profile, summary: e.target.value } })}
              />
            </Field>
            <Field label="LinkedIn URL">
              <Input
                value={draft.profile.linkedin}
                onChange={(e) => setDraft({ ...draft, profile: { ...draft.profile, linkedin: e.target.value } })}
              />
            </Field>
            <Field label="GitHub URL">
              <Input
                value={draft.profile.github}
                onChange={(e) => setDraft({ ...draft, profile: { ...draft.profile, github: e.target.value } })}
              />
            </Field>
          </CardContent>
        </Card>

        {/* Metadata (hero + contact headings) */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display">Hero & contact copy</CardTitle>
            <p className="text-xs text-muted-foreground">
              The animated headline on the landing hero and the section title on the contact panel.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Field label="Hero line 1">
              <Input
                value={draft.heroHeadline}
                onChange={(e) => setDraft({ ...draft, heroHeadline: e.target.value })}
              />
            </Field>
            <Field label="Hero accent (gradient)">
              <Input
                value={draft.heroAccent}
                onChange={(e) => setDraft({ ...draft, heroAccent: e.target.value })}
              />
            </Field>
            <Field label="Hero line 3">
              <Input
                value={draft.heroTail}
                onChange={(e) => setDraft({ ...draft, heroTail: e.target.value })}
              />
            </Field>
            <Field label="Contact section heading" className="sm:col-span-3">
              <Input
                value={draft.contactHeading}
                onChange={(e) => setDraft({ ...draft, contactHeading: e.target.value })}
              />
            </Field>
          </CardContent>
        </Card>

        {/* CV */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <FileText className="h-4 w-4" /> CV / Resume
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Upload a PDF (session only — active until reload) or paste a hosted URL for a
              permanent link. Uploaded PDFs override the URL while attached.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="PDF upload (session only)" className="sm:col-span-2">
              <CvPdfUpload />
            </Field>
            <Field label="CV URL (permanent)" className="sm:col-span-2">
              <Input
                placeholder="https://.../resume.pdf"
                value={draft.cvUrl}
                onChange={(e) => setDraft({ ...draft, cvUrl: e.target.value })}
              />
            </Field>
            <Field label="Display filename">
              <Input
                placeholder="resume.pdf"
                value={draft.cvFilename ?? ""}
                onChange={(e) => setDraft({ ...draft, cvFilename: e.target.value || null })}
              />
            </Field>
          </CardContent>
        </Card>

        {/* Skills CRUD */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display flex items-center gap-2">
                <Layers className="h-4 w-4" /> Core competencies
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Manage skill groups and their badges — click any badge on the public site to filter projects.
              </p>
            </div>
            <Button size="sm" onClick={addSkillGroup}>
              <Plus className="h-3.5 w-3.5" /> Add group
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {draft.skillGroups.map((g) => (
              <div key={g.id} className="rounded-lg border border-border bg-surface/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {g.id}
                  </div>
                  <button
                    onClick={() => deleteSkillGroup(g.id)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Group label">
                    <Input value={g.label} onChange={(e) => updateSkillGroup(g.id, { label: e.target.value })} />
                  </Field>
                  <Field label="Icon">
                    <select
                      value={g.icon}
                      onChange={(e) => updateSkillGroup(g.id, { icon: e.target.value as SkillGroup["icon"] })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="code">Code</option>
                      <option value="boxes">Boxes</option>
                      <option value="database">Database</option>
                      <option value="wrench">Wrench</option>
                    </select>
                  </Field>
                  <Field label="Skills (comma separated)" className="sm:col-span-2">
                    <Textarea
                      rows={2}
                      value={g.items.join(", ")}
                      onChange={(e) =>
                        updateSkillGroup(g.id, {
                          items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
            {draft.skillGroups.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No skill groups — click "Add group".
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline CRUD */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Experience & education
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Manage career, certifications, and academic entries shown on the timeline.
              </p>
            </div>
            <Button size="sm" onClick={addTimeline}>
              <Plus className="h-3.5 w-3.5" /> Add entry
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {draft.timeline.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-surface/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t.id}
                  </div>
                  <button
                    onClick={() => deleteTimeline(t.id)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Year / range">
                    <Input value={t.year} onChange={(e) => updateTimeline(t.id, { year: e.target.value })} />
                  </Field>
                  <Field label="Kind">
                    <select
                      value={t.kind}
                      onChange={(e) => updateTimeline(t.id, { kind: e.target.value as TimelineEntry["kind"] })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="work">Work</option>
                      <option value="cert">Certification</option>
                      <option value="edu">Education</option>
                    </select>
                  </Field>
                  <Field label="Title" className="sm:col-span-2">
                    <Input value={t.title} onChange={(e) => updateTimeline(t.id, { title: e.target.value })} />
                  </Field>
                  <Field label="Organization" className="sm:col-span-2">
                    <Input value={t.org} onChange={(e) => updateTimeline(t.id, { org: e.target.value })} />
                  </Field>
                  <Field label="Details" className="sm:col-span-2">
                    <Textarea
                      rows={3}
                      value={t.detail}
                      onChange={(e) => updateTimeline(t.id, { detail: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            ))}
            {draft.timeline.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No entries — click "Add entry".
              </div>
            )}
          </CardContent>
        </Card>


        {/* Projects CRUD */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Projects</CardTitle>
              <p className="text-xs text-muted-foreground">
                Full CRUD — video accepts a URL only (YouTube, Vimeo, or direct MP4).
              </p>
            </div>
            <Button size="sm" onClick={addProject}>
              <Plus className="h-3.5 w-3.5" /> Add project
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {draft.projects.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-surface/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.id}
                  </div>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Title" className="sm:col-span-2">
                    <Input value={p.title} onChange={(e) => updateProject(p.id, { title: e.target.value })} />
                  </Field>
                  <Field label="Repository URL">
                    <Input value={p.repo} onChange={(e) => updateProject(p.id, { repo: e.target.value })} />
                  </Field>
                  <Field label="Video URL">
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      value={p.videoUrl}
                      onChange={(e) => updateProject(p.id, { videoUrl: e.target.value })}
                    />
                  </Field>
                  <Field label="Or upload local video (.mp4 / .webm)">
                    <VideoUpload projectId={p.id} />
                  </Field>
                  <Field label="Architecture note" className="sm:col-span-2">
                    <Input
                      value={p.architecture}
                      onChange={(e) => updateProject(p.id, { architecture: e.target.value })}
                    />
                  </Field>
                  <Field label="Summary" className="sm:col-span-2">
                    <Textarea
                      rows={3}
                      value={p.summary}
                      onChange={(e) => updateProject(p.id, { summary: e.target.value })}
                    />
                  </Field>
                  <Field label="Tech stack (comma separated)">
                    <Input
                      value={p.stack.join(", ")}
                      onChange={(e) =>
                        updateProject(p.id, {
                          stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                    />
                  </Field>
                  <Field label="Architecture flow (one step per line)">
                    <Textarea
                      rows={3}
                      value={p.flow.join("\n")}
                      onChange={(e) =>
                        updateProject(p.id, {
                          flow: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
            {draft.projects.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No projects — click "Add project" to create one.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save}>
            <Save className="h-4 w-4" /> Save all changes
          </Button>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function CvStat() {
  const [tel, setTel] = useState<CvTelemetry>(() => getCvTelemetry());
  useEffect(() => {
    const sync = () => setTel(getCvTelemetry());
    window.addEventListener("cv:telemetry", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cv:telemetry", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary">
        <Download className="h-3 w-3" /> CV downloads
      </div>
      <div className="mt-1 font-display text-2xl font-bold">{tel.total}</div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}

function VideoUpload({ projectId }: { projectId: string }) {
  const [attached, setAttached] = useState<string | null>(() => getProjectBlobUrl(projectId) ?? null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/\.(mp4|webm)$/i.test(file.name) && !/^video\/(mp4|webm)$/.test(file.type)) {
      Swal.fire({ ...swalTheme(), title: "Unsupported format", text: "Please choose an .mp4 or .webm file.", icon: "error" });
      return;
    }
    const url = setProjectBlobUrl(projectId, file);
    setAttached(url);
    Swal.fire({
      ...swalTheme(),
      title: "Video attached",
      text: `${file.name} is now playing on this project card (session only).`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const clear = () => {
    clearProjectBlobUrl(projectId);
    setAttached(null);
    Swal.fire({ ...swalTheme(), title: "Local video cleared", icon: "info", timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="cursor-pointer">
        <input type="file" accept="video/mp4,video/webm,.mp4,.webm" className="hidden" onChange={onFile} />
        <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
          <Upload className="h-3 w-3" /> Choose file
        </span>
      </label>
      {attached && (
        <>
          <span className="font-mono text-[10px] text-muted-foreground">Local clip attached (session only)</span>
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">
            Clear
          </button>
        </>
      )}
      {!attached && (
        <span className="font-mono text-[10px] text-muted-foreground">
          Not stored in localStorage — resets on reload
        </span>
      )}
    </div>
  );
}

function CvPdfUpload() {
  const [state, setState] = useState(() => getCvBlob());
  useEffect(() => {
    const sync = () => setState(getCvBlob());
    window.addEventListener(CV_BLOB_EVENT, sync);
    return () => window.removeEventListener(CV_BLOB_EVENT, sync);
  }, []);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      Swal.fire({ ...swalTheme(), title: "PDF required", text: "Please select a .pdf file.", icon: "error" });
      return;
    }
    const { name } = setCvBlob(file);
    Swal.fire({
      ...swalTheme(),
      title: "Resume refreshed",
      text: `${name} is now the active download (session only).`,
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
    });
  };

  const clear = () => {
    clearCvBlob();
    Swal.fire({ ...swalTheme(), title: "Uploaded PDF cleared", icon: "info", timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="cursor-pointer">
        <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={onFile} />
        <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
          <Upload className="h-3 w-3" /> Choose PDF
        </span>
      </label>
      {state.url ? (
        <>
          <span className="font-mono text-[10px] text-muted-foreground">Active: {state.name}</span>
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">
            Clear
          </button>
        </>
      ) : (
        <span className="font-mono text-[10px] text-muted-foreground">
          No PDF attached — public button uses the CV URL below.
        </span>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

export type ProjectMedia = {
  videoUrl: string;
  summary: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  architecture: string;
  stack: string[];
  repo: string;
  flow: string[];
  videoUrl: string;
};

export type SkillGroup = {
  id: string;
  label: string;
  icon: "code" | "boxes" | "database" | "wrench";
  items: string[];
};

export type TimelineEntry = {
  id: string;
  year: string;
  title: string;
  org: string;
  detail: string;
  kind: "work" | "cert" | "edu";
};

export type PortfolioData = {
  profile: {
    name: string;
    title: string;
    summary: string;
    email: string;
    linkedin: string;
    github: string;
  };
  heroHeadline: string;
  heroAccent: string;
  heroTail: string;
  contactHeading: string;
  projects: Project[];
  skillGroups: SkillGroup[];
  timeline: TimelineEntry[];
  cvUrl: string;
  cvFilename: string | null;
};

export const PROJECT_IDS = ["employee-management", "store-mvcsn", "url-shortener"] as const;
export type ProjectId = (typeof PROJECT_IDS)[number];

const defaultProjects: Project[] = [
  {
    id: "employee-management",
    title: "Employee Management System",
    summary:
      "Enterprise MERN/MEAN platform managing corporate headcount, attendance metrics, cascade removals, timezone-safe logs, and automated payroll reporting.",
    architecture:
      "Full-stack — Modular services, cascade-safe writes, timezone-aware logging, payroll pipeline",
    stack: ["Node.js", "Express", "MongoDB", "Mongoose", "Angular"],
    repo: "https://github.com/YousefMohamedMareiMahmoudMadin/Employee_Management_System",
    flow: [
      "Angular Frontend",
      "Express Middleware (JWT / Timezone Check)",
      "Mongoose Cascade Pre-hooks",
      "MongoDB (Indexed Collections)",
      "Payroll Reporting Job",
    ],
    videoUrl: "",
  },
  {
    id: "store-mvcsn",
    title: "Store MvcSn — Enterprise E-commerce",
    summary:
      "E-commerce platform built on the Microsoft .NET MVC pattern with robust database tracking, secure payment pipelines, and backend inventory management.",
    architecture:
      ".NET MVC — Layered architecture, transactional inventory, secure checkout flow",
    stack: [".NET Core", "C#", "MVC", "SQL Server", "Entity Framework"],
    repo: "https://github.com/YousefMohamedMareiMahmoudMadin/Store_MvcSn",
    flow: [
      "Razor Views (MVC)",
      "Controllers + Model Binding",
      "Service Layer (Auth, Cart, Payment)",
      "Entity Framework (Unit of Work)",
      "SQL Server (Transactional)",
    ],
    videoUrl: "",
  },
  {
    id: "url-shortener",
    title: "URL Shortener — Full-Stack",
    summary:
      "Optimized utility for compressing corporate links, tracking click-through analytics, and managing swift server-side redirection.",
    architecture: "Full-stack — Hashing strategy, click telemetry, low-latency redirects",
    stack: ["Node.js", "Express", "MongoDB", "TypeScript", "REST API"],
    repo: "https://github.com/YousefMohamedMareiMahmoudMadin/URL-Shortener-Full-Stack",
    flow: [
      "React Client",
      "Express REST API",
      "Hash / Collision Resolver",
      "MongoDB (Short-code Index)",
      "301 Redirect + Analytics Log",
    ],
    videoUrl: "",
  },
];

const defaultSkillGroups: SkillGroup[] = [
  { id: "lang", label: "Languages", icon: "code", items: ["C#", "JavaScript", "TypeScript", "SQL", "Bash"] },
  {
    id: "backend",
    label: "Backend Frameworks",
    icon: "boxes",
    items: ["Node.js", "Express", ".NET Core", "Angular", "React", "Next.js"],
  },
  {
    id: "db",
    label: "Database Systems",
    icon: "database",
    items: ["MongoDB", "Mongoose", "SQL Server", "PostgreSQL", "Redis"],
  },
  {
    id: "devops",
    label: "DevOps & Infrastructure",
    icon: "wrench",
    items: ["REST APIs", "GraphQL", "Git", "Docker", "OAuth / JWT", "CI/CD"],
  },
];

const defaultTimeline: TimelineEntry[] = [
  {
    id: "t1",
    year: "2023 — Present",
    title: "Principal Backend Engineer",
    org: "Meridian Systems",
    detail:
      "Lead architecture for a distributed analytics platform handling 12M+ daily events. Introduced event sourcing and CQRS patterns; reduced p99 latency by 62%.",
    kind: "work",
  },
  {
    id: "t2",
    year: "2020 — 2023",
    title: "Senior Full-Stack Engineer",
    org: "Northwind Digital",
    detail:
      "Modernized a legacy .NET Framework monolith into modular .NET 8 services. Owned identity, billing, and reporting domains across Angular and React clients.",
    kind: "work",
  },
  {
    id: "t3",
    year: "2018 — 2020",
    title: "Software Engineer, Node.js",
    org: "Atlas Labs",
    detail:
      "Built the MERN stack platform behind a fintech onboarding suite; implemented SOC 2 controls and hardened the API surface.",
    kind: "work",
  },
  {
    id: "t4",
    year: "2019",
    title: "Microsoft Certified: Azure Solutions Architect Expert",
    org: "Microsoft",
    detail: "Deep specialization in distributed systems, identity, and secure cloud workloads.",
    kind: "cert",
  },
  {
    id: "t5",
    year: "2014 — 2018",
    title: "B.Sc. Computer Science",
    org: "University of Toronto",
    detail:
      "Focus on distributed systems, database theory, and compilers. Graduated with high distinction.",
    kind: "edu",
  },
];

export const defaultData: PortfolioData = {
  profile: {
    name: "Yousef Mohamed",
    title: "Software Engineer | Node.js & .NET Developer | Full-Stack Web Applications",
    summary:
      "I design and ship enterprise-grade platforms across the Node.js (MEAN/MERN) and Microsoft .NET ecosystems — with a focus on database performance, distributed architecture, and maintainable code that outlives the sprint that shipped it.",
    email: "hello@example.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com/YousefMohamedMareiMahmoudMadin",
  },
  heroHeadline: "Building resilient",
  heroAccent: "backend systems",
  heroTail: "that scale gracefully.",
  contactHeading: "Let's build something durable.",
  projects: defaultProjects,
  skillGroups: defaultSkillGroups,
  timeline: defaultTimeline,
  cvUrl: "",
  cvFilename: null,
};

const KEY = "portfolio.data.v2";
const LEGACY_KEYS = ["portfolio.data.v1"];

export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (err) {
    try {
      for (const k of LEGACY_KEYS) window.localStorage.removeItem(k);
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      import("sweetalert2").then(({ default: Swal }) => {
        Swal.fire({
          title: "Storage limit reached",
          text: "Browser localStorage quota exceeded. Please use hosted URLs for large files.",
          icon: "error",
          confirmButtonText: "Understood",
        });
      });
      console.error("localStorage quota exceeded:", err);
      return false;
    }
  }
}

function readStorage(): PortfolioData {
  if (typeof window === "undefined") return defaultData;
  for (const k of LEGACY_KEYS) {
    try {
      window.localStorage.removeItem(k);
    } catch {}
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return {
      ...defaultData,
      ...parsed,
      profile: { ...defaultData.profile, ...(parsed.profile ?? {}) },
      projects:
        Array.isArray(parsed.projects) && parsed.projects.length > 0
          ? parsed.projects
          : defaultData.projects,
      skillGroups:
        Array.isArray(parsed.skillGroups) && parsed.skillGroups.length > 0
          ? parsed.skillGroups
          : defaultData.skillGroups,
      timeline:
        Array.isArray(parsed.timeline) && parsed.timeline.length > 0
          ? parsed.timeline
          : defaultData.timeline,
      cvUrl: typeof parsed.cvUrl === "string" ? parsed.cvUrl : "",
      cvFilename: parsed.cvFilename ?? null,
    };
  } catch {
    return defaultData;
  }
}

export function writeStorage(data: PortfolioData): boolean {
  if (typeof window === "undefined") return false;
  const ok = safeSetItem(KEY, JSON.stringify(data));
  if (ok) window.dispatchEvent(new CustomEvent("portfolio:update"));
  return ok;
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(readStorage());
    setHydrated(true);
    const handler = () => setData(readStorage());
    window.addEventListener("portfolio:update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("portfolio:update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    data,
    hydrated,
    setData: (d: PortfolioData) => {
      if (writeStorage(d)) setData(d);
    },
  };
}

export const ADMIN_PASSWORD_KEY = "portfolio.admin.session.v1";
export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "Ghtr123!@!@";

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
  startDate: string;
  endDate: string;
  title: string;
  org: string;
  detail: string;
  kind: "work" | "cert" | "edu";
  type: "Job" | "Training" | "Certificate" | "Education";
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

export const PROJECT_IDS = ["employee-management", "store-mvcsn", "url-shortener", "educational-center"] as const;
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
    videoUrl: "https://res.cloudinary.com/zeoypfid/video/upload/v1783311125/EMS_sucgbl.mp4",
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
    videoUrl: "https://res.cloudinary.com/zeoypfid/video/upload/v1783310599/store_fxsvnp.mp4",
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
    videoUrl: "https://res.cloudinary.com/zeoypfid/video/upload/v1783309477/url_shortner_mx9quu.mp4",
  },
  {
    id: "educational-center",
    title: "Educational Center Platform",
    summary:
      "Full-featured web application built using ASP.NET Core Razor Pages, designed to manage academic operations, student tracking, and lesson planning efficiently.",
    architecture: "Razor Pages — PageModel encapsulation, centralized database state, secure administrative dashboard",
    stack: ["ASP.NET Core", "C#", "Razor Pages", "SQL Server", "Entity Framework"],
    repo: "https://github.com/YousefMohamedMareiMahmoudMadin",
    flow: [
      "Razor Pages UI",
      "PageModel Handlers",
      "Centralized Operations Service",
      "Entity Framework Core Context",
      "SQL Server Relations",
    ],
    videoUrl: "https://res.cloudinary.com/zeoypfid/video/upload/v1783311220/courses_tekfem.mp4",
  },
];

const defaultSkillGroups: SkillGroup[] = [
  { id: "lang", label: "Languages", icon: "code", items: ["C#", "JavaScript", "TypeScript", "SQL", "Bash"] },
  {
    id: "backend",
    label: "Backend Frameworks",
    icon: "boxes",
    items: ["Node.js", "Express", ".NET Core", "Angular", "Linq", "React", "Entity Framework"],
  },
  {
    id: "db",
    label: "Database Systems",
    icon: "database",
    items: ["MongoDB", "Mongoose", "SQL Server", "My Sql", "Redis"],
  },
  {
    id: "devops",
    label: "DevOps & Infrastructure",
    icon: "wrench",
    items: ["REST APIs", "Git", "Docker", "OAuth / JWT", "Clean Architecture", "Microservices", "CI/CD", "CQRS"],
  },
];

const defaultTimeline: TimelineEntry[] = [
  {
    id: "t1",
    year: "2026",
    startDate: "03/2026",
    endDate: "05/2026",
    title: "Backend Developer Intern",
    org: "Syntecxhub",
    kind: "work",
    type: "Job",
    detail: "Engineered scalable RESTful APIs leveraging .NET Core ecosystems. Specialized in implementing robust backend patterns including server-side pagination, dynamic sorting, and multi-field filtering algorithms to optimize data retrieval pipelines. Architected secure authentication infrastructure utilizing JWT token validation, refresh tokens, stateful login/register workflows, and role-based access controls to safeguard data integrity and system scalability.",
  },
  {
    id: "t2",
    year: "2026",
    startDate: "07/2026",
    endDate: "08/2026",
    title: "Mean Stack Trainee",
    org: "National Telecommunication Institute (NTI)",
    kind: "work",
    type: "Training",
    detail: "Immersed in an intensive enterprise-grade training focusing on full-stack Javascript architecture using the MEAN/MERN stack. Built responsive data tables powered by Node.js and Angular/React, utilizing TypeScript for type-safe components. Developed advanced filtering, custom sorting, and complex CRUD operations coupled with granular authorization systems, secure privilege checking, and high-performance MongoDB schema indexing.",
  },
  {
    id: "t3",
    year: "2024 — 2026",
    startDate: "10/2024",
    endDate: "03/2026",
    title: "Backend Mastery & Distributed Systems Course",
    org: "Catalyst AI (Eng. Abdullah Hatem)",
    kind: "cert",
    type: "Certificate",
    detail: "A comprehensive deep-dive into lower-level system engineering and production-grade software architectures. Mastered system design principles for distributed computing, microservices decoupling, and high-availability networks. Engineered optimized backend microservices utilizing Node.js, applied advanced data structures for memory efficiency, managed custom operating system interactions, and established production-ready code quality frameworks with automated testing strategies.",
  },
  {
    id: "t4",
    year: "2025 — 2026",
    startDate: "02/2025",
    endDate: "06/2026",
    title: "Full-Stack .NET Developer Diploma",
    org: "IT Legend (Eng. Ali Shahin)",
    kind: "cert",
    type: "Certificate",
    detail: "An elite, project-driven specialization tracking modern enterprise application engineering. Mastered database design paradigms, transactional entity modeling, ASP.NET Core MVC, and Clean Architecture patterns. Scaled monolithic monoliths into distributed microservices architectures, implemented secure integrated payment pipelines, and gained expert capabilities in System Analysis—bridging client requirements into robust technological blueprints.",
  },
  {
    id: "t5",
    year: "2023 — 2027",
    startDate: "09/2023",
    endDate: "07/2027",
    title: "Bachelor of Computer Science",
    org: "Faculty of Computers and Information",
    kind: "edu",
    type: "Education",
    detail: "Formal academic foundation focusing heavily on software engineering methodologies, advanced algorithms, compiler design, data communication networks, cryptography, and application security principles. Bridge technical theory with real-world application paradigms across distributed systems.",
  },
];

export const defaultData: PortfolioData = {
  profile: {
    name: "Yousef Mohamed Marei Mahmoud",
    title: "Software Engineer | Node.js & .NET Developer | Full-Stack Web Applications",
    summary:
      "I am a results-driven Full-Stack Software Engineer specialized in structural architecture, database efficiency, and enterprise scalability across .NET and MEAN/MERN ecosystems. Bridging the gap between fluid, responsive user interfaces and highly performant backend systems, I engineer maintainable architectures built for long-term growth. My core expertise centers on designing scalable RESTful APIs, implementing robust security protocols, and managing optimized transactional data storage under high-concurrency loads.",
    email: "yousefmohamedmarei@gmail.com",
    linkedin: "https://www.linkedin.com/in/yousef-mohamed-4668173a7?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/YousefMohamedMareiMahmoudMadin",
  },
  heroHeadline: "Hi, I'm Yousef Mohamed",
  heroAccent: "Backend Architect",
  heroTail: "building resilient systems.",
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
export const ADMIN_EMAIL = "admin@protoflio.com";
export const ADMIN_PASSWORD = "Ghtr123!@!@";
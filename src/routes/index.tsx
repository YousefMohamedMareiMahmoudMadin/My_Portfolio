import { createFileRoute } from "@tanstack/react-router";
import { SideNav } from "@/components/portfolio/SideNav";
import { Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { Timeline } from "@/components/portfolio/Timeline";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SideNav />
      <main className="min-w-0 pt-14 lg:pl-64 lg:pt-0">
        <Hero />
        <Projects />
        <Skills />
        <Timeline />
        <Contact />
      </main>
    </div>
  );
}

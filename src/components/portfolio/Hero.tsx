import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-store";
import { trackCvDownload } from "@/lib/cv-telemetry";
import { getCvBlob, CV_BLOB_EVENT } from "@/lib/cv-blob-store";

function useCv() {
  const { data } = usePortfolioData();
  const [blob, setBlob] = useState(() => getCvBlob());
  useEffect(() => {
    const sync = () => setBlob(getCvBlob());
    window.addEventListener(CV_BLOB_EVENT, sync);
    return () => window.removeEventListener(CV_BLOB_EVENT, sync);
  }, []);
  const url = blob.url || data.cvUrl;
  const name = blob.name || data.cvFilename;
  return { url, name };
}

export function Hero() {
  const { data } = usePortfolioData();
  const cv = useCv();

  return (
    <section id="home" className="relative flex min-h-screen items-center px-6 py-24 lg:px-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="truncate">{data.profile.title}</span>
        </div>

        <h1 className="font-display text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl max-w-4xl">
          {data.heroHeadline} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">| {data.heroAccent}</span>
        </h1>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {data.profile.summary}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="lg" asChild>
            <a href="#projects">
              View selected work <ArrowUpRight />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild={!!cv.url}
            disabled={!cv.url}
            title={cv.url ? "Download Technical Resume" : "CV not set — upload in /admin"}
          >
            {cv.url ? (
              <a
                href={cv.url}
                target="_blank"
                rel="noreferrer"
                download={cv.name ?? undefined}
                onClick={() => trackCvDownload()}
              >
                <Download /> Download Technical Resume
              </a>
            ) : (
              <span>
                <Download /> Download Technical Resume
              </span>
            )}
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
          {[
            { k: "1+", v: "Years shipping" },
            { k: "5+", v: "Production systems" },
            { k: "12M", v: "Requests/month handled" },
            { k: "99.98%", v: "Avg. uptime" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-3xl font-bold text-foreground">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const KEY = "portfolio.cv.telemetry.v1";

export type CvTelemetry = {
  total: number;
  events: number[]; // epoch ms
};

function read(): CvTelemetry {
  if (typeof window === "undefined") return { total: 0, events: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { total: 0, events: [] };
    const p = JSON.parse(raw) as CvTelemetry;
    return { total: p.total ?? 0, events: Array.isArray(p.events) ? p.events.slice(-200) : [] };
  } catch {
    return { total: 0, events: [] };
  }
}

export function getCvTelemetry(): CvTelemetry {
  return read();
}

export function trackCvDownload() {
  if (typeof window === "undefined") return;
  const cur = read();
  const next: CvTelemetry = {
    total: cur.total + 1,
    events: [...cur.events, Date.now()].slice(-200),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("cv:telemetry"));
  } catch {}
}

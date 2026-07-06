// Runtime-only blob URL store for uploaded video files.
// Never persisted (avoids localStorage quota exhaustion). Cleared on reload.

const blobUrls = new Map<string, string>();
const EVENT = "portfolio:blob-update";

export function setProjectBlobUrl(projectId: string, file: File): string {
  const existing = blobUrls.get(projectId);
  if (existing) URL.revokeObjectURL(existing);
  const url = URL.createObjectURL(file);
  blobUrls.set(projectId, url);
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT));
  return url;
}

export function clearProjectBlobUrl(projectId: string) {
  const existing = blobUrls.get(projectId);
  if (existing) {
    URL.revokeObjectURL(existing);
    blobUrls.delete(projectId);
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT));
  }
}

export function getProjectBlobUrl(projectId: string): string | undefined {
  return blobUrls.get(projectId);
}

export const BLOB_EVENT = EVENT;

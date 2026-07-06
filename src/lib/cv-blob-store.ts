// Session-only CV blob store — PDF files stay in memory, never localStorage.
export const CV_BLOB_EVENT = "cv-blob:update";

let currentUrl: string | null = null;
let currentName: string | null = null;

export function setCvBlob(file: File): { url: string; name: string } {
  if (currentUrl) {
    try {
      URL.revokeObjectURL(currentUrl);
    } catch {}
  }
  currentUrl = URL.createObjectURL(file);
  currentName = file.name;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CV_BLOB_EVENT));
  }
  return { url: currentUrl, name: currentName };
}

export function clearCvBlob() {
  if (currentUrl) {
    try {
      URL.revokeObjectURL(currentUrl);
    } catch {}
  }
  currentUrl = null;
  currentName = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CV_BLOB_EVENT));
  }
}

export function getCvBlob(): { url: string | null; name: string | null } {
  return { url: currentUrl, name: currentName };
}

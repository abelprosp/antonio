"use client";

const IFRAME_URLS_KEY = "iframe_urls";

export type IframeUrls = {
  dashboard: string;
  bluemilk: string;
  hm: string;
};

const defaultUrls: IframeUrls = {
  dashboard: "",
  bluemilk: "",
  hm: "",
};

export function getIframeUrls(): IframeUrls {
  if (typeof window === "undefined") return defaultUrls;

  try {
    const stored = localStorage.getItem(IFRAME_URLS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<IframeUrls>;
      return { ...defaultUrls, ...parsed };
    }
  } catch (error) {
    console.error("Error reading iframe URLs from localStorage:", error);
  }

  return defaultUrls;
}

export function setIframeUrls(urls: Partial<IframeUrls>): void {
  if (typeof window === "undefined") return;

  try {
    const current = getIframeUrls();
    const updated = { ...current, ...urls };
    localStorage.setItem(IFRAME_URLS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving iframe URLs to localStorage:", error);
  }
}

export function getIframeUrl(page: keyof IframeUrls): string {
  const urls = getIframeUrls();
  return urls[page] || "";
}


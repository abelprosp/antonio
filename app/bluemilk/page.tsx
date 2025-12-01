"use client";

import { useEffect, useState } from "react";
import { getIframeUrl } from "../../utils/iframeUrls";

export default function BlueMilkPage() {
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    setIframeUrl(getIframeUrl("bluemilk"));
    
    const handleStorageChange = () => {
      setIframeUrl(getIframeUrl("bluemilk"));
    };
    window.addEventListener("storage", handleStorageChange);
    
    const interval = setInterval(() => {
      const current = getIframeUrl("bluemilk");
      if (current !== iframeUrl) {
        setIframeUrl(current);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [iframeUrl]);

  return (
    <section className="page-hero full-bleed">
      <div className="page-hero-inner mx-auto max-w-5xl space-y-4 px-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight drop-shadow-sm" style={{ color: "var(--page-title-text)" }}>
            IA BlueMilk
          </h1>
        </div>

        <div className="iframe-container bg-white/92">
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              className="w-full h-full min-h-[600px] border-0 rounded-xl"
              title="IA BlueMilk"
              allow="fullscreen"
            />
          ) : (
            <div className="flex h-[600px] items-center justify-center text-gray-400">
              <p>Configure a URL do iframe nas Configurações</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

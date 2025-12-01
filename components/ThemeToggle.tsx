"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const THEME_COOKIE = "theme";

const getStoredTheme = (): Theme | null => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${THEME_COOKIE}=`));
  if (cookie) {
    const value = cookie.split("=")[1] as Theme;
    if (value === "dark" || value === "light") return value;
  }
  return null;
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.remove("theme-dark", "theme-light");
  document.documentElement.classList.add(`theme-${theme}`);
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = getStoredTheme();
    const prefersDark =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(prefersDark);
    applyTheme(prefersDark);
  }, []);

  const handleToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
        isDark
          ? "border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:text-white"
          : "border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400 hover:text-gray-900"
      }`}
      aria-label={`Ativar modo ${isDark ? "claro" : "escuro"}`}
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95 5.636 18.364M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}

// Theme utilities for notification management
export type Theme = "light" | "dark" | "auto";

export const THEME_STORAGE_KEY = "notification-theme";

export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "dark";
};

export const getActiveTheme = (theme: Theme): "light" | "dark" => {
  if (theme === "auto") {
    return getSystemTheme();
  }
  return theme;
};

export const setTheme = (theme: Theme) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const activeTheme = getActiveTheme(theme);
    const html = document.documentElement;

    if (activeTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }
};

export const getStoredTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    return stored || "auto";
  }
  return "auto";
};

export const initializeTheme = () => {
  const stored = getStoredTheme();
  setTheme(stored);
};

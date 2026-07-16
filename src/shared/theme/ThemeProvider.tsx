"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  colors: ThemeColors;
}

interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  success: string;
  successSubtle: string;
  error: string;
  errorSubtle: string;
  warning: string;
  warningSubtle: string;
  info: string;
  infoSubtle: string;
}

const lightColors: ThemeColors = {
  primary: "#2563eb",
  primaryHover: "#1e3d6f",
  secondary: "#7c3aed",
  success: "#22c55e",
  successSubtle: "#dcfce7",
  error: "#ef4444",
  errorSubtle: "#fef2f2",
  warning: "#f97316",
  warningSubtle: "#ffedd5",
  info: "#0ea5e9",
  infoSubtle: "#e0f2fe",
};

const darkColors: ThemeColors = {
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  secondary: "#a78bfa",
  success: "#4ade80",
  successSubtle: "#14532d",
  error: "#f87171",
  errorSubtle: "#7f1d1d",
  warning: "#fb923c",
  warningSubtle: "#7c2d12",
  info: "#38bdf8",
  infoSubtle: "#0c4a6e",
};

const createAppTheme = (mode: "light" | "dark") => {
  const colors = mode === "dark" ? darkColors : lightColors;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: mode === "dark" ? "#60a5fa" : "#3b82f6",
        dark: mode === "dark" ? "#1e3d6f" : "#1d4ed8",
        contrastText: "#ffffff",
      },
      secondary: {
        main: colors.secondary,
        light: "#a78bfa",
        dark: "#5b21b6",
        contrastText: "#ffffff",
      },
      error: {
        main: colors.error,
        light: "#fca5a5",
        dark: "#b91c1c",
      },
      warning: {
        main: colors.warning,
        light: "#fdba74",
        dark: "#c2410c",
      },
      info: {
        main: colors.info,
        light: "#7dd3fc",
        dark: "#0369a1",
      },
      success: {
        main: colors.success,
        light: "#86efac",
        dark: "#15803d",
      },
      background: {
        default: mode === "dark" ? "#0f172a" : "#f8fafc",
        paper: mode === "dark" ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#f1f5f9" : "#0f172a",
        secondary: mode === "dark" ? "#94a3b8" : "#64748b",
      },
      divider: mode === "dark" ? "#334155" : "#e2e8f0",
    },
    typography: {
      fontFamily: '"Inter", "Geist", system-ui, -apple-system, sans-serif',
      h1: { fontWeight: 700, letterSpacing: "-0.025em" },
      h2: { fontWeight: 700, letterSpacing: "-0.025em" },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: "none" },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor: mode === "dark" ? "#475569 #1e293b" : "#cbd5e1 #f1f5f9",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
          contained: {
            "&:hover": {
              boxShadow: `0 4px 12px ${colors.primary}40`,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              "& fieldset": {
                borderColor: mode === "dark" ? "#475569" : "#cbd5e1",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#64748b" : "#94a3b8",
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.primary,
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === "dark"
              ? "0 1px 3px 0 rgb(0 0 0 / 0.3)"
              : "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 6,
            fontSize: "0.75rem",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "&:hover": {
              backgroundColor: mode === "dark"
                ? "rgba(59, 130, 246, 0.1)"
                : "rgba(37, 99, 235, 0.08)",
            },
          },
        },
      },
    },
  });
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "app-theme-mode";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Initialization from localStorage requires setState in effect for SSR compatibility
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initialMode = stored || "system";
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const resolved = initialMode === "system"
      ? (mediaQuery.matches ? "dark" : "light")
      : initialMode;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModeState(initialMode);
    setResolvedMode(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateResolvedMode = () => {
      const resolved = mode === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : mode;
      setResolvedMode(resolved);

      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.setAttribute("data-theme-transition", "true");
      setTimeout(() => {
        document.documentElement.removeAttribute("data-theme-transition");
      }, 300);
    };

    updateResolvedMode();

    mediaQuery.addEventListener("change", updateResolvedMode);
    return () => mediaQuery.removeEventListener("change", updateResolvedMode);
  }, [mode, mounted]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const toggleMode = useCallback(() => {
    const nextMode = resolvedMode === "light" ? "dark" : "light";
    setMode(nextMode);
  }, [resolvedMode, setMode]);

  const colors = resolvedMode === "dark" ? darkColors : lightColors;

  const value: ThemeContextValue = {
    mode,
    resolvedMode,
    setMode,
    toggleMode,
    colors,
  };

  const theme = createAppTheme(resolvedMode);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

const defaultThemeValue: ThemeContextValue = {
  mode: "system",
  resolvedMode: "light",
  setMode: () => {},
  toggleMode: () => {},
  colors: lightColors,
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultThemeValue;
  }
  return context;
}

// ============================================================
// MUI THEME — Design tokens from SCSS variables
// ============================================================
"use client";

import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#2a5bc0",
      light: "#5a8fe8",
      dark: "#1a335c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7a52cc",
      light: "#b393eb",
      dark: "#5f3fa8",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d13b3b",
      light: "#ed7872",
      dark: "#852525",
    },
    warning: {
      main: "#e89b33",
    },
    info: {
      main: "#40b8d4",
    },
    success: {
      main: "#1dab60",
      light: "#5dd98f",
      dark: "#146c3c",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    divider: "#e5e7eb",
  },
  typography: {
    fontFamily: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: "-0.025em",
    },
    h3: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.375 },
    h4: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.375 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "10px 20px",
          fontWeight: 600,
          fontSize: "0.9375rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          "&:hover": { boxShadow: "0 6px 20px rgba(42,91,192,0.5)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            "& fieldset": { borderColor: "#d1d5db" },
            "&:hover fieldset": { borderColor: "#9ca3af" },
            "&.Mui-focused fieldset": {
              borderColor: "#2a5bc0",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#2a5bc0",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: "0.875rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#6b7280",
          "&:hover": {
            backgroundColor: "rgba(42,91,192,0.06)",
            color: "#2a5bc0",
          },
        },
      },
    },
  },
});

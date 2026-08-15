import type { Preview } from "@storybook/nextjs-vite";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import * as React from "react";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2a5bc0",
    },
    secondary: {
      main: "#dc2626",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    layout: "centered",
  },
};

export default preview;

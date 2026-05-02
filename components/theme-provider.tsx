"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentMode = mounted ? (resolvedTheme || theme || "light") : "light";

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: currentMode === "dark" ? "dark" : "light",
          primary: {
            main: '#6366f1', // Indigo 500
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#fff',
          },
          secondary: {
            main: '#ec4899', // Pink 500
          },
          background: {
            default: currentMode === "dark" ? "#0f172a" : "#f8fafc", // Navy / Slate
            paper: currentMode === "dark" ? "#1e293b" : "#ffffff", // Lighter Navy / White
          },
          text: {
            primary: currentMode === "dark" ? "#f1f5f9" : "#1e293b",
            secondary: currentMode === "dark" ? "#94a3b8" : "#64748b",
          },
        },
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 24px',
                borderRadius: '12px',
              },
              contained: {
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
              },

            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: currentMode === "dark" ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                  },
                },
              },
            },
          },
        },
      }),
    [currentMode]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MuiThemeWrapper>{children}</MuiThemeWrapper>
    </NextThemesProvider>
  );
}

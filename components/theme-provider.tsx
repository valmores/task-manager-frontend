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
            main: currentMode === "dark" ? "#fff" : "#000",
          },
          background: {
            default: currentMode === "dark" ? "#09090b" : "#fafafa",
            paper: currentMode === "dark" ? "#09090b" : "#fff",
          },

          text: {
            primary: currentMode === "dark" ? "#fafafa" : "#171717",
          }
        },
        typography: {
          fontFamily: 'inherit',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: '8px',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
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



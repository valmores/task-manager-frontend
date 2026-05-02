"use client";

import * as React from "react";
import { useTheme as useNextTheme } from "next-themes";
import { IconButton, Box } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Box sx={{ width: 40, height: 40 }} />;
  }

  const isDarkMode = resolvedTheme === 'dark';



  return (
    <IconButton
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      color="inherit"
      aria-label="Toggle theme"
      sx={{
        borderRadius: 2,
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      {isDarkMode ? (
        <LightModeIcon fontSize="small" />
      ) : (
        <DarkModeIcon fontSize="small" />
      )}
    </IconButton>
  );
}



import React from "react";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useTheme } from "../contexts/ThemeProvider";

function ThemeToggle(): React.ReactElement {
  const { theme, setMode } = useTheme();

  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title="Toggle light/dark theme">
      <IconButton color="inherit" onClick={() => setMode(isDark ? "light" : "dark")}>
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;

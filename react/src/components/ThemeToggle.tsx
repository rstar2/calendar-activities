import React from "react";

import Button from "@mui/material/Button";

import { useTheme } from "../contexts/ThemeProvider";

function ThemeToggle(): React.ReactElement {
  const { theme, setMode } = useTheme();

  return (
    <div>
      <Button variant="contained" onClick={() => setMode(theme.palette.mode === "dark" ? "light" : "dark")}>
        Theme toggle
      </Button>
    </div>
  );
}

export default ThemeToggle;

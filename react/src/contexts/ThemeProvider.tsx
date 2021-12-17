import React, { Context, PropsWithChildren, createContext, useState, useContext } from "react";

import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
export type { Theme };

const mdTheme = createTheme();

type ThemeContextValue = {
  theme: Theme;
  setMode(mode: PaletteMode): void;
};

const ThemeContext: Context<ThemeContextValue> = createContext({
  theme: mdTheme,
  setMode: () => {
    // noop
  },
} as ThemeContextValue);

/**
 * The custom hook for using the theme,
 * It exports getter and setter
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: PropsWithChildren<unknown>): React.ReactElement {
  const [theme, setTheme] = useState(mdTheme);

  function setMode(mode: PaletteMode) {
    setTheme((theme) => {
      const changedTheme = { ...theme };
      changedTheme.palette.mode = mode;
      return changedTheme;
    });
  }

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ theme: theme, setMode }}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  );
}

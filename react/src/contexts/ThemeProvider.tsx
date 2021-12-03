import React, { Context, PropsWithChildren, createContext, useState, useContext } from "react";

export enum Theme {
  light,
  dark,
}

type ThemeContextValue = {
  theme: Theme;
  setTheme(theme: Theme): void;
};

const ThemeContext: Context<ThemeContextValue> = createContext({
  theme: Theme.dark,
  setTheme() {},
} as ThemeContextValue);

/**
 * The custom hook for using the theme,
 * It exports getter and setter
 */
export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const [theme, setTheme] = useState(Theme.dark);

  return <ThemeContext.Provider value={{ theme: theme, setTheme }}>{children}</ThemeContext.Provider>;
}

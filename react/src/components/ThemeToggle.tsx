import React from "react";

import { useTheme, Theme } from "../contexts/ThemeProvider";

function Nav() {
  let { theme, setTheme } = useTheme();

  return (
    <div>
        <button onClick={() => setTheme(theme === Theme.dark ? Theme.light : Theme.dark)}>
            Theme toggle
            </button>
    </div>
  );
}

export default Nav;

import React from "react";

import { useTheme, Theme } from "../contexts/ThemeProvider";

function Nav() {
  let { theme } = useTheme();

  const themeStyles = {
    color: theme === Theme.dark ? "pink" : "gray",
    backgroundColor: theme === Theme.dark ? "gray" : "pink",
  };

  return <nav style={themeStyles}>Navigation</nav>;
}

export default Nav;

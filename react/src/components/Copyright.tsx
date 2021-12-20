import React from "react";

import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function Copyright(props: Record<string, unknown>): React.ReactElement {
  const theme = useTheme();

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://rumenneshev.com/">
        Rumen Neshev
      </Link>
      {" " + theme.palette.mode}
      {" " + new Date().getFullYear() + "."}
    </Typography>
  );
}

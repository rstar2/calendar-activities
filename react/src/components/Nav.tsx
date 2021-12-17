import React from "react";

import { Link as NavLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

import ThemeToggle from "./ThemeToggle";

export default function Nav(): React.ReactElement {
  return (
    <>
      <Box
        sx={(theme) => ({
          color: theme.palette.mode === "dark" ? "pink" : "gray",
          backgroundColor: theme.palette.mode === "dark" ? "gray" : "pink",
          "& > :not(style) + :not(style)": {
            ml: 2,
          },
        })}
      >
        <Link component={NavLink} to="/users" color="inherit">
          Users
        </Link>

        <Link component={NavLink} to="/activities" color="inherit">
          Activities
        </Link>
      </Box>

      <ThemeToggle />

      <Divider />
    </>
  );
}

import React from "react";

import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import useUsers from "../hooks/useUsers";

export default function Copyright(props: Record<string, unknown>): React.ReactElement {
  const theme = useTheme();

  const users = useUsers();

  return (
    <>
      <List>
        {users.map((user) => {
          return (
            <ListItem key={user.id}>
              <Typography variant="subtitle1">UID: {user.id}</Typography>
              <Typography variant="subtitle2">Name: {user.name}</Typography>
            </ListItem>
          );
        })}
      </List>

      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Rumen Neshev
        </Link>
        {" " + theme.palette.mode}
        {" " + new Date().getFullYear() + "."}
      </Typography>
    </>
  );
}

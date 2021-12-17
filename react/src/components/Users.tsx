import React, { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import { useGetUsersQuery, useGetUserQuery } from "../services/users";

export default function Users(): React.ReactElement {
  const [userId, setUserId] = useState("1");

  // Using a query hook automatically fetches data and returns query values
  const { data: users, error: errorUsers, isLoading: isLoadingUsers } = useGetUsersQuery();
  const { data: user, error: errorUser, isLoading: isLoadingUser } = useGetUserQuery(userId);
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = userApi.endpoints.getUser.useQuery('1')

  return (
    <>
      <Typography>User ${userId}</Typography>
      <Paper>
        {errorUser ? (
          <>Oh no, there was an error loading user</>
        ) : isLoadingUser ? (
          <>Loading user...</>
        ) : user ? (
          <>
            <Typography variant="subtitle1">UID: {user.id}</Typography>
            <Typography variant="subtitle2">Name: {user.name}</Typography>
          </>
        ) : null}
      </Paper>

      <Typography>Users:</Typography>
      <Box>
        {errorUsers ? (
          <>Oh no, there was an error loading users</>
        ) : isLoadingUsers ? (
          <>Loading users...</>
        ) : users ? (
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
        ) : null}
      </Box>
    </>
  );
}

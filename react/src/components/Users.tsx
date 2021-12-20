import React, { useState } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "../store";
import { useGetUsersQuery /* , useGetUserQuery */ } from "../services/usersApi";

export default function Users(): React.ReactElement {
  //   const [userId, setUserId] = useState("1");

  const { isAuth } = useAppSelector((state) => state.auth);

  // Using a query hook automatically fetches data and returns query values
  const { data: users, error: errorUsers, isLoading: isLoadingUsers } = useGetUsersQuery();
  //   const { data: user, error: errorUser, isLoading: isLoadingUser } = useGetUserQuery(userId);
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = userApi.endpoints.getUser.useQuery('1')

  return (
    <>
      <Typography>Users:</Typography>

      {!isAuth ? (
        <Typography variant="body2">Not logged in yet</Typography>
      ) : (
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
      )}
    </>
  );
}

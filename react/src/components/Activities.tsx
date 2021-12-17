import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import { fetchActivities } from "../store/slices/activities";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

export default function Activities(): React.ReactElement {
  const activities = useSelector((state: RootState) => state.activities);
  const dispatch = useDispatch();

  useEffect(() => {
    // use redux-thunks
    dispatch(fetchActivities());
  }, [dispatch]);

  return (
    <>
      <Typography>Activities</Typography>
      <Box>
        <List>
          {activities.activities.map((activity) => {
            return (
              <ListItem key={activity.id}>
                <Typography variant="subtitle1">UID: {activity.id}</Typography>
                <Typography variant="subtitle2">Name: {activity.name}</Typography>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}

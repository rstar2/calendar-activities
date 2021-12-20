import React, { useState, useEffect, useCallback } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/PlusOne";
import ResetIcon from "@mui/icons-material/RestartAlt";

import { useAppDispatch, useAppSelector } from "../store";
import {
  activitiesSubscribe,
  activityIncrement,
  activityReset,
} from "../store/slices/activities";
import { usersSubscribe, selectUserId } from "../store/slices/users";
import Activity, { getIcon } from "../types/Activity";

export default function Activities(): React.ReactElement {
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  // not best optimal solution as when one activity is changed the whole list will be re-rendered
  // this could be avoided - see https://redux.js.org/tutorials/fundamentals/part-5-ui-react#selecting-data-in-list-items-by-id
  const activities = useAppSelector((state) => state.activities.activities);
  const usersState = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // still the dispatch() will return whatever returns the action/thunk
    const unsubscribeActivities = dispatch(activitiesSubscribe());
    const unsubscribeUsers = dispatch(usersSubscribe());

    return () => {
      // unsubscribe if possible
      unsubscribeActivities();
      unsubscribeUsers();
    };
  }, []);

  const [disabled, setDisabled] = useState({} as { [key: string]: boolean });

  const increment = useCallback(async (id: string) => {
    setDisableById(id, true);
    await dispatch(activityIncrement(id));
    setDisableById(id, false);
  }, []);

  const reset = useCallback(async (id: string) => {
    setDisableById(id, true);
    await dispatch(activityReset(id));
    setDisableById(id, false);
  }, []);

  const setDisableById = (id: string, value: boolean) => {
    setDisabled({ ...disabled, [id]: value });
  };

  const getUser = ({ user }: Activity) => {
    return selectUserId(usersState, user)?.name;
  };

  return (
    <>
      <Typography>Activities (current/cycle/total)</Typography>

      {!isAuth ? (
        <Typography variant="body2">Not logged in yet</Typography>
      ) : (
        <List>
          {activities.map((activity) => {
            return (
              <ListItem key={activity.id}>
                <ListItemAvatar>{getIcon(activity)}</ListItemAvatar>

                <ListItemText
                  primary={getUser(activity) + " - " + activity.name}
                  secondary={`${activity.current}/${activity.cycle}/${activity.total}`}
                ></ListItemText>

                <Tooltip title="Increment activity">
                  <IconButton
                    edge="end"
                    disabled={!!disabled[activity.id]}
                    onClick={() => increment(activity.id)}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset activity">
                  <IconButton
                    edge="end"
                    disabled={!!disabled[activity.id]}
                    onClick={() => reset(activity.id)}
                  >
                    <ResetIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
}

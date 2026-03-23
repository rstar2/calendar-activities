import React, { useCallback } from "react";
import { useMap } from "react-use";
import {
  HStack,
  List,
  ListItem,
  IconButton,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, RepeatIcon } from "@chakra-ui/icons";

import { useAuth } from "../cache/auth";
import {
  useActivities,
  useActivityIncrease,
  useActivityDecrease,
  useActivityReset,
} from "../cache/activities";
import { type Activity, getIcon } from "../types/Activity";
import Expander from "./Expander";
import TooltipMobile from "./TooltipMobile";

function Activities() {
  const {
    data: { isAuth },
  } = useAuth();

  const [disabled, { set: setDisabled, remove: removeDisabled }] = useMap(
    {} as Record<string, true>,
  );

  const { data: activities } = useActivities();

  const activityIncrement = useActivityIncrease();
  const activityDecrement = useActivityDecrease();
  const activityReset = useActivityReset();

  const handleActivityIncrement = useCallback(
    ({ id }: Activity) => {
      setDisabled(id, true);
      activityIncrement(id).finally(() => removeDisabled(id));
    },
    [setDisabled, removeDisabled, activityIncrement],
  );

  const handleActivityDecrement = useCallback(
    ({ id }: Activity) => {
      setDisabled(id, true);
      activityDecrement(id).finally(() => removeDisabled(id));
    },
    [setDisabled, removeDisabled, activityDecrement],
  );

  const handleActivityReset = useCallback(
    ({ id }: Activity) => {
      setDisabled(id, true);
      activityReset(id).finally(() => removeDisabled(id));
    },
    [setDisabled, removeDisabled, activityReset],
  );

  return (
    <List spacing={3}>
      {!activities
        ? Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} h={6} />
          ))
        : activities.map((activity) => (
            <ListItem key={activity.id}>
              <HStack>
                <Text>{formatActivity(activity)}</Text>
                {isAuth && (
                  <>
                    <Expander />
                    {activity.left === undefined && (
                      <TooltipMobile label="Increment">
                        <IconButton
                          variant="ghost"
                          isRound
                          isDisabled={!isAuth || disabled[activity.id]}
                          onClick={() => handleActivityIncrement(activity)}
                          icon={<AddIcon />}
                          aria-label="increment"
                        />
                      </TooltipMobile>
                    )}

                    {activity.left !== undefined && (
                      <TooltipMobile label="Decrement">
                        <IconButton
                          variant="ghost"
                          isRound
                          isDisabled={!isAuth || disabled[activity.id]}
                          onClick={() => handleActivityDecrement(activity)}
                          icon={<MinusIcon />}
                          aria-label="decrement"
                        />
                      </TooltipMobile>
                    )}

                    {activity.cycle !== undefined && (
                      <TooltipMobile label="Reset">
                        <IconButton
                          variant="ghost"
                          isRound
                          isDisabled={!isAuth || disabled[activity.id]}
                          onClick={() => handleActivityReset(activity)}
                          icon={<RepeatIcon />}
                          aria-label="reset"
                        />
                      </TooltipMobile>
                    )}
                  </>
                )}
              </HStack>
            </ListItem>
          ))}
    </List>
  );
}

const formatActivity = (activity: Activity): React.ReactNode => {
  return (
    getIcon(activity) +
    " " +
    activity.name +
    " - " +
    (activity.current !== undefined
      ? activity.current
      : activity.left !== undefined
      ? " Left " + activity.left
      : " Total " + activity.total)
  );
};

export default Activities;

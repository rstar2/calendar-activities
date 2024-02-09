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
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";

import { useAuth } from "../cache/auth";
import {
  useActivities,
  useActivityIncrement,
  useActivityReset,
} from "../cache/activities";
import Activity, { getIcon } from "../types/Activity";
import Expander from "./Expander";
import TooltipMobile from "./TooltipMobile";

function Activities() {
  const {
    data: { isAuth },
  } = useAuth();

  const { data: activities } = useActivities();

  const activityIncrement = useActivityIncrement();
  const activityReset = useActivityReset();

  const handleActivityIncrement = useCallback(({ id }: Activity) => {
    setDisabled(id, true);
    activityIncrement(id).finally(() => removeDisabled(id));
  }, []);

  const handleActivityReset = useCallback(({ id }: Activity) => {
    setDisabled(id, true);
    activityReset(id).finally(() => removeDisabled(id));
  }, []);

  const [disabled, { set: setDisabled, remove: removeDisabled }] = useMap(
    {} as Record<string, true>,
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
                  </>
                )}
              </HStack>
            </ListItem>
          ))}
    </List>
  );
}

const formatActivity = (activity: Activity): React.ReactNode => {
  return getIcon(activity) + " " + activity.name + " - " + activity.current;
};

export default Activities;

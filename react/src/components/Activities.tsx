import React, { useCallback, useState } from "react";
import { useMap, useLongPress } from "react-use";
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
  useActivityUpdate,
} from "../cache/activities";
import { type Activity, getIcon } from "../types/Activity";
import Expander from "./Expander";
import TooltipMobile from "./TooltipMobile";
import DialogActivityAddOrEdit from "./DialogActivityAddOrEdit";

interface ActivityItemProps {
  activity: Activity;
  isAuth: boolean;
  disabled: Record<string, true>;
  onIncrement: (activity: Activity) => void;
  onDecrement: (activity: Activity) => void;
  onReset: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
}

function ActivityItem({
  activity,
  isAuth,
  disabled,
  onIncrement,
  onDecrement,
  onReset,
  onEdit,
}: ActivityItemProps) {
  const longPressEvent = useLongPress(() => isAuth && onEdit(activity), {
    delay: 500,
    isPreventDefault: true,
  });

  return (
    <ListItem>
      <HStack>
        <Text
          {...longPressEvent}
          cursor={isAuth ? "pointer" : "default"}
          userSelect="none"
        >
          {formatActivity(activity)}
        </Text>
        {isAuth && (
          <>
            <Expander />
            {!("left" in activity) && (
              <TooltipMobile label="Increment">
                <IconButton
                  variant="ghost"
                  isRound
                  isDisabled={!isAuth || disabled[activity.id]}
                  onClick={() => onIncrement(activity)}
                  icon={<AddIcon />}
                  aria-label="increment"
                />
              </TooltipMobile>
            )}

            {"left" in activity && (
              <TooltipMobile label="Decrement">
                <IconButton
                  variant="ghost"
                  isRound
                  isDisabled={!isAuth || disabled[activity.id]}
                  onClick={() => onDecrement(activity)}
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
                  onClick={() => onReset(activity)}
                  icon={<RepeatIcon />}
                  aria-label="reset"
                />
              </TooltipMobile>
            )}
          </>
        )}
      </HStack>
    </ListItem>
  );
}

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
  const activityUpdate = useActivityUpdate();

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

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

  const handleEditDialogClose = useCallback(
    async (updates?: Partial<Activity>) => {
      if (editingActivity && updates) {
        await activityUpdate({ id: editingActivity.id, updates });
      }
      setEditingActivity(null);
    },
    [editingActivity, activityUpdate],
  );

  return (
    <>
      <List spacing={3}>
        {!activities
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} h={6} />
            ))
          : activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isAuth={isAuth}
                disabled={disabled}
                onIncrement={handleActivityIncrement}
                onDecrement={handleActivityDecrement}
                onReset={handleActivityReset}
                onEdit={setEditingActivity}
              />
            ))}
      </List>

      {isAuth && editingActivity && (
        <DialogActivityAddOrEdit
          open={!!editingActivity}
          activity={editingActivity}
          onClose={handleEditDialogClose}
        />
      )}
    </>
  );
}

const formatActivity = (activity: Activity): React.ReactNode => {
  const count =
    "current" in activity && activity.current !== undefined
      ? activity.current
      : "left" in activity && activity.left !== undefined
      ? " Left " + activity.left
      : " Total " + activity.total;
  return getIcon(activity) + " " + activity.name + " - " + count;
};

export default Activities;

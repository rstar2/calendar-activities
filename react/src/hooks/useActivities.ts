import { useState, useEffect } from "react";

import Activity from "../types/Activity";

type Activities = [
  Activity[], // activities
  (activity: Activity) => void, // increment(activity)
  (activity: Activity) => void // reset(activity)
];

/**
 *
 * @returns latest activities reactive
 */
export default function useActivities(): Activities {
  const [activities, setActivities] = useState([] as Activity[]);

  function increment(activity: Activity) {
    // TODO: call increment
  }

  function reset(activity: Activity) {
    // TODO: call reset
  }

  useEffect(() => {
    // api.get().then((data) => setActivities(data));

    // TODO: subscribe to changes

    return () => {
      // TODO: unsubscribe
    };
  }, []);

  return [activities, increment, reset];
}

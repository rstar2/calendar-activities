import { type QuerySnapshot } from "firebase/firestore";
import { useQuery, useMutation } from "@tanstack/react-query";

import firebase, { parseDocs } from "../lib/firebase";
import { queryClient } from "./index";
import type Activity from "../types/Activity";

const collection = firebase.collection(
  import.meta.env.VITE_FIREBASE_COLL_ACTIVITIES!,
);

// the Firebase Firestore DB is protected from unauthorized add/update/delete
// so use a Firebase Callable Functions
const activitiesAddFn = firebase.httpsCallable("activitiesAdd");
const activitiesResetFn = firebase.httpsCallable("activitiesReset");

firebase.onSnapshot(collection, (snapshot: QuerySnapshot) => {
  const activities = parseDocs(snapshot) as Activity[];
  queryClient.setQueryData(["activities"], activities);
});

/**
 * Query for the Activities state.
 */
export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => Promise.reject(new Error("Not used")),
    enabled: false,
    staleTime: Infinity,
    // set it so that the TS to auto-infer the useActivities().data type
    initialData: undefined as Activity[] | undefined,
  });
}

/**
 * Mutation for "resetting" an Activity.
 */
export function useActivityReset() {
  const mutation = useMutation({
    mutationFn: async (activityId: string) => {
      await activitiesResetFn({ id: activityId }).then((result) => result.data);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Activity", "Reset"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation for "incrementing" an Activity.
 */
export function useActivityIncrement() {
  const mutation = useMutation({
    mutationFn: async (activityId: string) => {
      await activitiesAddFn({ id: activityId, count: 1 }).then(
        (result) => result.data,
      );
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Activity", "Increment"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

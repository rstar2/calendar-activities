import { type QuerySnapshot } from "firebase/firestore";
import { useQuery, useMutation } from "@tanstack/react-query";

import firebase, { parseDocs } from "../lib/firebase";
import { queryClient } from "./index";
import type { Activity } from "../types/Activity";

const collection = firebase.collection(
  import.meta.env.VITE_FIREBASE_COLL_ACTIVITIES!,
);

// the Firebase Firestore DB is protected from unauthorized add/update/delete
// so use a Firebase Callable Functions
const activityIncreaseFn = firebase.httpsCallable("activityIncrease");
const activityDecreaseFn = firebase.httpsCallable("activityDecrease");
const activityResetFn = firebase.httpsCallable("activityReset");
const activityUpdateFn = firebase.httpsCallable("activityUpdate");
const activityAddFn = firebase.httpsCallable("activityAdd");

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
    mutationFn: async (activityId: string, total?: number) => {
      await activityResetFn({ id: activityId, total }).then(
        (result) => result.data,
      );
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
export function useActivityIncrease() {
  const mutation = useMutation({
    mutationFn: async (activityId: string) => {
      await activityIncreaseFn({ id: activityId, count: 1 }).then(
        (result) => result.data,
      );
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Activity", "Increased"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation for "decreasing" an Activity.
 */
export function useActivityDecrease() {
  const mutation = useMutation({
    mutationFn: async (activityId: string) => {
      await activityDecreaseFn({ id: activityId, count: 1 }).then(
        (result) => result.data,
      );
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Activity", "Decreased"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation for "updating" an Activity.
 */
export function useActivityUpdate() {
  const mutation = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<Activity> }) => {
      await activityUpdateFn(params).then((result) => result.data);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Activity", "Updated"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return [mutation.mutateAsync, mutation.isPending] as const;
}

/**
 * Mutation for "adding" an Activity.
 */
export function useActivityAdd() {
  const mutation = useMutation({
    mutationFn: async (
      activity: Partial<Activity> & { current?: number; left?: number },
    ) => {
      await activityAddFn(activity).then((r) => r.data);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Activity", "Added"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return [mutation.mutateAsync, mutation.isPending] as const;
}

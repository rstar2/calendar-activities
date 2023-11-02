import { useQuery, useMutation } from "@tanstack/react-query";

import firebase from "../lib/firebase";
import { queryClient } from "./index";
import { createSubscription } from "../configurePushNotifications";

firebase.onAuthStateChanged((user) => {
  if (user) {
    createSubscription();
  }

  queryClient.setQueryData(["auth"], {
    isKnown: true,
    isAuth: !!user,
  });
});

/**
 * Query for the auth state.
 */
export function useAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: () => Promise.reject(new Error("Not used")),
    enabled: false,
    staleTime: Infinity,
    initialData: {
      isKnown: false,
      isAuth: false,
    },
  });
}

/**
 * Mutation to login.
 * Could use directly the firebase.signIn(), but thus all is wrapped hin one place,
 * and can reuse the mutations API
 */
export function useAuthLogin() {
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => firebase.signIn(email, password),
    // meta is used for success/failed notification on mutation result
    meta: {
      action: "Login",
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation to logout.
 * Could use directly the firebase.signOut(), but thus all is wrapped hin one place,
 * and can reuse the mutations API
 */
export function useAuthLogout() {
  const mutation = useMutation({
    mutationFn: async () => firebase.signOut(),
    // meta is used for success/failed notification on mutation result
    meta: {
      action: "Logout",
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

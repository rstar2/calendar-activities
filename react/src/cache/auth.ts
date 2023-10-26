import { useQuery, useMutation } from "@tanstack/react-query";

import firebase from "../lib/firebase";
import { queryClient } from "./index";

firebase.onAuthStateChanged((user) => {
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
    queryFn: () => null,
    initialData: {
      isKnown: false,
      isAuth: false,
    },
    staleTime: Infinity,
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
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import User from "../types/User";

import { add as addNotification } from "../store/slices/notifications";

type UserLike = {
  id: string;
  name: string;
};

const transformUser = (userLike: UserLike): User => {
  return {
    id: userLike.id,
    name: userLike.name,
  };
};

// Define a service using a base URL and expected endpoints
export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com/users" }),
  endpoints: (builder) => ({
    // query for getting all users
    getUsers: builder.query<User[], void>({
      // builder for the query - e.g result will be appended to the 'baseUrl'
      query: () => "",

      // transform response to whatever is required
      transformResponse: (response: UserLike[], meta, arg) => {
        return response.map((userLike) => transformUser(userLike));
      },

      //
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // `onStart` side-effect
        dispatch(addNotification({ type: "info", text: "Fetching users..." }));
        try {
          // queryFulfilled is the API promise
          await queryFulfilled;
          // `onSuccess` side-effect
          //   dispatch(addNotification({type: "success", text: "Users received!"}));
        } catch (err) {
          // `onError` side-effect
          //   dispatch(addNotification({type: "error", text: "Error fetching users!"}));
        }
      },
    }),

    // // query for getting a specific user
    getUser: builder.query<User, string>({
      query: (uid) => `${uid}`,
      transformResponse: (response: UserLike, meta, arg) => {
        return transformUser(response);
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUsersQuery, useGetUserQuery } = usersApi;

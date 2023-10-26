import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// import { showNotification, showNotificationMessage } from "@/notifications";
import React, { PropsWithChildren } from "react";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // default is 0
            staleTime: 3000, // 3 seconds, to "combine" simultaneous same requests from different components, on same "screen"

            // Specifying a longer staleTime means queries will not refetch their data as often
            // Infinity will mean that queries never get stale (always stay fresh),
            // so they are not re-fetched id there's data in the cache for the same key
            //staleTime: Infinity,

            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            networkMode: "always",
        },
        mutations: {
            networkMode: "always",
        },
    },
    // queryCache: new QueryCache({
    //     onSuccess(data, query) {},
    //     onError(error, query) {},
    //     // one combined callback
    //     onSettled(data, error, query) {
    //         const { queryKey } = query;
    //         // keys are like ["admin", "BonusTask", ...]
    //         // show toast notifications only for Admin UI
    //         if (queryKey[0] === "admin") {
    //             // show error notification here
    //         }
    //     },
    // }),

    mutationCache: new MutationCache({
        // onSuccess(data, variables, context, mutation) {},
        // onError(error, variables, context, mutation) {},

        // one combined callback
        onSettled(data, error, variables, context, mutation) {
            // const { meta } = mutation;
            // // show success notification here
            // if (meta) {
            //     // if there's explicit (ready to be used message , for success or error) then use it
            //     // otherwise use the generic "entity/action".
            //     // The "player" uses the explicit messages as it uses localization.
            //     // The "admin" uses the "entity/action" variant.
            //     const type = error ? "Error" : "Success";
            //     const message = error ? meta.success : meta.error;
            //     const subMessage = error?.response?.data?.message;
            //     if (message) showNotificationMessage(message, type, subMessage);
            //     else showNotification({ ...meta, type, subMessage }, error);
            // }
        },
    }),
});

/**
 * The cache react-query provider component.
 * Any component that will use any of the cache hooks must be wrapped in such a provider component.
 */
export const CacheProvider: React.FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
);

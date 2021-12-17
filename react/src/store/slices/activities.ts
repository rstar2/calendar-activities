import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { AppThunk } from "..";
import Activity from "../../types/Activity";

// First, define the reducer and action creators via `createSlice`
export const activitiesSlice = createSlice({
  name: "activities",
  initialState: {
    loading: "idle",
    activities: [] as Activity[],
  },
  reducers: {
    activitiesLoading(state, action: PayloadAction<undefined>) {
      // Use a "state machine" approach for loading state instead of booleans
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    },
    activitiesReceived(state, action: PayloadAction<Activity[]>) {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.activities = action.payload;
      }
    },
  },
});

// Destructure and export the plain action creators
export const { activitiesLoading, activitiesReceived } = activitiesSlice.actions;

export default activitiesSlice.reducer;

// 1. One way -Define a plain redux-thunk that dispatches those action creators
export const fetchActivities = (): AppThunk => async (dispatch) => {
  dispatch(activitiesLoading());
  // const response = await usersAPI.fetchAll()
  // dispatch(activitiesReceived(response.data));

  dispatch(activitiesReceived([{ id: "asd", name: "name" }]));
};

// 2. Second way - use createAsyncThunk
// export const fetchActivities = createAsyncThunk(
//     'articles/fetchActivities',
//     async (id: number) => {
//       const data = await fakeAPI.articles.show(id)
//       // Normalize the data so reducers can responded to a predictable payload.
//       // Note: at the time of writing, normalizr does not automatically infer the result,
//       // so we explicitly declare the shape of the returned normalized data as a generic arg.
//       const normalized = normalize<
//         any,
//         {
//           articles: { [key: string]: Article }
//           users: { [key: string]: Author }
//           comments: { [key: string]: Comment }
//         }
//       >(data, articleEntity)
//       return normalized.entities
//     }
//   )

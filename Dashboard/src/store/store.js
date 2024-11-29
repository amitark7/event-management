import { configureStore } from "@reduxjs/toolkit";
import eventSlice from "./reducers/eventReducer";
import gallerySlice from "./reducers/galleryReducer";
import members from "./reducers/memberReducer";
import fundSlice from "./reducers/fundReducer";
import expenseSlice from "./reducers/expenseReducers";

export const store = configureStore({
  reducer: {
    events: eventSlice.reducer,
    gallery: gallerySlice.reducer,
    members: members.reducer,
    funds: fundSlice.reducer,
    expenses: expenseSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

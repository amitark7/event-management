import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const addEvent = createAsyncThunk("addEvent", async (data) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data, createdAt: new Date().toISOString() };
  } catch (err) {
    console.log(err);
  }
});

export const updateEvent = createAsyncThunk("updateEvents", async (data) => {
  try {
    const userDoc = doc(db, "events", data.id);
    await updateDoc(userDoc, data.eventData);
  } catch (error) {
    console.log("Error -> ", error);
  }
});

export const deleteEvent = createAsyncThunk(
  "deleteEvents",
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { events } = getState();
      const documentRef = doc(db, "events", eventId);
      await deleteDoc(documentRef);
      return events.events.filter((event) => event.id !== eventId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getEvents = createAsyncThunk("getEvents", async () => {
  try {
    const eventsQuery = query(
      collection(db, "events"),
      orderBy("createdAt", "desc")
    );
    const data = await getDocs(eventsQuery);
    let events = [];
    data.forEach((doc) => {
      events = [...events, { ...doc.data(), id: doc.id }];
    });

    return events;
  } catch (error) {
    console.log(error);
  }
});

const eventSlice = createSlice({
  name: "events",
  initialState: { events: [], loading: false, fetching: false },
  reducers: {
    updateEventsInState: (state, action) => {
      state.events = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events = [action.payload, ...state.events];
        state.loading = false;
      })
      .addCase(addEvent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getEvents.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.fetching = false;
      })
      .addCase(getEvents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEvent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEvent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(deleteEvent.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateEventsInState } = eventSlice.actions;
export default eventSlice;

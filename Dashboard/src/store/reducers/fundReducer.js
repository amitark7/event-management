import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase.js";
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

export const addFund = createAsyncThunk(
  "addFund",
  async (data, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "funds"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      return { id: docRef.id, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFund = createAsyncThunk(
  "updateFund",
  async (data, { rejectWithValue }) => {
    try {
      const userDoc = doc(db, "funds", data.id);
      await updateDoc(userDoc, {
        ...data.fundData,
        updatedAt: serverTimestamp(),
      });

      return { id: data.id, fundData: data.fundData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFund = createAsyncThunk(
  "deleteFund",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { funds } = getState();
      const documentRef = doc(db, "funds", id);
      await deleteDoc(documentRef);
      return funds.fundList.filter((fund) => fund.id !== id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFundList = createAsyncThunk(
  "getFundList",
  async (_, { rejectWithValue }) => {
    try {
      const fundQuery = query(
        collection(db, "funds"),
        orderBy("createdAt", "desc")
      );
      const data = await getDocs(fundQuery);
      let funds = [];
      data.forEach((doc) => {
        funds = [...funds, { ...doc.data(), id: doc.id }];
      });

      return funds;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fundSlice = createSlice({
  name: "funds",
  initialState: { fundList: [], totalFund: 0, loading: false, fetching: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFundList.pending, (state) => {
        state.fetching = false;
      })
      .addCase(getFundList.fulfilled, (state, action) => {
        state.fetching = false;
        state.fundList = action.payload;
      })
      .addCase(getFundList.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(addFund.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFund.fulfilled, (state, action) => {
        state.loading = false;
        state.fundList = [action.payload, ...state.fundList];
      })
      .addCase(addFund.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateFund.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFund.fulfilled, (state, action) => {
        state.loading = false;
        const { id, fundData } = action.payload;
        state.fundList = state.fundList.map((fund) =>
          fund.id === id ? { ...fund, ...fundData } : fund
        );
      })
      .addCase(updateFund.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteFund.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFund.fulfilled, (state, action) => {
        state.loading = false;
        state.fundList = action.payload;
      })
      .addCase(deleteFund.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default fundSlice;

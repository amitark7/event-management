import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, imageDb } from "../../firebase/firebase";
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

export const getExpenseList = createAsyncThunk(
  "getExpenseList",
  async (_, { rejectWithValue }) => {
    try {
      const expenseQuery = query(
        collection(db, "expenses"),
        orderBy("createdAt", "desc")
      );
      const data = await getDocs(expenseQuery);
      let expenses = [];
      data.forEach((doc) => {
        expenses = [...expenses, { ...doc.data(), id: doc.id }];
      });
      return expenses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addExpense = createAsyncThunk(
  "addExpense",
  async (data, { rejectWithValue }) => {
    try {
      const imageRef = ref(imageDb, `Expenses/${Date.now()}`);
      await uploadBytes(imageRef, data.reciept);
      const imageURL = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "expenses"), {
        ...data,
        reciept: imageURL,
        createdAt: serverTimestamp(),
      });
      return {
        id: docRef.id,
        ...data,
        reciept: imageURL,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  "updateExpense",
  async (data, { rejectWithValue }) => {
    try {
      let imageURL = data.expenseData.reciept;
      if (typeof data.expenseData.reciept !== "string") {
        const imageRef = ref(imageDb, `Expenses/${Date.now()}`);
        await uploadBytes(imageRef, data.expenseData.reciept);
        imageURL = await getDownloadURL(imageRef);
      }

      const updateData = {
        ...data.expenseData,
        reciept: imageURL,
        updatedAt: serverTimestamp(),
      };
      const userDoc = doc(db, "expenses", data.id);
      await updateDoc(userDoc, updateData);

      return { id: data.id, updateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "deleteExpense",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { expenses } = getState();
      const documentRef = doc(db, "expenses", id);
      await deleteDoc(documentRef);
      return expenses.expenseList.filter((expense) => expense.id !== id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const expenseSlice = createSlice({
  name: "expenses",
  initialState: { expenseList: [], loading: false, fetching: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExpenseList.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getExpenseList.fulfilled, (state, action) => {
        state.fetching = false;
        state.expenseList = action.payload;
      })
      .addCase(getExpenseList.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseList = [action.payload, ...state.expenseList];
      })
      .addCase(addExpense.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updateData } = action.payload;
        state.expenseList = state.expenseList.map((expense) =>
          expense.id === id ? { ...expense, ...updateData } : expense
        );
      })
      .addCase(updateExpense.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenseList = action.payload;
      });
  },
});

export default expenseSlice;

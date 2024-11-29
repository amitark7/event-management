import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db, imageDb } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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

export const addMember = createAsyncThunk(
  "addMember",
  async (data, { rejectWithValue }) => {
    try {
      const imageRef = ref(imageDb, `Member/${Date.now()}`);
      await uploadBytes(imageRef, data.image);
      const imageURL = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "members"), {
        ...data,
        image: imageURL,
        createdAt: serverTimestamp(),
      });
      return {
        id: docRef.id,
        ...data,
        image: imageURL,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMember = createAsyncThunk(
  "deleteMember",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { members } = getState();
      const documentRef = doc(db, "members", id);
      await deleteDoc(documentRef);
      return members.memberList.filter((member) => member.id !== id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMember = createAsyncThunk(
  "updateMember",
  async (data, { rejectWithValue }) => {
    try {
      let imageURL = data.memberData.image;
      if (typeof data.memberData.image !== "string") {
        const imageRef = ref(imageDb, `Member/${Date.now()}`);
        await uploadBytes(imageRef, data.memberData.image);
        imageURL = await getDownloadURL(imageRef);
      }

      const updateData = {
        ...data.memberData,
        image: imageURL,
        updatedAt: serverTimestamp(),
      };
      const userDoc = doc(db, "members", data.id);
      await updateDoc(userDoc, updateData);

      return { id: data.id, ...updateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMemberList = createAsyncThunk(
  "getMemberList",
  async (_, { rejectWithValue }) => {
    try {
      const membersQuery = query(
        collection(db, "members"),
        orderBy("createdAt", "desc")
      );
      const data = await getDocs(membersQuery);
      let members = [];
      data.forEach((doc) => {
        members = [...members, { ...doc.data(), id: doc.id }];
      });
      return members;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const members = createSlice({
  name: "members",
  initialState: { memberList: [], loading: false, fetching: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMemberList.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getMemberList.fulfilled, (state, action) => {
        state.fetching = false;
        state.memberList = action.payload;
      })
      .addCase(getMemberList.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(addMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = false;
        state.memberList = [action.payload, ...state.memberList];
      })
      .addCase(addMember.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.memberList = action.payload;
      })
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const { id, ...updatedMemberData } = action.payload;
        state.memberList = state.memberList.map((member) =>
          member.id === id ? { ...member, ...updatedMemberData } : member
        );
      })
      .addCase(updateMember.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default members;

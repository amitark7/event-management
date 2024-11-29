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
} from "firebase/firestore";

export const uploadImage = createAsyncThunk(
  "uploadImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const imageRef = ref(imageDb, `Gallery/${Date.now()}`);
      await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "gallery"), {
        image: imageURL,
        uploadedAt: serverTimestamp(),
      });
      return {
        id: docRef.id,
        image: imageURL,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "deleteImage",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { gallery } = getState();
      const documentRef = doc(db, "gallery", id);
      await deleteDoc(documentRef);
      return gallery.galleryList.filter((gallery) => gallery.id !== id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getImageList = createAsyncThunk(
  "getImageList",
  async (_, { rejectWithValue }) => {
    try {
      const galleryQuery = query(
        collection(db, "gallery"),
        orderBy("uploadedAt", "desc")
      );
      const data = await getDocs(galleryQuery);
      let gallery = [];
      data.forEach((doc) => {
        gallery = [...gallery, { ...doc.data(), id: doc.id }];
      });
      return gallery;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: { galleryList: [], loading: false, fetching: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.galleryList = [action.payload, ...state.galleryList];
      })
      .addCase(uploadImage.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getImageList.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getImageList.fulfilled, (state, action) => {
        state.fetching = false;
        state.galleryList = action.payload;
      })
      .addCase(getImageList.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.galleryList = action.payload;
      })
      .addCase(deleteImage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default gallerySlice;

import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const WishListSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishListFromLocalStorage: (state, action) => {
      return [...state, ...action.payload];
    },
    removeAll: (state, action) => {
      return [];
    },
    addToWishList: (state, action) => {
      return [...state, action.payload];
    },
    removeFromWishList: (state, action) => {
      return state.filter((product) => action.payload !== product.product.id);
    },
  },
});

export const {
  setWishListFromLocalStorage,
  removeAll,
  addToWishList,
  removeFromWishList,
} = WishListSlice.actions;
export default WishListSlice.reducer;

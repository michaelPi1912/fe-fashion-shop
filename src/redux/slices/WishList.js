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
    // increaseQty: (state, action) => {
    //   return state.map((product) =>
    //     product.id === action.payload ? { ...product, qty: product.qty + 1 } : product
    //   );
    // },
    // decreaseQty: (state, action) => {
    //   return state.map((product) =>
    //     product.id === action.payload ? { ...product, qty: product.qty - 1 } : product
    //   );
    // },
  },
});

export const {
  setWishListFromLocalStorage,
  removeAll,
  addToWishList,
  removeFromWishList,
//   increaseQty,
//   decreaseQty,
} = WishListSlice.actions;
export default WishListSlice.reducer;

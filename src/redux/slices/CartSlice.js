import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartFromLocalStorage: (state, action) => {
      return [...state, ...action.payload];
    },
    checkoutCart: (state, action) => {
      return [];
    },
    // addToCart: (state, action) => {
    //   return [...state, action.payload];
    // },
    addToCart: (state, action) => {

      const index = state.findIndex(el => el.product.id === action.payload.product.id)
      if(index === -1){
        return [...state, action.payload];
      }else{
        return state.map((item, i) => index === i?{ ...item, qty: item.qty + +action.payload.qty } : item)
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((product) => action.payload !== product.id);
    },
    changeQty: (state, action) => {
      console.log(action  )
      return state.map((product) =>
        product.id === action.payload.id ? { ...product, qty: +action.payload.qty <= 1?1 : +action.payload.qty} : product
      );
    },
    decreaseQty: (state, action) => {
      return state.map((product) =>
        product.id === action.payload.id ? { ...product, qty: product.qty - 1 < 1?1: product.qty - 1} : product
      );
    },
    increaseQty: (state, action) => {
      return state.map((product) =>
        product.id === action.payload.id ? { ...product, qty: product.qty +1 } : product
      );
    },
  },
});

export const {
  setCartFromLocalStorage,
  checkoutCart,
  addToCart,
  removeFromCart,
  changeQty,
  increaseQty,
  decreaseQty

} = CartSlice.actions;
export default CartSlice.reducer;

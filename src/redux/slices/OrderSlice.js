import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderFromLocalStorage: (state, action) => {
      return [...state, ...action.payload];
    },
    SuccessOrder: (state, action) => {
      return [];
    },

    createOrder: (state, action) => {

        return [action.payload.items];
    },
    createOrderInfo: (state, action) => {

      return [action.payload.items];
  },
  },
});

export const {
    setOrderFromLocalStorage,
    SuccessOrder,
    createOrder,
    createOrderInfo
} = OrderSlice.actions;
export default OrderSlice.reducer;

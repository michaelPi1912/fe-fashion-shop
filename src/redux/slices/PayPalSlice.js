import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const PayPalSlice = createSlice({
  name: "paypalOrder",
  initialState,
  reducers: {
    setPayPalFromLocalStorage: (state, action) => {
        return [...state, ...action.payload];
    },
    SuccessPayment: (state, action) => {
      return [];
    },
    createPaypalOrder: (state, action) => {

        return [action.payload.items];
    },
  },
});

export const {
    SuccessPayment,
    createPaypalOrder,
    setPayPalFromLocalStorage
} = PayPalSlice.actions;
export default PayPalSlice.reducer;

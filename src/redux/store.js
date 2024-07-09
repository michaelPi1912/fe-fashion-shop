import { configureStore } from "@reduxjs/toolkit";
import CartReducer, { setCartFromLocalStorage } from "./slices/CartSlice";
import WishListReducer,{setWishListFromLocalStorage} from "./slices/WishList";
import OrderReducer,{setOrderFromLocalStorage} from "./slices/OrderSlice";
import PayPalReducer,{setPayPalFromLocalStorage} from "./slices/PayPalSlice";
export const store = configureStore({
  reducer: {
    cart: CartReducer,
    wishlist: WishListReducer,
    order: OrderReducer,
    paypal:PayPalReducer
  },
});

// Use subscribe to listen for changes in the store
store.subscribe(() => {
  const state = store.getState();
  console.log(state);
  localStorage.setItem("localCart", JSON.stringify(state.cart));
  localStorage.setItem("localWishList", JSON.stringify(state.wishlist));
  localStorage.setItem("localOrder", JSON.stringify(state.order));
  localStorage.setItem("localPayPal", JSON.stringify(state.paypal));
});
const loadDataFromLocalStorage = () => {
  const storedWishList = localStorage.getItem("localWishList");
  const storedCart = localStorage.getItem("localCart");
  const storedOrder = localStorage.getItem("localOrder")
  const storedPaypal = localStorage.getItem("localPayPal")

  if (storedWishList && storedCart && storedOrder) {
    // wishlist
    const parsedWishList = JSON.parse(storedWishList);
    store.dispatch(setWishListFromLocalStorage(parsedWishList));
    // cart
    const parsedCart = JSON.parse(storedCart);
    store.dispatch(setCartFromLocalStorage(parsedCart));
    // order
    const parsedOrder = JSON.parse(storedOrder);
    store.dispatch(setOrderFromLocalStorage(parsedOrder));
    // order
    const parsedPaypal = JSON.parse(storedPaypal);
    store.dispatch(setPayPalFromLocalStorage(parsedPaypal));
  }
};
loadDataFromLocalStorage();
// const loadCartFromLocalStorage = () => {
  
//   if (storedCart) {
//     const parsedCart = JSON.parse(storedCart);

//     store.dispatch(setCartFromLocalStorage(parsedCart));
//   }
// };
// loadCartFromLocalStorage();



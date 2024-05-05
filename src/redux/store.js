import { configureStore } from "@reduxjs/toolkit";
import CartReducer, { setCartFromLocalStorage } from "./slices/CartSlice";
// import WishListReducer,{setWishListFromLocalStorage} from "./slices/WishList";
import WishListReducer,{setWishListFromLocalStorage} from "./slices/WishList";

export const store = configureStore({
  reducer: {
    cart: CartReducer,
    wishlist: WishListReducer
  },
});

// Use subscribe to listen for changes in the store
store.subscribe(() => {
  const state = store.getState();
  console.log(state);
  localStorage.setItem("localCart", JSON.stringify(state.cart));
  localStorage.setItem("localWishList", JSON.stringify(state.wishlist));
});
const loadDataFromLocalStorage = () => {
  const storedWishList = localStorage.getItem("localWishList");
  const storedCart = localStorage.getItem("localCart");
  if (storedWishList && storedCart) {
    const parsedWishList = JSON.parse(storedWishList);

    store.dispatch(setWishListFromLocalStorage(parsedWishList));
    const parsedCart = JSON.parse(storedCart);

    store.dispatch(setCartFromLocalStorage(parsedCart));
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



import React, { useState, useEffect } from "react";
import CartCard from "../components/CartCard";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkoutCart } from "../redux/slices/CartSlice";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
import toast from "react-hot-toast";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  // console.log(cart.length)
  const dispatch = useDispatch();

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)
    );
  }, [cart]);

  const checkout = () => {
    toast.success("Order Placed Successfully");
    localStorage.removeItem("localCart");
    dispatch(checkoutCart());
    navigate("/");
  };
  return (
    <div style={{height:"100%"}}>
      <NavbarNavigate/> 
      <div style={{marginTop: "85px", padding: "40px"}}>
        <h1>Giỏ Hàng</h1>
        <div className="">
          <div className="d-flex flex-col lg:flex-row gap-x-6">
            <div className="">
              {cart.map((cartItem) => (
                <div>
                  <div className="d-flex">
                    <input type="checkbox"/>
                    <CartCard key={cartItem.product.id} item={cartItem} />
                    
                  </div>
                  <hr style={{height:"2px", backgroundColor:"black"}}/>
                </div>
              ))}
            </div>

            {cart.length === 0 ? (
              <div className="min-w-[320px] md:min-w-[1280px] md:max-h-[100px] flex justify-center" style={{marginTop: "50px"}}>
                <div className="flex flex-col justify-around gap-y-4 md:gap-y-10">
                  <div className="">
                    <h6>
                      Không có sản phẩm trong giỏ hàng
                    </h6>
                  </div>
                  <div className="flex justify-center">
                    <button>
                      <Link style={{color:"white", textDecoration: "none"}} to="/">Shop Now</Link>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className=" h-[200px] mt-[40px] w-[300px] md:w-[600px] p-4 flex flex-col justify-between">
                <div>
                  <h1 className="text-xl md:text-4xl font-bold text-slate-300 hover:text-slate-500">
                    TOTAL ITEMS : {cart.length}
                  </h1>
                  <h1 className="text-xl dark:text-white md:text-5xl font-bold text-slate-500">
                    TOTAL PRICE : VND {total}
                  </h1>
                </div>
                <div>
                  <button
                    className="bg-[#2a2a2a] w-full text-white p-2 rounded-md cursor-pointer hover:bg-black"
                    onClick={checkout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CartPage;

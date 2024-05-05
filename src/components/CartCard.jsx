import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../redux/slices/CartSlice";
import toast from "react-hot-toast";

const CartCard = ({ item }) => {
  const dispatch = useDispatch();

  const remove = (itemIdx) => {
    dispatch(removeFromCart(itemIdx));
    toast.error("Removed item from cart");
  };

  const increase = (id) => {
    dispatch(increaseQty(id));
  };

  const decrease = (id) => {
    if (item.qty === 1) {
      dispatch(removeFromCart(id));
    } else dispatch(decreaseQty(id));
  };

  return (
    <div>
      <div className="h-80 w-[310px] md:h-72 md:w-[600px] bg-slate-100 dark:bg-[#1f1b24] dark:hover:bg-[#121015] rounded-2xl hover:shadow-lg mt-[40px] md:mt-[20px]">
        <div className="d-flex">
          <div>
            <img
              src={"https://res.cloudinary.com/djz6golwu/image/upload/"+item.product.productImage[0]}
              alt=""
              width={150}
              height={150}
            />
          </div>
          <div className=" justify-between dark:text-white">
            <div className="d-flex flex-col ml-[20px] gap-y-2 overflow-y-hidden">
              <div className="">
                <div className="text-xs font-bold tracking-normal mr-1 md:text-sm sm:block">
                  {item.product.name}
                </div>
                <div className="flex justify-evenly gap-x-8 mt-2 md:gap-x-0 md:justify-evenly">
                
                  <div>
                    <div className="flex gap-x-6">
                      <p className="d-flex ">
                        <button
                          className="p-1 mr-2 bg-[#dadada] dark:bg-[#2a2a2a] dark:hover:bg-black dark:border-none border rounded-lg font-bold w-[30px]"
                          onClick={() => decrease(item.id)}
                        >
                          -
                        </button>
                        <span className="text-lg font-bold">{item.qty}</span>
                        <button
                          className="p-1 ml-2 bg-[#dadada] dark:bg-[#2a2a2a] dark:hover:bg-black dark:border-none border rounded-lg font-bold w-[30px]"
                          onClick={() => increase(item.id)}
                        >
                          +
                        </button>
                      </p>
                      
                      <div className="mt-[10px] font-bold">
                        Tổng Cộng : {item.product.price *item.qty}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button style={{backgroundColor:"white", color:"black", width: "50px", fontSize:"20px"}} onClick={() => remove(item.id)}>X</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;

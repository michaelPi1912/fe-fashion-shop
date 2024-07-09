import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  changeQty,
  increaseQty,
  decreaseQty,
} from "../redux/slices/CartSlice";
import toast from "react-hot-toast";
import { blockInvalidChar } from "./blockInvalidChar";

const CartCard = ({ item, isChecked, setIsCheck, setIsCheckAll }) => {
  console.log(isChecked)
  const dispatch = useDispatch();
  console.log(item);
  const [qty, setQty] = useState(0);
  console.log(qty)
  const remove = (itemIdx) => {
    dispatch(removeFromCart(itemIdx));
    toast.error("Removed item from cart");
  };

  const handleClick = (e) =>{
    const { id, checked } = e.target;
    console.log(id)
    setIsCheck(cur => [...cur, +id]);
    if (!checked) {
      setIsCheck(cur => cur.filter(item => item !== +id));
      setIsCheckAll(cur => cur === true ? !cur : cur)
    }
  }
  const handleOnChange = (e) =>{
    console.log(e.target.value)
    dispatch(changeQty({id: item.id,qty: e.target.value}))
  }


  return (
    <div className="d-flex">
      <input type="checkbox" id={item.id} onChange={handleClick} checked={isChecked}/>
      <div className="d-flex gap-3 justify-content-between" style={{flexGrow:1}}>
          <div>
            <img
              src={"https://res.cloudinary.com/djz6golwu/image/upload/"+item.product?.productImages[0]}
              alt=""
              width={150}
              height={150}
            />
          </div>
          <div className=" justify-between dark:text-white">
            <div className="d-flex flex-col ml-[20px] gap-y-2 overflow-y-hidden">
              <div className="">
                <div className="" style={{fontWeight:"bold"}}>
                  {item.product.name}
                </div>
                <div className="flex justify-evenly gap-x-8 mt-2 md:gap-x-0 md:justify-evenly">

                  <div>
                    <div className="flex">
                      <p style={{fontWeight:"bold"}}>{item.product.price}</p>       
                      <div style={{alignSelf:"end"}}>
                        <p style={{fontWeight:"bold"}}>QUANTITY</p>
                        <div className="d-flex">
                          <button style={{width:"50px",borderTopLeftRadius:"10px", borderBottomLeftRadius:"10px"}} onClick={(e) => dispatch(decreaseQty({id:item.id,qty: e.target.value -1}))}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                              </svg>
                          </button>
                          <input style={{width:"30%",textAlign:"center"}} min={1} value={item.qty} type="number" autoFocus onKeyDown={blockInvalidChar} onChange={handleOnChange}/>
                          <button style={{width:"50px",borderTopRightRadius:"10px", borderBottomRightRadius:"10px"}} onClick={(e) => dispatch(increaseQty({id:item.id,qty: e.target.value+1}))}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                          </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
          <div className="mt-[10px] font-bold" style={{alignSelf:"end", fontWeight:"bold"}}>
                        SUBTOTAL : {item.product.price *item.qty}
                      </div>
          <button  style={{alignSelf:"",marginLeft:"auto",backgroundColor:"white", color:"black", width: "50px", fontSize:"40px"}} 
              onClick={() => remove(item.id)}><strong><i class="bi bi-x"></i></strong></button>
        </div>
    </div>
        
  );
};

export default CartCard;

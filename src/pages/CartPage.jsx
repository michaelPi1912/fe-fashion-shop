import React, { useState, useEffect } from "react";
import CartCard from "../components/CartCard";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkoutCart } from "../redux/slices/CartSlice";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
import toast from "react-hot-toast";
import { createOrder } from "../redux/slices/OrderSlice";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [isCheck, setIsCheck] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  console.log(cart)
  console.log(isCheck)
  useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)
    );
    // setTotalItems(
    //   cart.reduce((acc, curr) => acc + curr.qty, 0)
    // );
  }, [cart]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(cart.map(li => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const checkout = () => {
    if(localStorage.getItem("user-info")){
      const orderItems = cart.filter((el) => isCheck.includes(el.id));
      console.log(orderItems)
      dispatch(createOrder({items: orderItems}))
      if(orderItems.length > 0){
        navigate("/order");
      }else{
        toast.error("Please choose at least one item !")
      }
    }else{
      navigate("/login")
    }
  };


  
  return (
    <div>
      <NavbarNavigate/> 
      <div style={{marginTop: "85px"}}>
        <h1 style={{paddingLeft:"5%", paddingTop:"5%"}}><strong>SHOPPING CART</strong></h1>
        {/* <br/><br/> */}
         {
                cart.length >0 ?(
                <div style={{}}>
                  <div className="d-flex flex-col lg:flex-row gap-5">
                    <div className="" style={{width:"65%", padding:"5%"}}>
                      {/*  */}
                    <div className="d-flex gap-2" style={{alignItems:"center"}}>
                          <input type="checkbox" onClick={handleSelectAll} checked={isCheckAll}/>
                          <div style={{fontSize:"20px"}}>Select All</div>
                        </div>
                      <div style={{marginTop:"15px"}}></div>
                      {cart.map((cartItem) => (
                        <div>
                          <CartCard key={cartItem.product.id} item={cartItem} isChecked={isCheck.includes(cartItem.id)} setIsCheck={setIsCheck} setIsCheckAll={setIsCheckAll}/>
                          <hr style={{height:"2px", backgroundColor:"black"}}/>
                        </div>
                      ))}
                      {
                        cart.length > 0 ?(
                          <div style={{position:"fixed",right:"8%", top:"20%", width:"25%"}} className="border border-dark h-[200px] mt-[40px] w-[300px] md:w-[600px] p-4 flex flex-col justify-between">
                        <h4>SUMMARY</h4>
                        <div>
                          <p className="text-xl md:text-4xl font-bold text-slate-300 hover:text-slate-500">
                            TOTAL ITEMS : &nbsp;{ cart.reduce((acc, curr) =>isCheck.includes(curr.id)? acc + curr.qty : acc, 0)}
                          </p>
                          <p>
                            SUBTOTAL :  {cart.reduce((acc, curr) =>isCheck.includes(curr.id)? acc + curr.product.price * curr.qty: acc, 0)} VND
                          </p>
                          <hr/>
                          <p>
                            TOTAL :  {cart.reduce((acc, curr) =>isCheck.includes(curr.id)? acc + curr.product.price * curr.qty: acc, 0)} VND
                          </p>
                        </div>
                        <div>
                          <button
                            style={{width:"100%", fontWeight:"bold"}}
                            className="bg-[#2a2a2a] w-full text-white p-2 rounded-md cursor-pointer hover:bg-black"
                            onClick={checkout}
                          >
                            CHECKOUT
                          </button>
                        </div>
                      </div>
                        ):<div></div>
                      }
                    </div>
                    
                    
                  </div>
                </div>
        ) : <div></div>
        }
        {cart.length === 0 ? (
                <div className="" style={{padding:"5%"}}>
                  <div className="">
                    <h5 style={{fontSize:"36px"}}>
                      There are no items in the cart
                    </h5>
                  </div>
                  <div className="flex justify-center">
                    <button>
                      <Link style={{color:"white", textDecoration: "none", fontWeight:"bold"}} to="/">Shop Now</Link>
                    </button>
                  </div>
                </div>
               
            ) : (
              <div></div>
            )}   
      </div>
      {/* {
        cart.length > 0 ?()
      } */}
      <br/>
      <br/>
      <br/>
      <br/>
      <footer style={{bottom:0, width:"100%"}}>
                <Footer/>
                </footer>
    </div>
    
  );
};

export default CartPage;

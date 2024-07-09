import { useEffect, useState } from "react";
import NavbarNavigate from "../components/Navbar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';  

import { FaFontAwesome } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { set } from "@cloudinary/url-gen/actions/variable";
import {toast,Toaster } from "react-hot-toast";
import { opacity } from "@cloudinary/url-gen/actions/adjust";
import PaymentCard from "../components/PaymentCard";
import { useNavigate } from "react-router-dom";
import { SuccessOrder, createOrder, createOrderInfo } from "../redux/slices/OrderSlice";
import { removeFromCart } from "../redux/slices/CartSlice";
import { ImOpt } from "react-icons/im";
import { createPaypalOrder } from "../redux/slices/PayPalSlice";


export default function OrderPage(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // list items
    const order = useSelector((state) => state.order);
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [address, setAddress] = useState();

    const [open, setOpen] = useState(false);
    const [other, setOther] = useState(false);

    const [addressType, setAddressType] = useState("Home");
    
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [commune, setCommune] = useState("");

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    
    const [addressDetail, setAddressDetail] = useState("");
    
    
    // address
    const [selectAddress, setSelectAddress] = useState();
    //ship method
    const [shipmentMethod, setShipmentMethod] = useState("STANDARD");
    // ship cost
    const [cost, setCost] = useState(0);
    // phone
    const [phone, setPhone] = useState("");    
    // payment
    const [payment, setPayment] = useState("COD");
    // total
    // {order[0].reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)+cost} 

    // coupon 
    const [code ,setCode] = useState("");
    const [coupon, setCoupon] = useState([]);
    const [totalDiscount, setTotalDiscount] = useState(0);
    
    console.log(order[0]?.map(item =>{
         return {
           itemId: item.product.id,
           quantity: item.qty
         }
       })   )
    console.log(address)
    console.log(provinces)
    console.log(selectAddress)
    // console.log(provinces?.filter(a => a.Name=== selectAddress?.province))
    console.log(payment)
    console.log(coupon)

    // useEffect
    useEffect(()=>{
      if(order.length >0){
        fetchAddressValue()
        fetchUserAddress()
      }else{
        navigate("/")
      }
      

    },[])

    const fetchUserAddress =() =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/address/all`,{
          headers: {
                'Authorization' : `Bearer ${user.access_token}`
          }
        }).then(res => res.json())
        .then(json =>{
          console.log(json)
          setAddress(json) 
        } )
        
    }

    const fetchAddressValue = () => {
      fetch("https://michaelpi1912.github.io/api.v1/data.json")
      .then(res => res.json())
      .then(json => setProvinces(json))
    }
    const handleClickOpen = () =>{
      setOpen(true);
    };
    const handleClickClose = () =>{
        setOpen(false);
    }

   const addAddress = () => {
        if (province.length > 0 && district.length >0 && commune.length > 0 && addressDetail.length > 0) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/address/insert", {
            method: "POST",
            body: JSON.stringify({
              province,
              district,
              commune,
              addressDetail,
              addressType
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${user.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    // loadProductItem()
                    setCommune("")
                    setDistrict("")
                    setProvince("")
                    setAddressDetail("")
                    setAddressType("Home")
                    fetchUserAddress()
                    handleClickClose()
                }
            })
        }else{
          toast.error("Please fill in for address detail and select all.")
        }
    };
    const checkout = () => {
      // console.log("paymentType:"+ payment,
      //   shipmentMethod,
      //   phone,
      //   "total:"+ order[0].reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)+cost+caculatorDiscount(),
      //   "shippingCost:"+ cost,
      //   "itemRequests: "+
      //     order[0].map(item =>{
      //       return {
      //         itemId: item.product.id,
      //         quantity: item.qty
      //       }
      //     })   
      //   ,
      //   "addressId:"+ selectAddress.id,
      //   "coupons:"+ coupon)
        if (selectAddress) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/order/insert", {
            method: "POST",
            body: JSON.stringify({
                paymentType: payment,
                shipmentMethod,
                phone,
                total: order[0].reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)+cost+caculatorDiscount(),
                shippingCost: cost,
                itemRequests: 
                  order[0].map(item =>{
                    return {
                      itemId: item.product.id,
                      quantity: item.qty
                    }
                  })   
                ,
                address: selectAddress.addressType +": "+ selectAddress.addressDetail+","+ selectAddress.commune +","+ selectAddress.district + ","+ selectAddress.province,
                coupons: coupon
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${user.access_token}`
            },
          })
            .then(response => {
              // console.log(response.status)
                if(response.status === 200){
                  
                  toast.success("Order Success")
                    order[0].map(item =>{
                      dispatch(removeFromCart(item.id))
                    })
                    dispatch(SuccessOrder());
                    // dispatch()
                    navigate("/")
                }
            })
        }
    };
    const loadPayPalPage = () =>{
      const desc= `user ${user.user.username} place an order` 
      fetch(process.env.REACT_APP_API_URL+"/api/v1/payment/create", {
        method: "POST",
        body:JSON.stringify({
          total: order[0].reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)+cost+caculatorDiscount(),
          description: desc
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Authorization': `Bearer ${user.access_token}`
        },
      }).then(res => res.text().then(
        url => {
          if(url === "Error"){
            toast.error("PayPal is not available !")
          }else{
            window.location.replace(url)
          }
          
        }
      ))
    }
    // order submit
    const handleSubmit = (e) =>{
      e.preventDefault();
      if(payment ==="COD"){
        checkout()
      }else if(payment ==="PAYPAL"){
        //order info
        const orderInfo = {
          paymentType: payment,
          shipmentMethod,
          phone,
          total: order[0].reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)+cost+caculatorDiscount(),
          shippingCost: cost,
          itemRequests: 
            order[0].map(item =>{
              return {
                itemId: item.product.id,
                quantity: item.qty
              }
            })   
          ,
          addressId: selectAddress.id,
          coupons: coupon
      };
      dispatch(createPaypalOrder({items: orderInfo}))
        loadPayPalPage()
      }
    }
    // change shipping method
    const handleChange= (e) =>{
      setShipmentMethod(e.target.value)
      const ship = provinces?.filter(a => a.Name=== selectAddress?.province)[0].Cost;
      if(e.target.value === "STANDARD"){
        setCost(ship)
      }
      if(e.target.value === "EXPRESS"){
        setCost(ship+ 10000)
      }
      if(e.target.value === "PRIORITY"){
        setCost(ship+20000)
      }

    }

    const handleAddCoupon = (code) => {
      if(coupon.length >= 1){
        toast.error("You are only allowed to use one coupon")
      }else{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/coupon/check/${code}`,{
        headers: {
              'Authorization' : `Bearer ${user.access_token}`
        }
        })
        .then(res => res.json())
        .then(json =>{
          console.log(json)
          if(json.code === null){
            toast.error("Coupon not available")
          }else{
            setCoupon(cur => [...cur, json])
          }
        })
      }
        
    }
    function caculatorDiscount(){
      let sum = 0;
      coupon.map(c =>{
        if(c.discountType === "FixedDiscount"){
          sum = sum - c.maxValue;
        }else{
          sum = sum - order[0]?.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)*c.amount/100
        }
      })

      return sum;
    }
    const deleteCoupon = (item) =>{
      setCoupon(coupon.filter(v => v.code !== item.code))
    }


    const Truncate = (string, number) => {
      if (!string) {
        return null;
      }
      if (string.length <= number) {
        return string;
      }
      return string.slice(0, number) + "...";
    };

    return (
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px", padding:"60px"}}>
                <h1 style={{fontWeight:"bold"}}>CHECKOUT</h1>
                <br/>
                <form onSubmit={handleSubmit}>
                {/* Items */}
                <div style={{width:"60%"}} className="border border-dark">
                  <div style={{padding:"5%"}}>
                    <h3 style={{fontWeight:'bold'}}>ITEMS</h3>
                    <hr/>
                    <div className="d-flex flex-wrap">
                      {
                      order[0]?.map((item) =>(
                        <div className="d-flex">
                            <img
                              src={"https://res.cloudinary.com/djz6golwu/image/upload/"+item.product?.productImages[0]}
                              alt=""
                              width={150}
                              height={150}
                            />
                            <div>
                              <p>X{item.qty}</p>
                            </div>
                        </div>
                      ))
                    }
                    </div>
                  </div>
                </div>
                <br/>
                {/* address */}
                <div style={{width:"60%"}} className="border border-dark">
                    <div style={{padding:"5%"}}>
                        <h3 style={{fontWeight:'bold'}}>SHIPPING ADDRESS</h3>
                        <hr/>
                        <div className="d-flex gap-4">
                            <select  style={{width:"70%", height:"50px"}} onChange={e =>{
                              setSelectAddress(address?.addressList[e.target.value])
                              setCost(provinces?.filter(a => a.Name=== address?.addressList[e.target.value]?.province)[0].Cost)}
                            } required>
                                <option selected disabled value="">Please select address</option>
                                {
                                  address?.addressList?.map((el, index) =>(<option value={index}>{
                                    Truncate(el.addressType +": "+ el.addressDetail+","+ el.commune +","+ el.district + ","+ el.province, 50)
                                    }</option>))
                                }
                            </select>
                            <button style={{background: "green", height:"50px"}} className="" onClick={handleClickOpen}><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>New Address</strong></button>
                        </div>
                        <br/>
                        {
                          selectAddress ?
                          <div>
                            {/* <p>Address Type: {selectAddress.addressType}</p> */}
                            <p>{ "Address : "+ selectAddress.addressDetail+","+ selectAddress.commune +","+ selectAddress.district + ","+ selectAddress.province}</p>
                          </div> : <div></div>
                        }
                        <br/>
                        <h5>PHONE NUMBER</h5>
                    
                        <input type="text" maxLength={10} minLength={10} style={{width:"70%"}} onChange={(e) => setPhone(e.target.value)} required/>
                        
                        
                    </div>
                    
                </div>
                <br/>
                {/* SHIPMENT */}
                <div style={{width:"60%", pointerEvents:selectAddress?"":"none", opacity:selectAddress?"":"0.4"}} className="border border-dark">
                  <div style={{padding:"5%"}}>
                    <h3 style={{fontWeight:'bold'}}>SHIPMENT</h3>
                    <hr/>
                    <div style={{display: selectAddress?"":"none"}}>
                      <h5>SHIPMENT METHOD</h5>
                      <div>
                        <input
                          type="radio"
                          name="method"
                          value="STANDARD"
                          id="standard"
                          checked={shipmentMethod === "STANDARD"}
                          onChange={handleChange}
                        />
                        <label htmlFor="standard">STANDARD</label>
                          <br/>
                        <input
                          type="radio"
                          name="method"
                          value="EXPRESS"
                          id="express"
                          checked={shipmentMethod === "EXPRESS"}
                          onChange={handleChange}
                        />
                        <label htmlFor="express">EXPRESS</label>
                          <br/>
                        <input
                          type="radio"
                          name="method"
                          value="PRIORITY"
                          id="priority"
                          checked={shipmentMethod === "PRIORITY"}
                          onChange={handleChange}
                        />
                        <label htmlFor="priority">PRIORITY</label>
                        </div>
                        <br/>
                        <div>
                          <div><strong>SHIPPING TO :</strong> {selectAddress?.province}</div>
                        </div>
                        <hr/>
                        <p><strong>COST : </strong>{
                          cost} </p>
                      </div>
                    </div>
                </div>
                <br/>
                {/* COUPON SIDE */}
                <div style={{width:"60%"}} className="border border-dark">
                  <div style={{padding:"5%"}}>
                    <h3 style={{fontWeight:'bold'}}>COUPON</h3>
                    <hr/>
                    <div className="d-flex gap-4">
                      <input type="text" onChange={e => setCode(e.target.value)}/>
                      <button type="button" onClick={()=> handleAddCoupon(code)}>Add Coupon</button>
                    </div>
                    <br/>
                    <div className="d-flex gap-2 flex-wrap">
                      {
                      coupon.map((c) => (
                        <div className="d-flex gap-2" style={{border:"1px solid black", width:"350px",padding:"2%",alignItems:"end"}}>
                          <div className="p-2" style={{width:"90%"}}>
                            <p><strong>Code:</strong> {c.code}</p>
                            <p><strong>Name:</strong> {c.name}</p>
                            <p><strong>Value:</strong> {c.discountType === "PercentageDiscount"? c.amount+"% Subtotal": c.amount+"VND"}</p>
                            <p><strong>Description:</strong> {c.name}</p>
                          </div>
                          

                          <button className="ml-auto p-2" style={{alignSelf:"start",width:"10%", background:"none", color:'black',fontSize:"24px"}} onClick={()=> deleteCoupon(c)}><i class="bi bi-x-circle"></i></button>
                        </div>
                      ))
                    }
                    </div>
                    
                  </div>
                  

                </div>
                <br/>
                {/* Payment Option */}
                <div style={{width:"60%", pointerEvents:cost>0?"":"none", opacity:cost>0?"":"0.4"}} className="border border-dark">
                  <div style={{padding:"5%"}}>
                    <h3 style={{fontWeight:'bold'}}>PAYMENT OPTION</h3>
                    <hr/>
                    <PaymentCard payment={payment} setPayment={setPayment}/>
                  </div>
                  

                </div>
                {/* Summarry */}
                <div style={{position:"fixed",right:"8%", top:"20%",width:"25%"}} className="border border-dark h-[200px] mt-[40px] w-[300px] md:w-[600px] p-4 flex flex-col justify-between">
                <h4>SUMMARY</h4>
                <div>
                  <p className="text-xl md:text-4xl font-bold text-slate-300 hover:text-slate-500">
                    TOTAL ITEMS : &nbsp;
                    { order[0]?.reduce((acc, curr) => acc+ curr.qty, 0)}
                  </p>
                  <p>
                    SUBTOTAL : &nbsp;
                     {order[0]?.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)}
                     &nbsp; VND
                  </p>
                  <p>
                    SHIPPING COST : &nbsp;
                     {cost}
                     &nbsp; VND
                  </p>
                  <p>
                    DISCOUNT : &nbsp;
                     {caculatorDiscount()}
                     &nbsp; VND
                  </p>
                  <hr/>
                  <p>
                    TOTAL : &nbsp;
                     {order[0]?.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0)+cost+ caculatorDiscount()} 
                     VND
                  </p>
                </div>
                <button type="submit"><strong>CHECKOUT</strong></button>
              </div>
                </form>
              {/* new address modal */}
              <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>New Address Shipping</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form.Group>
                                <Form.Label style={{fontWeight:"bold"}}>ADDRESS TYPE</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value ==="other"){
                                    setOther(true)
                                  }else{
                                    // setProvince(e.target)
                                    setOther(false)
                                    setAddressType(e.target.value)
                                  }
                                }}>
                                    <option value="Home">🏠 HOME</option>
                                    <option value="Office" >🏢 Office</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                                <br/>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    autoFocus
                                    style={{display: other === true ? "" :"none"}}
                                    onChange={(e) => setAddressType(e.target.value)}
                                />
                                <Form.Label style={{fontWeight:"bold"}}>PROVINCE</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  // console.log(e.target.value == -1)
                                  if(e.target.value === -1){
                                    setCommunes([])
                                    setDistricts([])
                                  }else{
                                    setDistricts(provinces[e.target.value].Districts)
                                    setProvince(provinces[e.target.value].Name)
                                  }
                                  
                                }} required>
                                  <option value={-1} disabled selected>Please select a province</option>
                                    {
                                      provinces?.map((p,index) =>(
                                        <option value={index}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>DISTRICT</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value === -1){
                                    setCommunes([])
                                    // setDistricts([])
                                  }else{
                                    setCommunes(districts[e.target.value].Wards)
                                    setDistrict(districts[e.target.value].Name)
                                  }
                                }} required>
                                  <option value={-1} disabled selected>Please select your district</option>
                                  {
                                      districts?.map((p,index) =>(
                                        <option value={index}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>WARD</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value === -1){
                                    setCommune("")
                                  }else{
                                    setCommune(communes[e.target.value].Name)
                                  }
                                }} required>
                                  <option value={-1} disabled selected>Please select your ward</option>
                                  {
                                      communes?.map((p,index) =>(
                                        <option value={index}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>ADDRESS DETAIL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    required
                                    onChange={e =>{
                              
                                      setAddressDetail(e.target.value)}}
                                    // minLength={10}
                                />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickClose}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={() => addAddress()}>
                                Add
                            </button>
                            </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
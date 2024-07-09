import { useParams, useNavigate } from "react-router-dom";
import NavbarNavigate from "../components/Navbar";
import ProfileSideBar from "../components/ProfileSideBar";
import { useEffect, useState } from "react";
import DateConvert from "../components/DateConvert";
import OrderAction from "../components/OrderAction";

export default function OrderDetail(){
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const {id} = useParams();
    const [order, setOrder] = useState();
    const navigate = useNavigate()
    useEffect(()=>{
        fetchOrder()
    },[])
    console.log(order)
    const fetchOrder=()=>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/${id}`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setOrder(json);
            }
        )
    }
    const loadData = () =>{
        navigate(-1);
    }
    return(
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px"}} className="d-flex">
                <ProfileSideBar />
                <div style={{padding:"5%", width:"70%"}}>
                   {/* <a style={{background:"none", color:"black", fontSize:"24px",fontWeight:"bold"}} onClick={() => navigate(-1)}>
                        <i class="bi bi-arrow-left"></i> &nbsp;Go back
                        </a> */}
                    <div className="d-flex" style={{fontWeight:"bold", fontSize:"32px"}}> 
                        
                        Order Details #{order?.code}
                    </div>
                    <br/>
                    <div>
                        <div style={{border:"1px solid black"}}>
                            <h4 style={{padding:"10px"}}>Order Items</h4>
                            <hr/>
                            <table >
                            <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                            <tr style={{borderBottom:"1px solid black"}} >
                                <th style={{width:"25%",border:"0"}}>Product</th>
                                <th style={{width:"25%",border:"0"}}></th>
                                <th style={{width:"20%",border:"0"}}>Options</th>
                                <th style={{width:"20%",border:"0"}}>Price</th>
                                <th style={{width:"10%",border:"0"}}>QTY</th>
                                <th style={{width:"30%",border:"0"}}>Total</th>
                            </tr></thead>
                            {
                                order?.orderLines?.map((line) => (
                               
                                    <tr style={{borderBottom:"1px solid black", height:"60px"}}>
                                        <td style={{border:"0"}}>{line.productItem?.name}</td>
                                        <td style={{border:"0"}}>
                                            <img src={"https://res.cloudinary.com/djz6golwu/image/upload/"+line.productItem?.productImages} alt={line.productItem?.name} width={80}/>
                                        </td>
                                        <td style={{border:"0"}}>
                                            {
                                                line.productItem?.options?.map((o) =>(
                                                    <div>{o.value}</div>
                                                ))
                                            }
                                        </td>
                                        <td style={{border:"0"}}>
                                            {line.productItem?.price} VND
                                        </td>
                                        <td style={{border:"0", textAlign:"unset"}}>{line.quantity}
                                            </td>
                                        <td style={{border:"0"}}>
                                            {line.productItem?.price*line.quantity} VND
                                        </td>
                                    </tr>
                              ))
                            }
                            </table>
                           
                            <div className="d-flex flex-column" style={{alignItems:"end"}}>
                                <table style={{width:"50%"}}>
                                <tr style={{border:0}}>
                                        <td style={{border:0}}>Items:</td>
                                        <td style={{border:0, textAlignLast:"right"}}>{order?.orderTotal -order?.shipCost} VND</td>
                                    </tr>
                                    <tr>
                                        <td style={{border:0}}>Shipping costs:</td>
                                        <td style={{border:0, textAlignLast:"right"}}>{order?.shipCost} VND</td>
                                    </tr>
                                    <tr>
                                        <td style={{border:0}}>Invoice discount:</td>
                                        <td style={{border:0, textAlignLast:"right"}}>0 VND</td>
                                    </tr>
                                    <tr style={{borderTop:"1px solid black"}}>
                                        <th style={{border:0}}>Total:</th>
                                        <th style={{border:0, textAlignLast:"right"}}>{order?.orderTotal} VND</th>
                                    </tr>
                                </table>
                            </div>
                            
                        </div>
                        <br/>
                            {/* address box */}
                        <div style={{border:"1px solid black"}}>
                            <h4 style={{padding:"10px"}}>Address</h4>
                            <hr/>
                            <div style={{padding:"2%"}}>
                                <div><strong>Phone :</strong> {order?.phone}</div>
                                {/* <div><strong>Address Type :</strong> {order?.address}</div> */}
                                <div><strong>Address :</strong> {order?.address}</div>
                            </div>
                        </div>
                            <br/>
                        <div style={{border:"1px solid black"}}>
                            <h4 style={{padding:"10px"}}>Orders Detail</h4>
                            <hr/>
                            <div style={{padding:"2%"}}>
                                <div><strong>Status : </strong>{order?.orderStatus?.status}</div>
                                <div className="d-flex"><strong>Order Date :  </strong> &nbsp;<DateConvert date={order?.orderDate}/></div>
                                {
                                    order?.deliveryDate !== null? <div className="d-flex"><strong>Delivery Date :  </strong> &nbsp;<DateConvert date={order?.deliveryDate}/></div>:<></>
                                }
                                <div><strong>Payment Method : </strong> {order?.paymentType}</div>
                                <div><strong>Shipping Method : </strong> {order?.shippingMethod}</div>
                            </div>
                        </div>
                        <br/>
                        {/*  */}
                        
                        <div className="d-flex gap-3 justify-content-end" style={{width:"100%"}}>
                            <button style={{height:"40px", background:"none", color:"black", border:"1px solid black"}} onClick={()=>navigate(-1)}>Back To History</button>
                            <OrderAction order={order} status={order?.orderStatus.status} loadData={loadData}/>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
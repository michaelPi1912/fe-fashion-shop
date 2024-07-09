import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DateConvert from "../../components/DateConvert";
import SideBar from "../../components/SideBar";
import Modal from 'react-bootstrap/Modal';
import toast from "react-hot-toast";


export default function OrderDetailAdmin(){
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });
    const {id} = useParams();
    const [order, setOrder] = useState();
    const [status, setStatus] = useState(0);
    const [edit, setEdit] = useState(false);
    const [desc, setDesc] = useState("");


    const navigate = useNavigate()
    useEffect(()=>{
        fetchOrder()
    },[])
    console.log(order)
    const fetchOrder=()=>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/${id}`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setOrder(json);
            }
        )
    }

    const updateStatus = (orderId, statusId) => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/update/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/update/${orderId}/status/${statusId}?desc=${desc}`, {
          method: 'PUT',
          headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                toast.success("Update Status Successfully")
                setDesc("")
                fetchOrder()
                handleCloseEdit()
            }else{
                toast.error("Cannot Update Status!")
            }
        })

    };

    const handleOpenEdit = (order)=>{
        // setorder(order)
        setStatus(0)
        setEdit(true)
    }

    const handleCloseEdit = () =>{
        setEdit(false)
    }
    
    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding:"5%", width:"70%"}}>
                   <a style={{background:"none", color:"black", fontSize:"24px",fontWeight:"bold"}} onClick={() => navigate(-1)}>
                        <i class="bi bi-arrow-left"></i> &nbsp;Go back
                        </a>
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
                                {/* <div><strong>Address Type :</strong> {order?.address?.addressType}</div> */}
                                <div><strong>Address :</strong> {order?.address}</div>
                            </div>
                        </div>
                            <br/>
                        <div style={{border:"1px solid black"}}>
                            <h4 style={{padding:"10px"}}>Orders Detail</h4>
                            <hr/>
                            <div style={{padding:"2%"}}>
                                <div><strong>Status : </strong>{order?.orderStatus?.status}</div>
                                {
                                    order?.orderStatus?.status ==="Attempted delivery" ?(<div><strong>Description : </strong> {order?.description}</div>) :""
                                }
                                <div className="d-flex"><strong>Order Date :  </strong> &nbsp;<DateConvert date={order?.orderDate}/></div>
                                {
                                    order?.deliveryDate !== null? <div className="d-flex"><strong>Delivery Date :  </strong> &nbsp;<DateConvert date={order?.deliveryDate}/></div>:<></>
                                }
                                <div><strong>Payment Method : </strong> {order?.paymentType}</div>
                                <div><strong>Shipping Method : </strong> {order?.shippingMethod}</div>
                            </div>
                        </div>
                        <br/>
                        <button className="p-2" 
                        style={{ background:"black", display: (order?.orderStatus?.status  ==="Completed" || order?.orderStatus?.status ==="Refunded" || order?.orderStatus?.status ==="Cancelled"|| order?.orderStatus?.status ==="Attempted delivery")? "none" :""}} onClick={() => handleOpenEdit(order)}><strong style={{marginLeft:"5px"}}>Update Status</strong></button>
                    </div>
                </div>
                <Modal show={edit} onHide={handleCloseEdit}>
                                <Modal.Header closeButton>
                                <Modal.Title>Update Status</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                {
                                                       
                                    (
                                        ()=>{
                                            console.log(order?.orderStatus?.status)
                                            if(order?.orderStatus?.status ==="Ordered"){
                                                return(
                                                    <div className="d-flex gap-4 align-items-center">
                                                        <div style={{fontWeight:"bold"}}>STATUS</div>
                                                        <select style={{height:"50px"}} onChange={(e) =>{
                                                            setStatus(e.target.value)
                                                        }}>
                                                            <option value={1}  disabled selected> Ordered </option>
                                                            <option value={2}>In Transit</option>
                                                            <option value={5}>Decline</option>
                                                        </select>
                                                  </div>
                                                )
                                            }else if(order?.orderStatus?.status ==="In Transit"){
                                                return(
                                                    <div>
                                                        <div className="d-flex gap-4 align-items-center">
                                                            <div style={{fontWeight:"bold", width:"20%"}}>STATUS</div>
                                                            <select style={{height:"50px"}}
                                                                onChange={(e) =>{
                                                                setStatus(e.target.value)
                                                                // setorder(order)
                                                                // handleClickOpen()
                                                            }}>
                                                                <option value={2} disabled  selected={order.orderStatus.status ==="In Transit"}>In Transit</option>
                                                                <option value={3}>Completed</option>
                                                                <option value={8}>Attempted delivery</option>
                                                            </select>
                                                        </div>
                                                        <br/>
                                                        {
                                                            status === "8" ?(<div className="d-flex gap-2" style={{display: status !== "8" ? "none" : ""}}>
                                                                <div style={{fontWeight:"bold"}}>DESCRIPTION</div>
                                                                <textarea style={{width:"70%",height:"70px"}} onChange={e=> setDesc(e.target.value)}></textarea>
                                                        </div>):<div></div>
                                                        }
                                                        
                                                    </div>
                                                )
                                            }
                                            else if(order?.orderStatus?.status ==="Declined" ||order?.orderStatus?.status ==="Cancelled"){
                                                if(order?.paymentType ==="PAYPAL"){
                                                    return(
                                                        <div className="d-flex gap-4 align-items-center">
                                                            <div style={{fontWeight:"bold"}}>STATUS</div>
                                                            <select style={{height:"50px"}} onChange={(e) =>{
                                                                setStatus(e.target.value)
                                                                // setorder(order)
                                                                // handleClickOpen(order)
                                                            }}>
                                                                <option disabled selected>Declined </option>
                                                                <option value={6}>Refunded</option>
                                                            </select>
                                                        </div>
                                                    )
                                                }
                                                // return(
                                                //     <div style={{background:"red",color:"white", width:"100px",marginLeft:"10%"}}>{order.orderStatus.status}</div>
                                                // )
                                            }
                                            // else if(order.orderStatus.status ==="Refunded"){
                                            //     return(
                                            //         <div style={{background:"#ffcc33",color:"white"}}>{order.orderStatus.status}</div>
                                            //     )
                                            // }
                                            // else if(order.orderStatus.status ==="Completed"){
                                            //     return(
                                            //         <div style={{background:"green",color:"white"}}>{order.orderStatus.status}</div>
                                            // )
                                            // }
                                            // else if(order?.orderStatus?.status ==="Attempted delivery"){
                                            //     return(
                                            //         <div style={{background:"#ffcc33",color:"white"}}>{order?.orderStatus?.status}</div>
                                            //     )
                                            // }
                                            else if(order?.orderStatus?.status ==="Awaiting Payment"){
                                                return(
                                                    <div className="d-flex gap-4 align-items-center">
                                                        <div style={{fontWeight:"bold"}}>STATUS</div>
                                                        <select style={{height:"50px"}} onChange={(e) => setStatus(e.target.value)}>
                                                            <option disabled selected>Awaiting Payment</option>
                                                            <option value={1}>Ordered</option>
                                                        </select>
                                                    </div>
                                                    
                                                )
                                            }
                                        }
                                    )()
                                }  
                                </Modal.Body>
                                <Modal.Footer >
                                    <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                                        <button style={{backgroundColor:"red"}}  onClick={handleCloseEdit}>
                                        Cancel
                                    </button>
                                    <button style={{backgroundColor:"SteelBlue"}} onClick={() => updateStatus(order.id,status)}>
                                        Update
                                    </button>
                                    </div>
                                
                                </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
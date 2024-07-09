import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateConvert from "../../components/DateConvert";
import Modal from 'react-bootstrap/Modal';
import {toast,Toaster } from "react-hot-toast";

import "../../style/css/admin/remove-arrow.css"


export default function OrdersAdmin(){
    const navigate = useNavigate();

    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const [orders, setOrders] = useState();
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [edit, setEdit] = useState(false);

    const [curOrder, setCurOrder] = useState();
    const [status, setStatus] = useState(0);
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState(0);
    const [desc, setDesc] = useState("");

    const [curPage, setCurPage] = useState(0);
    let paginationNumber = []
    for (let i = 0; i < orders?.totalPages; i++) {
            paginationNumber.push(i);
    }
    // Log
    console.log(statusFilter)
    // const [val, setVal] = useState();
    // let options = [];
    console.log(orders)
    console.log(status)
    console.log(startDate + endDate)

    useEffect(() => {
        if(admin === undefined){
            navigate("/admin")
        }else{
            loadData()
        }
        
    }, []);

    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/all`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setOrders(json)
            }
        )
    }
    const filterData = () =>{
        let date1 = new Date(startDate+" 00:00:00");
        let date2 = new Date(endDate +" 23:59:59");
        let url = "/api/v1/order/all?";
        if(phone !==""){
            url += `phone=${phone}&`
        }
        if(code !==""){
            url +=`code=${code}&`
        }
        if(statusFilter !==0){
            url +=`status=${statusFilter}&`
        }
        if(startDate !=="" && endDate !==""){
            url += `startDate=${startDate}&endDate=${endDate}`
        }
        console.log(url)
        if(startDate ==="" && endDate ===""){
            fetch(`${process.env.REACT_APP_API_URL}`+url,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
            }).then(
                res => res.json()
            ).then(
                json => {
                    setOrders(json)
                    // setCode("")
                    // setPhone("")
                    // setStartDate("")
                    // setEndDate("")
                    // setStatusFilter(0)
                    handleCloseFilter()
                }
            )
        }
        else{
            if(date1<date2){
                fetch(`${process.env.REACT_APP_API_URL}`+url,{
                    headers: {
                        'Authorization' : `Bearer ${admin.access_token}`
                    }
                    }).then(
                        res => res.json()
                    ).then(
                        json => {
                            setOrders(json)
                            // setCode("")
                            // setPhone("")
                            // setStartDate("")
                            // setEndDate("")
                            // setStatusFilter(0)
                            handleCloseFilter()
                        }
                    )
            }else{
                    toast.error("The start date or The end date is not a valid")

            }
        }
        
    }

    const handleClickOpen = () =>{
        setOpen(true);
    };
    const handleClickClose = () =>{
        setOpen(false);
    }

    const handleOpenFilter = () =>{
        setCode("")
        setPhone("")
        setStartDate("")
        setEndDate("")
        setStatusFilter(0)
        setOpenFilter(true);
    };
    const handleCloseFilter = () =>{
        setOpenFilter(false);
    }

    const handleOpenEdit = (order)=>{
        setCurOrder(order)
        setStatus(0)
        setEdit(true)
    }

    const handleCloseEdit = () =>{
        setEdit(false)
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
                loadData()
                handleCloseEdit()
            }else{
                toast.error("Cannot Update Status!")
            }
        })

    };

    const navigatePageable = nums =>{
        setCurPage(nums)
        let date1 = new Date(startDate+" 00:00:00");
        let date2 = new Date(endDate+" 23:59:59");
        let url = `/api/v1/order/all?page=${nums}&`;
        if(phone !==""){
            url += `phone=${phone}&`
        }
        if(code !==""){
            url +=`code=${code}&`
        }
        if(statusFilter !==0){
            url +=`status=${statusFilter}&`
        }
        if(startDate !=="" && endDate !==""){
            url += `startDate=${startDate}&endDate=${endDate}`
        }
        fetch(`${process.env.REACT_APP_API_URL}`+url,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setOrders(json)
            }
        )
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    <div>
                        <h1>Orders</h1>
                        <div className="d-flex gap-3">
                        <button style={{width:"10%"}} onClick={handleOpenFilter}><i class="bi bi-funnel"></i>Filter</button>
                        <button type="reset" style={{ width:"60px"}} onClick={() => loadData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg></button>
                        </div>
                        <hr/>
                        <div>
                            <table >
                                <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                                <tr style={{background:"teal", color:"white",borderBottom:"1px solid black"}} >
                                    <th style={{width:"10%",border:"0"}}>CODE</th>
                                    <th style={{width:"18%",border:"0",textAlignLast:"auto"}}>DATE</th>
                                    <th style={{width:"16%",border:"0"}}>PHONE</th>
                                    <th style={{width:"10%",border:"0",textAlignLast:"auto"}}>TOTAL</th>
                                    {/* <th style={{width:"10%"}}>QUANTITY</th> */}
                                    <th style={{width:"10%",border:"0",textAlign:"center"}}>STATUS</th>
                                    <th style={{width:"20%",border:"0"}}></th>
                                </tr></thead>
                                {
                                    orders !== undefined ? orders.orderList?.map((order) => (
                                
                                        <tr style={{borderBottom:"1px solid black", height:"60px"}}>
                                            <td style={{border:"0"}}>{order.code}</td>
                                            <td style={{border:"0"}}>
                                            <DateConvert date={order.orderDate}/>
                                            </td>
                                            <td style={{border:"0"}}>{order.phone}</td>
                                            <td style={{border:"0"}}>{order.orderTotal}VND</td>
                                            <td style={{textAlign: "center",border:"0"}}>
                                                    {
                                                        order.orderStatus.status
                                                        // (
                                                        //     ()=>{
                                                        //         if(order.orderStatus.status ==="Ordered"){
                                                        //             return(
                                                        //               <select value={order.orderStatus.id} onChange={(e) =>{
                                                        //                 setStatus(e.target.value)
                                                        //                 setCurOrder(order)
                                                        //                 handleClickOpen()
                                                        //               }}>
                                                        //                 <option value={1}  disabled selected> Ordered </option>
                                                        //                 <option value={2}>In Transit</option>
                                                        //                 <option value={5}>Decline</option>
                                                        //               </select>
                                                        //             )
                                                        //         }else if(order.orderStatus.status ==="In Transit"){
                                                        //             return(<select value={order.orderStatus.id} style={{width:"100%"}}
                                                        //             onChange={(e) =>{
                                                        //                 setStatus(e.target.value)
                                                        //                 setCurOrder(order)
                                                        //                 handleClickOpen()
                                                        //             }}>
                                                        //                 <option value={2} disabled  selected={order.orderStatus.status ==="In Transit"}>In Transit</option>
                                                        //                 <option value={3}>Completed</option>
                                                        //                 <option value={8}>Attempted delivery</option>
                                                        //             </select>)
                                                        //         }else if(order.orderStatus.status ==="Declined" ||order.orderStatus.status ==="Cancelled"){
                                                        //             if(order.paymentType ==="PAYPAL"){
                                                        //                 return(
                                                        //                     <select value={order.orderStatus.id} onChange={(e) =>{
                                                        //                         setStatus(e.target.value)
                                                        //                         setCurOrder(order)
                                                        //                         handleClickOpen(order)
                                                        //                     }}>
                                                        //                         <option disabled selected>-- Declined --</option>
                                                        //                         <option value={6}>Refunded</option>
                                                        //                     </select>
                                                        //                 )
                                                        //             }
                                                        //             return(
                                                        //                 <div style={{background:"red",color:"white", width:"100px",marginLeft:"10%"}}>{order.orderStatus.status}</div>
                                                        //             )
                                                        //         }else if(order.orderStatus.status ==="Refunded"){
                                                        //             return(
                                                        //                 <div style={{background:"#ffcc33",color:"white"}}>{order.orderStatus.status}</div>
                                                        //             )
                                                        //         }else if(order.orderStatus.status ==="Completed"){
                                                        //             return(
                                                        //                 <div style={{background:"green",color:"white"}}>{order.orderStatus.status}</div>
                                                        //         )
                                                        //         }
                                                        //         else if(order.orderStatus.status ==="Attempted delivery"){
                                                        //             return(
                                                        //                 <div style={{background:"#ffcc33",color:"white"}}>{order.orderStatus.status}</div>
                                                        //         )
                                                        //         }
                                                        //         // else if(order.orderStatus.status ==="Awaiting Payment"){
                                                        //         //     return(
                                                        //         //         <select>
                                                        //         //             <option disabled selected>Awaiting Payment</option>
                                                        //         //             <option value={1}>Ordered</option>
                                                        //         //         </select>)
                                                        //         // }
                                                        //     }
                                                        // )()
                                                    }     
                                            </td>
                                            <td className="d-flex gap-3 justify-content-end align-items-center" style={{height:"60px",border:"0"}}>
                                                <button className="p-2" style={{
                                                    background:"#4CAF50", 
                                                    display: (order.orderStatus.status  ==="Completed" || order.orderStatus.status ==="Refunded" || order.orderStatus.status ==="Cancelled"|| order?.orderStatus?.status ==="Attempted delivery")? "none" :""
                                                    }} onClick={() => handleOpenEdit(order)}><i class="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Update Status</strong></button>
                                                <a href={"/orders/"+order.id}>Detail</a>
                                                {/* <OrderAction status={order.orderStatus.status}/> */}
                                            </td>
                                        </tr>
                                )) : <h1>load data</h1>
                                }
                            </table>
                            <br/>
                            {/* Navigate */}
                            <nav aria-label="Page navigation example" style={{left:"45%"}}>
                        <ul class="pagination justify-content-center">
                            <li class="page-item">
                                <a class="page-link" onClick={() =>{
                                    navigatePageable(curPage === 0 ? 0 : curPage -1)
                                }} aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                        
                                </a>
                            </li>
                            {
                                paginationNumber.map((nums) =>{
                                    return <li class="page-item" style={{textDecoration:nums===curPage ? "underline":""}}><a class="page-link" onClick={()=>navigatePageable(nums)}>{nums +1}</a></li>
                                })
                            }
                            <li class="page-item">
                                <a class="page-link" onClick={() =>{
                                    navigatePageable(paginationNumber[curPage+1] !== undefined ? paginationNumber[curPage+1]: paginationNumber[curPage])
                                }} aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                            </nav>
                            {/* warning update */}
                            <Modal show={open} style={{textAlign:'center'}}>
                                <Modal.Body >
                                    {/* <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i> */}
                                    <h4>Update Status</h4>
                                    <p >Do you really want to change Status of this Order?<br/> This process cannot be undone</p>
                        
                                </Modal.Body>
                                <Modal.Footer >
                                    <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                                        <button style={{backgroundColor:"red"}}  onClick={handleClickClose}>
                                        Cancel
                                    </button>
                                    <button style={{backgroundColor:"SteelBlue"}} onClick={() => updateStatus(curOrder.id,status)}>
                                        Update
                                    </button>
                                    </div>
                                
                                </Modal.Footer>
                            </Modal>

                            {/* edit status */}
                            <Modal show={edit} onHide={handleCloseEdit}>
                                <Modal.Header closeButton>
                                <Modal.Title>Update Status</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                {
                                                       
                                    (
                                        ()=>{
                                            console.log(curOrder?.orderStatus?.status)
                                            if(curOrder?.orderStatus?.status ==="Ordered"){
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
                                            }else if(curOrder?.orderStatus?.status ==="In Transit"){
                                                return(
                                                    <div>
                                                        <div className="d-flex gap-4 align-items-center">
                                                            <div style={{fontWeight:"bold", width:"20%"}}>STATUS</div>
                                                            <select style={{height:"50px"}}
                                                                onChange={(e) =>{
                                                                setStatus(e.target.value)
                                                                // setCurOrder(order)
                                                                // handleClickOpen()
                                                            }}>
                                                                <option value={2} disabled  selected={curOrder.orderStatus.status ==="In Transit"}>In Transit</option>
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
                                            else if(curOrder?.orderStatus?.status ==="Declined" ||curOrder?.orderStatus?.status ==="Cancelled"){
                                                if(curOrder?.paymentType ==="PAYPAL"){
                                                    return(
                                                        <div className="d-flex gap-4 align-items-center">
                                                            <div style={{fontWeight:"bold"}}>STATUS</div>
                                                            <select style={{height:"50px"}} onChange={(e) =>{
                                                                setStatus(e.target.value)
                                                                // setCurOrder(order)
                                                                // handleClickOpen(curOrder)
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
                                            // else if(curOrder.orderStatus.status ==="Refunded"){
                                            //     return(
                                            //         <div style={{background:"#ffcc33",color:"white"}}>{order.orderStatus.status}</div>
                                            //     )
                                            // }
                                            // else if(order.orderStatus.status ==="Completed"){
                                            //     return(
                                            //         <div style={{background:"green",color:"white"}}>{order.orderStatus.status}</div>
                                            // )
                                            // }
                                            // else if(curOrder?.orderStatus?.status ==="Attempted delivery"){
                                            //     return(
                                            //         <div style={{background:"#ffcc33",color:"white"}}>{curOrder?.orderStatus?.status}</div>
                                            //     )
                                            // }
                                            else if(curOrder?.orderStatus?.status ==="Awaiting Payment"){
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
                                    <button style={{backgroundColor:"SteelBlue"}} onClick={() => updateStatus(curOrder.id,status)}>
                                        Update
                                    </button>
                                    </div>
                                
                                </Modal.Footer>
                            </Modal>
                            {/* Filter */}
                            <Modal show={openFilter} onHide={handleCloseFilter} >
                                <Modal.Title style={{textAlign:"center", fontWeight:"bold", fontSize:"32px"}}>Filter Order</Modal.Title>
                                    <hr/><Modal.Body>       
                                    
                                    <div className="gap-2 d-flex flex-column">
                                                    
                                    <div>
                                        <label>Code : &nbsp; &nbsp;</label>
                                        <input type="text" maxLength={6} onChange={e => setCode(e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Phone : &nbsp;</label>
                                        <input type="number"  maxLength={10} onChange={e => setPhone(e.target.value)} />
                                    </div> 
                                    <div>
                                        <label>Order Status: &nbsp;</label>
                                        <select onChange={e => setStatusFilter(e.target.value)}>
                                            <option value={0}> Select Status</option>
                                            <option value={1}>Ordered</option>
                                            <option value={2}>In Transit</option>
                                            <option value={3}>Completed</option>
                                            <option value={4}>Cancelled</option>
                                            <option value={5}>Declined</option>
                                            <option value={6}>Refunded</option>
                                            <option value={7}>Awaiting Payment</option>
                                            <option value={8}>Attempted delivery</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label>Date From: &nbsp;</label>
                                        <input type="date" onChange={e => setStartDate(e.target.value)}/>
                                        &nbsp;
                                        &nbsp;
                                        <label>To: &nbsp;</label>
                                        <input type="date" onChange={e => setEndDate(e.target.value)}/>
                                    </div>
                                </div>
                                </Modal.Body>
                                <Modal.Footer >
                                    <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                                        <button style={{backgroundColor:"white",color:"black",border:"1px solid black" }}  onClick={handleCloseFilter}>
                                        Close
                                    </button>
                                    <button style={{backgroundColor:"#0066cc"}} onClick={() => filterData()}>
                                        Filter
                                    </button>
                                    </div>
                                
                                </Modal.Footer>
                            </Modal>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
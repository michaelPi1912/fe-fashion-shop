import { useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from "react-redux";
import { SuccessOrder, createOrder } from "../redux/slices/OrderSlice";
import { useNavigate } from "react-router-dom";

export default function OrderAction({order, status, loadData}){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [open, setOpen] = useState(false);
    const [orderLines, setOrderLines] =useState([]);

    console.log(orderLines)
    const handleClickOpen = () =>{
        setOpen(true);
    };
    const handleClickClose = () =>{
        setOpen(false);
    }

    const reOrder=() =>{
        getOrderLine();
        if(orderLines.length > 0){
            dispatch(SuccessOrder())
            dispatch(createOrder({items: orderLines}))
            navigate("/order")
        }
    }

    const getOrderLine= () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/orderLine/${order.id}`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                json.map((item,i) =>{
                    setOrderLines(cur => [...cur,{id: i,product: item.productItem, qty: item.quantity}])
                })
            }
        )
    }

    const cancelOrder = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/cancel/${order.id}`, {
          method: 'PUT',
          headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${user.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                loadData()
                handleClickClose()
            }
        })

    };


    return(
        <div>
            {
                (()=>{
                        // console.log(status ==="Ordered")
                        if(status === "Ordered"){
                            return(<button style={{background:"red", height:"40px"}} onClick={handleClickOpen}>Cancel</button>)
                        }
                        else if(status==="Completed"||status==="Cancelled"){
                            return(<button style={{background:"#0099ff", height:"40px"}} onClick={() => reOrder()}>Re-Order</button>)
                        }else{
                            return(<div></div>)
                        }
                })()
            }
            <Modal show={open} onHide={handleClickOpen} style={{textAlign:'center'}}>
                    <Modal.Body >
                        {/* <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i> */}
                        <h4>Cancel Order</h4>
                        <p >Do you really want to Cancel this order?<br/> This process cannot be undone</p>
            
                    </Modal.Body>
                    <Modal.Footer >
                        <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                            <button style={{backgroundColor:"grey"}}  onClick={handleClickClose}>
                            No
                        </button>
                        <button style={{backgroundColor:"red"}} onClick={() => cancelOrder()}>
                            Yes
                        </button>
                        </div>
                    
                    </Modal.Footer>
                </Modal>
        </div>
    )
}
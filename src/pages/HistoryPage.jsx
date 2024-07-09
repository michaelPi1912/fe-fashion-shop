import { useEffect,  useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarNavigate from "../components/Navbar";
import ProfileSideBar from "../components/ProfileSideBar";
import Footer from "../components/Footer";
import DateConvert from "../components/DateConvert";
import OrderStatus from "../components/OrderStatus";
import OrderAction from "../components/OrderAction";
import toast from "react-hot-toast";
export default function HistoryPage(){

    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState();
    const [curPage, setCurPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    let paginationNumber = []
    for (let i = 0; i < orders?.totalPages; i++) {
            paginationNumber.push(i);
    }
    console.log(orders)
    useEffect(() =>{
        if(!localStorage.getItem("user-info")){
            navigate("/")
        }else{
            loadData()
        }
    },[])
    
    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/user`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
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
        let date1 = new Date(startDate+ " 00:00:00");
        let date2 = new Date(endDate +" 23:59:59");
        console.log(date1 + date2)
        let url = "/api/v1/order/user?";
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
                'Authorization' : `Bearer ${user.access_token}`
            }
            }).then(
                res => res.json()
            ).then(
                json => {
                    setOrders(json)
                }
            )
        }
        else{
            if(date1<date2){
                fetch(`${process.env.REACT_APP_API_URL}`+url,{
                    headers: {
                        'Authorization' : `Bearer ${user.access_token}`
                    }
                    }).then(
                        res => res.json()
                    ).then(
                        json => {
                            setOrders(json)
                        }
                    )
            }else{
                    toast.error("The start date or The end date is not a valid")

            }
        }
        
    }
    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/user?page=${nums}`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setOrders(json)
            }
        )
    }
    // console.log(orders[0]?.orderStatus.status)
    return(
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px"}} className="d-flex">
                <ProfileSideBar />
                <div style={{padding:"5%", width:"85%"}}>
                    <h2>HISTORY</h2>
                    <form>
                    <div className="d-flex gap-4">
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
                            <label>Date From : &nbsp;</label>
                        <input type="date" onChange={e=> setStartDate(e.target.value)}/>
                        </div>
                        <div>
                            <label>To : &nbsp;</label>
                        <input type="date" onChange={e=> setEndDate(e.target.value)}/>
                        </div>
                        <button type="button" style={{height:"100%", width:"90px",padding:"2px"}} onClick={() => filterData()}><i class="bi bi-search"></i>&nbsp;Search</button>
                        <button style={{height:"100%", width:"80px",padding:"2px"}} type="reset" onClick={() =>{loadData()}}><i class="bi bi-arrow-clockwise"></i>Reset</button>
                    </div>
                    </form>
                    <hr/>
                    <div>
                    <table >
                            <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                            <tr style={{background:"teal", color:"white",borderBottom:"1px solid black"}} >
                                <th style={{width:"10%",border:"0"}}>CODE</th>
                                <th style={{width:"18%",border:"0",textAlignLast:"auto"}}>DATE</th>
                                <th style={{width:"18%",border:"0",textAlignLast:"auto"}}>DELIVERY DATE</th>
                                <th style={{width:"10%",border:"0",textAlignLast:"auto"}}>TOTAL</th>
                                {/* <th style={{width:"10%"}}>QUANTITY</th> */}
                                <th style={{width:"5%",border:"0",textAlign:"center"}}>STATUS</th>
                                <th style={{width:"10%",border:"0"}}></th>
                            </tr></thead>
                            {
                                orders !== undefined ? orders.orderList?.map((order) => (
                               
                                    <tr style={{borderBottom:"1px solid black", height:"60px"}}>
                                        <td style={{border:"0"}}>{order.code}</td>
                                        <td style={{border:"0"}}>
                                           <DateConvert date={order.orderDate}/>
                                        </td>
                                        <td style={{border:"0"}}><DateConvert date={order.deliveryDate}/></td>
                                        <td style={{border:"0"}}>{order.orderTotal}VND</td>
                                        <td style={{textAlign: "center",border:"0"}}>
                                            <OrderStatus status={order.orderStatus.status}/>
                                        </td>
                                        <td className="d-flex gap-3  align-items-center" style={{height:"60px",border:"0",textAlign:"center"}}>
                                            {/* <a href={"/order-detail/"+order.id}>Detail</a> */}
                                            <button style={{background:"seagreen", height:"40px", width:"100px"}} onClick={() => navigate("/order-detail/"+order.id)}>Detail</button>
                                            <OrderAction order={order} status={order.orderStatus.status} loadData={loadData}/>
                                        </td>
                                    </tr>
                              )) : <h1>load data</h1>
                            }
                            </table>
                    </div>
                    {/* navigate */}
                    <nav aria-label="Page navigation example" style={{bottom: "0", position:"absolute", left:"55%"}}>
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
                                        return <li class="page-item"><a class="page-link" onClick={()=>navigatePageable(nums)}>{nums +1}</a></li>
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
                </div>
            </div>
            <Footer/>
        </div>
    );
}
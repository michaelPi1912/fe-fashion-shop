import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StackedBarChart from "../../components/StackBarChart";
import toast from "react-hot-toast";
export default function Statistics(){
    const navigate = useNavigate();
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const date = new Date();
    let firstDate = new Date(date.getFullYear(), date.getMonth()-1,2);
    let endDate = new Date(date.getFullYear(), date.getMonth(),1);
    const [start, setStart] = useState(firstDate.toISOString().substring(0,10))
    const [end, setEnd] = useState(endDate.toISOString().substring(0,10))
    // let startValue = start.toISOString().substring(0,10);
    // let endValue = end.toISOString().substring(0,10)
    const [sales, setSales] = useState(0);
    const [orders, setOrders] = useState(0);
    const [avg, setAvg] = useState(0);
    // console.log(start.toISOString().substring(0,10), end)
    const [dates,setDates] = useState([]);
    const [cashs,setCashs] = useState([]);
    const [paypals, setPaypals] = useState([]);

    console.log(dates, cashs, paypals)
    useEffect(() =>{
        if(admin === undefined){
            navigate("/admin")
        }else{
            fetchData()
        }
    },[])

    const fetchData =() =>{
        let date1 = new Date(start+" 00:00:00");
        let date2 = new Date(end+" 23:59:59");
        if(date1 > date2){
            toast.error("Date is incorrect")
        }else{
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/statistics?start=${start}&end=${end}`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                console.log(json)
                setSales(json.sale)
                setAvg(json.avg)
                setOrders(json.orders)
                setDates(json.dates)
                setCashs(json.saleDate)
                setPaypals(json.saleDatePayPal)
            }
        )
        }
        
    }

    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    <div>
                        <h1><strong>Statistics</strong></h1>
                        <form>
                            <div style={{border:"1px solid black",padding:"2%"}} className="">
                                <div className="d-flex">
                                    <div style={{width:"15%"}}>
                                        <label ><strong>From</strong></label>&nbsp;
                                        <input type="date" value={start} style={{width:"70%"}} onChange={e => setStart(e.target.value)}/>
                                    </div>
                                    <div style={{width:"15%"}}>
                                        <label ><strong>To</strong></label>&nbsp;
                                        <input type="date" value={end} style={{width:"70%"}} onChange={e=> setEnd(e.target.value)}/>
                                    </div>
                             
                                     
                                <button type="button" style={{height:"30px",width:"100px", textAlign:'center'}} onClick={() => fetchData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>&nbsp; Search</button>
                                &nbsp;
                                <button style={{height:"30px", width:"60px"}} type="reset" 
                                    onClick={() => {
                                        window.location.reload()

                                        setStart(firstDate)
                                        setEnd(endDate)
                                    }}
                                ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                </svg></button>
                                </div>
                               
                            
                            </div> 
                        </form>                        
                        <hr/><br/>
                        <div className="d-flex gap-2">
                            <div style={{backgroundColor:"#666699", width:"30%",height:"150px", borderRadius:"20px", color:"white"}}   >
                                <div style={{padding:"3%"}}>
                                    <h4 style={{fontWeight:"bold"}}>Sales</h4>
                                    <p style={{fontSize:"18px"}}>{sales.toLocaleString()} VND</p>
                                </div>
                                
                            </div>
                            <div style={{backgroundColor:"#666699", width:"30%",height:"150px", borderRadius:"20px", color:"white"}}   >
                                <div style={{padding:"3%"}}>
                                    <h4 style={{fontWeight:"bold"}}>Orders</h4>
                                    <p style={{fontSize:"18px"}}>{orders.toLocaleString()}</p>
                                </div>
                            </div>
                            <div style={{backgroundColor:"#666699", width:"30%",height:"150px", borderRadius:"20px", color:"white"}}   >
                                <div style={{padding:"3%"}}>
                                    <h4 style={{fontWeight:"bold"}}>Avg order value</h4>
                                    <p style={{fontSize:"18px"}}>~ {(avg).toLocaleString()} VND</p>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div style={{width:"99%"}}>
                            <StackedBarChart labels={dates} cash={cashs} paypal={paypals}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
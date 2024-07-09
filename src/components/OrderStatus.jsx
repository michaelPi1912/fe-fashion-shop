

export default function OrderStatus({status}){    
    return(
        <div>
            {
                (()=>{
                    // console.log(status)
                    if(status === "Ordered" || status ==="In Transit" || status==="Awaiting Payment"){
                        
                        return( <div style={{background:"#3b71ca", color:"white", fontWeight:"bold",margin:"-5%"}}>{status}</div>)
                    }else if(status === "Refunded" || status==="Cancelled"||status==="Declined"|| status==="Attempted delivery"){
                        return(<div style={{background:"#ffcc33",color:"white"}}>{status}</div>)
                    }else if(status==="Completed"){
                        return( <div style={{background:"#009933",color:"white"}}>{status}</div>)
                    }else{
                        return(<div>No status</div>)
                    }
                })()
            }
        </div>
    )
}
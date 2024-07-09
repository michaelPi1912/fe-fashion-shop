import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DashBoard(){
    const navigate = useNavigate();
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });
    console.log(admin);
    useEffect(() =>{
        if(admin === undefined){
            navigate("/admin")
        }
    })

    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    <div>
                        <h1><strong>Dashboard</strong></h1>
                        
                        {/* <button onClick={handleClickOpen} style={{background: "#0288D1"}} className=""><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button> */}
                        <hr/><br/>
                        <div>
                            <div className="d-flex flex-wrap gap-4 ">
                                <button style={{padding:"5%", width:"22%"}} onClick={() => navigate("/users")}>
                                    Users
                                </button>
                                <button style={{padding:"5%", width:"22%"}} onClick={() => navigate("/product")}>
                                    Products
                                </button>
                                <button style={{padding:"5%", width:"22%"}} onClick={() => navigate("/orders")}>
                                    Orders
                                </button>
                                <button style={{padding:"5%", width:"22%"}} onClick={() => navigate("/feedback")}>
                                    FeedBack
                                </button>
                                {/* <button style={{padding:"5%", width:"20%"}}>
                                    Product
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
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
                <div style={{marginLeft: "25%"}} className="col">
                ... page content ...
                </div>
            </div>
        </div>
    );
}
import { useNavigate } from "react-router-dom";
import {logo} from "../assets/data";

export default function SideBar(){
    const navigate = useNavigate();
    const saved = localStorage.getItem("admin-info");
    const admin = JSON.parse(saved);
    const handleLogout = () =>{
        fetch(process.env.REACT_APP_API_URL+"/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${admin.access_token}`
          },
        })
          .then(response => {
              if(response.status === 200){
                  localStorage.removeItem("admin-info");
                  navigate("/admin");
              }
          })
        
      }
    return(
            <div className="bg-dark col-auto col-md-2 min-vh-100 d-flex justify-content-between flex-column">
                <div>
                    <div style={{textAlign:"center",color:"white"}} className="">
                        <img src={logo} alt="" height={60} width={60} />
                        <label className="ms-1" style={{fontSize:"32px", alignItems:"center"}}>Fashion</label>
                    </div>
                    <hr className="text-secondary"/>
                    <ul className="nav nav-pills flex-column">
                        {/* <li className="nav-item text-white fs-4">
                            <a href="/dashboard" className="nav-link text-white fs-5" aria-current="page">
                                <i className="fs-4 bi bi-speedometer2"></i>
                                <span className="ms-2">Dashboard</span>
                            </a>
                            
                        </li> */}
                        <li className="nav-item text-white fs-4">
                            <a href="/users" className="nav-link text-white fs-5" aria-current="page">
                                <i class="fs-4 bi bi-person"></i>
                                <span className="ms-2">User</span>
                            </a>
                            
                        </li>
                        <li className="nav-item text-white fs-4">
                            <a href="/product" className="nav-link text-white fs-5" aria-current="page">
                               
                                <i class="bi bi-box-seam-fill"></i>
                                <span className="ms-2">Products</span>
                            </a>
                            
                        </li>
                        <li className="nav-item text-white fs-4">
                            <a href="/category" className="nav-link text-white fs-5" aria-current="page">
                                <i class="bi bi-list-task"></i>    
                                <span className="ms-2">Category</span>
                            </a>
                            
                        </li>
                        <li className="nav-item text-white fs-4" style={{borderBottom: "2px white"}}>
                            <a href="/orders" className="nav-link text-white fs-5" aria-current="page">
                                <i class="bi bi-cart-fill"></i>
                                <span className="ms-2">Orders</span>
                            </a>
                        </li>

                        <li className="nav-item text-white fs-4" style={{borderBottom: "2px white"}}>
                            <a href="/coupons" className="nav-link text-white fs-5" aria-current="page">
                                <i class="bi bi-ticket-perforated"></i>
                                <span className="ms-2">Coupon</span>
                            </a>
                        </li>
                        <li className="nav-item text-white fs-4" style={{borderBottom: "2px white"}}>
                            <a href="/feedback" className="nav-link text-white fs-5" aria-current="page">
                                <i class="bi bi-chat-left-dots"></i>
                                <span className="ms-2">Feedback</span>
                            </a>
                        </li>
                        <li className="nav-item text-white fs-4" style={{borderBottom: "2px white"}}>
                            <a href="/statistics" className="nav-link text-white fs-5" aria-current="page">
                                <i class="bi bi-bar-chart-line-fill"></i>
                                <span className="ms-2">Statistics</span>
                            </a>
                        </li>
                        <li className="nav-item text-white fs-4" style={{borderBottom: "2px white"}}>
                            <a onClick={() => handleLogout()}  className="nav-link text-white fs-5" aria-current="page">
                                <i class="bi bi-box-arrow-right"></i>
                                <span className="ms-2">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
                {/* <button className="fs-4" style={{background: "red", marginLeft:"15px"}}>Logout</button> */}
            </div>
    );
}
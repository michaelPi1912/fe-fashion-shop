

export default function ProfileSideBar(){
    return(
            <div style={{width:"25%" ,alignItems:"flex-end",paddingTop:"5%", paddingRight:"2%",borderRight:"1px solid black"}} className=" col-auto col-md-2 min-vh-100 d-flex justify-content-between flex-column">
                <div>
                    <div style={{fontWeight:"bold", fontSize:"32px"}}>ACCOUNT</div>
                    <br/>
                    <ul style={{alignItems:"start",}} className="nav nav-pills flex-column" >
                        <li style={{alignItems:"start"}} className="nav-item  fs-4">
                            <a href="/profile" style={{ color:"black"}} className="nav-link  fs-5" aria-current="page">
                                <span className="ms-2">Profile</span>
                            </a>
                            
                        </li>
                        <li className="nav-item  fs-4">
                            <a href="/profile/address" style={{ color:"black"}} className="nav-link  fs-5" aria-current="page"> 
                            <span className="ms-2">Address</span>
                            </a>
                            
                        </li>
                        <li className="nav-item  fs-4">
                            <a href="/history" style={{ color:"black"}} className="nav-link  fs-5" aria-current="page">
                                <span className="ms-2">Order History</span>
                            </a>
                            
                        </li>
                        {/* <li className="nav-item  fs-4" style={{borderBottom: "2px white"}}>
                            <a href="#" style={{ color:"black"}} className="nav-link  fs-5" aria-current="page">
                                <span className="ms-2">Coupon</span>
                            </a>
                        </li> */}
                        <li className="nav-item  fs-4" style={{borderBottom: "2px white"}}>
                            <a href="/profile/changePassword" style={{ color:"black"}} className="nav-link  fs-5" aria-current="page">
                                <span className="ms-2">Change Password</span>
                            </a>
                        </li>

                    </ul>
                </div>
                {/* <button className="fs-4" style={{background: "red", marginLeft:"15px"}}>Logout</button> */}
            </div>
    );
}
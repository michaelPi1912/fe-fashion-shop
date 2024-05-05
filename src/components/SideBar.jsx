export default function SideBar(){
    return(
            <div className="bg-dark col-auto col-md-2 min-vh-100 d-flex justify-content-between flex-column">
                <div>
                    <a className="text-decoration-none text-white d-flex align-itemcenter">
                        <span className="ms-1 fs-4">Brand</span>
                    </a>
                    <hr className="text-secondary"/>
                    <ul className="nav nav-pills flex-column">
                        <li className="nav-item text-white fs-4">
                            <a href="#" className="nav-link text-white fs-5" aria-current="page">
                                <i className="fs-4 bi bi-speedometer2"></i>
                                <span className="ms-2">Dashboard</span>
                            </a>
                            
                        </li>
                        <li className="nav-item text-white fs-4">
                            <a href="/users" className="nav-link text-white fs-5" aria-current="page">
                                <i class="fs-4 bi bi-person"></i>
                                <span className="ms-2">User</span>
                            </a>
                            
                        </li>
                        <li className="nav-item text-white fs-4">
                            <a href="/product" className="nav-link text-white fs-5" aria-current="page">
                                <i class="fs-r bi bi-cart3"></i>
                                <span className="ms-2">Products</span>
                            </a>
                            
                        </li>
                        <li className="nav-item text-white fs-4">
                            <a href="/category" className="nav-link text-white fs-5" aria-current="page">
                                <i className="fs-4 bi bi-house"></i>
                                <span className="ms-2">Category</span>
                            </a>
                            
                        </li>
                        <li className="nav-item text-white fs-4" style={{borderBottom: "2px white"}}>
                            <a href="#" className="nav-link text-white fs-5" aria-current="page">
                                <i className="fs-4 bi bi-table"></i>
                                <span className="ms-2">Orders</span>
                            </a>
                            
                        </li>
                    </ul>
                </div>
                {/* <button className="fs-4" style={{background: "red", marginLeft:"15px"}}>Logout</button> */}
            </div>
    );
}
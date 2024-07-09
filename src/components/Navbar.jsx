import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {logo} from "../assets/data";
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';



export default function NavbarNavigate() {
  const navigate = useNavigate();
  const location = useLocation()
  const [user,setUser] = useState(() =>{
    const saved = localStorage.getItem("user-info");
    const initialValue = JSON.parse(saved);
    return initialValue || undefined;
  });
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("")
  const handleLogout = () =>{
    fetch(process.env.REACT_APP_API_URL+"/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Authorization': `Bearer ${user.access_token}`
      },
    })
      .then(response => {
          if(response.status === 200){
              localStorage.removeItem("user-info");
              navigate("/");
          }
      })
    
  }

  const handleOpenSearch = () =>{
    setOpenSearch(true)
  }
  const handleCloseSearch = () =>{
    setOpenSearch(false)
  }
  
  return (
    <div style={{fontSize: 20}}>
      <Navbar className="fixed-top" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/" ><img src={logo} alt="" height={60} width={60} /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href ="/" style={{marginRight:20,marginLeft:10}}>Home</Nav.Link>
            <Nav.Link href ="/men" style={{marginRight:20,marginLeft:10}}>Men</Nav.Link>
            <Nav.Link href ="/women"style={{marginRight:20}}>Women</Nav.Link>
            {/* <Nav.Link href ="/children">Children</Nav.Link> */}
            {/* <Nav.Link href='/'><i ></i></Nav.Link> */}
          </Nav>
          {/* Search Input */}
          {
            openSearch === false ?<div></div>:
            <div className='d-flex container' style={{width:"450px",marginRight:"15%"}}>
              <form className='d-flex' >
                <input type='text'style={{height:"50px",backgroundColor:"white",width:"450px"}} onChange={e=> setSearch(e.target.value)} required/>
                <button type='submit' style={{right:"45px",alignSelf:"center",position:"absolute",height:"40px",width:"40px", backgroundColor:"white",color:"black"}} 
                 onClick={() =>location.pathname.includes('/search')?navigate('/search/'+search,{replace:true}) : navigate('/search/'+search)}><i class="bi bi-search"></i></button>
                
              </form>
              <button style={{borderLeft:"1px solid black",right:"0px",alignSelf:"center",position:"absolute",height:"40px",width:"40px", backgroundColor:"white",color:"black"}} onClick={handleCloseSearch}><i class="bi bi-x-lg"></i></button>
            </div>
          }
          
          <div style={{display: 'flex', gap: 20}}>
            <button style={{background:"none", fontSize:"24px", width:"30px"}}>
              <span aria-label={"Search"} role="img" aria-hidden="true" title={"Search"}>
                <a style={{ color:"white",display:openSearch ===true?"none":""}}><i class="bi bi-search" onClick={handleOpenSearch}></i></a>
              </span>
            </button>
            <button style={{background:"none", fontSize:"24px", width:"30px"}}>
            <span aria-label={"Cart"} role="img" aria-hidden="true" title={"Cart"}>
              <a href='/cart' style={{fontSize:"24px", color:"white"}}><i class="bi bi-cart3"></i></a>
            </span></button>
            <button style={{background:"none", fontSize:"24px", width:"30px"}}>
            <span aria-label={"Wishlist"} role="img" aria-hidden="true" title={"Wishlist"}>
              <a href='/wishlist' style={{fontSize:"24px", color:"white"}}><i class="bi bi-heart"></i></a>
            </span></button>
            {
              localStorage.getItem("user-info") !== null ?
              // button dropdown
              <Dropdown className="d-inline mx-2">
                <Dropdown.Toggle id="dropdown-autoclose-true" style={{background:"none", border:"none", fontSize:"24px", width:"30px"}}>
                  <span aria-label={"Account"} role="img" aria-hidden="true" title={"Account"} style={{marginLeft:"-20px"}}>
                    <i class="bi bi-person-circle"></i>
                  </span>
                </Dropdown.Toggle>
   

                <Dropdown.Menu style={{fontSize:"20px", marginLeft:"-50px"}}>
                  <Dropdown.Item href="/profile" ><i class="bi bi-person-circle"></i>&ensp;Profile</Dropdown.Item>
                  <Dropdown.Item href="/history"><i class="bi bi-box2-fill"></i> &nbsp; Order History</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleLogout()} ><i class="bi bi-box-arrow-right"></i> &nbsp; Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              : <button style={{background:"none", border:"none", fontSize:"24px", width:"30px"}}>
                  <span aria-label={"Login"} role="img" aria-hidden="true" title={"Login"} style={{marginLeft:"-5px"}}>
                    <a href='/login' style={{fontSize:"24px", color:"white"}}><i class="bi bi-person-circle"></i></a>
                  </span>
                </button>
            }
          
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

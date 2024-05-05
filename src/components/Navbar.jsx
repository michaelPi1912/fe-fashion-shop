import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {logo} from "../assets/data";
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function NavbarNavigate() {
  const navigate = useNavigate();
  const [user,setUser] = useState(() =>{
    const saved = localStorage.getItem("user-info");
    const initialValue = JSON.parse(saved);
    return initialValue || undefined;
  });

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
  
  
  return (
    <div style={{fontSize: 20}}>
      <Navbar className="fixed-top" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/" ><img src={logo} alt="" height={60} width={60} /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href ="/man" style={{marginRight:20,marginLeft:10}}>Man</Nav.Link>
            <Nav.Link href ="/woman"style={{marginRight:20}}>Woman</Nav.Link>
            <Nav.Link href ="/children">Children</Nav.Link>
            <Nav.Link href='/'><i ></i></Nav.Link>
          </Nav>
          
          <div style={{display: 'flex', gap: 20}}>
            <button style={{background:"none", fontSize:"24px", width:"30px"}}>
              <span aria-label={"Search"} role="img" aria-hidden="true" title={"Search"}>
                <a href='/search' style={{ color:"white"}}><i class="bi bi-search"></i></a>
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
                  <Dropdown.Item href="/profile" ><i class="bi bi-person"></i> &ensp;Profile</Dropdown.Item>
                  {/* <Dropdown.Item href="/wishlist"><i class="bi bi-heart"></i> &nbsp; Wish List</Dropdown.Item> */}
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

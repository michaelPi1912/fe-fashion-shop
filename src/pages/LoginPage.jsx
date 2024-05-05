import React, { useState} from 'react';
import { useNavigate } from "react-router-dom";
import { logo } from '../assets/data';
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
import toast from "react-hot-toast";

import '../style/css/login.css';

export default function LoginPage(){
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  async function loginUser(credentials) {
    let res = await fetch(process.env.REACT_APP_API_URL+'/api/v1/auth/authenticate', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
  
      },
      body: JSON.stringify(credentials)
    });
    if(res.status === 200){
      res = await res.json();

      localStorage.setItem("user-info" , JSON.stringify(res));
      toast.success("Login Success")
      navigate("/");
    }else{
      toast.error("Login Fail")
    }
    
   }
  const handleSubmit = async e => {
    e.preventDefault();
    loginUser({
      email,
      password
    });
  }
  
  return(
    <div>
      <NavbarNavigate/>
      <section className="vh-100">
        <div className="container-fluid">
          <div className="row"  style={{justifyContent: 'center'}}>
            <div className="col-sm-5 text-black">
              <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

                <form style={{width: '23rem', alignItems: 'center'}} onSubmit={handleSubmit}>
                  <img src={logo} width={150} alt='logo' style={{marginLeft:"30%", fontWeight:'bold'}}/>
                  <h3 className="fw-small mb-3 pb-3" style={{letterSpacing: '0.25px',textAlign:'center'}}>LOGIN</h3>

                  <div className="form-outline mb-4">
                    <label style={{textAlign:'left'}} className="form-label" for="form2Example18">Email address</label>
                    <input type="email" id="form2Example18" placeholder='Email address' className="form-control form-control-lg" 
                    onChange={e => setEmail(e.target.value)}/>
                    
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" for="form2Example28">Password</label>
                    <input type="password" id="form2Example28" placeholder='Password' className="form-control form-control-lg" 
                    onChange={e => setPassword(e.target.value)}/>
                    
                  </div>

                  <div className="pt-1 mb-4">
                    <button style={{color:'white', width:'100%'}} className="btn btn-info btn-lg btn-block" type="submit">Login</button>
                  </div>

                  <p style={{textAlign:'center'}} className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                  <p style={{textAlign:'center', marginTop:'-10%'}} >Don't have an account? <a href="/register" className="link-info">Register here</a></p>

                </form>

              </div>

            </div>
            <div className="col-sm-5 px-0 d-none d-sm-block">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                alt="bg" className="w-125 vh-100" style={{objectFit: 'cover', objectPosition: 'left'}}/>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
// LoginPage.propTypes = {
//   setToken: PropTypes.func.isRequired
// };

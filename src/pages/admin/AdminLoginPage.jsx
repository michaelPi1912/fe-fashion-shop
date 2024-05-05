import React, {useState} from 'react'
import '../../style/css/admin/login.css'
import { useNavigate } from "react-router-dom";
import DashBoard from './Dashboard';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  if(localStorage.getItem("admin-info") !== null){

    return <DashBoard/>
  }

  async function loginAdmin(credentials) {
    let res = await fetch(process.env.REACT_APP_API_URL+'/api/v1/auth/authenticate', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
  
      },
      body: JSON.stringify(credentials)
    });
    res = await res.json();
    console.log(res);
    if(res.user.role === "ADMIN" || res.user.role === "MANAGER"){
      localStorage.setItem("admin-info" , JSON.stringify(res));
      navigate("/dashboard");
    }
    
  }
  const handleSubmit = async e => {
    e.preventDefault();
    loginAdmin({
      email,
      password
    });
  }

  return (
    <div>
    <div class="login-page">
      <div class="form">
        <h1>Login</h1>
        <form class="login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="username" onChange={e => setEmail(e.target.value)}/>
          <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
          <button>login</button>
          {/* <p class="message">Not registered? <a href="#">Create an account</a></p> */}
        </form>
      </div>
    </div>
    </div>
  )
}

export default LoginAdmin

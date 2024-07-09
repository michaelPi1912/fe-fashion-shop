import { useState } from "react";
import NavbarNavigate from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ChangePasswordForgot(){
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    // console.log(queryParameters.get("token"))
    const [newPassword, setNewPassword] = useState();
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        changePassword();
    }

    const changePassword = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/changePassword`, {
            method: 'PUT',
            body: JSON.stringify({
                  newPassword
              }),
            headers:{
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${queryParameters.get("token")}`
            }
          }).then(res => {
            if(res.status === 200){
                navigate("/login")
            }
          })
    }
    return(
    <div>
         <div>
            <NavbarNavigate />
            <div style={{marginTop: "85px", paddingLeft:"10%", paddingTop:"5%",paddingRight:"50%"}}>
                <h2 style={{fontWeight:"bold"}}>RESET YOUR PASSWORD</h2>
                <br/>
                <div style={{border:"1px solid black", padding:"5%"}}>
                    <p>Please enter a new password.</p>
                    <form onSubmit={handleSubmit}>
                        <label style={{fontWeight:"bold",}}>NEW PASSWORD</label>
                        <input type="password" style={{width:"100%", height:"40px"}}  onChange={e=> setNewPassword(e.target.value)} required/>
                        
                        <button style={{marginTop:"20px"}}>Change Password</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}
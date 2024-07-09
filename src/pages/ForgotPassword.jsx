import { useState } from "react";
import NavbarNavigate from "../components/Navbar";
import toast from "react-hot-toast";
import { json, useNavigate } from "react-router-dom";


export default function ForgotPassword(){   
    const navigate  = useNavigate();
    const [email, setEmail] = useState();

    const sendEmail = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/forgotPassword/${email}`)
        .then(res => {
            res.text().then(
                data => {
                console.log(data)
                if(data === "Information provided doesn’t match our records"){
                    toast.error("Information provided doesn’t match our records");
                }else{
                    toast.success(data)
                    navigate("/")
                }
                }
            )
        })   
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        sendEmail();
    }
    return(
        <div>
            <NavbarNavigate />
            <div style={{marginTop: "85px", paddingLeft:"10%", paddingTop:"5%",paddingRight:"50%"}}>
                <h2 style={{fontWeight:"bold"}}>RESET YOUR PASSWORD</h2>
                <br/>
                <div style={{border:"1px solid black", padding:"5%"}}>
                    <p>Please enter your registered email address.</p>
                    <form onSubmit={handleSubmit}>
                        <label style={{fontWeight:"bold",}}>EMAIL ADDRESS </label>
                        <input style={{width:"100%", height:"40px"}} placeholder="Enter your email" onChange={e=> setEmail(e.target.value)} required/>
                        
                        <button style={{marginTop:"20px"}}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
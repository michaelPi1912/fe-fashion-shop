import { useEffect, useState } from "react";
import NavbarNavigate from "../components/Navbar";
import ProfileSideBar from "../components/ProfileSideBar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ChangePassword(){

    const navigate = useNavigate();
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    useEffect(() =>{
        if(!localStorage.getItem("user-info")){
            navigate("/")
        }
    },[])

    const updatePassword = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/change-password`, {
            method: 'PUT',
            body: JSON.stringify({
                currentPassword,
                newPassword
              }),
            headers:{
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${user.access_token}`
            }
          })
          .then(response => {
              if(response.status === 200){
                response.json().then(json => {
                    toast.success("Change Password Success")
                })
              }else{
                toast.error("Current Password is incorrect !")
              }
          })
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
		if(newPassword !== confirmPassword){
			toast.error("Password are not the same")
		}else{
			updatePassword();
            e.target.reset();
		}
    }

    return(
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px"}} className="d-flex">
                <ProfileSideBar />
                <div style={{padding:"5%", width:"70%"}}>
                    <h2 style={{fontWeight:"bold"}}>CHANGE PASSWORD</h2>
                    <div style={{border:"1px solid black", width:"80%", padding:"2%"}}>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label style={{width:"30%", fontWeight:"bold"}}>Current Password</label>
                                <input type="password" style={{width:"50%"}} onChange={e => setCurrentPassword(e.target.value)} required/>
                            </div>
                            <br/>
                            <div>
                                <label style={{width:"30%", fontWeight:"bold"}}>New Password</label>
                                <input type="password" style={{width:"50%"}} onChange={e => setNewPassword(e.target.value)} required/>
                            </div>
                            <br/>
                            <div> 
                                <label style={{width:"30%", fontWeight:"bold"}}>Confirm New Password</label>
                                <input type="password" style={{width:"50%"}} onChange={e => setConfirmPassword(e.target.value)}/>
                            </div>
                            <br/>
                            <div className="d-flex">
                                <label style={{width:"30%"}}></label>
                                <button type="submit" style={{width:"30%"}}>Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
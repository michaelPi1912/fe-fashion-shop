import Footer from "../components/Footer";
import NavbarNavigate from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import ProfileSideBar from "../components/ProfileSideBar";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { blockInvalidChar } from "../components/blockInvalidChar";
import toast from "react-hot-toast";

export default function ProfilePage(){
    const navigate = useNavigate();
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [open, setOpen] = useState(false)
    const [firstname, setFirstname] = useState(user.user.firstname)
    const [lastname, setLastname] = useState(user.user.lastname)
    const [phone, setPhone] = useState(user.user.phone)
    const [gender, setGender] = useState(user.user.gender === null? "": user.user.gender)

    useEffect(()=>{
        if(!localStorage.getItem("user-info")){
            navigate("/")
        }
    },[])

    const handleClickOpen = () =>{
        setOpen(true)
    }

    const handleClickClose = () =>{
        setOpen(false)
    }

    const updateProfile = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/update`, {
            method: 'PUT',
            body: JSON.stringify({
              firstname,
              lastname,
              phone,
              gender
              }),
            headers:{
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${user.access_token}`
            }
          })
          .then(response => {
              if(response.status === 200){
                response.json().then(json => {
                    const info = {access_token: user.access_token, refresh_token: user.refresh_token,user: json}
                    localStorage.setItem("user-info" , JSON.stringify(info));
                    handleClickClose()
                })
              }
          })
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
		if(phone.length !== 10){
			toast.error("Phone number is not valid!")
		}else{
			updateProfile()
		}
    }

    return (
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px"}} className="d-flex">
                <ProfileSideBar />
                <div style={{padding:"5%", width:"70%"}}>
                    <h2 style={{fontWeight:"bold"}}>PROFILE</h2>
                    <div style={{width:"90%", border:"1px solid black"}}>
                        <div className="d-flex gap-3" style={{padding:"1%"}}>
                            <label style={{width:"30%",fontWeight:"bold", fontSize:"20px"}}>Email Address</label>
                            <p>{user.user.email}</p>
                        </div>
                        <div className="d-flex gap-3" style={{padding:"1%"}}>
                            <label style={{width:"30%",fontWeight:"bold", fontSize:"20px"}}>Fullname</label>
                            <p style={{textTransform:"capitalize"}}>{user.user.firstname} {user.user.lastname}</p>
                        </div>
                        <div className="d-flex gap-3" style={{padding:"1%"}}>
                            <label style={{width:"30%",fontWeight:"bold", fontSize:"20px"}}>Gender</label>
                            <p style={{textTransform:"capitalize"}}>{user.user.gender}</p>
                        </div>
                        <div className="d-flex gap-3" style={{padding:"1%"}}>
                            <label style={{width:"30%",fontWeight:"bold", fontSize:"20px"}}>Phone</label>
                            <p style={{textTransform:"capitalize"}}>{user.user.phone}</p>
                        </div>
                    </div>
                    <br/>
                    <button onClick={handleClickOpen}>Edit Profile</button>
                </div>
                <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Edit Profile</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit}>
                                <div>
                                    <label style={{width:"30%"}}>Firstname</label>
                                    <input value={firstname} onChange={e => setFirstname(e.target.value)}/>
                                </div>
                                <br/>
                                <div>
                                    <label style={{width:"30%"}}>Lastname</label>
                                    <input value={lastname} onChange={e => setLastname(e.target.value)}/>
                                </div>
                                <br/>
                                <div>
                                    <label style={{width:"30%"}}>Gender</label>
                                    <select onChange={e => setGender(e.target.value)}>
                                        <option value="" selected={user.user.gender ===null || user.user.gender ===""} > Unslect</option>
                                        <option value="Male" selected={user.user.gender ==="Male"} > Male</option>
                                        <option value="Female" selected={user.user.gender === "Female"} >Female</option>

                                    </select>
                                </div>
                                <br/>
                                <div>
                                    <label style={{width:"30%"}}>Phone</label>
                                    <input type="number" 
                                    onInput={e =>{if(e.target.value > 10){e.target.value = e.target.value.slice(0, 10)}}} onKeyDown={blockInvalidChar} value={phone} minLength={10} maxLength={10} onChange={e => setPhone(e.target.value)} required/>
                                </div>
                                <br/>
                                <button type="submit">Edit</button>
                                </form>
                            </Modal.Body>
                        </Modal>
            </div>
            <Footer/>
        </div>
    );
}
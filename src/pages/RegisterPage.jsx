import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {bg} from "../assets/data";
import {rf} from "../assets/data";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';

import "../style/css/register.css"

export default function RegisterPage(){
	const navigate = useNavigate();

	const [firstname,setFName] = useState();
	const [lastname,setLName] = useState();
	const [email,setEmail] = useState();
	const [phone,setPhone] = useState();
	const [gender,setGender] = useState();
	const [password,setPassword] = useState();
	const [confirmPassword,setConfirmPassword] = useState();
	const [image, setImage] = useState("");
	const role = "USER";


	async function signUp(credentials) {
		let res = await fetch(process.env.REACT_APP_API_URL+'/api/v1/auth/register', {
			method: 'POST',
			mode: 'cors',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials)
		  });
	  
		  res = await res.json();
		  navigate("/login");
	}
	const handleSubmit = async e => {
		e.preventDefault();
		signUp({firstname, lastname, email, phone, gender, password, confirmPassword, role, image});
	  }
    return (
		<div>
			<NavbarNavigate/>
			<div className="wrapper" style={{backgroundImage: `url(${bg})`, marginTop:'85px'}}>
            	<div className="inner">
                	<div className="image-holder">
						<img src={rf} alt=""/>
					</div>
					<form onSubmit={handleSubmit}>
						<h3>Registration Form</h3>
						<div class="form-group">
							<input type="text" placeholder="First Name" class="form-control" onChange={(e) => setFName(e.target.value)}/>
							<input type="text" placeholder="Last Name" class="form-control" onChange={(e) => setLName(e.target.value)}/>
						</div>
						
						<div class="form-wrapper">
							<input type="text" placeholder="Email Address" class="form-control" onChange={(e) => setEmail(e.target.value)}/>
							<i class="zmdi zmdi-email"></i>
						</div>
						<div class="form-wrapper">
							<input type="text" placeholder="Phone" class="form-control" onChange={(e) => setPhone(e.target.value)}/>
							<i class="zmdi zmdi-account"></i>
						</div>
						<div class="form-wrapper">
							<select name="" id="" class="form-control" onChange={(e) => setGender(e.target.value)}>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
							<i class="zmdi zmdi-caret-down" style={{fontSize: '17px'}}></i>
						</div>
						<div class="form-wrapper">
							<input type="password" placeholder="Password" class="form-control" onChange={(e) => setPassword(e.target.value)}/>
							<i class="zmdi zmdi-lock"></i>
						</div>
						<div class="form-wrapper">
							<input type="password" placeholder="Confirm Password" class="form-control" onChange={(e) => setConfirmPassword(e.target.value)}/>
							<i class="zmdi zmdi-lock"></i>
						</div>
						<button type="submit" style={{width:"100%", background:"green"}}>Register
							<i class="zmdi zmdi-arrow-right"></i>
						</button>
					</form>
            	</div>
       		</div>
			   <Footer/>
		</div>
       
    );
}
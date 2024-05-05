import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function UserPage(){
    const navigate = useNavigate();
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });
    const [users, setUsers] = useState();
    const [firstname,setFName] = useState();
	const [lastname,setLName] = useState();
	const [email,setEmail] = useState();
	const [phone,setPhone] = useState();
	const [gender,setGender] = useState("male");
	const [password,setPassword] = useState();
	const [confirmPassword,setConfirmPassword] = useState();
	const [image, setImage] = useState("");
	const [role,setRole] = useState("USER");

    const [open,setOpen] = useState(false);
    console.log(users)
    useEffect(() => {
        if(admin === undefined){
            navigate("/admin")
        }else{
            loadData()
        }
        
    }, []);
    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/all`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setUsers(json)
            }
        )
    };
    const handleClickOpen = () =>{
        setOpen(true);
    };
    const handleClickClose = () =>{
        setOpen(false);
    }

    async function signUp(credentials) {
        console.log(firstname + lastname+ email+ phone+ gender+password+ confirmPassword + role)
        if(firstname&& lastname&& email&& phone&& gender&& password&& confirmPassword && role){
            let res = await fetch(process.env.REACT_APP_API_URL+'/api/v1/auth/register', {
                method: 'POST',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
	  
            if(res.status === 200){
                loadData()
                handleClickClose()
            }
        }
		
	}
	const handleSubmit = async e => {
		e.preventDefault();
		signUp({firstname, lastname, email, phone, gender, password, confirmPassword, role, image});
	}

    const blockUser = (id) =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/users/block/${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${admin.access_token}`
            },
        }).then(res =>{
            if(res.status === 200){
                loadData()
            }
        })
        
    }

    const unBlockUser = (id) =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/users/un-block/${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${admin.access_token}`
            },
        }).then(res =>{
            if(res.status === 200){
                loadData()
            }
        })
        
    }

    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                        <h1>User</h1>
                        <hr/>
                        <button onClick={handleClickOpen}  style={{background: "#0288D1"}} className=""><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                        <br/>
                        <table >
                            <tr style={{background:"black", color:"white"}}>
                                <th style={{width:"30%"}}>Full Name</th>
                                <th style={{width:"30%"}}>Email</th>
                                <th style={{width:"30%"}}>Role</th>
                                <th style={{width:"10%"}}>Active</th>
                            </tr>
                            {
                                users !== undefined ? users.users.map((user) => (
                                    <tr>
                                        <td>{user.firstname +" "+ user.lastname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            {
                                                (user.active === true) ? <button style={{background:"red", display: user.role ==="ADMIN" ?"none": ""}} onClick={() => blockUser(user.id)}>Block</button> 
                                                : <button style={{background:"red"}} onClick={() => unBlockUser(user.id)}>Unblock</button>
                                            }
                                            
                                        </td>
                                    </tr>
                              )) : <h1>load data</h1>
                            }
                            
                        </table>
                        {/* <nav aria-label="Page navigation example">
                            <ul class="pagination justify-content-center">
                                <li class="page-item">
                                    <a class="page-link" onClick={() =>{
                                        navigatePageable(curPage === 0 ? 0 : curPage -1)
                                    }} aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                            
                                    </a>
                                </li>
                                {
                                    paginationNumber.map((nums) =>{
                                        return <li class="page-item"><a class="page-link" onClick={()=>navigatePageable(nums)}>{nums +1}</a></li>
                                    })
                                }
                                <li class="page-item">
                                    <a class="page-link" onClick={() =>{
                                        navigatePageable(curPage === categories.totalPages - 1 ? curPage : curPage + 1)
                                    }} aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav> */}
                        <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Add New User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="d-flex gap-3">
                                    <Form.Group className="mb-1" >
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            onChange={e => setFName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-1" >
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            onChange={e => setLName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        autoFocus
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        autoFocus
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select onChange={(e) => setGender(e.target.value)}>
                                        <option value="male" >Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select onChange={(e) => setRole(e.target.value)}>
                                        <option value="USER" >User</option>
                                        <option value="MANAGER">Manager</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder=""
                                        autoFocus
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder=""
                                        autoFocus
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <button type="submit" style={{width:"100%", background:"green"}}>Add New</button>
                            </Form>
                            </Modal.Body>
                        </Modal>
                </div>
            </div>
        </div>
    );
}
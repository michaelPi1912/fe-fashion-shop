import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";

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
    const [curPage, setCurPage] = useState(0);
    let paginationNumber = []
    for (let i = 0; i < users?.totalPages; i++) {
            paginationNumber.push(i);
    }

    const [sEmail,setSEmail] = useState("")
    const [sName,setSName] = useState("")
    const [sRole,setSRole] = useState(0)
    const [sActive,setSAtive] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [unBlockAlert, setUnBlockAlert] = useState(false)
    const [targetUser, setTargetUser] = useState()

    // log
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
                setSEmail("")
                setSAtive(0)
                setSRole(0)
                setSName("")
            }
        )
    };

    const loadSearch = () =>{

        let param = "";
        if(sEmail !== ""){
            param += `email=${sEmail}&`
        }

        if(sName !== ""){
            param += `name=${sName}&`
        }

        fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/all?active=${sActive}&role=${sRole}&`+param,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                console.log(json)
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
                toast.error("user has been blocked")
                loadData()
                handleCloseAlert()
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
                toast.success("user has been unblocked")
                loadData()
                handleCloseUnBlockAlert()
            }
        })
        
    }

    const handleShowAlert  = (user) =>{
        setTargetUser(user)
        setShowAlert(true)
    }

    const handleCloseAlert = () =>{
        setShowAlert(false)
    }

    const handleUnBlockAlert  = (user) =>{
        setTargetUser(user)
        setUnBlockAlert(true)
    }

    const handleCloseUnBlockAlert = () =>{
        setUnBlockAlert(false)
    }

    const navigatePageable = nums =>{
        setCurPage(nums)
        let param = "";
        if(sEmail !== ""){
            param += `email=${sEmail}&`
        }

        if(sName !== ""){
            param += `name=${sName}&`
        }
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/all?page=${nums}&active=${sActive}&role=${sRole}&`+param,{
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
    }

    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                        <h1>User</h1>
                        {/* filter */}
                        <form>
                        <div className="d-flex gap-2">
                            <label ><strong>EMAIL</strong></label>
                            <input type="text" style={{width:"15%"}} onChange={e=> setSEmail(e.target.value)}/>
                            <label ><strong>NAME</strong></label>
                            <input type="text" style={{width:"15%"}} onChange={e=> setSName(e.target.value)}/>
                            <label><strong>ROLE</strong></label>
                            <select onChange={e=> setSRole(+e.target.value)}>
                                <option value={0}>All</option>
                                <option value={1}>ADMIN</option>
                                <option value={2}>MANAGER</option>
                                <option value={3}>USER</option>
                            </select>
                            <label><strong>STATUS</strong></label>
                            <select style={{width:"100px"}} onChange={e=> setSAtive(+e.target.value)}>
                                <option value={0}>All</option>
                                <option value={1}>Blocked</option>
                                <option value={2}>None-Blocked</option>
                                
                            </select>
                            {/* Search */}
                            <button type="button" style={{height:"30px",width:"100px", textAlign:'center'}} onClick={()=>loadSearch()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>&nbsp; Search</button>
                            {/* reset */}
                            <button type="reset" style={{height:"30px", width:"60px"}} onClick={() =>loadData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                        </form>
                        <hr/>
                        {/* <button onClick={handleClickOpen}  style={{background: "#0288D1"}} className=""><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button> */}
                        {/* Data */}
                        <table >
                            <tr style={{background:"black", color:"white"}}>
                                <th style={{width:"30%"}}>Full Name</th>
                                <th style={{width:"30%"}}>Email</th>
                                <th style={{width:"30%"}}>Role</th>
                                <th style={{width:"10%"}}>STATUS</th>
                            </tr>
                            {
                                users !== undefined ? users.users.map((user) => (
                                    <tr>
                                        <td>{user.firstname +" "+ user.lastname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            {
                                                (user.active === true) ? <button style={{background:"red", display: user.role ==="ADMIN" ||user.role ==="MANAGER" ?"none": ""}} onClick={() => handleShowAlert(user)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-fill-lock" viewBox="0 0 16 16">
                                                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5v-1a2 2 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693Q8.844 9.002 8 9c-5 0-6 3-6 4m7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/>
                                                    </svg> &nbsp;Block</button> 
                                                : <button style={{background:"green"}} onClick={() => handleUnBlockAlert(user)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-unlock" viewBox="0 0 16 16">
                                                    <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/>
                                                    </svg> &nbsp;Unblock</button>
                                            }
                                            
                                        </td>
                                    </tr>
                              )) : <h1>load data</h1>
                            }
                            
                        </table>
                        <br/>
                        {/* Navigation */}
                        <nav aria-label="Page navigation example" style={{left:"55%"}}>
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
                                        navigatePageable(paginationNumber[curPage+1] !== undefined ? paginationNumber[curPage+1]: paginationNumber[curPage])
                                    }} aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        {/* creat */}
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

                        {/* block */}
                        <Modal show={showAlert} onHide={handleCloseAlert} style={{textAlign:'center'}}>
                    <Modal.Body >
                        <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i>
                        <h5 >Are you sure?</h5>
                        <p >Do you really want to block this user?<br/> This process cannot be undone</p>
            
                    </Modal.Body>
                    <Modal.Footer >
                        <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                            <button style={{backgroundColor:"grey"}}  onClick={handleCloseAlert}>
                            No
                        </button>
                        <button style={{backgroundColor:"red"}} onClick={() => blockUser(targetUser.id)}>
                            Yes
                        </button>
                        </div>
                    
                    </Modal.Footer>
                        </Modal>
                        {/* unblock */}
                        <Modal show={unBlockAlert} onHide={handleCloseUnBlockAlert} style={{textAlign:'center'}}>
                    <Modal.Body >
                        <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i>
                        <h5 >Are you sure?</h5>
                        <p >Do you really want to unblock this user?</p>
            
                    </Modal.Body>
                    <Modal.Footer >
                        <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                            <button style={{backgroundColor:"grey"}}  onClick={handleCloseUnBlockAlert}>
                            No
                        </button>
                        <button style={{backgroundColor:"red"}} onClick={() => unBlockUser(targetUser.id)}>
                            Yes
                        </button>
                        </div>
                    
                    </Modal.Footer>
                        </Modal>
                </div>
            </div>
        </div>
    );
}
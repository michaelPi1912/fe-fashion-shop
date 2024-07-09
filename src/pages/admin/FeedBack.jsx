import { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import {  useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import DateConvert from "../../components/DateConvert";
import '../../style/css/admin/toggle-switch.css'
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

export default function FeedBack(){
    const navigate = useNavigate();
    
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const [feedback, setFeedback] = useState();
    const [curReview, setCurReview] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [open, setOpen] = useState(false);

    const [email, setEmail] =useState("");
    const [start, setStart] =useState("");
    const [end, setEnd] =useState("");
    const [active, setActive] =useState(0);
    const [rating, setRating] =useState(0);

    const [curPage, setCurPage] = useState(0);
    let paginationNumber = []
    for (let i = 0; i < feedback?.totalPages; i++) {
            paginationNumber.push(i);
    }

    console.log(curReview)

    useEffect(() => {
        if(admin === undefined){
            navigate("/admin")
        }else{
            loadData()
        }
        
    }, []);

    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/all`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            
            json => {
                console.log(json);
                setFeedback(json);
                setEmail("")
                setStart("")
                setEnd("")
                setActive(0)
                setRating(0)
            }
        )
    }

    const loadSearch = () =>{
        let date1 = new Date(start);
        let date2 = new Date(end);
        console.log(rating)
        
        let param = "";
        if(email !== ""){
            param += `email=${email}&`
        }
        if(rating !== 0){
            param +=`rating=${rating}&`
        }
        if(active != 0){
            param +=`status=${active}&`
        }

        if(start === "" && end === ""){
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/all?`+param,{
                headers: {
                    'Authorization' : `Bearer ${admin.access_token}`
                }
            }).then(
                res => res.json().then(
                    json => {
                        console.log(json);
                        setFeedback(json);
                    }
                )
            )
        }else{
            if(date1 > date2){
                toast.error("The start date or The end date is not a valid")
            }else{
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/all?rating=${rating}&status=${active}&email=${email}&start=${start}&end=${end}`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
            }).then(
                res => res.json().then(
                    json => {
                        console.log(json);
                        setFeedback(json);
                    }
                )
            )
        }
        
        }

        
    }

    const Truncate = (string, number) => {
        if (!string) {
          return null;
        }
        if (string.length <= number) {
          return string;
        }
        return string.slice(0, number) + "...";
    };

    const updateActive = (review) =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/update/active/${review.id}`, {
        method: 'PUT',
        headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${admin.access_token}`
        }
        })
        .then(response => {
            if(response.status === 200){
                toast.success("Update Status Successful")
                loadData()
            }else{
                toast.success("Cannot Update Status!")
            }
        })
    }

    

    const deleteReview = id =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/delete/${id}`, {
        method: 'DELETE',
        headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${admin.access_token}`
        }
        })
        .then(response => {
            if(response.status === 200){
                toast.success("Delete Review successful")
                loadData()
                handleCloseAlert()
            }else{
                toast.success("Cannot Delete Status")
            }
        })
    }

    const handleShowAlert = (review) =>{
        setCurReview(review)
        setShowAlert(true)
    }

    const handleCloseAlert = () =>{
        setShowAlert(false)
    }
    const handleOpen = (review) =>{
        setCurReview(review)
        setOpen(true)
    }

    const handleClose = () =>{
        setOpen(false)
    }

    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/all?page=${nums}&rating=${rating}&active=${active}&email=${email}&start=${start}&end=${end}`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            
            json => {
                console.log(json);
                setFeedback(json)
            }
        )
    }

    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    <div>
                        <h1>FeedBack</h1>
                        <form>
                        <div className="d-flex gap-2">
                            <label >User </label>
                            <input type="text" style={{width:"15%"}} onChange={e=> setEmail(e.target.value)}/>
                            <label>From</label>
                            <input type="date" onChange={e=> setStart(e.target.value)}/>
                            <label>To</label>
                            <input type="date" onChange={e=> setEnd(e.target.value)}/>
                            <label>Active</label>
                            <select onChange={e=> setActive(+e.target.value)}>
                                <option value={0}>All</option>
                                <option value={1}>Active</option>
                                <option value={2}>Not Actice</option>
                            </select>
                            <label>Rating</label>
                            <select style={{width:"80px"}} onChange={e => setRating(+e.target.value)}>
                                <option value={0}>All</option>
                                <option value={5}>5⭐</option>
                                <option value={4}>4⭐</option>
                                <option value={3}>3⭐</option>
                                <option value={2}>2⭐</option>
                                <option value={1}>1⭐</option>
                            </select>
                            {/* search */}
                            <button type="button" style={{height:"30px",width:"60px", textAlign:'center'}} onClick={()=> loadSearch()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg></button>
                            {/* reset */}
                            <button type="reset" style={{height:"30px", width:"60px"}} onClick={() => loadData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg></button>
                        </div>
                        </form>
                        <hr/>
                        <div>
                            <table>
                            <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                                <tr style={{background:"teal", color:"white",borderBottom:"1px solid black"}} >
                                    <th style={{width:"10%",border:"0"}}>User</th>
                                    <th style={{width:"15%",border:"0"}}>Comment</th>
                                    <th style={{width:"15%",border:"0",textAlignLast:"auto"}}>DATE</th>
                                    <th style={{width:"15%",border:"0"}}>Rating</th>
                                    <th style={{width:"10%",border:"0",textAlignLast:"auto"}}>Active</th>
                                    
                                    <th style={{width:"20%",border:"0"}}>Action</th>
                                </tr></thead>
                                {
                                    feedback?.reviewList?.map((review) => (
                                
                                        <tr style={{borderBottom:"1px solid black", height:"60px"}}>
                                            <td style={{border:"0"}}>{review.user.email}</td>
                                            <td style={{border:"0"}}>{Truncate(review.comment, 20)}</td>
                                            <td style={{border:"0"}}>
                                                <DateConvert date={review.commentDate}/>
                                            </td>
                                            <td style={{border:"0"}}>
                                                <StarRatings rating={review.ratingValue} starRatedColor="orange" starHoverColor="orange" starDimension="20px"/>
                                            </td>
                                            <td style={{border:"0"}}>
                                                {
                                                    <label class="switch">
                                                        <input type="checkbox" checked={review.active} onChange={() => updateActive(review)}/>
                                                        <span class="slider round"></span>
                                                  </label>
                                                }
                                            </td>
                                            <td className="d-flex gap-3" style={{textAlign: "center",border:"0"}}>
                                                <button className="p-2" style={{background:"#D50000", height:"100%", width:"50%"}} onClick={() => handleShowAlert(review)}>
                                                    <i class="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong>
                                                </button>
                                                <button style={{height:"40px"}} onClick={() => handleOpen(review)}>Detail</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </table>
                            <br/>
                            {/*Navigate  */}
                            <nav aria-label="Page navigation example" style={{ left:"55%"}}>
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
                            {/* Reivew detail ALERT */}
                            <Modal show={open} onHide={handleClose} style={{textAlign:'center'}}>
                                <Modal.Title>Detail Review</Modal.Title>
                                <Modal.Body >
                                    <div className="d-flex">
                                        <label style={{width:"20%", textAlign:"left", fontWeight:"bold"}}>Comment</label>
                                        <p>{curReview?.comment}</p>
                                    </div>
                                    <br/>
                                    <div className="d-flex">
                                        <label style={{width:"20%", textAlign:"left", fontWeight:"bold"}}>Date</label>
                                        <DateConvert date={curReview?.commentDate}/>
                                    </div>
                                    <br/>
                                    <div className="d-flex">
                                        <label style={{width:"20%", textAlign:"left", fontWeight:"bold"}}>Rating</label>
                                        <StarRatings rating={curReview?.ratingValue} starRatedColor="orange" starHoverColor="orange" starDimension="20px"/>
                                    </div>
                                    <br/>
                                    <div className="d-flex">
                                        <label style={{width:"20%", textAlign:"left", fontWeight:"bold"}}>Fit</label>
                                        <p>{curReview?.fit}</p>
                                    </div>
                                    
                                    <div className="d-flex">
                                        <label style={{width:"30%", textAlign:"left", fontWeight:"bold"}}> Purchaseed Size</label>
                                        <p>{curReview?.size !== "" ? curReview?.size : "None"}</p>
                                    </div>
                                    <br/>
                                    <div className="d-flex">
                                        <label style={{width:"30%", textAlign:"left", fontWeight:"bold"}}> Gender</label>
                                        <p>{curReview?.gender !== "" ? curReview?.gender : "None"}</p>
                                    </div>
                                    <br/>
                                    <div className="d-flex">
                                        <label style={{width:"30%", textAlign:"left", fontWeight:"bold"}}>Age</label>
                                        <p>{curReview?.age !== "" ? curReview?.age : "None"}</p>
                                    </div>
                                    <br/>
                                    <div className="d-flex">
                                        <label style={{width:"30%", textAlign:"left", fontWeight:"bold"}}>Height</label>
                                        <p>{curReview?.height !== "" ? curReview?.height : "None"}</p>
                                    </div>
                                    <br/>
                                    <div className="d-flex">
                                        <label style={{width:"30%", textAlign:"left", fontWeight:"bold"}}>Weight</label>
                                        <p>{curReview?.weight !== "" ? curReview?.weight : "None"}</p>
                                    </div>
                                </Modal.Body>
                                {/* <Modal.Footer >
                                    <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                                        <button style={{background:"none",border:"1px solid black", color:'black'}}  onClick={handleClose}>
                                        Close
                                    </button>
                                    </div>
                                
                                </Modal.Footer> */}
                            </Modal>
                            {/* DELETE ALERT */}
                            <Modal show={showAlert} onHide={handleCloseAlert} style={{textAlign:'center'}}>
                                <Modal.Body >
                                    <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i>
                                    <h5 >Are you sure?</h5>
                                    <p >Do you really want to delete this review?<br/> This process cannot be undone</p>
                        
                                </Modal.Body>
                                <Modal.Footer >
                                    <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                                        <button style={{backgroundColor:"grey"}}  onClick={handleCloseAlert}>
                                        No
                                    </button>
                                    <button style={{backgroundColor:"red"}} onClick={() => deleteReview(curReview.id)}>
                                        Yes
                                    </button>
                                    </div>
                                
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
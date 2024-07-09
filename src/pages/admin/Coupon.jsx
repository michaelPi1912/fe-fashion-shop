import { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { blockInvalidChar } from "../../components/blockInvalidChar";
import toast from "react-hot-toast";
import DateConvert from "../../components/DateConvert";

export default function CouponPage(){
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });
    const [coupons, setCoupons] = useState();
    const [open,setOpen] = useState(false);
    const [edit,setEdit] = useState(false);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDesc] = useState("");
    const [type, setType] = useState("percent");
    const [amount, setAmount] = useState(0);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [limit, setLimit] = useState(0)
    const [times, setTimes] = useState(0)
    const [maxValue, setMaxValue] = useState(0);

    const [curCoupon, setCurCoupon] = useState();
    
    const [findCode, setFindCode] = useState("");
    const [status, setStatus] = useState(0)

    const [curPage, setCurPage] = useState(0);
    const [showAlert, setShowAlert] = useState(false);

    let paginationNumber = []
    for (let i = 0; i < coupons?.totalPages; i++) {
            paginationNumber.push(i);
    }

    console.log("code:" + code 
    +"\nname:"+ name, 
    +"\n decs:"+ description, 
    +"\n type:"+ type 
    +"\namount:"+ amount 
    +"\nstart:"+ startDate 
    +"\nend"+ endDate 
    +"\nlimit:"+ limit
     +"\ntimes:"+ times
    +"\nmax:"+maxValue)

    console.log(coupons)

    useEffect(() =>{
        loadData()
    },[])
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickClose = ()=>{
        setOpen(false)
    }
    const handleClickEditOpen = (item) => {
        setCurCoupon(item);
        setName(item.name)
        setDesc(item.description)
        setType(item.discountType === "PercentageDiscount" ? "percent" : "fixed")
        setAmount(item.amount)
        const date1 = new Date(item.startDate);
        const date2 = new Date(item.endDate);
        const day1 = date1.getDate()+1 <10 ? "0"+(date1.getDate()): date1.getDate();
        const month1 = date1.getMonth()+1 <10 ? "0"+(date1.getMonth()+1): date1.getMonth();
        const string1 = date1.getFullYear()+"-"+month1+"-"+ day1

        const day2 = date2.getDate()+1 <10 ? "0"+(date2.getDate()): date2.getDate();
        const month2 = date2.getMonth()+1 <10 ? "0"+(date2.getMonth()+1): date2.getMonth();
        const string2 = date2.getFullYear()+"-"+month2+"-"+ day2
        
        setStartDate(string1)
        setEndDate(string2)
        setLimit(item.limitUsage)
        setTimes(item.times)
        setMaxValue(item.maxValue)
        setEdit(true)
    }

    const handleClickEditClose = ()=>{
        setEdit(false)
    }
    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/coupon/all`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setCoupons(json)
                setFindCode("")
                setStatus(0)
            }
        )
    }

    const loadSearch = () =>{
        console.log(`/api/v1/coupon/all?code=${findCode}&status=${status}`)
        let param = "";
        if(findCode !==""){
            param += `code=${findCode}&`
        }
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/coupon/all?status=${status}&`+param,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res =>{
                // console.log(res.json())
                res.json().then(
                    json => {
                        setCoupons(json)
                    }
                )
            } 
        )
    }

    const generateCode = () => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 8) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        setCode(result);
    }

    const addCoupon = () => {
        let date1 = new Date(startDate);
        let date2 = new Date(endDate);
        if(type === "fixed"){
            setMaxValue(amount)
        }
        if (code && name && amount && date1 < date2 && limit > 0 && times > 0) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/coupon/insert", {
            method: "POST",
            body: JSON.stringify({
                code,
                name,
                description,
                discountType: type,
                amount,
                startDate,
                endDate,
                limitUsage: limit,
                times,
                maxValue
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    toast.success("Add Coupon Successfully");
                    setCode("")
                    loadData()
                    handleClickClose();
                }else{
                    toast.error("Cannot Add Coupon! Try again next time")
                }
            })
        }
    };

    const updateCoupon = (id) => {
        let date1 = new Date(startDate);
        let date2 = new Date(endDate);
       
        if (name && amount && date1 < date2 && limit > 0 && times > 0) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/coupon/update/"+id, {
            method: "PUT",
            body: JSON.stringify({
                name,
                description,
                discountType: type,
                amount,
                startDate,
                endDate,
                limitUsage: limit,
                times,
                maxValue
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    toast.success("Update Counpon Sucessfully");
                    setCode("")
                    loadData()
                    handleClickEditClose();
                }else{
                    toast.error("Cannot Update Coupon! Try again next time")
                }
            })
        }else{
            toast.error("Wrong value")

        }
    };

    const deleteCoupon = (id) =>{
        fetch(process.env.REACT_APP_API_URL+"/api/v1/coupon/delete/"+id, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    toast.success("Delete Counpon Sucessfully");
                    loadData()
                    handleClickEditClose();
                    setShowAlert(false);
                }else{
                    toast.error("Cannot Update Coupon! Try again next time")
                    setShowAlert(false);
                }
            })
    }

    const handleSubmit =(e) =>{
        e.preventDefault();
        addCoupon();
    }

    const handleSubmitEdit =(e) =>{
        e.preventDefault();
        updateCoupon(curCoupon.id)
    }

    const handleOpenAlert = (item) =>{
        setCurCoupon(item);
        setShowAlert(true)
    }

    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/coupon/all?page=${nums}&code=${findCode}&status=${status}`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setCoupons(json)
            }
        )
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    <div>
                        <h1>COUPONS</h1>
                        <button onClick={handleClickOpen} style={{background: "#0288D1"}} className="">
                            <i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong>
                        </button>
                        <br/>
                        <form>
                        <div className="d-flex gap-2">
                            <label ><strong>CODE</strong></label>
                            <input type="text" style={{width:"15%"}} onChange={e=> setFindCode(e.target.value)}/>
                        
                            <label><strong>STATUS</strong></label>
                            <select onChange={e => setStatus(+e.target.value)}>
                                <option value={0}>All</option>
                                <option value={1}>Active</option>
                                <option value={2}>Scheduled</option>
                                <option value={3}>Expired</option>
                            </select>
                            <button type="button" style={{height:"30px",width:"100px", textAlign:'center'}} onClick={()=> loadSearch()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>&nbsp; Search</button>
                            {/* reset */}
                            <button type="reset" style={{height:"30px", width:"60px"}} onClick={() =>loadData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg></button>
                        </div>
                        </form>
                        <hr/>
                        <div>
                        <table >
                                <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                                <tr style={{background:"teal", color:"white",borderBottom:"1px solid black"}} >
                                    <th style={{width:"10%",border:"0"}}>NAME</th>
                                    <th style={{width:"10%",border:"0"}}>COUPON CODE</th>
                              
                                    <th style={{width:"30%",border:"0"}}>STATUS</th>
                                    <th style={{width:"10%",border:"0"}}>ACTION</th>
                                </tr></thead>
                                {
                                    coupons !== undefined ? coupons.couponList?.map((coupon) => (
                                
                                        <tr style={{borderBottom:"1px solid black", height:"60px"}}>
                                            <td style={{border:"0"}}>{coupon.name}</td>
                                            <td style={{border:"0"}}>{coupon.code}</td>
                                            <td style={{border:"0", fontWeight:"bold"}}>
                                                {
                                                    (() =>{
                                                        const curDate = new Date();
                                                        const start= new Date(coupon.startDate);
                                                        const end = new Date(coupon.endDate);
                                                        console.log(curDate)
                                                        if(start <= curDate && curDate <= end){
                                                            return(
                                                                <div className="d-flex gap-2">
                                                                    <p style={{textAlign:"center",padding:"2%",width:"120px", backgroundColor:"#009900", color:"white"}}>Active</p>
                                                                    <DateConvert date={coupon.startDate}/> - <DateConvert date={coupon.endDate}/>
                                                                </div>
                                                            )
                                                        }else if(end < curDate){
                                                            return(
                                                                <div className="d-flex gap-2">
                                                                <p style={{textAlign:"center",padding:"2%",width:"120px", backgroundColor:"#999999", color:"white"}}>Expired</p>
                                                                <DateConvert date={coupon.startDate}/> - <DateConvert date={coupon.endDate}/>
                                                                </div>
                                                            )
                                                        }else if(curDate < start){
                                                            return(
                                                                <div className="d-flex gap-2">
                                                                <p style={{textAlign:"center",padding:"2%",width:"120px", backgroundColor:"#0059b3", color:"white"}}>Scheduled</p>
                                                                <DateConvert date={coupon.startDate}/> - <DateConvert date={coupon.endDate}/>
                                                                </div>
                                                            )
                                                        }
                                                    })()
                                                }
                                            </td>
                                            <td className="d-flex gap-2" style={{border:"0"}}>
                                                <button className="p-2" style={{background:"#4CAF50"}} onClick={() => handleClickEditOpen(coupon)}><i class="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button>
                                                <button className="p-2" style={{background:"#D50000"}} onClick={()=> handleOpenAlert(coupon)}><i class="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>
                                            </td>
                                           
                                        </tr>
                                )) : <h1>load data</h1>
                                }
                                </table>
                                <br/>
                                {/* Navigate */}
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
                        </div>
                    </div>

                    {/* add new coupon */}
                    <Modal show={open} onHide={handleClickClose} className="modal-lg">
                            <Modal.Header closeButton>
                            <Modal.Title>Add Coupon </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 d-flex gap-3">
                                    <Form.Label style={{width:"15%"}}>Coupon Code</Form.Label>
                                
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            value={code}
                                            style={{ width:"50%"}}
                                            // onChange={e =>setSku(e.target.value)}
                                            onChange={e => setCode(e.target.value)}
                                            required
                                        />
                                        
                                        <button type="button" style={{height:"30px", backgroundColor:"#0066cc", borderRadius:"5%"}} onClick={() => generateCode()}>
                                            Generate Code</button>
                                </Form.Group>
                                
                                <Form.Group className="mb-3 d-flex gap-3" controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setName(e.target.value)
                                    }}
                                    required
                                />
                                {/* <input type='number' onKeyDown={blockInvalidChar} min={0} /> */}
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setDesc(e.target.value)
                                    }}
                                />
                                
                                </Form.Group>
                                
                                
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Coupon Type</Form.Label>
                                <Form.Select style={{width:"30%"}} onChange={e => setType(e.target.value)} required>
                                    <option value="percent">Percentage Discount</option>
                                    <option value="fixed">Fixed Discount</option>
                                </Form.Select>                                
                                </Form.Group>
                                
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Coupon Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setAmount(e.target.value)
                                    }}
                                    required
                                />
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3" style={{display: type =="fixed"? "none":""}}>
                                <Form.Label style={{width:"15%",display: type =="fixed"? "none":""}}>Max Value (VND)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    style={{ width:"50%",display: type =="fixed"? "none":""}}
                                    onChange={e =>{
                                        setMaxValue(e.target.value)
                                    }}

                                    required={type !=="fixed" ? true: false}
                                />
                                </Form.Group>

                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Start date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setStartDate(e.target.value)
                                    }}
                                    required
                                />
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>End date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setEndDate(e.target.value)
                                    }}

                                    required
                                />
                                
                                </Form.Group>

                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Usage limit per coupon</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setLimit(e.target.value)
                                    }}

                                    required
                                />
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Usage per user</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setTimes(e.target.value)
                                    }}

                                    required
                                />
                                
                                </Form.Group>
                                
                                <button type="submit" style={{marginLeft:"20%",fontSize:"20px",width:"30%", backgroundColor:"#0066cc", color:"white"}}>Publish</button>

                                
                                </Form>
                            </Modal.Body>
                           
                    </Modal>
                    {/* edit coupon */}
                    <Modal show={edit} onHide={handleClickEditClose} className="modal-lg">
                            <Modal.Header closeButton>
                            <Modal.Title>Edit Coupon </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmitEdit}>
                                <Form.Group className="mb-3 d-flex gap-3">
                                    <Form.Label style={{width:"15%"}}>Coupon Code</Form.Label>
                                
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            value={curCoupon?.code}
                                            style={{ width:"50%"}}
                                            disabled
                                        />
                                        
                                </Form.Group>
                                
                                <Form.Group className="mb-3 d-flex gap-3" controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={name}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setName(e.target.value)
                                    }}
                                    required
                                />
                                {/* <input type='number' onKeyDown={blockInvalidChar} min={0} /> */}
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={description}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setDesc(e.target.value)
                                    }}
                                />
                                
                                </Form.Group>
                                
                                
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Coupon Type</Form.Label>
                                <Form.Select style={{width:"30%"}} onChange={e => setType(e.target.value)} required>
                                    <option value="percent" selected={type === "percent"}>Percentage Discount</option>
                                    <option value="fixed" selected={type === "fixed"}>Fixed Discount</option>
                                </Form.Select>                                
                                </Form.Group>
                                
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Coupon Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    value={amount}
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setAmount(e.target.value)
                                        if(type ==="fixed"){
                                            setMaxValue(e.target.value)
                                        }
                                    }}
                                    required
                                />
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%",display: type =="fixed"? "none":""}}>Max Value (VND)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    value={maxValue}
                                    style={{ width:"50%",display: type =="fixed"? "none":""}}
                                    onChange={e =>{
                                        setMaxValue(e.target.value)
                                    }}

                                    required={type !=="fixed" ? true: false}
                                />
                                </Form.Group>

                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Start date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder=""
                                    value={startDate}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setStartDate(e.target.value)
                                        // setSDate(e.target.value)
                                    }}
                                    required
                                />
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>End date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder=""
                                    value={endDate}
                                    autoFocus
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setEndDate(e.target.value)
                                        // setEDate(e.target.value)
                                    }}

                                    required
                                />
                                
                                </Form.Group>

                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Usage limit per coupon</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    value={limit}
                                    style={{ width:"50%"}}
                                    min={0}
                                    onChange={e =>{
                                        setLimit(e.target.value)
                                    }}

                                    required
                                />
                                
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex gap-3"  controlId="exampleForm.ControlInput1">
                                <Form.Label style={{width:"15%"}}>Usage per user</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    value={times}
                                    style={{ width:"50%"}}
                                    onChange={e =>{
                                        setTimes(e.target.value)
                                    }}

                                    required
                                />
                                
                                </Form.Group>
                                
                                <button type="submit" style={{marginLeft:"20%",fontSize:"20px",width:"30%", backgroundColor:"#0066cc", color:"white"}}>Edit</button>

                                
                                </Form>
                            </Modal.Body>
                           
                    </Modal>
                    <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                            <Modal.Header closeButton>
                            <Modal.Title>Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <h5 >Are you sure?</h5>
                            <p >Do you really want to delete this coupon?<br/> This process cannot be undone</p>
                            </Modal.Body>
                            <Modal.Footer>
                            <button  onClick={() => setShowAlert(false)}>
                                No
                            </button>
                            <button  style={{backgroundColor:"red"}} onClick={() => deleteCoupon(curCoupon.id)}>
                                Yes
                            </button>
                            </Modal.Footer>
                        </Modal>
                </div>
            </div>
        </div>
    );
}
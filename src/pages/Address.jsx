import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarNavigate from "../components/Navbar";
import ProfileSideBar from "../components/ProfileSideBar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';  
import toast from "react-hot-toast";


export default function AddressPage(){
    const navigate = useNavigate();
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [address, setAddress] = useState();
    const [curPage,setCurPage] = useState(0);

    const [targetAddress, setTargetAddress] = useState();
    const [open, setOpen] = useState(false);
    // address type
    const [addressType, setAddressType] = useState("Home");
    const [other, setOther] = useState(false);
    // province
    const [province, setProvince] = useState("");
    // disctrict
    const [district, setDistrict] = useState("");
    // commune
    const [commune, setCommune] = useState("");
    // province List
    const [provinces, setProvinces] = useState([]);
    // disctrict list
    const [districts, setDistricts] = useState([]);
    // commune list
    const [communes, setCommunes] = useState([]);
    // address detail
    const [addressDetail, setAddressDetail] = useState("");
    // 
    const [showAlert, setShowAlert] = useState(false);
    const [edit, setEdit] = useState(false);


    console.log(address) 
    let paginationNumber = []
    for (let i = 0; i < address?.totalPages; i++) {
        paginationNumber.push(i);
    }
    useEffect(()=>{
        if(!localStorage.getItem("user-info")){
            navigate("/")
        }else{
            fetchUserAddress()
            fetchAddressValue()
        }
    },[])

    const fetchUserAddress =() =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/address/all`,{
          headers: {
                'Authorization' : `Bearer ${user.access_token}`
          }
        }).then(res => res.json())
        .then(json =>{
          console.log(json)
          setAddress(json) 
        } )
        
    }
    const addAddress = () => {
        if (province.length > 0 && district.length >0 && commune.length > 0 && addressDetail.length > 0) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/address/insert", {
            method: "POST",
            body: JSON.stringify({
              province,
              district,
              commune,
              addressDetail,
              addressType
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${user.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    // loadProductItem()
                    setCommune("")
                    setDistrict("")
                    setProvince("")
                    setAddressDetail("")
                    setOther(false)
                    setAddressType("Home")
                    fetchUserAddress()
                    handleClickClose()
                }
            })
        }else{
          toast.error("Please fill in for address detail and select all.")
        }
    };
    // open add new
    const handleClickOpen = (item) =>{
        setOpen(true)
    }
    // close add new
    const handleClickClose = () =>{
        setOpen(false)
    }
    // show alert delete
    const handleShowAlert = (item) =>{
        setTargetAddress(item)
        setShowAlert(true)
    }
    const handleClickCloseEdit = () =>{
        setEdit(false)
    }
    // show edit
    const handleClickOpenEdit = (item) =>{
        // console.log(item)
        setTargetAddress(item)
        setCommune(item.commune)
        setAddressDetail(item.addressDetail)
        setAddressType(item.addressType)
        setDistrict(item.district)
        setProvince(item.province)
        const ps = provinces.filter(p => p.Name === item.province)
        // console.log(ps[0].Districts);
        setDistricts(ps[0]?.Districts)
        const ds = ps[0].Districts.filter(d => d.Name === item.district)
        setCommunes(ds[0]?.Wards)
        setOther(item.addressType !== "Home" && item.addressType !=="Office")
        setEdit(true)
    }
    // address value
    const fetchAddressValue = () => {
        fetch("https://michaelpi1912.github.io/api.v1/data.json")
        .then(res => res.json())
        .then(json => setProvinces(json))
      }

    // Navigate method
    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/address/all?page=${nums}`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setAddress(json)
            }
        )
    }
    const handleSubmitUpdate =(e) =>{
        e.preventDefault();
        // console.log(targetAddress.province )
        if(targetAddress.province !== province){
            if(targetAddress.district === district){
                toast.error("Select a district and a ward")
            }else if(targetAddress.district !== district &&targetAddress.commune === commune){
                toast.error("Select a ward")
            }else{
                updateAddress(targetAddress.id);
            }
        }else{
            if(targetAddress.district !== district && targetAddress.commune === commune){
                toast.error("Select a ward !")
            }else{
                // toast.success("success")
                updateAddress(targetAddress.id);
            }
            
        }
        
    }
    const updateAddress = id => {
        console.log("cos update")
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/address/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            province,
            district,
            commune,
            addressDetail,
            addressType
            }),
          headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${user.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                fetchUserAddress()
                setCommune("")
                setDistrict("")
                setProvince("")
                setAddressDetail("")
                setOther(false)
                setAddressType("Home")
                handleClickCloseEdit()
            }
        })

    };
    const deleteAddress = id => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/address/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${user.access_token}`
          }
        })
        .then(response => {
        if(response.status === 200){
            console.log("success")
            fetchUserAddress();
            setShowAlert(false);
        }
        })

        
    };

    return(
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px"}} className="d-flex">
                <ProfileSideBar />
                <div style={{padding:"5%", width:"70%"}}>
                    <h2 style={{fontWeight:"bold"}}>ADDRESS</h2>
                    <button onClick={handleClickOpen}>New Address</button>
                    <hr/>
                    <div>
                        <table>
                        <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                            <tr style={{background:"teal", color:"white",borderBottom:"1px solid black"}} >
                                <th style={{width:"15%",border:"0"}}>Province</th>
                                <th style={{width:"20%",border:"0",textAlignLast:"auto"}}>District</th>
                                <th style={{width:"25%",border:"0",textAlignLast:"auto"}}>Ward</th>
                                <th style={{width:"25%",border:"0",textAlignLast:"auto"}}>Detail</th>
                                {/* <th style={{width:"10%"}}>QUANTITY</th> */}
                                <th style={{width:"15%",border:"0",textAlign:"center"}}>Type</th>
                                <th style={{width:"25%",border:"0"}}></th>
                            </tr></thead>
                            {
                                address !== undefined ? address.addressList?.map((item) => (
                               
                                    <tr style={{borderBottom:"1px solid black", height:"60px"}}>
                                        <td style={{border:"0"}}>{item.province}</td>
                                        <td style={{border:"0"}}>
                                            {item.district}
                                        </td>
                                        <td style={{border:"0"}}>{item.commune}</td>
                                        <td style={{border:"0"}}>{item.addressDetail}</td>
                                        <td style={{textAlign: "center",border:"0"}}>
                                            {item.addressType}
                                        </td>
                                        <td className="d-flex gap-3  align-items-center" style={{height:"60px",border:"0",textAlign:"center"}}>
                                            <button style={{backgroundColor:"green", color:"white"}} onClick={() => handleClickOpenEdit(item)}>Edit</button> 
                                            <button style={{backgroundColor:"red", color:"white"}} onClick={() => handleShowAlert(item)}>Delete</button>
                                        </td>
                                    </tr>
                              )) : <h1>load data</h1>
                            }
                        </table>
                    </div>
                    <br/>
                    {/* navigation */}
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

                        {/* Modal Add new */}
                        <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>New Address</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form.Group>
                                <Form.Label style={{fontWeight:"bold"}}>ADDRESS TYPE</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value ==="other"){
                                    setOther(true)
                                  }else{
                                    // setProvince(e.target)
                                    setOther(false)
                                    setAddressType(e.target.value)
                                  }
                                }}>
                                    <option value="Home">🏠 HOME</option>
                                    <option value="Office" >🏢 Office</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                                <br/>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    autoFocus
                                    style={{display: other === true ? "" :"none"}}
                                    onChange={(e) => setAddressType(e.target.value)}
                                />
                                <Form.Label style={{fontWeight:"bold"}}>PROVINCE</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  // console.log(e.target.value == -1)
                                  if(e.target.value === -1){
                                    setCommunes([])
                                    setDistricts([])
                                  }else{
                                    setDistricts(provinces[e.target.value].Districts)
                                    setProvince(provinces[e.target.value].Name)
                                  }
                                  
                                }} required>
                                  <option value={-1} disabled selected>Please select a province</option>
                                    {
                                      provinces?.map((p,index) =>(
                                        <option value={index}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>DISTRICT</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value === -1){
                                    setCommunes([])
                                    // setDistricts([])
                                  }else{
                                    setCommunes(districts[e.target.value].Wards)
                                    setDistrict(districts[e.target.value].Name)
                                  }
                                }} required>
                                  <option value={-1} disabled selected>Please select your district</option>
                                  {
                                      districts?.map((p,index) =>(
                                        <option value={index}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>WARD</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value === -1){
                                    setCommune("")
                                  }else{
                                    setCommune(communes[e.target.value].Name)
                                  }
                                }} required>
                                  <option value={-1} disabled selected>Please select your ward</option>
                                  {
                                      communes?.map((p,index) =>(
                                        <option value={index}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>ADDRESS DETAIL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    required
                                    onChange={e =>{
                              
                                      setAddressDetail(e.target.value)}}
                                    // minLength={10}
                                />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickClose}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={() => addAddress()}>
                                Add
                            </button>
                            </Modal.Footer>
                        </Modal>
                        {/* Modal Edit */}
                        <Modal show={edit} onHide={handleClickCloseEdit}>
                            <Modal.Header closeButton>
                            <Modal.Title>Edit Address</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmitUpdate}>
                              <Form.Group>
                                <Form.Label style={{fontWeight:"bold"}}>ADDRESS TYPE</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value ==="other"){
                                    setOther(true)
                                  }else{
                                    // setProvince(e.target)
                                    setOther(false)
                                    setAddressType(e.target.value)
                                  }
                                }}>
                                    <option value="Home" selected={addressType ==="Home"}>🏠 HOME</option>
                                    <option value="Office" selected={addressType ==="Office"}>🏢 Office</option>
                                    <option value="other" selected={addressType !=="Home" && addressType !=="Office"}>Other</option>
                                </Form.Select>
                                <br/>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    autoFocus
                                    required
                                    defaultValue={addressType}
                                    style={{display: other === true ? "" :"none"}}
                                    onChange={(e) => setAddressType(e.target.value)}
                                />
                                <Form.Label style={{fontWeight:"bold"}}>PROVINCE</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  // console.log(e.target.value == -1)
                                  if(e.target.value === -1){
                                    setCommunes([])
                                    setDistricts([])
                                  }else{
                                    setDistricts(provinces[e.target.value].Districts)
                                    setProvince(provinces[e.target.value].Name)
                                  }
                                  
                                }} >
                                  <option value={-1} disabled selected>Please select a province</option>
                                    {
                                      provinces?.map((p,index) =>(
                                        <option value={index} selected={p.Name === province}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>DISTRICT</Form.Label>
                                <Form.Select onChange={(e) =>{
                                  if(e.target.value === -1){
                                    setCommunes([])
                                    // setDistricts([])
                                  }else{
                                    setCommunes(districts[e.target.value].Wards)
                                    setDistrict(districts[e.target.value].Name)
                                  }
                                }} required>
                                  <option value={-1} disabled selected>Please select your district</option>
                                  {
                                      districts?.map((p,index) =>(
                                        <option value={index} selected={p.Name === district}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>WARD</Form.Label>
                                <Form.Select  onChange={(e) =>{
                                  if(e.target.value === -1){
                                    setCommune("")
                                  }else{
                                    setCommune(communes[e.target.value].Name)
                                  }
                                }} required>
                                  <option value={-1} disabled selected>Please select your ward</option>
                                  {
                                      communes?.map((p,index) =>(
                                        <option value={index} selected={p.Name === commune}>{p.Name}</option>
                                      ))
                                    }
                                </Form.Select>
                                <br/>
                                <Form.Label style={{fontWeight:"bold"}}>ADDRESS DETAIL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    required
                                    defaultValue={targetAddress !== undefined ? targetAddress.addressDetail : ""}
                                    onChange={e =>{
                              
                                      setAddressDetail(e.target.value)}}
                                    // minLength={10}
                                />
                                
                                </Form.Group>
                                <button type="submit" style={{background:"green"}} variant="primary">
                                    Update
                                </button>
                                </form>
                            </Modal.Body>
                           
                        </Modal>
                        {/* Modal delete */}
                        <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                            <Modal.Header closeButton>
                            <Modal.Title>Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to delete?</Modal.Body>
                            <Modal.Footer>
                            <button  onClick={() => setShowAlert(false)}>
                                No
                            </button>
                            <button onClick={() => deleteAddress(targetAddress.id)} style={{backgroundColor:"red"}}>
                                Yes
                            </button>
                            </Modal.Footer>
                        </Modal>
                </div>
            </div>
        </div>
    );
}
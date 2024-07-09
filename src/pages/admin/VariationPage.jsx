import SideBar from "../../components/SideBar";
import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";

export default function VariationPage(props){
    const navigate = useNavigate();
    const {id} =  useParams();
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const [variations, setVariations] = useState();
    const [options, setOptions] = useState([]);
    const [vname, setVName] = useState();
    const [curVari, setCurVari] = useState();
    const [curOption, setCurOption] = useState();

    const [open, setOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const [openOption, setOpenOption] = useState(false);
    const [editOption, setEditOption] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertOption, setShowAlertOption] = useState(false);

    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [optionsList, setOptionsList] = useState([])
    useEffect(() =>{
        if(admin === undefined){
            navigate("/admin")
        }else{
            loadData()
        }
    }
        
    ,[]);
    console.log(curVari,vname)

    const handleClickOpen = () =>{
        setOpen(true);
    };
    const handleClickClose = () =>{
        setOpen(false);
    }
    const handleClickOpenEdit = item =>{
        setCurVari(item);
        console.log(curVari)
        setEditOpen(true);
    };
    const handleClickCloseEdit = () =>{
        setEditOpen(false);
    }
    // 
    const handleClickOpenOption = (item) =>{
        setOpenOption(true);
        // setCurVari(item);
        // console.log(curVari)
        // fetchOption(item)
    };
    const handleClickCloseOption = () =>{
        setOpenOption(false);
    }
    const handleClickOpenEditOption = (item)=>{
        setCurOption(item)
        setEditOption(true)
    }
    const handleClickCloseEditOption = ()=>{
        setEditOption(false)
    }
    const handleShowAlert = (item) =>{
        setCurVari(item)
        setShowAlert(true);
    };
    const handleCloseAlert = () =>{
        setShowAlert(false);
    }
    const handleShowAlertOption = (item) =>{
        setCurOption(item)
        setShowAlertOption(true);
    };
    const handleCloseAlertOption = () =>{
        setShowAlertOption(false);
    }
    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/variation/${id}/variations`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                console.log(json)
                setVariations(json)
             
                json.variations.map(variation =>{
                    fetchOption(variation)
                })
            }
        )
    }

    const fetchOption =(item) => {
        console.log(`${process.env.REACT_APP_API_URL}/api/v1/option/${item.id}/variations`)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/${item.id}/options`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                console.log(json)
                json.optionList.map(item =>{
                    const check = options.filter(option => option.id === item.id)
                    if(check.length ===0){
                        setOptions(cur => [...cur,item])
                        console.log(item.variation.name ==="Color")
                        if(item.variation.name ==="Color"){
                            setColors(cur => [...cur, item.value])
                        }else{
                            setSizes(cur => [...cur, item.value])
                        }
                    }   
                })
            }
        )
    }

    const addVariation = () => {
        if (vname) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/variation/insert", {
            method: "POST",
            body: JSON.stringify({
                categoryId: id,
                name: vname
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                if(response.status){
                    console.log("success")
                    loadData()
                    handleClickClose()
                }
            })
        }
    };
    const updateVariation = idItem => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/update/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/variation/update/${idItem}`, {
          method: 'PUT',
          body: JSON.stringify({
            categoryId: id,
            name: vname
            }),
          headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                loadData()
                handleClickCloseEdit()
            }
        })

    };
    const deleteVariation = id => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/variation/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                console.log("success")
                loadData();
                handleCloseAlert();
            }
        })
    };

    const addOption =  () => {

        if (vname) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/option/insert", {
            method: "POST",
            body: JSON.stringify({
                variationId: curVari.id,
                value: vname
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    toast.success("Add Option successful")
                    setVName("")
                    fetchOption(curVari)
                    handleClickCloseOption()
                }else{
                    toast.error("Cannot Add Option")
                }
            })
        }
    };
    const updateOption = (item, id) => {
        console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/update/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            variationId: "",
            value: vname
            }),
          headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                fetchOption(item)
                handleClickCloseEditOption()
            }
        })


    };
    const deleteOption = (id) => {
        
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                toast.success("Delete Option successful")
                window.location.reload()
                handleCloseAlertOption()
            }else{
                toast.success("Cannot Delete option")
            }
        })
    };

    const handleSubmit= (e)=>{
        e.preventDefault();
        addOption();
    }

    const handleOnChange = (e) =>{
        const item = variations.variations.filter(v=> v.id === e.target.value)
        setCurVari(item[0])
        console.log(item)
        if(item[0].name === "Color"){
            const arr = ["White", "Black", "Blue", "Red", "Yellow", "Pink","Purple","Green","Brown","Orange"];
            const arr2 = arr.filter(str => 
                !colors.includes(str)
            )
            setOptionsList(arr2)
        }else if(item[0].name === "Size"){
            const arr = ["XS", "S", "M", "L","XL"]
            const arr2 = arr.filter(str => 
                !sizes.includes(str)
            )
            console.log(arr2)
            setOptionsList(arr2)
        }
    }
    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div className="col">
                    <div className="d-flex" style={{marginTop: "5px"}}>
                        <a className="" style={{alignContent: "center"}} onClick={() => navigate("/category")}><i className="bi bi-arrow-left" style={{fontSize: "24px", color:"black"}}></i></a>
                        <br/>
                        <h1>&ensp;Options </h1>
                    </div>
                    <hr/>
                    <button  style={{background: "#0288D1"}} onClick={handleClickOpenOption}><i className="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                    <br/>
                    <div>
                        <table >
                                <tr style={{background:"black", color:"white"}}>
                                <th style={{width:"25%"}}>Option Value</th>
                                    <th style={{width:"25%"}}>Variation Name</th>
                                    <th style={{width:"50%"}}>Action</th>
                                </tr>
                                {
                                    options.map((item) => (

                                            <tr key={item.id}>
                                                <td>{item.value}</td>
                                                <td >{item.variation.name}</td>
                                                <td>
                                                    <div className="d-flex flex-row gap-3">
                                                        {/* <button className="p-2" style={{background:"#4CAF50"}} onClick={()=>handleClickOpenEdit(item)}><i className="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button> */}
                                                        <button className="p-2" style={{background:"#D50000"}} onClick={()=> handleShowAlertOption(item)}><i className="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>
                                                        {/* <button className="p-2" onClick={()=>handleClickOpenOption(item)} ><i className="bi bi-caret-down-fill"></i><br/><strong style={{marginLeft:"5px"}}>Option</strong></button> */}
                                                    </div>
                                                </td>

                                            </tr>             
                                    ))
                                }
                                
                        </table>
                    </div>
                    {/*  */}
                    <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Add New Variation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    autoFocus
                                    onChange={e =>setVName(e.target.value)}
                                />
                                </Form.Group>
                                <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1"
                                >
                                </Form.Group>
                            </Form>
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickClose}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" 
                            onClick={()=> addVariation()}
                            >
                                Add
                            </button>
                            </Modal.Footer>
                    </Modal>

                    
                    <Modal show={openEdit} onHide={handleClickCloseEdit}>
                        <Modal.Header closeButton>
                        <Modal.Title>Change Name Variation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                defaultValue={curVari !== undefined? curVari.name : ""}
                                autoFocus
                                onChange={e =>setVName(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                            >
                            </Form.Group>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickCloseEdit}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={() => updateVariation(curVari.id)}>
                                Add
                            </button>
                        </Modal.Footer>
                    </Modal>
                        {/*  Option*/}
                    <Modal  show={openOption} onHide={handleClickCloseOption}>
                        <Modal.Header closeButton>
                        <Modal.Title>Add New Option</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                      
                            <div className="d-flex gap-3">
                                <label style={{width:"20%"}}>Variation</label>
                                <select onChange={handleOnChange}>
                                    <option value={0} disabled selected={curVari === undefined ? true:false}>Select Variation</option>
                                {
                                    variations?.variations?.map(variation=>(
                                        <option value={variation.id}>{variation.name}</option>
                                    )
                                       
                                    )
                                }</select>
                            </div>
                            <br/>
                            <div className="d-flex gap-3">
                                <label style={{width:"20%"}}>Option</label>
                                <select onChange={e => setVName(e.target.value)}>
                                    <option value={0} disabled selected>Select Option</option>
                                {
                                    optionsList?.map(option=>(
                                        <option value={option} style={{display: (colors.includes(option)|| sizes.includes(option)) ? "none":""}}>{option}</option>
                                    ))
                                }</select>
                            </div>  
                        </Modal.Body>
                        <Modal.Footer>
                                <button style={{background: "red"}} variant="secondary" onClick={handleClickCloseOption}>
                                    Cancle
                                </button>
                                <button style={{background:"green"}} variant="primary" onClick={()=> addOption()}>
                                    Add
                                </button>
                            </Modal.Footer>
                    </Modal>
                        {/* EDIT OPTION */}
                        {/* <Modal show={editOption} onHide={handleClickCloseEditOption}>
                            <Modal.Header closeButton>
                            <Modal.Title>Change Value Option</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                      
                                <Form.Control
                                type="text"
                                placeholder=""
                                defaultValue={curOption !== undefined ? curOption.value: ""}
                                autoFocus
                                onChange={e =>setVName(e.target.value)}
                                /> 
                            </Modal.Body>
                            <Modal.Footer>
                                <button style={{background: "red"}} variant="secondary" onClick={handleClickCloseEditOption}>
                                    Cancle
                                </button>
                                <button style={{background:"green"}} variant="primary" onClick={() => updateOption(curVari,curOption.id)}>
                                    Save
                                </button>
                            </Modal.Footer>
                        </Modal> */}
                        {/* DELETE VARIAtION */}
                        {/* DELETE ALERT */}
                        <Modal show={showAlert} onHide={handleCloseAlert} style={{textAlign:'center'}}>
                            <Modal.Body >
                                <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i>
                                <h5 >Are you sure?</h5>
                                <p >Do you really want to delete this variation?<br/> This process cannot be undone</p>
                    
                            </Modal.Body>
                            <Modal.Footer >
                                <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                                    <button style={{backgroundColor:"grey"}}  onClick={handleCloseAlert}>
                                    No
                                </button>
                                <button style={{backgroundColor:"red"}} onClick={() => deleteVariation(curVari.id)}>
                                    Yes
                                </button>
                                </div>
                            
                            </Modal.Footer>
                        </Modal>
                        {/* DELETE ALERT Option */}
                        <Modal show={showAlertOption} onHide={handleCloseAlertOption} style={{textAlign:'center'}}>
                            <Modal.Body >
                                <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i>
                                <h5 >Are you sure?</h5>
                                <p >Do you really want to delete this option?<br/> This process cannot be undone</p>
                    
                            </Modal.Body>
                            <Modal.Footer >
                                <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                                    <button style={{backgroundColor:"grey"}}  onClick={handleCloseAlertOption}>
                                    No
                                </button>
                                <button style={{backgroundColor:"red"}} onClick={() => deleteOption(curOption.id)}>
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
import SideBar from "../../components/SideBar";
import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function VariationPage(props){
    const navigate = useNavigate();
    const {id} =  useParams();
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const [variations, setVariations] = useState();
    const [options, setOptions] = useState();
    const [vname, setVName] = useState();
    const [curVari, setCurVari] = useState();
    const [curOption, setCurOption] = useState();

    const [open, setOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const [openOption, setOpenOption] = useState(false);
    const [editOption, setEditOption] = useState(false);
    useEffect(() =>{
        if(admin === undefined){
            navigate("/admin")
        }else{
            loadData()
        }
    }
        
    ,[]);
    console.log(variations)

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
    const handleClickOpenOption = (item) =>{
        setOpenOption(true);
        setCurVari(item);
        console.log(curVari)
        fetchOption(item)
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

    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/variation/${id}/variations`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setVariations(json)
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
                setOptions(json)
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
                    console.log("success")
                    setVName("")
                    fetchOption(curVari)
                    
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
    const deleteOption = (item, id) => {
        
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                console.log("success")
                fetchOption(item)
            }
        })
    };
    return(
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div className="col">
                    <div className="d-flex" style={{marginTop: "5px"}}>
                        <a className="" style={{alignContent: "center"}} onClick={() => navigate("/category")}><i className="bi bi-arrow-left" style={{fontSize: "24px", color:"black"}}></i></a>
                        <br/>
                        <h1>&ensp;Variation</h1>
                    </div>
                    <hr/>
                    <button  style={{background: "#0288D1"}} onClick={handleClickOpen}><i className="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                    <br/>
                    <div>
                        <table >
                                <tr style={{background:"black", color:"white"}}>
                                    <th style={{width:"25%"}}>Variation Name</th>
                                    <th style={{width:"50%"}}>Action</th>
                                </tr>
                                {
                                    variations !== undefined ? variations.variations.map((item) => (

                                            <tr key={item.id}>
                                                <td >{item.name}</td>
                                                <td>
                                                    <div className="d-flex flex-row gap-3">
                                                        <button className="p-2" style={{background:"#4CAF50"}} onClick={()=>handleClickOpenEdit(item)}><i className="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button>
                                                        <button className="p-2" style={{background:"#D50000"}} onClick={()=> deleteVariation(item.id)}><i className="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>
                                                        <button className="p-2" onClick={()=>handleClickOpenOption(item)} ><i className="bi bi-caret-down-fill"></i><br/><strong style={{marginLeft:"5px"}}>Option</strong></button>
                                                    </div>
                                                </td>

                                            </tr>             
                                )) : <tr></tr>
                                }
                                
                        </table>
                    </div>
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

                        <Modal show={openOption} onHide={handleClickCloseOption}>
                            <Modal.Header closeButton>
                            <Modal.Title>{curVari !== undefined? curVari.name : ""}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <div className="d-flex" style={{gap: "20px"}}>
                                    <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={vname}
                                    autoFocus
                                    onChange={e =>setVName(e.target.value)}
                                    />
                                    <button style={{height: "2em"}} onClick={() => addOption()}><i className="bi bi-plus-lg" style={{marginLeft:"-10px"}}></i>&nbsp; Add</button>
                                </div>
                                    <hr/>
                          
                                    { 
                                        options !== undefined ? options.optionList.map((o) =>(
                                            <div className="row" style={{padding: "10px" }}>
                                            <div className="card">
                                                <div className="d-flex align-items-center" style={{gap:"10px"}}>
                                                    
                                                    <p style={{width: "100px", fontSize:"20px", fontStyle:"oblique"}}>{o.value}</p>
                                                    <button  style={{background:"orange", color:"black"}} onClick={()=>handleClickOpenEditOption(o)}>Edit</button>                                                   
                                                    <button style={{background:"red", color:"black"}} onClick={() => deleteOption(curVari, o.id)}>Delete</button>
                                                </div>
                                            </div></div>
                                            
                                        )): <h5>options is empty</h5>
                                    }   
                            </Modal.Body>
                        </Modal>
                        <Modal show={editOption} onHide={handleClickCloseEditOption}>
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
                        </Modal>
                </div>
            </div>
        </div>
    );
}
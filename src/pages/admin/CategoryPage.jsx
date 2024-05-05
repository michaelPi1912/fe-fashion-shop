import { useState,useEffect } from "react";
import SideBar from "../../components/SideBar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

import "../../style/css/admin/table.css"


export default function CategoryPage(){
    const navigate = useNavigate();

    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const [categories, setCategories] = useState();
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [name, setName] = useState();
    const [parentId, setParentId] = useState();
    const [cate, setCate] = useState();
    const [curCate, setCurCate] = useState();
    const [curPage, setCurPage] = useState(1);

    let paginationNumber = []

    const handleClickOpen = () =>{
        setOpen(true);
    };
    const handleClickClose = () =>{
        setOpen(false);
    }
    const handleClickOpenEdit = (cate) =>{
        setCurCate(cate)
        setOpenEdit(true);
    };
    const handleClickCloseEdit = () =>{
        setOpenEdit(false);
    }
    const handleOpenAlert = (cate) =>{
        setCate(cate)
        setShowAlert(true)
    }
    useEffect(() => {
        if(admin === undefined){
            navigate("/admin")
        }else{
            loadData()
        }
        
    }, []);
    console.log(admin);
    console.log(categories);
 
    if(categories !== undefined){
        for (let i = 0; i < categories.totalPages; i++) {
            paginationNumber.push(i);
        }
    }
    console.log(paginationNumber)
    console.log(categories !== undefined ? categories : "no data");
    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/category/all`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setCategories(json)
            }
        )
    }
    const addCate = () => {
        if (name) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/category/insert", {
            method: "POST",
            body: JSON.stringify({
                name,
                parentId
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                response.json()
            }).then(
                data =>{
                    loadData()
                    handleClickClose()
                }
            )
        }
    };
    const updateCategory = id => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/update/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/category/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name,
            parentId
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
    const deleteCategory = id => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
        if(response.status === 200){
            console.log("success")
            loadData();
            setShowAlert(false);
        }
        })

        
    };
    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/category/all?page=${nums}`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setCategories(json)
            }
        )
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    <div>
                        <h1>Category</h1>
                        <hr/>
                        <button onClick={handleClickOpen} style={{background: "#0288D1"}} className=""><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                        <br/>
                        <table >
                            <tr style={{background:"black", color:"white"}}>
                                <th style={{width:"25%"}}>Category Name</th>
                                <th style={{width:"25%"}}>Category's Parent</th>
                                <th style={{width:"50%"}}>Action</th>
                            </tr>
                            {
                                categories !== undefined ? categories.categoryList.map((cate) => (
                               
                                    <tr>
                                        <td>{cate.name}</td>
                                        <td>{cate.parent === null ? "" : cate.parent}</td>
                                        <td>
                                            <div className="d-flex flex-row gap-3">
                                                <button className="p-2" style={{background:"#4CAF50"}} onClick={() =>handleClickOpenEdit(cate)}><i class="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button>
                                                <button className="p-2" style={{background:"#D50000"}} onClick={()=> handleOpenAlert(cate)}><i class="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>
                                                <button className="p-2" onClick={() => navigate(`/variation/${cate.id}`)}><i class="bi bi-gear-fill" ></i><br/><strong style={{marginLeft:"5px"}}>Variation</strong></button>
                                            </div>
                                        </td>
                                    </tr>
                                    
                        
                              )) : <h1>load data</h1>
                            }
                            
                        </table>
                        <nav aria-label="Page navigation example">
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
                            </nav>
                        <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Add New Product Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    autoFocus
                                    onChange={e =>setName(e.target.value)}
                                />
                                </Form.Group>
                                <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1"
                                >
                                <Form.Label>Parent</Form.Label>
                                <Form.Select onChange={(e) => setParentId(e.target.value)}>
                                    <option value="null">None</option>
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Children">Children</option>
                                </Form.Select>
                                </Form.Group>
                            </Form>
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickClose}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={()=> addCate()}>
                                Add
                            </button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={openEdit} onHide={handleClickCloseEdit}>
                            <Modal.Header closeButton>
                            <Modal.Title>Update Product Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    defaultValue={curCate !== undefined ? curCate.name : ""}
                                    autoFocus
                                    onChange={e =>setName(e.target.value)}
                                />
                                </Form.Group>
                                <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1"
                                >
                                <Form.Label>Parent</Form.Label>
                                <Form.Select onChange={(e) => setParentId(e.target.value)}>
                                    <option value="null">None</option>
                                    {/* <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Children">Children</option> */}
                                </Form.Select>
                                </Form.Group>
                            </Form>
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickCloseEdit}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={()=>updateCategory(curCate.id)}>
                                Add
                            </button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                            <Modal.Header closeButton>
                            <Modal.Title>Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to delete?</Modal.Body>
                            <Modal.Footer>
                            <button  onClick={() => setShowAlert(false)}>
                                No
                            </button>
                            <button onClick={() => deleteCategory(cate.id)}>
                                Yes
                            </button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}
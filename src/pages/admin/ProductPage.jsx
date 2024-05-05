import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
// import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
// import { image } from "@cloudinary/url-gen/qualifiers/source";
export default function ProductPage(){
    const navigate = useNavigate();
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const [edit,setEdit] = useState(false);
    const [curProduct, setCurProduct] =useState();
    const [publicId, setPublicId] = useState([]);
    // Replace with your own cloud name
    const [cloudName] = useState("djz6golwu");
    // Replace with your own upload preset
    const [uploadPreset] = useState("v7dvlxlo");

    const [name, setName] = useState();
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState();
    const [desc, setDesc] = useState();
    const [price, setPrice] = useState()
    const [stock, setStock]  = useState(0)
    

    const [uwConfig] = useState({
        cloudName,
        uploadPreset
        // cropping: true, //add a cropping step
        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        // multiple: false,  //restrict upload to a single file
        // folder: "user_images", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        // clientAllowedFormats: ["images"], //restrict uploading to image files only
        // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
        // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
        // theme: "purple", //change to a purple theme
    });

    // Create a Cloudinary instance and set your cloud name.
    const cld = new Cloudinary({
        cloud: {
        cloudName
        }
    });
    console.log(publicId)
    console.log(categories)
    console.log(category)
 

    const [products, setProducts] = useState();
    const [open,setOpen] = useState(false);
    let paginationNumber = [];
    const [curPage, setCurPage] = useState(1);
    if(products !== undefined){
        for (let i = 0; i < products.totalPages; i++) {
            paginationNumber.push(i);
        }
    }

    console.log(products);
    console.log(categories);
    console.log(paginationNumber + curPage)
    useEffect(() =>{
        if(admin === undefined){
            navigate("/admin")
        }else{
            loadData();
            loadCate();
        }
    },[]);

    const handleClickOpen = () =>{
        loadCate();
        setCategory(categories.categoryList[0].id)
        setOpen(true);
    };
    const handleClickClose = () =>{
        setPublicId([]);
        setOpen(false);
    }

    const handleClickOpenEdit = (item) =>{
        setCurProduct(item)
        setPublicId(item.productImage)
        setName(item.name)
        setCategory(item.productCategory.id)
        setStock(item.stock)
        setDesc(item.description)
        setPrice(item.price)
        setEdit(true);
    };
    const handleClickCloseEdit = () =>{
        setPublicId([]);
        setEdit(false);
    }

    const loadData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/all`,{
            // headers: {
            //     'Authorization' : `Bearer ${admin.access_token}`
            // }
        }).then(
            res => res.json()
        ).then(
            json => {
                setProducts(json)
            }
        )
    };
    const loadCate = () =>{
        fetch(`http://localhost:8080/api/v1/category/list`,{
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
    };

    const remove = (i) => {
        let filter = publicId.filter(item => item !== i);
        setPublicId(filter);
    };

    const addProduct = () => {
        console.log(name, category, desc ,publicId)
        if (name && category && desc && publicId) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/product/insert", {
            method: "POST",
            body: JSON.stringify({
                categoryId: category,
                name : name,
                description : desc,
                image: publicId,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    loadData()
                    handleClickClose()
                }
            })
        }
    };
    const updateProduct = id => {
        console.log(name, category, desc ,publicId)
        if (name && category && desc && publicId ){
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                    categoryId: category,
                    name : name,
                    description : desc,
                    image: publicId,
                    // price : price,
                    // stock : stock
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
        }

    };
    const deleteProduct = id => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
        if(response.status === 200){
            console.log("success")
            loadData()
        }
        })
    };

    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/all?page=${nums}`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setProducts(json)
            }
        )
    }
    return(
        <div className="container-fluid" style={{height:"100%"}}>
            <div className="row">
                <SideBar />
                <div className="col" style={{padding:"2%"}}>
                    <h1>Product</h1>
                    <hr/>
                    <button  style={{background: "#0288D1"}} onClick={handleClickOpen}><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                    <br/>
                    <div style={{height:"60%", width:"80%", overflowY:"scroll", position:"absolute"}}>
                        <table>
                            <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                            <tr style={{background:"black", color:"white",}}>
                                <th style={{width:"15%"}}>Product Name</th>
                                <th style={{width:"10%"}}>Category Name</th>
                                <th style={{width:"15%"}}>Image</th>
                                <th style={{width:"10%"}}>Stock</th>
                                <th style={{width:"10%"}}>Sold</th>
                                
                                <th style={{width:"40%"}}>Action</th>
                            </tr></thead>
                            {
                                products !== undefined ? products.productList.map((p) => (
                                    <tr>
                                        <td>{p.name}</td>
                                        <td>{p.productCategory.name}</td>
                                        <td><img alt="product" src={"https://res.cloudinary.com/djz6golwu/image/upload/"+p.productImage[0]}/></td>
                                        {/* sum all stock from product item */}
                                        <td>0</td>
                                        <td>{p.sold}</td>
                                        {/* <td>{p.price}</td>  */}
                                        <td>
                                            <div className="d-flex  gap-3">
                                                <button className="p-2" style={{background:"#4CAF50", position:"relative"}} onClick={() => handleClickOpenEdit(p)}><i class="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button>
                                                <button className="p-2" style={{background:"#D50000"}} onClick={() => deleteProduct(p.id)}><i class="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>
                                                <button className="p-2" style={{background:"grey"}} onClick={() => {
                                                    localStorage.setItem("product-config", JSON.stringify(p))    
                                                    navigate(`/configuration/${p.id}`)
                                                }}><i class="bi bi-gear"></i><strong style={{marginLeft:"5px"}}>Configuration</strong></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : <h1>load data</h1>
                            }
                            
                        </table>
                    </div>
                   
                    <nav aria-label="Page navigation example" style={{bottom: "0", position:"absolute", left:"50%"}}>
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
                                        navigatePageable(curPage === products.totalPages - 1 ? curPage : curPage + 1)
                                    }} aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Add New Product</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Label>Category</Form.Label>
                                <Form.Select onChange={(e) => setCategory(e.target.value)} defaultValue={categories !== undefined ? categories.categoryList[0] : ""}>
                                    {
                                        categories !== undefined && categories.categoryList !== undefined ? categories.categoryList.map((c) =>(
                                            <option value={c.id}>{c.name}</option>
                                        )) : <option></option>
                                    }
                                </Form.Select>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        autoFocus
                                        onChange={e =>setName(e.target.value)}
                                    />
                                </Form.Group>
                               
                                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
                                <div className="d-flex flex-wrap" style={{marginTop: "10px", gap:"1%"}}>
                                    {
                                        publicId.map((pid) =>(
                                                <div style={{width:"25%",border:"2px solid black"}}>
                                                    <button style={{color:"white", backgroundColor:"grey", width:"100%", height:"15%", fontSize:"25px"}} onClick={() => remove(pid)}><i class="bi bi-x"></i></button>
                                                    <img src={"https://res.cloudinary.com/djz6golwu/image/upload/"+pid} alt="product"/>
                                                </div>
                                            
                                        ))
                                    }
                                </div>
                                <Form.Group className="mb-3 row" controlId="exampleForm.ControlInput1" style={{marginTop:"10px"}}>
                                    <Form.Label>Description</Form.Label>
                                    <textarea style={{margin : "15px", width: "450px", height:"150px"}} onChange={(e) => setDesc(e.target.value)}/>
                                </Form.Group>
                            
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickClose}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={() => addProduct()}>
                                Add
                            </button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={edit} onHide={handleClickCloseEdit}>
                            <Modal.Header closeButton>
                            <Modal.Title>Update Product</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Label>Category</Form.Label>
                                <Form.Select onChange={(e) => setCategory(e.target.value)} defaultValue={curProduct !== undefined ? curProduct.productCategory.id : ""}>
                                    {
                                        categories !== undefined ? categories.categoryList.map((c) =>(
                                            <option value={c.id} >{c.name}</option>
                                        )) : <option></option>
                                    }
                                </Form.Select>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        defaultValue={curProduct !== undefined ? curProduct.name: ""}
                                        autoFocus
                                        onChange={e =>setName(e.target.value)}
                                    />
                                </Form.Group>
                                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
                                <div className="d-flex flex-wrap" style={{marginTop: "10px", gap:"1%"}}>
                                    {
                                        publicId.map((pid) =>(
                                                <div style={{width:"25%",border:"2px solid black"}}>
                                                    <button style={{color:"white", backgroundColor:"grey", width:"100%", height:"15%", fontSize:"25px"}} onClick={() => remove(pid)}><i class="bi bi-x"></i></button>
                                                    <img src={"https://res.cloudinary.com/djz6golwu/image/upload/"+pid} alt="product"/>
                                                </div>
                                            
                                        ))
                                    }
                                </div>
                                <Form.Group className="mb-3 row" controlId="exampleForm.ControlInput1" style={{marginTop:"10px"}}>
                                    <Form.Label>Description</Form.Label>
                                    <textarea style={{margin : "15px", width: "450px", height:"150px"}} onChange={(e) => setDesc(e.target.value)} value={curProduct !== undefined ? curProduct.description : ""}/>
                                </Form.Group>
                            
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickCloseEdit}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={() => updateProduct(curProduct.id)}>
                                Add
                            </button>
                            </Modal.Footer>
                        </Modal>
                </div>
            </div>
        </div>
    );
}
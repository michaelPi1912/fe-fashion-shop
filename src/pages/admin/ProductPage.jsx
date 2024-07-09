import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import toast from "react-hot-toast";
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
    const [showAlert, setShowAlert] = useState(false);

    

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
    const [search, setSearch] = useState("");
    const [searchCate, setSearchCate] = useState("");


    let paginationNumber = [];
    const [curPage, setCurPage] = useState(0);

        for (let i = 0; i < products?.totalPages; i++) {
            paginationNumber.push(i);
        }
    
    console.log(search)
    console.log(products);
    console.log(categories);
    console.log(paginationNumber +" "+ curPage)
    console.log(paginationNumber[curPage+1])
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
                setSearch("")
                setSearchCate("")
            }
        )
    };

    const loadSearch = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/all?search=${search}&category=${searchCate}`,{
        }).then(
            res => {
                // console.log(res.json())
                res.json().then(
            json => {
                console.log(json)
                setProducts(json)
            }
        )
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
                    toast.success("add product successfully")
                    loadData()
                    handleClickClose()
                }else{
                    toast.error("cannot add product")
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
                    toast.success("Product update successful")
                    loadData()
                    handleClickCloseEdit()
                }else{
                    toast.success("Product update failed")
                }
            })
        }

    };
    const handleShowAlert = (item) =>{
        setCurProduct(item)
        setShowAlert(true);
    };
    const handleCloseAlert = () =>{
        setShowAlert(false);
    }
    const deleteProduct = id => {
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                toast.success("Product Was Deleted")
                loadData()
                handleCloseAlert()
            }else{
                toast.error("Cannot Delete Product")
            }
        })
    };

    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/all?page=${nums}&category=${searchCate}&search=${search}`,{
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

    function countStock(product){
        let stock =0;
        product.productItem.map(item =>{
            stock += item.stock;
        })

        return stock;
    }

    function countSold(product){
        let sold =0;
        product.productItem.map(item =>{
            sold += item.sold;
        })

        return sold;
    }

    return(
        <div className="container-fluid" style={{height:"100%"}}>
            <div className="row">
                <SideBar />
                <div className="col" style={{padding:"2%"}}>
                    <h1>Product</h1>
                    
                    <button  style={{background: "#0288D1"}} onClick={handleClickOpen}><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                    <br/>
                    <form>
                        <div className="d-flex gap-2">
                            <label ><strong>NAME</strong></label>
                            <input type="text" style={{width:"15%"}} onChange={e=> setSearch(e.target.value)}/>
                            <label><strong>CATEGORY</strong></label>
                            <select onChange={e=> setSearchCate(e.target.value)}>
                                <option value="">All</option>
                                {
                                    categories?.categoryList.map(cate =>(
                                        <option value={cate.name}>{cate.parent?.name} {cate.name} </option>
                                    ))
                                }
                            </select>
                            {/* Search */}
                            <button type="button" style={{height:"30px",width:"100px", textAlign:'center'}} onClick={() => loadSearch()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>&nbsp; Search</button>
                            {/* <button type="button" style={{height:"100%", width:"90px",padding:"2px"}} onClick={() => loadSearch()}><i class="bi bi-search"></i>&nbsp;Search</button> */}
                            {/* Reset */}
                            <button style={{height:"30px", width:"60px"}} type="reset" onClick={() => loadData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg></button>
                           
                        </div> 
                    </form>
                        
                    <hr/>
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
                                        <td>{countStock(p)}</td>
                                        <td>{countSold(p)}</td>
                                        {/* <td>{p.price}</td>  */}
                                        <td>
                                            <div className="d-flex  gap-3">
                                                <button className="p-2" style={{background:"#4CAF50", position:"relative"}} onClick={() => handleClickOpenEdit(p)}><i class="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button>
                                                <button className="p-2" style={{background:"#D50000"}} onClick={() => handleShowAlert(p)}><i class="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>
                                                <button className="p-2" style={{background:"grey"}} onClick={() => {
                                                    localStorage.setItem("product-config", JSON.stringify(p))    
                                                    navigate(`/configuration/${p.id}`)
                                                }}><i class="bi bi-gear"></i><strong style={{marginLeft:"5px"}}>Configuration</strong></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : <h1>NO DATA</h1>
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
                                        navigatePageable(paginationNumber[curPage+1] !== undefined ? paginationNumber[curPage+1]: paginationNumber[curPage])
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
                                            <option value={c.id}>{c.name} {c.parent?.name}</option>
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
                        {/* DELETE ALERT */}
                <Modal show={showAlert} onHide={handleCloseAlert} style={{textAlign:'center'}}>
                    <Modal.Body >
                        <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i>
                        <h5 >Are you sure?</h5>
                        <p >Do you really want to delete this product?<br/> This process cannot be undone</p>
            
                    </Modal.Body>
                    <Modal.Footer >
                        <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                            <button style={{backgroundColor:"grey"}}  onClick={handleCloseAlert}>
                            No
                        </button>
                        <button style={{backgroundColor:"red"}} onClick={() => deleteProduct(curProduct.id)}>
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
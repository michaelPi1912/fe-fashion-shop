import { useParams,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import OptionSelector from "../../components/OptionsSelector";
import OptionsList from "../../components/OptionList";
import { blockInvalidChar } from "../../components/blockInvalidChar";
import { Cloudinary } from "@cloudinary/url-gen/index";
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import { color } from "@cloudinary/url-gen/qualifiers/background";
import toast from "react-hot-toast";

export default function ConfigPage(){
    
    
    const {id} =  useParams();
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });
    const [product,setProduct] = useState(() =>{
        const saved = localStorage.getItem("product-config");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });
    const [variations, setVariations] = useState();
    const [optionList, setOptionList] = useState([]);
    const [sku, setSku] = useState("");
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    
    const [open, setOpen] = useState(false);
    const [productItem, setProductItem] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [curItem, setCurItem] = useState();
    const [edit, setEdit] = useState(false);
    const [options, setOptions] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
// search param
    const [sSku, setSSku] = useState("")
    const [sStock, setSStock] = useState(0)
    const [sColor, setSColor] = useState("")
    const [sSize, setSSize] = useState("")
    

    console.log(colors,sizes)

    const [curPage, setCurPage] = useState(0);
    let paginationNumber = []
        for (let i = 0; i < productItem?.totalPages; i++) {
                paginationNumber.push(i);
        }


    // Replace with your own cloud name
    const [cloudName] = useState("djz6golwu");
    // Replace with your own upload preset
    const [uploadPreset] = useState("v7dvlxlo");
    console.log(product)
    console.log(optionList)
    console.log(productItem)
    console.log(options)
    
    useEffect(() =>{
            loadProductItem()
            loadVariations();
        },[]);

    const loadProductItem = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product-item/${product.id}/items`,{
            // headers: {
            //     'Authorization' : `Bearer ${admin.access_token}`
            // }
        }).then(
            res => res.json()
        ).then(
            json => {
                setProductItem(json);
                setSSku("")
                setSColor("")
                setSSize("")
                setSStock(0)
            }
        )
    }

    const loadSearch = () =>{
        console.log(sStock)

        let param = "";
        if(sSku !==""){
            param +=`sku=${sSku}&`
        }
        if(sColor !==""){
            param +=`color=${sColor}&`
        }
        if(sSize !==""){
            param +=`sizes=${sSize}&`
        }
        if(sStock !==0){
            param +=`inStock=${sStock}&`
        }

        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product-item/${product.id}/items?`+param,{
            // headers: {
            //     'Authorization' : `Bearer ${admin.access_token}`
            // }
        }).then(
            res => res.json()
        ).then(
            json => {
                setProductItem(json);
                
            }
        )
    }

    const loadOptions = (variation) =>{
    
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/${variation.id}/options`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
            }).then(
                res => res.json()
            ).then(
                json => {
                  json.optionList.map(option =>{
                    if(option.variation.name ==="Size"){
                        setSizes(cur => sizes.includes(option.value)? cur : [...cur,option.value])
                    }else{
                        setColors(cur => colors.includes(option.value)? cur : [...cur,option.value])

                    }
                  })
                }
        )    
    }
    const loadVariations = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/variation/${product.productCategory.id}/variations`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setVariations(json);
                json.variations.map(variation =>{
                    loadOptions(variation)
                })
            }
        )
    }

    const handleClickOpen = () =>{
        setOpen(true);
    };
    const handleClickClose = () =>{
        setOpen(false);
    }
    const handleClickOpenEdit = (item) =>{
        setImages(item.productImages)
        setSku(item.sku)
        setStock(item.stock)
        setPrice(item.price)
        setCurItem(item);
        setEdit(true);
    };
    const handleClickCloseEdit = () =>{
        setEdit(false);
    }

    const handleShowAlert = (item) =>{
        setCurItem(item)
        setShowAlert(true);
    };
    const handleCloseAlert = () =>{
        setShowAlert(false);
    }

    const addProductItem = () => {
        console.log(optionList)
        if (price && sku) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/product-item/insert", {
            method: "POST",
            body: JSON.stringify({
                code: sku,
                productId: product.id,
                price : price,
                stock: stock,
                optionsId : optionList,
                images: images

            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${admin.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                    toast.success("Add Product Item Successfully")
                    loadProductItem()
                    setImages([])              
                    setOptionList([]);
                    handleClickClose()
                    
                }else{
                    toast.error("Cannot Add Product Item")
                }
            })
        }
    };


    const updateProductItem = () => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/update/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product-item/update/${curItem.id}`, {
          method: 'PUT',
          body: JSON.stringify({
                code: sku,
                productId: product.id,
                price : price,
                stock: stock,
                optionsId : optionList,
                images: images
            }),
          headers:{
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                toast.success("Update Product Item Successfully")
                loadProductItem()
                setImages([])              
                setOptionList([]);
                handleClickCloseEdit()
            }else{
                toast.error("Cannot Update Product Item")
            }
        })

    };

    const deleteProductItem = id => {
        // console.log(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${id}`);
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product-item/delete/${id}`, {
          method: 'Delete',
          headers:{
            'Authorization': `Bearer ${admin.access_token}`
          }
        })
        .then(response => {
            if(response.status === 200){
                toast.success("Product Item Was Deleted")
                loadProductItem();
                handleCloseAlert();
            }else{
                toast.success("Cannot Delete Product Item")
            }
        })
    };

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
    const remove = (i) => {
        let filter = images.filter(item => item !== i);
        setImages(filter);
    };

    const navigatePageable = nums =>{
        setCurPage(nums)
        let param = "";
        if(sSku !==""){
            param +=`sku=${sSku}&`
        }
        if(sColor !==""){
            param +=`color=${sColor}&`
        }
        if(sSize !==""){
            param +=`sizes=${sSize}&`
        }
        if(sStock !==0){
            param +=`inStock=${sStock}&`
        }
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product-item/${product.id}/items?page=${nums}&`+param,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
        }).then(
            res => res.json()
        ).then(
            json => {
                setProductItem(json)
            }
        )
    }
    // const preventNegativeValues = (e) => ["e", "E", "+", "-","."].includes(e.key) && e.preventDefault();

    return (
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    
                    <h1>{product?.name} Configuration</h1>
                   
                    <button onClick={handleClickOpen} style={{background: "#0288D1"}} className=""><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                    <br/>
                    <form>
                        <div className="d-flex gap-2">
                            <label ><strong>SKU</strong></label>
                            <input type="text" style={{width:"15%"}} onChange={e=>setSSku(e.target.value)}/>
                        
                            <label><strong>STOCK</strong></label>
                            <select onChange={e=> setSStock(e.target.value)}>
                                <option value={0}>All</option>
                                <option value={1}>In Stock</option>
                                <option value={2}>Out of Stock</option>
                            </select>
                            <label><strong>Color</strong></label>
                            <select onChange={e=> setSColor(e.target.value)}>
                                <option value="">All</option>
                                {
                                    colors.map(color =>(
                                        <option value={color}>{color}</option>))
                                }
                            </select>
                            <label><strong>Size</strong></label>
                            <select onChange={e=> setSSize(e.target.value)}>
                                <option value="">All</option>
                                {
                                    sizes.map(item =>(<option value={item}>{item}</option>)
                                        
                                    )
                                }
                            </select>
                            <button type="button" style={{height:"30px",width:"100px", textAlign:'center'}} onClick={() =>loadSearch()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>&nbsp; Search</button>
                            {/* reset */}
                            <button type="reset" style={{height:"30px", width:"60px"}} onClick={() =>loadProductItem()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg></button>
                        </div>
                        </form>
                    <hr/>
                    <div style={{height:"60%", width:"80%", overflowY:"scroll", position:"absolute"}}>
                        <table >
                            <thead style={{position:"sticky", top:"0", zIndex:"1"}}>
                            <tr style={{background:"black", color:"white"}}>
                                <th style={{width:"15%"}}>SKU</th>
                                <th style={{width:"20%"}}>Images</th>
                                <th style={{width:"10%"}}>Stock</th>
                                <th style={{width:"10%"}}>Price</th>
                                <th style={{width:"10%"}}>Options</th>
                                <th style={{width:"30%"}}>Action</th>
                            </tr></thead>
                            {
                                productItem !== undefined ? productItem.productItems.map((item,index) => (
                               
                                    <tr>
                                        <td>{item.sku}</td>
                                        <td><img src={"https://res.cloudinary.com/djz6golwu/image/upload/"+item?.productImages[0]} width={100} alt="product"/></td>
                                        <td>{item.stock}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            {
                                                item.options.length > 0 ? item.options.map((v) =>(
                                                    <p>{v.variation.name}: {v.value}</p>
                                                )) :<p></p>
                                            }
                                        </td>
                                        <td>
                                            <div className="d-flex gap-3">
                                                <button className="p-2" style={{background:"#4CAF50"}} onClick={() =>handleClickOpenEdit(item)}><i class="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button>
                                                <button className="p-2" style={{background:"#D50000"}} onClick={() => handleShowAlert(item)}><i class="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>                                            
    
                                            </div>
                                        </td>
                                    </tr>
                              )) : <h1>load data</h1>
                            }
                            
                        </table>
                    </div>
                    <nav aria-label="Page navigation example" style={{bottom: "0", position:"absolute", left:"55%"}}>
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
                <Modal show={open} onHide={handleClickClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>New Product Configuration </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>SKU</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    autoFocus
                                    onChange={e =>setSku(e.target.value)}
                                />
                                </Form.Group>
                                <Form.Label>List Options</Form.Label>
                                <div style={{margin:"1%", border:"1px solid black", padding:"10px"}}>
                                {
                                    variations !== undefined ? variations.variations.map(
                                        (variation, index) =>(
                                            <OptionSelector key={index} variation={variation} optionList={optionList} setOptionList={setOptionList}/>
                                        )
                                    ) : <div></div>
                                }
                                </div>
                                <Form.Label>Images</Form.Label><br/>
                                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setImages} />
                                <div className="d-flex flex-wrap" style={{marginTop: "10px", gap:"1%"}}>
                                    {
                                        images.map((pid) =>(
                                                <div style={{width:"25%",border:"2px solid black"}}>
                                                    <button style={{color:"white", backgroundColor:"grey", width:"100%", height:"15%", fontSize:"25px"}} onClick={() => remove(pid)}><i class="bi bi-x"></i></button>
                                                    <img src={"https://res.cloudinary.com/djz6golwu/image/upload/"+pid} alt="product"/>
                                                </div>
                                            
                                        ))
                                    }
                                </div>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    onChange={e =>{
                                         setPrice(e.target.value)
                                    }}
                                />
                                {/* <input type='number' onKeyDown={blockInvalidChar} min={0} /> */}
                                
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    onChange={e =>setStock(e.target.value)}
                                />
                            </Form.Group>
                                
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickClose}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={() => addProductItem()}>
                                Add
                            </button>
                            </Modal.Footer>
                </Modal>
                {/* Modal Edit */}
                <Modal show={edit} onHide={handleClickCloseEdit}>
                            <Modal.Header closeButton>
                            <Modal.Title>Update Product Configuration </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>SKU</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    autoFocus
                                    onKeyDown={blockInvalidChar}
                                    defaultValue={curItem!== undefined ?curItem.sku :""}
                                    onChange={e =>setSku(e.target.value)}
                                />
                                </Form.Group>
                    
                                <Form.Label>Images</Form.Label><br/>
                                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setImages} />
                                <div className="d-flex flex-wrap" style={{marginTop: "10px", gap:"1%"}}>
                                    {
                                        images.map((pid) =>(
                                                <div style={{width:"25%",border:"2px solid black"}}>
                                                    <button style={{color:"white", backgroundColor:"grey", width:"100%", height:"15%", fontSize:"25px"}} onClick={() => remove(pid)}><i class="bi bi-x"></i></button>
                                                    <img src={"https://res.cloudinary.com/djz6golwu/image/upload/"+pid} alt="product"/>
                                                </div>
                                            
                                        ))
                                    }
                                </div>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    defaultValue={curItem!== undefined ?curItem.price :""}
                                    onKeyDown={blockInvalidChar}
                                    onChange={e =>setPrice(e.target.value)}
                                />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    min={0}
                                    autoFocus
                                    defaultValue={curItem!== undefined ?curItem.stock :""}
                                    onKeyDown={blockInvalidChar}
                                    onChange={e =>setStock(e.target.value)}
                                />
                                </Form.Group>
                                
                            </Modal.Body>
                            <Modal.Footer>
                            <button style={{background: "red"}} variant="secondary" onClick={handleClickCloseEdit}>
                                Cancle
                            </button>
                            <button style={{background:"green"}} variant="primary" onClick={() => updateProductItem()}>
                                Update
                            </button>
                            </Modal.Footer>
                </Modal>
                {/* DELETE ALERT */}
                <Modal show={showAlert} onHide={handleCloseAlert} style={{textAlign:'center'}}>
                    <Modal.Body >
                        <i class="bi bi-x-circle" style={{fontSize:"60px",color:"red"}}></i>
                        <h5 >Are you sure?</h5>
                        <p >Do you really want to delete this record?<br/> This process cannot be undone</p>
            
                    </Modal.Body>
                    <Modal.Footer >
                        <div className="d-flex gap-3" style={{marginRight:"10%"}}>
                            <button style={{backgroundColor:"grey"}}  onClick={handleCloseAlert}>
                            No
                        </button>
                        <button style={{backgroundColor:"red"}} onClick={() => deleteProductItem(curItem.id)}>
                            Yes
                        </button>
                        </div>
                    
                    </Modal.Footer>
                </Modal>
                {/*  */}
                
                {/*  */}
            </div>
        </div>
    );
}
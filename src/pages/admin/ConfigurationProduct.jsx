import { useParams,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import OptionSelector from "../../components/OptionsSelector";
import OptionsList from "../../components/OptionList";
import { blockInvalidChar } from "../../components/blockInvalidChar";

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
    const [images, setImages] = useState([
        "/v1714581084/ao_thun_unisex_2_2_s1beew.jpg"
        ]);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    
    const [open, setOpen] = useState(false);
    const [productItem, setProductItem] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [curItem, setCurItem] = useState();
    const [edit, setEdit] = useState(false);
    const [options, setOptions] = useState([]);
    console.log(product)
    console.log(optionList)
    console.log(productItem)
    console.log(options)
    
    useEffect(() =>{
            loadProductItem()
            loadVariations();
        },[]);
    const loadProductItem = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product-item/all/${product.id}`,{
            // headers: {
            //     'Authorization' : `Bearer ${admin.access_token}`
            // }
        }).then(
            res => res.json()
        ).then(
            json => {
                setProductItem(json);
                Promise.all(json.productItems.map((item) =>{
                    loadOptions(item);
                }))
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
            }
        )
    }

    const loadOptions = (item) =>{
    
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/${item.id}`,{
   
           }).then(
               res => res.json()
           ).then(
               json => {
                    setOptions((cur) => [...cur, json])
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
                    loadProductItem()
                    handleClickClose()
                    setOptionList([]);
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
                loadProductItem()
                handleClickCloseEdit()
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
                console.log("success")
                loadProductItem();
                handleCloseAlert();
            }
        })
    };
    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };
    const preventNegativeValues = (e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

    return (
        <div className="container-fluid">
            <div className="row">
                <SideBar />
                <div style={{padding: "2%"}} className="col">
                    
                    <h1>Configuration Product</h1>
                    <hr/>
                    <button onClick={handleClickOpen} style={{background: "#0288D1"}} className=""><i class="bi bi-plus-lg"></i><strong style={{marginLeft:"5px"}}>Add New</strong></button>
                    <br/>
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
                                        <td><img alt={item.sku}/></td>
                                        <td>{item.stock}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            {
                                                item.options.length > 0 ? item.options.map((v) =>(
                                                    <p>{v.variation.name}: {v.value}</p>
                                                )) : options.length > 0 ? options[index]?.map(v => <p>{v.variation.name}: {v.value}</p>) :<p></p>
                                            }
                                        </td>
                                        <td>
                                            <div className="d-flex gap-3">
                                                <button className="p-2" style={{background:"#4CAF50"}} onClick={() =>handleClickOpenEdit(item)}><i class="bi bi-pencil-square"></i><strong style={{marginLeft:"5px"}}>Edit</strong></button>
                                                <button className="p-2" style={{background:"#D50000"}} onClick={() => handleShowAlert(item)}><i class="bi bi-trash3"></i><strong style={{marginLeft:"5px"}}>Delete</strong></button>                                            
                                                {/* <button className="p-2" style={{background:"DarkCyan"}} ><i class="bi bi-eye"></i><strong style={{marginLeft:"5px"}}>View</strong></button> */}
                                            </div>
                                        </td>
                                    </tr>
                              )) : <h1>load data</h1>
                            }
                            
                        </table>
                    </div>
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
                                <Form.Label>Images</Form.Label>
                                <button >choose</button>
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
                    
                                <Form.Label>Images</Form.Label>
                                <button >choose</button>
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
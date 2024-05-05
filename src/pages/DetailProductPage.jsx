import { useParams } from "react-router-dom";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/slices/CartSlice";
import toast from "react-hot-toast";
import "../style/css/detail.css"


export default function DetailProductPage(props){
    const cart = useSelector((state) => state.cart);
    const {id} =  useParams();
    const [product, setProduc] = useState([]);
    console.log(id);
    useEffect(() =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/product/${id}`)
        .then(respone => respone.json())
        .then(json => setProduc(json))
    },[]);
    console.log(product)

    const dispatch = useDispatch();

    const add = () => {
        dispatch(addToCart({id: cart.length +1,product,qty: 1 }));
        toast.success("Added to cart");
    };

    // const remove = (itemIdx) => {
    //     dispatch(removeFromCart(itemIdx));
    //     toast.error("Removed item from cart");
    // };

    return (
        <div>
            <NavbarNavigate/>
            <div style={{marginTop: "85px"}}>
                <section class="py-5">
                    <div class="container">
                        <div class="row gx-5">
                        <aside class="col-lg-6">
                            <div class="border rounded-4 mb-3 d-flex justify-content-center">
                            <a data-fslightbox="mygalley" class="rounded-4" target="_blank" data-type="image">
                                <img style={{maxWidth: "100%", maxHeight: "100%", margin: "auto"}} class="rounded-4 fit" src={product && product.productImage !== undefined ? "https://res.cloudinary.com/djz6golwu/image/upload/"+product.productImage[0] : ""} alt={product.name} />
                            </a>
                            </div>
                            <div class="d-flex justify-content-center mb-3">
                            {/* <a data-fslightbox="mygalley" class="border mx-1 rounded-2" target="_blank" data-type="image" href="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big1.webp" class="item-thumb">
                                <img width="60" height="60" class="rounded-2" src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big1.webp" />
                            </a>
                            <a data-fslightbox="mygalley" class="border mx-1 rounded-2" target="_blank" data-type="image" href="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big2.webp" class="item-thumb">
                                <img width="60" height="60" class="rounded-2" src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big2.webp" />
                            </a>
                            <a data-fslightbox="mygalley" class="border mx-1 rounded-2" target="_blank" data-type="image" href="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big3.webp" class="item-thumb">
                                <img width="60" height="60" class="rounded-2" src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big3.webp" />
                            </a>
                            <a data-fslightbox="mygalley" class="border mx-1 rounded-2" target="_blank" data-type="image" href="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big4.webp" class="item-thumb">
                                <img width="60" height="60" class="rounded-2" src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big4.webp" />
                            </a>
                            <a data-fslightbox="mygalley" class="border mx-1 rounded-2" target="_blank" data-type="image" href="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big.webp" class="item-thumb">
                                <img width="60" height="60" class="rounded-2" src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/detail1/big.webp" />
                            </a> */}
                            </div>
                        </aside>
                        <main class="col-lg-6">
                            <div class="ps-lg-3">
                            <h4 class="title text-dark">
                                {product.name}
                            </h4>
                            <div class="d-flex flex-row my-3">
                                <div class="text-warning mb-1 me-2">
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span class="ms-1">
                                    4.5
                                </span>
                                </div>
                                <span class="text-muted"><i class="fas fa-shopping-basket fa-sm mx-1"></i>154 orders</span>
                                <span class="text-success ms-2">In stock</span>
                            </div>

                            <div class="mb-3">
                                <span class="h5">{product.price} VND</span>
                                {/* <span class="text-muted">/per box</span> */}
                            </div>

                            <p>
                                {product.description}
                            </p>

                            <div class="row">
                                {/* <dt class="col-3">Type:</dt>
                                <dd class="col-9">Regular</dd> */}

                                <dt class="col-3">Màu Sắc</dt>
                                <dd class="col-9">Brown</dd>

                                <dt class="col-3">Chất Liệu</dt>
                                <dd class="col-9">Cotton, Jeans</dd>

                                {/* <dt class="col-3">Brand</dt>
                                <dd class="col-9">Reebook</dd> */}
                            </div>

                            <hr />

                            <div class="row mb-4">
                                <div class="row-md-4 row-6">
                                <label class="mb-2">Size</label>
                                {/* <select class="form-select border border-secondary" style={{height: "35px"}}>
                                    <option>Small</option>
                                    <option>Medium</option>
                                    <option>Large</option>
                                </select> */}
                                </div>
                            
                                <div class="row-md-4 col-6 mb-3">
                                    <label class="mb-2 d-block">Số Lượng</label>
                                    <div class="input-group" >
                                        <input type="button" value="-" className="btn btn-white border border-secondary px-3"/>
                                        <input type="text" className="text-center  border border-secondary" style={{width: "100px"}}/>
                                        <input type="button" value="+" className="btn btn-white border border-secondary px-3"/>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-warning shadow-0"> Buy now </button>
                            <button class="btn btn-primary shadow-0" onClick={add}> <i class="me-1 fa fa-shopping-basket"></i> Add to cart </button>
                            <button class="btn btn-light border border-secondary py-2 icon-hover px-3"> <i class="me-1 fa fa-heart fa-lg"></i> Save </button>
                            </div>
                        </main>
                        </div>
                    </div>
                    </section>
                </div>
            <Footer/>
        </div>
    );
}
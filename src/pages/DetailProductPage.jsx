import { useParams } from "react-router-dom";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/slices/CartSlice";
import toast from "react-hot-toast";
import RadioColorPicker from "../components/RadioColorPicker";
import { useNavigate } from "react-router-dom";

import "../style/css/detail.css"
import StarRatings from "react-star-ratings";
import { addToWishList, removeFromWishList } from "../redux/slices/WishList";
import { blockInvalidChar } from "../components/blockInvalidChar";
import CardProduct from "../components/CardProduct";


export default function DetailProductPage(props){
    const dispatch = useDispatch();
    const wish = useSelector((state) => state.wishlist);

    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const {id} =  useParams();
    const [product, setProduct] = useState([]);
    const [items, setItems] = useState([]);
    const [curItem, setCurItem] = useState();
    // const [options, setOptions] = useState([])
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colorPicker, setColorPicker] =useState();
    const [sizePicker, setSizePicker] = useState(); 
    const [quantity, setQuantity] = useState(1);
    const [isSoldOut, setIsSoldOut] = useState();
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState();
    const [fav, setFav] = useState(false);
    const [one, setOne] = useState(0);
    const [two, setTwo] = useState(0);
    const [three, setThree] = useState(0);
    const [four, setFour] = useState(0);
    const [five, setFive] = useState(0);
    const [related, setRelated] = useState();
    // console.log(review);
    useEffect(() =>{
        fetchProduct();
        fetchProductItems();
        fetchComment();
        checkWishList()
    },[]);
    console.log(product)
    // console.log(items)
    // // console.log(options)
    // console.log(colors)
    console.log(comment)
    console.log(rating)
    // console.log(sizes)
    // console.log(colorPicker)
    // console.log(sizePicker)
    const fetchRelatedProduct = (item) =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/product/related/${item?.productCategory?.name}/${item?.id}`)
        .then(respone => respone.json())
        .then(json => {
            console.log(json)
            setRelated(json)
        })
    }

    const checkWishList = () =>{
        if(user){
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/wish-list/check/${id}`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
            }).then(
                res => {
                 
                  res.json()
                    .then(json => {
                    if(json.id !== null){
                        setFav(true)
                    }
                })
            })
          }else{
            wish.map((item) => item.product.id === id ? setFav(true) : setFav(false))
          }
    }
    const fetchProduct = () =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/product/${id}`)
        .then(respone => respone.json())
        .then(json => {
            setProduct(json)
            fetchRelatedProduct(json)
        })
    }
    // get comment
    const fetchComment = () =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/reviews/product/${id}`)
        .then(respone => {
            respone.json().then(json => {
                setComment(json)
                let sum = 0;
                json.reviewList.map(review => {
                    sum += review.ratingValue
                })
                const l = json.reviewList.length ===0 ? 1:json.reviewList.length;
                setRating(sum/l)
            })        
        })
        fetch(process.env.REACT_APP_API_URL+`/api/v1/reviews/product/all/${id}`)
        .then(respone => {
            respone.json().then(json => {
                // console.log(json)
                // setReviews(json)
                let sum = 0;
                setOne(0);
                setTwo(0);
                setThree(0);
                setFour(0);
                setFive(0)
                // setTotal(json.length);
                json.map(review => {
                    sum += review.ratingValue;
                    if(review.ratingValue === 1){
                        setOne(cur => cur + 1)
                    }
                    if(review.ratingValue === 2){
                        setTwo(cur => cur + 1)
                    }
                    if(review.ratingValue === 3){
                        setThree(cur => cur + 1)
                    }
                    if(review.ratingValue === 4){
                        setFour(cur => cur + 1)
                    }
                    if(review.ratingValue === 5){
                        setFive(cur => cur + 1)
                    }
                })
                const l = json.length === 0 ? 1:json.length;
                setRating(sum/l)
            })        
        })
       
    }

    const fetchProductItems = () =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/product-item/${id}/items`)
        .then(respone => respone.json())
        .then(json => {
            setItems(json)
            if(json){
                setCurItem(json.productItems[0]);
                console.log(json)
                json.productItems?.map((item) =>
                    fetchOptions(item)
                )   
            }
        })
    }

    const fetchOptions = (item) =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/option/${item.id}`)
        .then(res => res.json())
        .then(json => {
            let color;
            let size = [];
            console.log(json)
            json?.optionList?.map(
                (o) => {
                    if(o.variation?.name ==="Color"){
                        color = o;
                        
                    }else{
                        size.push(o);
                    }
                    
                }
            )
            // console.log(color)
            // console.log(size)
            setColors(cur => 
                cur.includes(color.value)? cur : [...cur, color.value])
            setSizes(cur => {
                if(cur.includes(size[0].value)){
                    return cur;
                }else{
                    return [...cur, size[0].value];
                }
            })
            // setOptions((cur) => [...cur,{color,size}])
        })

    }
    // product valid
    function checkValid(){
        const item = items.productItems.filter(pItem =>
            {
                return (Object.values(pItem.options[0]).includes(sizePicker) || Object.values(pItem.options[0]).includes(colorPicker)) 
                && (Object.values(pItem.options[1]).includes(sizePicker) || Object.values(pItem.options[1]).includes(colorPicker))
            });
        console.log(item)
        return item;
    }
    //add to cart
    const add = () => {
        if(quantity < 1){
            toast.error("Minimum quantity is 1")
        }else{
            if(sizePicker && colorPicker){
                if(checkValid().length > 0){
                    const curQty = cart.filter(o => {
                        if(o.product.id === checkValid()[0].id){
                            return o.qty
                        }
                    })
                    
                    const t = curQty[0] !== undefined ? curQty[0]?.qty : 0;
                    console.log(t)
                    if(checkValid()[0].stock >= quantity + t){
                        dispatch(addToCart({id: cart.length +1,product: checkValid()[0],qty: quantity }));
                        toast.success("Added to cart");
                    }else{
                        toast.error("Quantity of product is not enough")
                    }
                    
                }else{
                    toast.error("This option is not available")
                }
                
            }else{
                toast.error("Please Choose Size And Color!")
            }
        }
        
        
    };

    // check can review
    const writeReview = async () => {
        if(user){
            checkOrdered(); 
        }else{
            toast.error("Please login to write a review")
        }
    }
    // 
    const checkOrdered = ()=>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/check/${product.id}`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(json =>{
            if(json.orderList.length >0){
                navigate("/review/"+product.id)
            }else{
                toast.error("You must have a product to review")
            }
        })
     
    }
    // add wishlish local
    const AddTWishList = () => {
        dispatch(addToWishList({id: wish.length + 1 ,product}));
        setFav(true)
        toast.success("Added to Wish List");
      };
    //   remove wishlist local
      const RemoveFWishList = (id) => {
        dispatch(removeFromWishList(id));
        setFav(false)
        toast.error("Removed from wish list");
      };
    //   wishlist 
      const addWishList= () =>{
          fetch(process.env.REACT_APP_API_URL+"/api/v1/users/wish-list", {
            method: "POST",
            body: JSON.stringify({
                "id": id
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${user.access_token}`
            },
          })
            .then(response => {
                if(response.status === 200){
                  setFav(true)
                  // console.log(success)
                  toast.success("Added to wish List");
                }
            })
      }
      const removeWishList = () =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/users/wish-list/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${user.access_token}`
          },
        })
          .then(response => {
              if(response.status === 200){
                setFav(false)
                toast.error("Removed from wish List");
                // console.log(success)
              }
          })
      }

    // const remove = (itemIdx) => {
    //     dispatch(removeFromCart(itemIdx));
    //     toast.error("Removed item from cart");
    // };
    const increaseQty = () =>{
        setQuantity(quantity+1)
    }
    const decreaseQty = () =>{
        setQuantity(quantity <= 1 ? 1: quantity-1)
    }

    return (
        <div>
            <NavbarNavigate/>
            <div style={{marginTop: "85px"}}>
                <section class="py-5">
                    <div class="container">
                        <div class="row gx-5" style={{marginLeft:"5%", marginRight:"5%"}}>
                            <aside class="col-lg-6">
                                <div class="border rounded-4 mb-3 d-flex justify-content-center">
                                <a data-fslightbox="mygalley" class="rounded-4" target="_blank" data-type="image">
                                    <img style={{width: "400px", height: "500px", margin: "auto"}} class="rounded-4 fit" src={product && product.productImage !== undefined ? "https://res.cloudinary.com/djz6golwu/image/upload/"+product.productImage[0] : ""} alt={product.name} />
                                </a>
                                </div>
                                <div class="d-flex justify-content-center mb-3">
                                    {
                                        items?.productItems?.map((item) => (
                                            <a data-fslightbox="mygalley" class="border mx-1 rounded-2" target="_blank" data-type="image">
                                                <img width="60" height="60" class="rounded-2" src={"https://res.cloudinary.com/djz6golwu/image/upload/"+item?.productImages} />
                                            </a>
                                        ))   
                                    }
                                
                                </div>
                                <br/>
                        <br/>
                        
                            </aside>
                            <main class="col-lg-6">
                                <div class="ps-lg-3">
                                <h4 class="title text-dark">
                                    {product.name}
                                </h4>
                                <div class="d-flex flex-row my-3">
                                    {/* <div class="text-warning mb-1 me-2">
                        
                                    <span class="ms-1">
                                        4.5
                                    </span>
                                    </div>
                                    <span class="text-muted"><i class="fas fa-shopping-basket fa-sm mx-1"></i>154 orders</span>
                                    <span class="text-success ms-2">In stock</span> */}
                                </div>

                                <div class="mb-3">
                                    <span class="h5">{curItem?.price} VND</span>
                                    {/* <span class="text-muted">/per box</span> */}
                                </div>

                                <p>
                                    {product.description}
                                </p>
                                <hr />
                                {/* Color */}
                                <div style={{fontSize:"20px"}}>
                                    {/* <dt class="col-3">Type:</dt>
                                    <dd class="col-9">Regular</dd> */}

                                    <p style={{fontWeight:"bold"}}>COLOR</p>
                                    
                                    <RadioColorPicker colors={colors} setColorPicker={setColorPicker}/>
                                    
                                </div>
                                {/* Size */}
                                <div class="row mb-4 gap-2" style={{fontSize:"20px", marginTop:"10px"}}>
                                    <div class="row-md-4 row-6">
                                    <label class="mb-2"><strong>Size</strong></label>
                                    <select class="form-select border border-secondary" style={{width: "20%"}} onChange={(e) => setSizePicker(e.target.value)}>
                                        <option></option>
                                        {
                                            sizes.length > 0 ? sizes.map((size) =>(
                                                <option value={size}>{size}</option>
                                            )): <option></option>
                                        }
                                    </select>
                                    </div>
                                    <hr/>
                                    <div class=" d-flex gap-5" >
                                        <div>
                                            <label class="mb-2 d-block"><strong>Quantity</strong></label>
                                            <div className="d-flex">
                                                <button style={{width:"50px",borderTopLeftRadius:"10px", borderBottomLeftRadius:"10px"}} onClick={decreaseQty}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                                    </svg>
                                                </button>
                                                <input style={{width:"30%",textAlign:"center"}} value={quantity} list="qty" type="number" min={1} autoFocus onKeyDown={blockInvalidChar} onChange={e => setQuantity(e.target.value)}/> 
                                                <datalist id="qty">
                                                    <option value={1}></option>
                                                    <option value={2}></option>
                                                    <option value={3}></option>
                                                    <option value={4}></option>
                                                    <option value={5}></option>
                                                    <option value={6}></option>
                                                    <option value={7}></option>
                                                    <option value={8}></option>
                                                    <option value={9}></option>
                                                    <option value={10}>10</option>
                                                </datalist>
                                            <button style={{width:"50px",borderTopRightRadius:"10px", borderBottomRightRadius:"10px"}} onClick={increaseQty}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                            </svg>
                                            </button>
                                            </div>
                                            
                                        </div>
                                        
                                        {
                                            colorPicker && sizePicker ? checkValid().length > 0 ? 
                                                <p style={{color:"green", alignSelf:"end"}}>Instock {checkValid()[0].stock} (items)</p>
                                            : <p>This option is not available. Please select another <strong>Size</strong> or another <strong>Color</strong> </p>
                                            :<p>Please select <strong>Size</strong> and <strong>Color</strong> for more information.</p>
                                        }
                                    </div>
                                   
                                </div>
                               
                                {/* Action */}
                                <div className="d-flex gap-1">
                                    <button class="btn btn-primary shadow-0" style={{width:"50%",backgroundColor:"green"}} onClick={add}><i class="bi bi-cart3"></i> ADD TO CART </button>
                                    {
                                        fav ?  <button class="btn shadow-0" style={{color:"white",backgroundColor:"red",width:"50%", gap:"2%"}} onClick={() => user? removeWishList(): RemoveFWishList(id)}><i class="bi bi-heart-fill"></i> ADDED TO WISH LIST </button>
                                        : <button class="btn shadow-0" style={{color:"white",backgroundColor:"grey",width:"50%", gap:"2%"}} onClick={() => user? addWishList(): AddTWishList()}><i class="bi bi-heart-fill"></i> ADD TO WISH LIST </button>

                                    }
                                </div>
                                
                                {/* <button class="btn btn-light border border-secondary py-2 icon-hover px-3" style={{width:"50%", backgroundColor:"red"}}> <i class="bi bi-heart"></i> Save </button> */}
                                
                                
                                </div>
                            </main>
                            </div>
                        </div>
                    </section>
                    {/* Reviews */}
                    <div className="d-flex gap-5">
                        <div style={{paddingLeft:"10%", width:"50%"}}>
                            <div className="d-flex gap-3">
                                <h3 style={{fontWeight:"bold"}}>REVIEWS ({comment?.totalItems})</h3>
                               
                                <StarRatings rating={rating} starRatedColor="orange" starHoverColor="orange" starDimension="30px"/>
                            </div>
                            <div>
                                Comments
                            </div>
                            <hr/>
                            {
                                comment?.reviewList?.map(review =>(
                                    <div style={{borderBottom:"1px solid grey"}}>
                                        <div style={{fontWeight:"bold", textTransform:"capitalize"}}>{review.user.firstname} {review.user.lastname}</div>
                                        <StarRatings rating={review?.ratingValue} starRatedColor="orange" starHoverColor="orange" starDimension="15px"/>
                                        <div>{review.comment}</div>
                                    </div>
                                ))
                            }
                            <br/>
                            <div className="d-flex gap-3">
                                <button style={{width:"50%",backgroundColor:"white",fontWeight:"bold",color:"black",border:"1px solid black"}} onClick={() => navigate("/review/product/"+product.id)}>VIEW MORE</button>
                                <button style={{width:"50%",backgroundColor:"#0066ff",fontWeight:"bold"}} onClick={() => writeReview()}>WRITE A REVIEW</button>
                            </div>
                        </div>
                        <br/>
                        <div style={{border:"1px solid black",padding:"2%",width:"25%", height:"50%"}}>
                            <h3><strong>REVIEW SUMARY</strong></h3>
                            <br/>
                            <h5><strong>RATINGS</strong></h5>
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex gap-3">
                                    <StarRatings rating={5} starRatedColor="orange" starHoverColor="orange" starDimension="18px"/>
                                    <p>({five})</p>
                                </div>
                                <div className="d-flex gap-3">
                                    <StarRatings rating={4} starRatedColor="orange" starHoverColor="orange" starDimension="18px"/>
                                    <p>({four})</p>
                                </div>
                                <div className="d-flex gap-3">
                                    <StarRatings rating={3} starRatedColor="orange" starHoverColor="orange" starDimension="18px"/>
                                    <p>({three})</p>
                                </div>
                                <div className="d-flex gap-3">
                                    <StarRatings rating={2} starRatedColor="orange" starHoverColor="orange" starDimension="18px"/>
                                    <p>({two})</p>
                                </div>
                                <div className="d-flex gap-3">
                                    <StarRatings rating={1} starRatedColor="orange" starHoverColor="orange" starDimension="18px"/>
                                    <p>({one})</p>
                                </div>
                            </div>
                            {/* <br/> */}
                            {/* <button style={{width:"100%"}} onClick={() => writeReview()}>WRITE REVIEW</button> */}
                        </div>
                    </div>
                    {/* Related */}
                    <br/>
                    <br/>
                    <br/>
                    <div style={{paddingLeft:"10%", marginRight:"5%"}}>
                        <h3 style={{fontWeight:"bold"}}>RELATED PRODUCTS</h3>
                        <div className="d-flex">
                            {
                                related?.productList?.map(o =>(
                                    <CardProduct product={o}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
            <Footer/>
        </div>
    );
}
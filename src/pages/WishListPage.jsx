import { useEffect, useState } from "react";
import NavbarNavigate from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { removeFromWishList } from "../redux/slices/WishList";
import Footer from "../components/Footer";


export default function WishListPage(){
    const dispatch = useDispatch();
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [wishList, setWishList] = useState([]);
    const [curPage, setCurPage] = useState(0);
    const [max, setMax] = useState(false);
    const [total, setTotal] = useState(0);
    const wish = useSelector((state) => state.wishlist);
    console.log(wishList)
    console.log(wish)
    useEffect(() =>{
        if(user){
            loadData();
        }else{
            wish.map((item) =>{
                setWishList((cur) => [...cur, item.product])
            })
        }
        
    },[])

    const loadData = () =>{
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/wish-list?page=${curPage}`,{
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
            }).then(
                res => res.json()
            ).then(
                json => {
                    console.log(json)
                    json.productList.map((product) => setWishList((cur) => [...cur, product]))
                    
                    setTotal(json.totalItems)
                    if(json.totalPages - 1 === curPage){
                        setMax(true)
                    }
                    setCurPage(curPage +1)
                }
            )
        
    }

    const remove = (id) =>{
        if(user){
            fetch(process.env.REACT_APP_API_URL+`/api/v1/users/wish-list/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${user.access_token}`
          },
        })
          .then(response => {
              if(response.status === 200){
                setWishList(wishList.filter((item => item.id !== id)))
                loadData()
                toast.error("Removed item from wish list");
              }
          })
        }else{
            dispatch(removeFromWishList(id));
            setWishList(wishList.filter((item => item.id !== id)))
            toast.error("Removed item from wish list");
        }
        
      }

    return(
        <div>
            <NavbarNavigate />
            <div style={{marginTop: "85px"}}>
                <div style={{paddingLeft: "200px", paddingTop:"50px",paddingRight:"200px"}}>
                    <h1><strong>Wish List</strong></h1>
                    <div style={{border:"1px solid black",width:"80%"}}>
                            <br/>
                            <p style={{marginLeft:"5%"}}>{total} Item(s)</p>
                            {
                                wishList.length !== 0 ? wishList.map((product) =>(
                                    <div className="container" style={{width:"96%", marginLeft:"2%"}}>
                                        <a href={`/detail/${product.id}`} style={{color:"black", textDecoration:"none"}}>
                                            <div className="d-flex gap-5">
                                                <img
                                                
                                                    src={"https://res.cloudinary.com/djz6golwu/image/upload/"+ product.productImage[0]}
                                                    alt={product.name}
                                                    style={{width: "150px"}}
                                                />
                                                <div>
                                                    <h4><strong>{product.name}</strong></h4>
                                                    <p><strong>{product?.productItem[0]?.price} VND</strong></p>
                                                    <p>{product.description}</p>
                                                </div>
                                                
                                            </div>
                                        </a>
                                        <button style={{background:"none",position:"absolute",  top:"8%", left:"0%", width:"5%", height:"5%", color:"red", fontSize:"20px", zIndex:"1"}} 
                                          onClick={() => remove(product.id)}  ><i class="bi bi-heart-fill"></i></button>
                                        <hr/>
                                    </div>
                                    
                                ))
                                : <div style={{paddingLeft: "5%", paddingTop:"2%"}}>
                                    <h2>Your Wish List Has No Items</h2>
                                    <p>Press the heart mark to add items on your wish list.</p>
                                </div>
                            }
                            <button style={{width:"80%", marginLeft:"10%", background:"none", color:"black", fontSize:"22px",
                            display: total > 5 && max !== true ? "" : "none"}} onClick={() => {
                                loadData()
                            }}>
                            VIEW MORE<i class="bi bi-chevron-down"></i></button>
                    </div>
                </div>
                
            </div>
            <br/>
            <Footer/>
        </div>
    );
}
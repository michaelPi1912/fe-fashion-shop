import { useState, useEffect } from "react";
import "../style/sass/card.scss";
import { useDispatch, useSelector } from "react-redux";
import { addToWishList, removeFromWishList } from "../redux/slices/WishList";
import toast from "react-hot-toast";
import { set } from "@cloudinary/url-gen/actions/variable";


const CardProduct = ({product, item}) => {
  const wish = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  
  const saved = localStorage.getItem("user-info");
  const user = JSON.parse(saved);
  const [fav, setFav] = useState(false)
  // const [item, setItem] = useState();
  console.log(wish)
  // console.log(item)

    useEffect(() => {
      if(user){
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/wish-list/check/${product.id}`,{
        headers: {
            'Authorization' : `Bearer ${user.access_token}`
        }
        }).then(
            res => {
              if(res.status === 200){
                setFav(true)
              }
            }
        )
      }else{
        wish.map((item) => item.product.id === product.id ? setFav(true) : setFav(false))
      }
      // fetchItem();
    },[]);

    // const fetchItem = async () =>{
    //   const res = await fetch(process.env.REACT_APP_API_URL+`/api/v1/product-item/all/${product.id}`);
    //   const json = await res.json();
    //   setItem(json.productItems[0])
    // }
    const Truncate = (string, number) => {
        if (!string) {
          return null;
        }
        if (string.length <= number) {
          return string;
        }
        return string.slice(0, number) + "...";
    };

    const add = () => {
      dispatch(addToWishList({id: wish.length + 1 ,product}));
      setFav(true)
      toast.success("Added to Wish List");
    };
    const remove = (id) => {
      dispatch(removeFromWishList(id));
      setFav(false)
      toast.error("Removed item from cart");
    };

    const addWishList= () =>{
        fetch(process.env.REACT_APP_API_URL+"/api/v1/users/wish-list", {
          method: "POST",
          body: JSON.stringify({
              "id": product.id
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
      fetch(process.env.REACT_APP_API_URL+`/api/v1/users/wish-list/${product.id}`, {
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
    return(
        <div className="container">
          {
            fav === false ?
            <button style={{background:"none", position:"absolute", top:"10%", right:"15%", width:"5%", height:"5%", color:"black", fontSize:"20px",zIndex:"1"}} 
              onClick={() => user? addWishList(): add()}><i class="bi bi-heart"></i></button>
            :<button style={{background:"none", position:"absolute", top:"10%", right:"15%", width:"5%", height:"5%", color:"red", fontSize:"20px", zIndex:"1"}} 
                  onClick={() => user? removeWishList(): remove(product.id)}><i class="bi bi-heart-fill"></i></button>
          }
          <a href={`/detail/${product.id}`} >
            <div className="card" key={product.id}>
                    <img
                      className="card-image"
                      src={"https://res.cloudinary.com/djz6golwu/image/upload/"+product.productImage[0]}
                      alt={product.name}

                    />
                    

                    <div className="card-body">
                      <h5
                        className="card-title"
                        title={product.name.length >= 50 ? product.name : null}
                      >
                        {Truncate(product.name, 20)}
                      </h5>
                      <p className="card-description">
                        {Truncate(product.description, 55)}
                      </p>
                      <p className="card-price">{item !== undefined? item.price : ""}</p>
                      {/* <div className="card-detail">
                        <StarRatings
                          rating={product.rating.rate}
                          starDimension="16px"
                          starSpacing="1px"
                          starRatedColor="black"
                        />
                        <span>Stock:{product.rating.count} </span>
                      </div> */}
                    </div>
            </div>
          </a>
        </div>
    );
}

export default CardProduct;
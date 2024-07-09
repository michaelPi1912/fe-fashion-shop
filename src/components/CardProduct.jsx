import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addToWishList, removeFromWishList } from "../redux/slices/WishList";
import toast from "react-hot-toast";
import "../style/css/card-product.css"
// import "../style/sass/card.scss";


const CardProduct = ({product, item}) => {
  const wish = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  
  const saved = localStorage.getItem("user-info");
  const user = JSON.parse(saved);
  const [fav, setFav] = useState(false)
  // const [item, setItem] = useState();
  // console.log(wish)
  // console.log(item)

    useEffect(() => {
      if(user){
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/wish-list/check/${product.id}`,{
        headers: {
            'Authorization' : `Bearer ${user.access_token}`
        }
        }).then(
            res => {
              // console.log(res.json())
              res.json().then(json => {
                if(json.id !== null){
                  setFav(true)
                }
              })
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
      toast.error("Removed from wish list");
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
        // <div className="container">
          
        //   <a href={`/detail/${product.id}`} >
        //     <div className="card" key={product.id}>
        //             <img
        //               className="card-image"
        //               src={"https://res.cloudinary.com/djz6golwu/image/upload/"+product.productImage[0]}
        //               alt={product.name}

        //             />
                    

        //             <div className="card-body">
        //               <h5
        //                 className="card-title"
        //                 title={product.name.length >= 50 ? product.name : null}
        //               >
        //                 {Truncate(product.name, 20)}
        //               </h5>
        //               <p className="card-description">
        //                 {Truncate(product.description, 55)}
        //               </p>
        //               <p className="card-price">{product?.productItem[0]?.price}</p>
        //               {/* <div className="card-detail">
        //                 <StarRatings
        //                   rating={product.rating.rate}
        //                   starDimension="16px"
        //                   starSpacing="1px"
        //                   starRatedColor="black"
        //                 />
        //                 <span>Stock:{product.rating.count} </span>
        //               </div> */}
        //             </div>
        //     </div>
        //   </a>
        // </div>
        <div className="container">
          <a className="product-card" href={`/detail/${product.id}`}>
          <img className="product-card__image"  src={"https://res.cloudinary.com/djz6golwu/image/upload/"+product.productImage[0]} />
          <p className="product-card__brand">{Truncate(product.name, 20)}</p>
          <p className="product-card__description">{Truncate(product.description, 55)}</p>
          <p className="product-card__price">{product?.productItem[0]?.price}</p>
          
        </a>
        {
       
              fav === false 
              ?
              <button className="product-card__btn-wishlist" onClick={() => user? addWishList(): add()} >
                <svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" >
                  <path
                    d="M9.01163699,14.9053769 C8.72930024,14.7740736 8.41492611,14.6176996 8.07646224,14.4366167 C7.06926649,13.897753 6.06198912,13.2561336 5.12636931,12.5170512 C2.52930452,10.4655288 1.00308384,8.09476443 1.00000218,5.44184117 C0.997549066,2.99198843 2.92175104,1.01242822 5.28303025,1.01000225 C6.41066623,1.00972036 7.49184369,1.4629765 8.28270844,2.2678673 L8.99827421,2.9961237 L9.71152148,2.26559643 C10.4995294,1.45849728 11.5791258,1.0023831 12.7071151,1.00000055 L12.7060299,1.00000225 C15.0693815,0.997574983 16.9967334,2.97018759 17.0000037,5.421337 C17.0038592,8.07662382 15.4809572,10.4530151 12.8850542,12.5121483 C11.9520963,13.2521931 10.9477036,13.8951276 9.94340074,14.4354976 C9.60619585,14.6169323 9.29297309,14.7736855 9.01163699,14.9053769 Z"
                    strokeWidth="2" 
                  />
                </svg>
              </button>
              :<button className="product-card__btn-wishlist"  onClick={() => user? removeWishList(): remove(product.id)} >
                  <svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" >
                    <path
                      d="M9.01163699,14.9053769 C8.72930024,14.7740736 8.41492611,14.6176996 8.07646224,14.4366167 C7.06926649,13.897753 6.06198912,13.2561336 5.12636931,12.5170512 C2.52930452,10.4655288 1.00308384,8.09476443 1.00000218,5.44184117 C0.997549066,2.99198843 2.92175104,1.01242822 5.28303025,1.01000225 C6.41066623,1.00972036 7.49184369,1.4629765 8.28270844,2.2678673 L8.99827421,2.9961237 L9.71152148,2.26559643 C10.4995294,1.45849728 11.5791258,1.0023831 12.7071151,1.00000055 L12.7060299,1.00000225 C15.0693815,0.997574983 16.9967334,2.97018759 17.0000037,5.421337 C17.0038592,8.07662382 15.4809572,10.4530151 12.8850542,12.5121483 C11.9520963,13.2521931 10.9477036,13.8951276 9.94340074,14.4354976 C9.60619585,14.6169323 9.29297309,14.7736855 9.01163699,14.9053769 Z"
                      strokeWidth="2" style={{fill:"red"}}
                    />
                  </svg>
                </button>
            
          }
        </div>
        
    );
}

export default CardProduct;
import { useEffect, useState } from "react";
import NavbarNavigate from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import StarRatings from "react-star-ratings";


export default function ReviewPage(){
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const {id} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState();
    const [rating, setRating] = useState(0);
    const [fit, setFit] = useState("true to size");
    const [comment, setComment] = useState("");
    const [size, setSize] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    console.log(product)

    useEffect(() =>{
        fetchProduct()
    },[])

    const fetchProduct = () =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/product/${id}`)
        .then(respone => respone.json())
        .then(json => {
            setProduct(json)
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        createReview()
    }

    const createReview = () => {
        if (rating >0 && fit && comment) {
          fetch(process.env.REACT_APP_API_URL+"/api/v1/reviews/insert", {
            method: "POST",
            body: JSON.stringify({
                comment,
                productId: product.id,
                rating,
                parentId: null,
                fit,
                gender,
                age,
                height,
                weight,
                size
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Bearer ${user.access_token}`
            },
          })
            .then(res => {
                if(res.status == 200){
                    navigate(-1)
                }
            })
        }
    };
    return(
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px", paddingLeft:"10%", paddingTop:"5%"}}>
                <Link to={-1} style={{color:"black", fontWeight:"bold", fontSize:"24px"}}>BACK TO DETAIL PRODUCT</Link>
                <br/>
                <br/>
                <h1>{product?.name}</h1>
                <div className="d-flex" style={{width:"90%"}}>
                    <div className="col-6" style={{border:"1px solid black",left:"0",width:"60%",padding:"2%"}}>
                        <form onSubmit={handleSubmit}>
                        <h3>WRITE A REVIEW </h3>
                        <br/>
                        <div>
                            <label style={{width:"20%"}}>RATING</label>
                            {/* <Rating onClick={setRating} initialValue={rating}/> */}
                            <StarRatings rating={rating} changeRating={setRating} starRatedColor="orange" starHoverColor="orange" starDimension="40px"/>
                        </div>
                        <br/>
                        <div className="d-flex">
                            <label style={{width:"20%"}}>FIT</label>
                            <select onChange={e => setFit(e.target.value)} required>
                                {/* <option value="">TIGHT</option>     */}
                                <option value="tight">TIGHT</option>
                                <option value="a bit tight">A BIT TIGHT</option>
                                <option value="true to size" selected>TRUE TO SIZE</option>
                                <option value="a bit loose">A BIT LOOSE</option>
                                <option value="loose">LOOSE</option>

                            </select>
                        </div>
                        <br/>
                        <div className="d-flex">
                            <label style={{width:"20%"}}>COMMENT</label>
                            <textarea onChange={e =>setComment(e.target.value)} style={{width:"60%"}} required/>
                        </div>
                        <br/>
                        
                        <hr/>
                        <label>WEARER INFORMATION</label>
                        <br/>
                        <br/>
                        <div className="d-flex">
                            <label style={{width:"20%"}}>PURCHASED SIZE</label>
                            <select onChange={e => setSize(e.target.value)}>
                                <option value="" disabled selected >Select Size</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>
                        <br/>
                        <div className="d-flex">
                            <label style={{width:"20%"}}>GENDER</label>
                            <select onChange={e => setGender(e.target.value)} >
                                <option value="" disabled selected >Select</option>
                                <option value="Male">MALE</option>
                                <option value="Female">FEMALE</option>
                            </select>
                        </div>
                        <br/>
                        <div className="d-flex">
                            <label style={{width:"20%"}}>AGE</label>
                            <select onChange={e => setAge(e.target.value)}>
                                <option value="" disabled selected>Select</option>
                                <option value="under 12 years">Under 12 years</option>
                                <option value="12-18 years">12 - 18 years</option>
                                <option value="18-25 years">18 - 25 years</option>
                                <option value="over 25 years">Over 25 years</option>
                            </select>
                        </div>
                        <br/>
                        <div className="d-flex">
                            <label  style={{width:"20%"}}>HEIGHT</label>
                            <select onChange={e=> setHeight(e.target.value)}>
                                <option value="" disabled selected>Select</option>
                                <option value="under 100cm">Under 100cm</option>
                                <option value="100-120cm">100-120cm</option>
                                <option value="120-150cm">120-150cm</option>
                                <option value="150-180cm">150-180cm</option>
                                <option value="over 180cm">Over 180cm</option>
                            </select>
                        </div>
                        <br/>
                        <div className="d-flex">
                            <label style={{width:"20%"}}>WEIGHT</label>
                            <select onChange={e=> setWeight(e.target.value)}>
                                <option value="" disabled selected>Select</option>
                                <option value="Under 15kg">Under 15kg</option>
                                <option value="15-20kg">15-20kg</option>
                                <option value="20-30kg">20-30kg</option>
                                <option value="30-40kg">30-40kg</option>
                                <option value="40-50kg">40-50kg</option>
                                <option value="50-60kg">50-60kg</option>
                                <option value="60-70kg">60-70kg</option>
                                <option value="70-80kg">70-80kg</option>
                                <option value="over 80kg">Over 80kg</option>
                            </select>
                        </div>
                        <br/>
                        <button type="submit" style={{width:"30%", marginLeft:"25%"}}>SUBMIT</button>
                        </form>
                    </div>
                    <div className="" style={{textAlign:"center", width:"100%"}}>
                        <img
                        className="card-image"
                        src={"https://res.cloudinary.com/djz6golwu/image/upload/"+product?.productImage[0]}
                        alt={product?.name}
                        // style={{width:"100%"}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
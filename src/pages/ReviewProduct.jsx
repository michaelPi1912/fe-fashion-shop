import { useNavigate, useParams } from "react-router-dom";
import NavbarNavigate from "../components/Navbar";
import { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import toast from "react-hot-toast";

export default function ReviewsByProduct(){
    const {id} = useParams();
    const navigate = useNavigate();
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [reviews, setReviews] = useState();
    const [rating, setRating] = useState(0);
    const [product, setProduct] = useState();
    const [one, setOne] = useState(0);
    const [two, setTwo] = useState(0);
    const [three, setThree] = useState(0);
    const [four, setFour] = useState(0);
    const [five, setFive] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [star, setStar] = useState(0);
    const [total, setTotal] = useState(0);
    let paginationNumber = []
    for (let i = 0; i < reviews?.totalPages; i++) {
            paginationNumber.push(i);
    }

    useEffect(()=>{
        fetchProduct()
        fetchReviews()
        fetchComment(star)
    },[])
    const fetchComment = (s) =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/reviews/product/${id}?rating=${s}`)
        .then(respone => {
            respone.json().then(json => {
                console.log(json)
                setReviews(json)
            })})
    }
    const fetchReviews =() =>{
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
                setTotal(json.length);
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
    const fetchProduct = () =>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/product/${id}`)
        .then(respone => respone.json())
        .then(json => {
            setProduct(json)
        })
    }
    const navigatePageable = nums =>{
        setCurPage(nums)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/product/${id}?page=${nums}&rating=${star}`,{
        }).then(
            res => res.json()
        ).then(
            json => {
                setReviews(json)
            }
        )
    }

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
    return(
        <div>
            <NavbarNavigate/>
            <div className="d-flex gap-5" style={{marginTop:"85px", paddingLeft:"15%", paddingTop:"5%"}}>
                <div style={{width:"60%"}}>
                    <a href="#" style={{color:"black", fontWeight:"bold"}} onClick={() => navigate(-1)}>RETURN TO PRODUCT DETAILS</a>
                    <br/>
                    <br/>
                    <h2><strong>{product?.name}</strong></h2>
                    <br/>
                    <br/>
                    <div className="d-flex gap-3">
                        <h3>REVIEWS ({total})</h3>
                        <StarRatings rating={rating} starRatedColor="orange" starHoverColor="orange" starDimension="30px"/>
                        
                    </div>
                    <div className="d-flex gap-2">
                        <button style={{background:"none", color:"black",width:"50px", border:star ===0?"2px solid blue":"1px solid grey", height:"25px",borderRadius:"30px",padding:"2%"}} 
                        onClick={() =>{
                            setStar(0);
                            fetchComment(0);
                        }}>All</button>
                        <button style={{background:"none", color:"orange",width:"50px", border:star ===5?"2px solid blue":"1px solid grey", height:"25px",borderRadius:"30px",padding:"2%"}}
                        onClick={() =>{
                            setStar(5);
                            fetchComment(5);
                        }}>5<i class="bi bi-star-fill"></i></button>
                        <button style={{background:"none", color:"orange",width:"50px", border:star ===4?"2px solid blue":"1px solid grey", height:"25px",borderRadius:"30px",padding:"2%"}}
                        onClick={() =>{
                            setStar(4);
                            fetchComment(4);
                        }}>4<i class="bi bi-star-fill"></i></button>
                        <button style={{background:"none", color:"orange",width:"50px", border:star ===3?"2px solid blue":"1px solid grey", height:"25px",borderRadius:"30px",padding:"2%"}}
                        onClick={() =>{
                            setStar(3);
                            fetchComment(3);
                        }}>3<i class="bi bi-star-fill"></i></button>
                        <button style={{background:"none", color:"orange",width:"50px", border:star ===2?"2px solid blue":"1px solid grey", height:"25px",borderRadius:"30px",padding:"2%"}}
                        onClick={() =>{
                            setStar(2);
                            fetchComment(2);
                        }}>2<i class="bi bi-star-fill"></i></button>
                        <button style={{background:"none", color:"orange",width:"50px", border:star ===1?"2px solid blue":"1px solid grey", height:"25px",borderRadius:"30px",padding:"2%"}}
                        onClick={() =>{
                            setStar(1);
                            fetchComment(1);
                        }}>1<i class="bi bi-star-fill"></i></button>
                    </div>
                    <hr/>
                    {
                        reviews?.reviewList?.map(review =>(
                            <div style={{borderBottom:"1px solid grey"}}>
                                <div style={{fontWeight:"bold", textTransform:"capitalize"}}>{review.user.firstname} {review.user.lastname}</div>
                                <StarRatings rating={review?.ratingValue} starRatedColor="orange" starHoverColor="orange" starDimension="15px"/>
                                <div>{review.comment}</div>
                            </div>
                        ))
                    }
                    <br/>
                    <nav aria-label="Page navigation example" style={{bottom: "0", left:"35%"}}>
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
                {/* Summary */}
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
                    <br/>
                    <button style={{width:"100%"}} onClick={() => writeReview()}>WRITE REVIEW</button>
                </div>

            </div>
        </div>
    )
}
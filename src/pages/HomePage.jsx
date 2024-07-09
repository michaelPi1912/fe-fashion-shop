import { useEffect, useState } from "react";
import { banner1, banner2, bn1, bn2, men, menLg, slide03, womenLg } from "../assets/data";
import Carousels from "../components/Carousels";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
import CardProduct from "../components/CardProduct";
import { Carousel } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomePage(){

    const [men, setMen] = useState(false);
    const [women, setWomen] = useState(false);

    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const settings = {
        nextArrow: (
            <div>
              <div className="next-slick-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
              </div>
            </div>
          ),
      
          prevArrow: (
            <div>
              <div className="next-slick-arrow rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
              </div>
            </div>
          ),
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        // infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
      };
    console.log(products)
    useEffect(() => {    
        fetchData(); 
    }, []);


    const fetchData = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/list?category=Men`).then(
            res => res.json()
        ).then(
            json => {
                setProducts(json)
                // json.productList.map((product) => fetchItem(product))
            }
        )
    }
    console.log(products.productList);

    return (
        <div>
            <NavbarNavigate/>
            <Carousels/>
            <br/>
            <div>
                <div style={{textAlign:"center",fontWeight:"bold", fontSize:"24px"}}>
                    
                    <div className="row" style={{width:"70%",margin:"auto"}}>
                        <div className="col container" >
                            <img src={bn2} width={500}/>
                            <a href="/women" style={{textDecoration:"none", color:"black", position:"absolute", top:"38%", left:"38%",padding:"2%",backgroundColor:'#ffffff'}}>Women's</a>
                        </div>
                        <div className="col container" >
                            <img src={bn1} width={500}/>
                            <a href="/men" style={{textDecoration:"none", color:"black", position:"absolute", top:"38%", left:"38%",padding:"2%",backgroundColor:'#ffffff'}}>Men's</a>
                        </div>
                        
                    </div>
                    <br/>
                  
                      <h1 style={{fontWeight:"bold"}}>PRODUCT OVERVIEW</h1>
                </div>
                <div className="d-flex" style={{width:"90%",margin:"auto"}}>
                    <div className="container" style={{width:"30%"}}>
                        <img src={womenLg} width={400} height={500} style={{filter: "blur(2px)"}}/>
                        <div style={{position:"absolute",top:"15%", left:"25%",textAlign:"center"}} >
                            <h4 style={{fontSize:"48px",fontWeight:"bold", color:'white'}}>Women's</h4>
                            <a href="/women" style={{color:"white", fontWeight:"bold", fontSize:"20px"}}>Discover More</a>
                        </div>
                       
                    </div>
                    <div className="container" style={{width:"65%", height:"500px",alignContent:"center"}}>
                        <Slider {...settings}>
                        {products.productList !== undefined ? products.productList.map( (product,index) => (
                                    <CardProduct product={product}/>
                            )) : <h1>load data</h1>}
                        </Slider>
                    </div>
                </div>
                <br/>
                <div style={{width:"90%",margin:"auto"}}>
                    <img src={slide03}/>
                </div>
                <br/>
                <div className="d-flex gap-2" style={{width:"90%",margin:"auto"}}>
                    <div className="container" style={{width:"65%", height:"500px",alignContent:"center"}}>
                        <Slider {...settings}>
                        {products.productList !== undefined ? products.productList.map( (product,index) => (
                                    <CardProduct product={product}/>
                            )) : <h1>load data</h1>}
                        </Slider>
                    </div>
                    <div className="container" style={{width:"30%"}}>
                        <img src={menLg} width={400} height={500} style={{filter: "blur(2px)"}}/>
                        <div style={{position:"absolute",top:"15%", left:"30%",textAlign:"center"}} >
                            <h4 style={{fontSize:"48px",fontWeight:"bold", color:'white'}}>Men's</h4>
                            <a href="/men" style={{color:"white", fontWeight:"bold", fontSize:"20px"}}>Discover More</a>
                    </div>
                       
                    </div>
                </div>
            </div>
            <br/>
            <Footer/>
        </div>
    );
}
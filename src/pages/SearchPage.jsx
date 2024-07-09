import { useParams } from "react-router-dom";
import NavbarNavigate from "../components/Navbar";
import { useEffect, useState } from "react";
import CardProduct from "../components/CardProduct";
import "../style/sass/color-picker.scss"
import { blockInvalidChar } from "../components/blockInvalidChar";
import MultiRangeSlider from "../components/MultiRangeSilder";
import { Slider } from "@mui/material";
import toast from "react-hot-toast";
import Footer from "../components/Footer";

export default function SearchPage(){

    const {q} =  useParams();
    const [products, setProducts] = useState([]);
    const colors1 = ["White", "Black", "Yellow", "Orange", "Red"]
    const colors2  =["Blue","Green", "Brown", "Pink", "purple"]
    
    const [colors, setColors] = useState([])
    const [category, setCategories] = useState("all")
    // const [prices, setPrices] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [newKey, setNewKey] = useState();
    const [total, setTotal] = useState(0);
    
    const [range, setRange] = useState([10000,1000000])
    // const [choose, setChoose]= useState(false);
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null)
    const [curPage, setCurPage] = useState(0);
    const [isAll, setIsAll] = useState(false)
    const [size, setSize] = useState(0)
    const [isFilter, setIsFilter] = useState(false); 
    useEffect(()=>{
        fetchData(q)
        setNewKey(q)
    },[])
    
    console.log(products)


    const fetchData = (q) =>{
        console.log(q+category+sizes+colors, size)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/filter?size=${size+6}`,{
            method: "POST",
            body: JSON.stringify({
                key: q,
                category,
                sizes,
                colors,
                // prices: null
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"                  
            }
        })
        .then(
            res => res.json()
        ).then(
            json => {
                console.log(json)
                setTotal(json.totalItems)
                setProducts([json.productList])
                setSize(size+6)
                if(size +6 >= json.totalItems){
                    setIsAll(true);
                }
            }
        )
    }

    // const handleClickPrice = (e) =>{
    //     const {value, checked} = e.target;
    //     if(checked){
    //         setChoose(false)
    //         setPrices(cur => [...cur,+value])
    //     }else{  
    //         setPrices(cur => cur.filter(i => i !== +value))
    //     }
    // }
    const handleClickSize = (e) =>{
        const {value, checked} = e.target;
        if(checked){
            setSizes(cur => [...cur,value])
        }else{  
            setSizes(cur => cur.filter(i => i !== value))
        }
    }
    const handleClickColor = (e) =>{
        const {value, checked} = e.target;
        if(checked){
            setColors(cur => [...cur,value])
        }else{  
            setColors(cur => cur.filter(i => i !== value))
        }
    }

    // const handleChoosePrice = (e) =>{
    //     const {value, checked} = e.target;
    //     if(checked){
    //         setChoose(true)
    //         setPrices([])
    //     }else{  
    //         setChoose(false)
    //     }
    // }

    const filterData = (count) =>{
        let array = [];
        // console.log(category)
        setProducts(array)
        console.log(size + " "+isAll)
        if(min !== null && max !== null && min > max){
            toast.error("The minimum price is greater than the maximum price")
        }else{
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/filter?size=${count}`,{
            method: "POST",
            body: JSON.stringify({
                key: q,
                category,
                sizes,
                colors,
                min,
                max
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"                  
            }
        })
        .then(
            res => res.json()
        ).then(
            json => {
                setIsFilter(true)
                setTotal(json.totalItems)
                setProducts([json.productList])
                setSize(size+6)
                setIsAll(false)
                if(count >= json.totalItems){
                    setIsAll(true);
                }
            }
        )
        }
        
            
        
    }

    const reset = () =>{
        
        setSizes([])
        setColors([])
        // setPrices([])
        setSize(0)
        setIsAll(false)
        setMin(null);
        setMax(null)
        setIsFilter(false)
        setCategories("all");
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/filter?size=6`,{
            method: "POST",
            body: JSON.stringify({
                key: q,
                category:"all",
                sizes:[],
                colors:[],
                prices: null
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"                  
            }
        })
        .then(
            res => res.json()
        ).then(
            json => {
                setTotal(json.totalItems)
                setProducts([json.productList])
            }
        )
    }
    function handleChanges(event, newValue) {
        setRange(newValue);
        console.log(newValue)
        setMin(newValue[0]*10000)
        setMax(newValue[1]*10000)
    }

    return(
        <div>
            <NavbarNavigate/>
            
            <div>
                <div style={{marginTop: "85px"}} className="d-flex">
                    {/* filter */}
                    <div style={{width:"30%" , textAlign:"-webkit-right",marginTop:"2%",paddingTop:"5%", paddingRight:"2%"}}>
                        <div style={{width:"70%", textAlign:"left", padding:"5%"}}>
                            <div>
                                <h4 style={{fontWeight:"bold"}}>Gender</h4>
                                <div className="d-flex flex-column">
                                    <div>
                                        <input type="radio" name="category" onChange={e=>setCategories(e.target.value)} value="all" checked={category ==="all"}/>&nbsp;
                                        <label>All</label>
                                    </div>
                                    <div>
                                        <input type="radio"  name="category" onChange={e=>setCategories(e.target.value)} value="men" checked={category ==="men"}/>&nbsp;
                                        <label>Men</label>
                                    </div>
                                    <div>
                                        <input type="radio"  name="category" onChange={e=>setCategories(e.target.value)} value="women" checked={category ==="women"}/>&nbsp;
                                        <label>Women</label>
                                    </div>                                 
                                </div>
                            </div>
                            <br/>
                            <div>
                                <h4 style={{fontWeight:"bold"}}>Price</h4>
                                <div className="d-flex flex-column">
                                    {/* <div>
                                        <input type="checkbox" value={0} onChange={handleClickPrice} checked={prices.includes(0)}/>&nbsp;
                                        <label>Under 199.000 VND</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" value={1}  onChange={handleClickPrice} checked={prices.includes(1)}/>&nbsp;
                                        <label>199.000 VND - 299.000 VND</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" value={2}  onChange={handleClickPrice} checked={prices.includes(2)}/>&nbsp;
                                        <label>299.000 VND - 399.000 VND</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" value={3}  onChange={handleClickPrice} checked={prices.includes(3)}/>&nbsp;
                                        <label>399.000 VND - 499.000 VND</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" value={4}  onChange={handleClickPrice} checked={prices.includes(4)}/>&nbsp;
                                        <label>Over 499.000 VND</label>
                                    </div>  
                                    <div>
                                        <input type="checkbox" value={5}  onChange={handleChoosePrice} checked={choose}/>&nbsp;
                                        <label>Choose Price</label>
                                    </div>  
                                    <br/> */}
                                    <Slider value = {range} min={1} max={100}  onChange = {handleChanges} valueLabelDisplay="auto"/>
                                    <br/>
                                    <div >
                                        <label style={{width:"20%"}}>From</label>&nbsp;
                                        <input style={{width:"40%"}} type="number" onKeyDown={blockInvalidChar} value={min} onChange={e => setMin(e.target.value)}/> VND
                                    </div>
                                    <br/>
                                    <div>
                                        <label style={{width:"20%"}}>- To</label>&nbsp;
                                        <input style={{width:"40%"}} type="number" onKeyDown={blockInvalidChar} value={max} onChange={e => setMax(e.target.value)}/> VND
                                    </div>
                                       
                                        
                                    
                                </div>
                            </div>
                            <br/>
                            <div>
                                <h4 style={{fontWeight:"bold"}}>Size</h4>
                                <div className="d-flex flex-column">
                                    <div>
                                        <input type="checkbox" name="size" value="XS"   
                                        onChange={handleClickSize} checked={sizes.includes("XS")}
                                        />&nbsp;
                                        <label>XS</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name="size" value="S"   onChange={handleClickSize} checked={sizes.includes("S")}/>&nbsp;
                                        <label>S</label>
                                    </div>
                                    <div>
                                        <input type="checkbox"  name="size" value="M"  onChange={handleClickSize} checked={sizes.includes("M")}/>&nbsp;
                                        <label>M</label>
                                    </div>
                                    <div>
                                        <input type="checkbox"  name="size" value="L"  onChange={handleClickSize} checked={sizes.includes("L")}/>&nbsp;
                                        <label>L</label>
                                    </div>
                                    <div>
                                        <input type="checkbox"  name="size" value="XL"  onChange={handleClickSize} checked={sizes.includes("XL")}/>&nbsp;
                                        <label>XL</label>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div>
                                <h4 style={{fontWeight:"bold"}}>Color</h4>
                                <div className="d-flex flex-column">
                                    <div>
                                        {
                                            colors1.map((color) => (
                                                <div  className="color-picker__item">
                                                    <input type="checkbox" id={color} className="color-picker__input" name="color-input"
                                                    value={color}
                                                    onChange={handleClickColor}
                                                    checked={colors.includes(color)}
                                                    />
                                                    <label for={color} className="color-picker__color color-picker__color" style={{background:color==="White"?"#f2f2f2":color}}></label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div>
                                        {
                                            colors2.map((color) => (
                                                <div  className="color-picker__item">
                                                    <input type="checkbox" id={color} className="color-picker__input" name="color-input"
                                                    value={color}
                                                    onChange={handleClickColor}
                                                    checked={colors.includes(color)}
                                                    />
                                                    <label for={color} className="color-picker__color color-picker__color" style={{background:color==="White"?"#f2f2f2":color}}></label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                
                                </div>
                                <br/>
                                <button  style={{alignSelf:"center",width:"100%"}} onClick={()=>{
                                    filterData(6)
                                    setSize(0)
                                }
                                }><i class="bi bi-funnel"></i>Filter</button>
                                <br/>
                                <button  style={{alignSelf:"center",width:"100%"}} onClick={() => reset()}><i class="bi bi-funnel"></i>Reset</button>
                                
                            </div>
                        </div>
                        
                    </div>
                     
                    
                    {/* results */}
                    <div style={{marginTop:"5%", width:"70%"}}>
                        <h1>Search Results ({total})</h1>
                        <div className="d-flex">
                            <input value={newKey} style={{width:"60%", height:"40px"}} onChange={e=> setNewKey(e.target.value)}/>
                            <button style={{ height:"40px"}} onClick={()=> {
                                window.location.href = window.location.origin + `/search/${newKey}`;
                            }}>Search</button>
                        </div>
                        
                        {
                            products?.length > 0 ? (
                                <section className="product">
                                    <div className="container">
                                        <div className="grid">
                                            { products[0].map( (product,index) => (
                                                <CardProduct product={product} item={product?.productItem[0]}/>
                                        )) }
                                        </div>
                                    </div>
                                </section>
                            ):<div style={{width:"100%"}}>There are no results that match your search.

                                {/* <button >Back Home</button> */}
                            </div>
                        }
                        
                    </div>
                    
                </div>
                <button style={{width:"80%", marginLeft:"10%", background:"none", color:"black", fontSize:"22px",
                            display: total > 6 && isAll !== true  ? "" : "none"}} onClick={() => {
                                if(isFilter === true){
                                    filterData(size+6)                                    
                                }else{
                                    fetchData(q)
                                }
                                setSize(0)
                                
                            }}>
                            VIEW MORE<i class="bi bi-chevron-down"></i>
                </button>
            </div>
            <br/>
            <Footer/>
        </div>
    )
}
import CardProduct from "../components/CardProduct";
import { useState, useEffect} from "react";
import "../style/sass/gridProduct.scss";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
import { Slider } from "@mui/material";

import { blockInvalidChar } from "../components/blockInvalidChar";
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";


export default function ManPage(){
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [cate, setCate] = useState("all")
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [range, setRange] = useState([10000,1000000])
  const [sizes, setSizes] = useState([]);
  const colors1 = ["White", "Black", "Yellow", "Orange", "Red"]
  const colors2  =["Blue","Green", "Brown", "Pink", "purple"]
  const [size, setSize] = useState(0)
  const [colors, setColors] = useState([])
  const [isAll, setIsAll] = useState(false)
  const [total, setTotal] = useState(0);
  const [isFilter, setIsFilter] = useState(false);

  useEffect(() => {    
    fetchData(6); 
    fetchCategory();
  }, []);
  // const fetchData = async () =>{
  //       const resMan = await fetch(process.env.REACT_APP_API_URL+"/api/v1/product/list?name=Men");
  //       const resUnisex = await fetch(process.env.REACT_APP_API_URL+"/api/v1/product/list?name=Unisex");
  //       if (!resMan.ok) {
  //         throw new Error(`HTTP error: Status ${resMan.status}`);
  //       }
  //       if (!resUnisex.ok) {
  //         throw new Error(`HTTP error: Status ${resUnisex.status}`);
  //       }
  //       let manData = await resMan.json();
  //       let unisexData = await resUnisex.json();
  //       setProducts(manData);
  //       setProducts(pre => ({
  //         productList: [...pre.productList, ...unisexData.productList]
  //       }));
  //     };

  console.log(category)

  const fetchData = (count) =>{

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/list?category=Men&size=${count}`).then(
        res => res.json()).then(
        json => {
            console.log(json)
            setProducts(json)
            setTotal(json.totalItems)
            setSize(size+6)
            json.productList.map((product) => fetchItem(product))
            setIsAll(false)
            if(count >= json.totalItems){
                setIsAll(true);
            }
        }
    )
    
  }
  console.log(products.productList);
  console.log(items)
  console.log(cate)
  console.log(total, isAll)
  // const searchProduct = products.productList.map((product) => {
  //   return Object.keys(product).some((key) =>
  //     product[key]
  //       .toString()
  //       .toLowerCase()
  //       .includes(search.toString().toLowerCase())
  //   );
  // });

  const fetchItem =  (product) =>{
     fetch(process.env.REACT_APP_API_URL+`/api/v1/product-item/all/${product.id}`)
     .then(res => res.json())
     .then(json => {
      console.log(json)
      setItems((cur) => [...cur, json.productItems[0]])
     })
      
  }
  const fetchCategory = () =>{
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/category/all?size=${20}`)
    .then(res => res.json())
    .then(json => {
      // console.log(json)
      setCategory([])
      json.categoryList.map((item) =>{
        if(item.parent?.name === "Men"){
          setCategory(cur => [...cur, item])
        }
      })
      // setCategory(json)
    })
  }
  function handleChanges(event, newValue) {
    setRange(newValue);
    console.log(newValue)
    setMin(newValue[0]*10000)
    setMax(newValue[1]*10000)
  }
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
  const Filter = (count) =>{
    
    if(cate === "all"){

        let params ="";
        if(sizes.length > 0){
            params += `sizes=${sizes}&`
        }
        if(colors.length > 0){
            params += `colors=${colors}&`
        }
        if(min !== null && max!== null)
            params +=  `min=${min}&max=${max}`
        if(min > max){
            toast.error("price range is not valid")
        }else{
            console.log(params)
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/list?category=Men&size=${count}&`+params).then(
          res => res.json()).then(
          json => {
            setProducts(json)
            setIsFilter(true)
            setTotal(json.totalItems)
            setSize(size+6)
            json.productList.map((product) => fetchItem(product))
            setIsAll(false)
            if(count >= json.totalItems){
                setIsAll(true);
            }
          }
      )}
    }else{
        let params =""
        if(sizes.length > 0){
            params += `sizes=${sizes}&`
        }
        if(colors.length > 0){
            params += `colors=${colors}&`
        }
        if(min !== null && max!== null)
            params +=  `min=${min}&max=${max}`
        if(min > max){
            toast.error("price range is not valid")
        }else{
            console.log(params)

            fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/list?category=${cate}&size=${count}&`+params).then(
            res => res.json()
            ).then(
                json => {
                    setIsFilter(true)
                    setProducts(json)
                    setTotal(json.totalItems)
                    setSize(size+6)
                    json.productList.map((product) => fetchItem(product))
                    setIsAll(false)
                    if(count >= json.totalItems){
                        setIsAll(true);
                    } 
                }
            )
        }
        
    }
  }
//   const reset = () =>{
        
//     setSizes([])
//     setColors([])
//     // setPrices([])
//     setIsAll(false)
//     setMin(null);
//     setMax(null)
//     setCate("all");
//     fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/filter?size=6`,{
//         method: "POST",
//         body: JSON.stringify({
//             // key: q,
//             category:"all",
//             sizes:[],
//             colors:[],
//             prices: null
//         }),
//         headers:{
//             "Content-type": "application/json; charset=UTF-8"                  
//         }
//     })
//     .then(
//         res => res.json()
//     ).then(
//         json => {
//             setTotal(json.totalItems)
//             setProducts([json.productList])
//         }
//     )
// }
  
  return (
    <div>
      <NavbarNavigate/>
      <div className="d-flex gap-4" style={{marginTop: "85px"}}>
        <div style={{width:"25%" , textAlign:"-webkit-right",marginTop:"2%",paddingTop:"5%", paddingRight:"2%"}}>
                        <div style={{width:"70%", textAlign:"left", padding:"5%"}}>
                            {/* Category */}
                            <div>
                                <h4 style={{fontWeight:"bold"}}>Category</h4>
                                <div className="d-flex flex-column">
                                    <div>
                                        <input type="radio" name="category" value="all" checked={cate ==="all"} onChange={e=>setCate(e.target.value)}/>&nbsp;
                                        <label>All</label>
                                    </div>
                                    {
                                      category.map(item =>(
                                        <div>
                                          <input type="radio" name="category" value={item.id} checked={cate ===item.id} onChange={e=>setCate(e.target.value)}/>&nbsp;
                                            <label>{item.name}</label>
                                        </div>
                                      ))
                                    }                               
                                </div>
                            </div>
                            <br/>
                            {/* Price */}
                            <div>
                                <h4 style={{fontWeight:"bold"}}>Price</h4>
                                <div className="d-flex flex-column">
                                    
                                    <Slider value = {range} min={1} max={100}  onChange = {handleChanges} valueLabelDisplay="auto"/>
                                    <br/>
                                    <div >
                                        <label style={{width:"20%"}}>From</label>&nbsp;
                                        <input style={{width:"40%"}} type="number" onKeyDown={blockInvalidChar} value={min} onChange={e => setMin(e.target.value)}/> VND
                                    </div>
                                    <br/>
                                    <div>
                                        <label style={{width:"20%"}}>To</label>&nbsp;
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
                                        <input type="checkbox" name="size" value="S"   
                                        onChange={handleClickSize} checked={sizes.includes("S")}
                                        />&nbsp;
                                        <label>S</label>
                                    </div>
                                    <div>
                                        <input type="checkbox"  name="size" value="M"  
                                        onChange={handleClickSize} checked={sizes.includes("M")}
                                        />&nbsp;
                                        <label>M</label>
                                    </div>
                                    <div>
                                        <input type="checkbox"  name="size" value="L"  
                                        onChange={handleClickSize} checked={sizes.includes("L")}
                                        />&nbsp;
                                        <label>L</label>
                                    </div>
                                    <div>
                                        <input type="checkbox"  name="size" value="XL"  
                                        onChange={handleClickSize} checked={sizes.includes("XL")}
                                        />&nbsp;
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
                                <button  style={{alignSelf:"center",width:"100%"}} onClick={() =>{
                                    Filter(6)
                                    setSize(0)
                                } }><i class="bi bi-funnel"></i>Filter</button>
                                <br/>
                                <button  style={{alignSelf:"center",width:"100%"}} onClick={() =>{
                                    window.location.reload()
                                }}><i class="bi bi-funnel"></i>Reset</button>
                                
                            </div>
                        </div>
                        
        </div>
        <section className="product" style={{marginTop:"5%"}}>
            <div className="container">
                <div className="grid">
                    {products.productList !== undefined ? products.productList.map( (product,index) => (
                    <CardProduct product={product} item={items[index]}/>
                )) : <h1>load data</h1>}
                </div>
                <br/>
                <button style={{width:"80%", marginLeft:"10%", background:"none", color:"black", fontSize:"22px",
                            display: total > 6 && isAll !== true  ? "" : "none"}} onClick={() => {
                                fetchData(size+6)
                            }}>
                            VIEW MORE<i class="bi bi-chevron-down"></i>
                </button>
            </div>
        </section>
      </div>
      <div style={{height:"200px"}}>

      </div>
      <Footer/>
    </div>
      
  );
}   
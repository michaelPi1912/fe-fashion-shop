import CardProduct from "../components/CardProduct";
import { useState, useEffect} from "react";
import "../style/sass/gridProduct.scss";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';
// import { Link } from "react-router-dom";


export default function ManPage(){
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {    
    fetchData(); 
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

  const fetchData = () =>{
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/list?name=Men`).then(
          res => res.json()
      ).then(
          json => {
              setProducts(json)
              json.productList.map((product) => fetchItem(product))
          }
      )
  }
  console.log(products.productList);
  console.log(items)
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


    return (
      <div>
        <NavbarNavigate/>
        <div style={{marginTop: "85px"}}>
            <section className="product">
                <div className="container">
                    <input
                        className="product-input"
                        placeholder="Product Filter"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                      <div className="grid">
                          {products.productList !== undefined ? products.productList.map( (product,index) => (
                            <CardProduct product={product} item={items[index]}/>
                      )) : <h1>load data</h1>}
                      </div>
                   
                </div>
            </section>
        </div>
        <Footer/>
      </div>
        
    );
}   
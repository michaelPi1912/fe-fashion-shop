import { useEffect } from "react"
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { SuccessPayment } from "../../redux/slices/PayPalSlice";
import { SuccessOrder } from "../../redux/slices/OrderSlice";
import { removeFromCart } from "../../redux/slices/CartSlice";
import NavbarNavigate from "../../components/Navbar";

export default function PaymentSuccess(){
    const orderInfo = useSelector((state) => state.paypal);
    const order = useSelector((state) => state.order);

    const data = orderInfo[0];
    console.log(orderInfo[0]);
    const dispatch = useDispatch();
    const saved = localStorage.getItem("user-info");
    const user = JSON.parse(saved);
    const [queryParameters] = useSearchParams();
    useEffect(()=>{
        fetch(process.env.REACT_APP_API_URL+`/api/v1/payment/success?paymentId=${queryParameters.get("paymentId")}&payerId=${queryParameters.get("PayerID")}`,
        {
            headers: {
                'Authorization' : `Bearer ${user.access_token}`
            }
        }
    )
        .then(res => res.text().then(data =>{
            if(data ==="success"){
                console.log(data) 
                checkout();

                
            }else{
                console.log(data)
            }
        }))
    },[])
    const checkout = () => {
            fetch(process.env.REACT_APP_API_URL+"/api/v1/order/insert", {
              method: "POST",
              body: JSON.stringify({
                paymentType: data.paymentType,
                shipmentMethod: data.shipmentMethod,
                phone: data.phone,
                total: data.total,
                shippingCost: data.shippingCost,
                itemRequests:  data.itemRequests,
                addressId: data.addressId,
                coupons: data.coupons
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Bearer ${user.access_token}`
              },
            })
              .then(response => {
                // console.log(response.status)
                  if(response.status === 200){
                    
                    toast.success("Order Success")
                    order[0].map(item =>{
                        dispatch(removeFromCart(item.id))
                      })
                    dispatch(SuccessOrder());
                    dispatch(SuccessPayment())
                      // dispatch()
                  }
              })
      };
    return(
      <div style={{height:"100%",marginTop: "85px"}}>
      <NavbarNavigate/>
      <div style={{textAlign:"center",padding:"5%"}}>
          <span><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" style={{color:'green'}} fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
</svg></span>
<br/>
<br/>
          <div className="d-flex justify-content-center" style={{}}>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-paypal" viewBox="0 0 16 16">
<path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.35.35 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91q.57-.403.993-1.005a4.94 4.94 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.7 2.7 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.7.7 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016q.326.186.548.438c.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.87.87 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.35.35 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32z"/>
</svg></span>
          <h1>PayPal Success</h1>
          </div>
          
      </div> 
  </div>
    )
}
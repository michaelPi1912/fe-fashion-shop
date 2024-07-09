import "../style/sass/payment-card.scss"

export default function PaymentCard({payment, setPayment}){
    return(
        <div class="grid">
            <label class="card" >
                <input name="plan" class="radio" type="radio"  onChange={(e) => setPayment("COD")} checked={payment === "COD"}/>
                
                <span class="plan-details" style={{width:"100%", height:"100%", backgroundColor:"#006600", fontSize:"20px"}}>
                <span class="plan-type"></span>
                <span class="plan-cost" style={{alignSelf:"center"}}><i class="bi bi-cash-stack" style={{backgroundColor:"#006600"}}></i></span>
                <span style={{fontWeight:"bold", alignSelf:"center"}}>CASH</span>
                </span>
            </label>
            <label class="card">
                <input name="plan" class="radio" type="radio" onChange={(e) => setPayment("PAYPAL")} checked={payment ==="PAYPAL"}/>
                <span class="plan-details" style={{width:"100%", height:"100%", backgroundColor:"#ffbf00", fontSize:"20px"}}>
                <span class="plan-type"></span>
                <span class="plan-cost" style={{alignSelf:"center"}}><i class="bi bi-paypal" style={{backgroundColor:"	#0040ff"}}></i></span>
                <span style={{fontWeight:"bold", alignSelf:"center"}}>PAYPAL</span>
                </span>
            </label>
            </div>
    );
}
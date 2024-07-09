import {logo} from "../assets/data";


export default function Footer(){
    return(
        <div style={{bottom: 0, width: "100%", height:"250px", backgroundColor:"black", color:"white"}}>
            <footer >
                <div className="d-flex gap-5" style={{margin: "auto",width: "50%", padding:"4%"}}>
                    <img src={logo} alt="" height={115} width={115} />
                    <div>
                        <h4>CONTACT</h4>
                        <div>fashion@gmail.com</div>
                        <div>086 868 8686</div>
                        <div>©️2024 FASHION SHOP Inc</div>
                    </div>
                </div>
                
                
            </footer>
            
            
        </div>
    );
}
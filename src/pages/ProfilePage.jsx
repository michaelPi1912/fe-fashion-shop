import Footer from "../components/Footer";
import NavbarNavigate from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function ProfilePage(){
    
    const navigate = useNavigate();

    return (
        <div>
            <NavbarNavigate/>
            <div style={{marginTop:"85px"}}>
                <h1>account page</h1>
            </div>
            <Footer/>
        </div>
    );
}
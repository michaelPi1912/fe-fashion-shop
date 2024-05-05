import Carousels from "../components/Carousels";
import Footer from '../components/Footer';
import NavbarNavigate from '../components/Navbar';

export default function HomePage(){
    return (
        <div>

            <NavbarNavigate/>
            <Carousels/>
            <Footer/>
        </div>
    );
}
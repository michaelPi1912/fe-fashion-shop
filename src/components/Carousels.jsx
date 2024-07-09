import Carousel from 'react-bootstrap/Carousel';
import { slide01, slide02, slide03 } from '../assets/data';

function Carousels() {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img src={slide01} className='d-block w-100' alt='...' style={{height: 760}} />  
        <Carousel.Caption style={{top:"40%"}}>
          <div style={{textAlign:"left", }}>
            <h2 style={{color:"black"}}>Women Collection</h2>
            <br/>
            <a href='/women' style={{textDecoration:"none", color:"white",backgroundColor:"black", paddingLeft:"5%", paddingRight:"5%", paddingTop:"2%", paddingBottom:"2%", borderRadius:"30px"}}>SHOP NOW</a>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide02} className='d-block w-100' alt='...' style={{height: 760}}/>
        <Carousel.Caption style={{top:"40%"}}>
          <div style={{textAlign:"left", }}>
            <h2 style={{color:"black"}}>Men Collection</h2>
            <br/>
            <a href='/men' style={{textDecoration:"none", color:"white",backgroundColor:"black", paddingLeft:"5%", paddingRight:"5%", paddingTop:"2%", paddingBottom:"2%", borderRadius:"30px"}}>SHOP NOW</a>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      {/* <Carousel.Item >
        <img src={slide03} className='d-block w-100' alt='...' style={{height: 760}}/>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item> */}
    </Carousel>
  );
}

export default Carousels;
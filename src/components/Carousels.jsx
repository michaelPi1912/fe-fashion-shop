import Carousel from 'react-bootstrap/Carousel';

function Carousels() {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img src='https://th.bing.com/th/id/OIG2.6XXQ5Q3.IYtob5Dq3bFH?pid=ImgGn' className='d-block w-100' alt='...' style={{height: 760}} />  
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img src='https://th.bing.com/th/id/OIG3.PP3AOXzFvO0oXCXddsvr?w=1024&h=1024&rs=1&pid=ImgDetMain' className='d-block w-100' alt='...' style={{height: 760}}/>
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src='https://th.bing.com/th/id/OIG3.krcd0mPWAj1gS53Bke9R?pid=ImgGn' className='d-block w-100' alt='...' style={{height: 760}}/>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Carousels;
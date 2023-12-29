import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import img1 from "../../assets/turtle.jpeg";
import img2 from "../../assets/mean.png";
import img3 from "../../assets/pullback.jpg";
import img4 from "../../assets/swing.jpg";

const Banner = () => {
  return (
    <div className="w-96 mx-auto my-auto ">
      <Carousel>
        <div>
          <img src={img1} />
        </div>
        <div>
          <img src={img2} />
        </div>
        <div>
          <img src={img3} />
        </div>
        <div>
          <img src={img4} />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;

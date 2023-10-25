import React, { useRef } from 'react';
import { Carousel } from 'antd';
import banner1 from '../../images/banner/banner1.jpg';
import banner3 from '../../images/banner/banner3.jpg';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

function Banner() {
  const carouselRef = useRef(null);

  const next = () => {
    carouselRef.current.next();
  };

  const previous = () => {
    carouselRef.current.prev();
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div style={{ position: 'relative' }}>
      <MdKeyboardArrowLeft
        style={{
          cursor: 'pointer',
          fontSize: '2em',
          color: 'white',
          position: 'absolute',
          top: '46%',
          left: '2%',
          zIndex: '1',
        }}
        onClick={previous}
      ></MdKeyboardArrowLeft>
      <Carousel ref={carouselRef} {...settings}>
        <div>
          <img src={banner1} width="98%" alt="Banner 1"></img>
        </div>
        <div>
          <img src={banner3} width="98%" alt="Banner 3"></img>
        </div>
      </Carousel>
      <MdKeyboardArrowRight
        style={{
          cursor: 'pointer',
          fontSize: '2em',
          color: 'white',
          position: 'absolute',
          top: '46%',
          right: '2%',
          zIndex: '1',
        }}
        type="right-circle"
        onClick={next}
      ></MdKeyboardArrowRight>
    </div>
  );
}

export default Banner;

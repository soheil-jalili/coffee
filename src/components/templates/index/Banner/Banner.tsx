"use client";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Autoplay, Navigation } from "swiper/modules";

const Banner: React.FC = () => {
  return (
    <Swiper
      navigation={true}
      loop={true}
      rewind={true}
      autoplay={{ delay: 1500 }}
  
      modules={[Navigation, Autoplay]}
      className="mySwiper home-slider"
    >
      <SwiperSlide>
        <img
          src="https://set-coffee.com/wp-content/uploads/2023/12/slide.jpg"
          alt="Slide"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="https://set-coffee.com/wp-content/uploads/2021/10/winter-slie.jpg"
          alt="Slide"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="https://set-coffee.com/wp-content/uploads/2022/06/fall.jpg"
          alt="Slide"
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;

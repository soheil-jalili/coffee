"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Product from "@/components/modules/Product/Product";
import RelatedProduct from "@/types/related-product";

const MoreProducts = ({
  relatedProduct,
}: {
  relatedProduct: RelatedProduct[];
}) => {
  return (
    <div data-aos="fade-right">
      <section>
        <h2>محصولات مرتبط</h2>
        <div
          style={{
            height: "2px",
            width: "70px",
            background: "black",
            marginTop: "10px",
          }}
        ></div>
      </section>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        dir="rtl"
        rewind={true}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper "
      >
        {relatedProduct.length === 0 ? (
          <p
            style={{
              marginTop: "1.5rem",
            }}
          >
            محصول مرتبطی مرتبطی موجود نیست
          </p>
        ) : (
          relatedProduct.map((product: RelatedProduct) => {
            return (
              <SwiperSlide>
                <Product {...product} key={product._id} />
              </SwiperSlide>
            );
          })
        )}
      </Swiper>
    </div>
  );
};

export default MoreProducts;

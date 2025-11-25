import Link from "next/link";
import React from "react";
import styles from "./product.module.css";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import averageScore from "@/utils/avg-score";
import RelatedProduct from "@/types/related-product";

const Product: React.FC<RelatedProduct> = ({
  name,
  price,
  comments,
  img,
  _id,
}: RelatedProduct) => {
  return (
    <div className={styles.card}>
      <div className={styles.details_container}>
        <img
          src={
            img ||
            "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
          }
          alt=""
        />
        <div className={styles.icons}>
          <Link href="/">
            <CiSearch />
            <p className={styles.tooltip}>مشاهده سریع</p>
          </Link>
          <div>
            <CiHeart />
            <p className={styles.tooltip}>افزودن به علاقه مندی ها </p>
          </div>
        </div>
        <button>افزودن به سبد خرید</button>
      </div>

      <div className={styles.details}>
        <Link href={`/product/${_id}`}>{name}</Link>
        <div>
          {Array.from({ length: 5 }).map((item, index: number) => {
            return index <= Math.round(averageScore(comments)) - 1 ? (
              <FaStar key={index} color="orange" />
            ) : (
              <FaStar key={index} color="#eee" />
            );
          })}
        </div>
        <span>{price.toLocaleString()} تومان</span>
      </div>
    </div>
  );
};

export default Product;

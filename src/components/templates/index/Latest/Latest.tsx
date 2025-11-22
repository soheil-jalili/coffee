import React from "react";
import styles from "./latest.module.css";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import Product from "@/components/modules/Product/Product";
import dbConnection from "../../../../../configs/db-connection";
import ProductModel from "../../../../../model/Product";
import RelatedProduct from "@/types/related-product";
const Latest: React.FC = async () => {
  dbConnection();
  const products = await ProductModel.find({}).populate("comments").lean();

  return (
    <div className={styles.container}>
      <section className={styles.title}>
        <div>
          <p>آخرین محصولات</p>
          <span>Latest products</span>
        </div>
        <Link className={styles.link} href={"/category"}>
          مشاهده همه <FaChevronLeft />{" "}
        </Link>
      </section>
      <main data-aos="fade-up" className={styles.products}>
        {products.map((product: RelatedProduct) => {
          return <Product key={product._id} {...product} />;
        })}
      </main>
    </div>
  );
};

export default Latest;

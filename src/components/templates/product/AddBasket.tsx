"use client";
import { showSwal } from "@/utils/helpers";
import styles from "./details.module.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Prop = {
  _id: string;
  name: string;
  price: number;
};

type ProductBasket = Prop & {
  count: number;
};
const AddBasket = ({ _id, name, price }: Prop) => {
  const [count, setCount] = useState<number>(1);
  const router = useRouter();
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")!) || [];
    const existingProduct = cart.find((p: ProductBasket) => p._id === _id);
    if (cart.length) {
      if (existingProduct) {
        existingProduct.count += count;
        localStorage.setItem("cart", JSON.stringify(cart));
        showSwal("تعداد محصول اضافه شد", "success", "باشه").then((res) =>
          router.refresh()
        );
      } else {
        const product = {
          _id,
          name,
          price,
          count,
        };
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        showSwal(
          "محصول با موفقیت به سبد خرید اضافه شد",
          "success",
          "باشه"
        ).then((res) => router.refresh());
      }
    } else {
      const product = {
        _id,
        name,
        price,
        count,
      };
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      showSwal("محصول با موفقیت به سبد خرید اضافه شد", "success", "باشه").then(
        (res) => router.refresh()
      );
    }
  };
  return (
    <div className={styles.cart}>
      <button onClick={addToCart}>افزودن به سبد خرید</button>
      <div>
        <span
          onClick={() =>
            setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1))
          }
        >
          -
        </span>
        {count}
        <span onClick={() => setCount((prevCount) => prevCount + 1)}>+</span>
      </div>
    </div>
  );
};

export default AddBasket;

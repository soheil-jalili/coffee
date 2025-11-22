"use client";
import React, { useEffect, useState } from "react";
import styles from "@/components/templates/p-admin/discounts/table.module.css";
import ProductType from "@/types/product-type";
import UserType from "@/types/user-type";
import { showSwal } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import mongoose from "mongoose";

const AddDiscount = () => {
  const router = useRouter();
  const [input, setInput] = useState<{
    code: string;
    percent: number;
    maxUse: number;
    product: null | mongoose.Types.ObjectId;
  }>({
    code: "",
    maxUse: 1,
    percent: 1,
    product: null,
  });
  const [products, setProducts] = useState<ProductType[] | null>();

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("http://localhost:3000/api/products");
      const productsItem = await response.json();
      setProducts(productsItem.products);
    };
    getProducts();
  }, []);

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setInput((prev) => ({ ...prev, [name]: value === "null" ? null : value }));
  };

  const addDiscount = async () => {
    const response = await fetch("http://localhost:3000/api/discounts", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        maxUse: Number(input.maxUse),
        percent: Number(input.percent),
        product: input.product,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      return showSwal(
        "کد تخفیف با موفقیت ساخته شد ...",
        "success",
        "باشه"
      ).then((_) => {
        router.refresh();
        setInput({
          code: "",
          maxUse: 1,
          percent: 1,
          product: null,
        });
      });
    }
    const { message } = await response.json();
    console.log(message);
  };

  return (
    <section className={styles.discount}>
      <p>افزودن کد تخفیف جدید</p>
      <div className={styles.discount_main}>
        <div>
          <label>شناسه تخفیف</label>
          <input
            placeholder="لطفا شناسه تخفیف را وارد کنید"
            type="text"
            name="code"
            onChange={inputHandler}
            value={input.code}
          />
        </div>
        <div>
          <label>درصد تخفیف</label>
          <input
            placeholder="لطفا درصد تخفیف را وارد کنید"
            type="number"
            min={1}
            max={100}
            name="percent"
            onChange={inputHandler}
            value={input.percent}
          />
        </div>
        <div>
          <label>حداکثر استفاده</label>
          <input
            placeholder="حداکثر استفاده از کد تخفیف"
            type="number"
            name="maxUse"
            onChange={inputHandler}
            value={input.maxUse}
          />
        </div>
        <div>
          <label>محصول</label>
          <select
            name="product"
            onChange={inputHandler}
            value={input.product?.toString()}
          >
            <option value={"null"}>همه محصولات</option>
            {products?.map((product: ProductType) => {
              return (
                <option
                  key={product._id.toString()}
                  value={product._id.toString()}
                >
                  {product.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <button onClick={addDiscount}>افزودن</button>
    </section>
  );
};

export default AddDiscount;

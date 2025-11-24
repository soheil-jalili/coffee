"use client";
import React from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";

import ProductType from "@/types/product-type";
import mongoose from "mongoose";
import { showSwal } from "@/utils/helpers";
export default function DataTable({
  products,
  title,
}: {
  products: ProductType[];
  title: string;
}) {
  const router = useRouter();

  const deleteProduct = async (_id: mongoose.Types.ObjectId) => {
    const res = await showSwal("آیا از حذف این محصول مطمن هستید ؟", "warning", [
      "خیر",
      "بله",
    ]);
    if (res) {
      const response = await fetch("/api/products/delete", {
        method: "DELETE",
        body: JSON.stringify({ _id }),
      });

      if (response.status === 200) {
        return showSwal("محصول با موفقیت حذف شد", "success", "باشه").then(
          (_) => {
            router.refresh();
          }
        );
      } else {
        console.log(_id)
        console.log(await response.json());
      }
    }
  };

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{title}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>محصول</th>
              <th>قیمت</th>
              <th>میانگین امتیاز</th>
              <th>تعداد کامنت ها</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id.toString()}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString()}</td>
                <td>{product.score}</td>
                <td>{product.comments.length}</td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => deleteProduct(product._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

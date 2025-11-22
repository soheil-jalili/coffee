"use client";
import React from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";
import mongoose from "mongoose";
import DiscountType from "@/types/discount-type";

export default function DataTable({
  discounts,
  title,
}: {
  discounts: DiscountType[];
  title: string;
}) {
  const router = useRouter();

  const deleteDiscountCode = async (_id: mongoose.Types.ObjectId) => {
    const res = await showSwal(
      "آیا از حذف این کد تخفیف مطمن هستید ؟",
      "warning",
      ["خیر", "بله"]
    );
    if (res) {
      const response = await fetch("/api/discounts/delete", {
        method: "DELETE",
        body: JSON.stringify({ _id }),
      });

      if (response.status === 200) {
        return showSwal("کد تخفیف با موفقیت حذف شد", "success", "باشه").then(
          (_) => {
            router.refresh();
          }
        );
      } else {
        console.log(_id);
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
              <th>کد تخفیف</th>
              <th>درصد تخفیف</th>
              <th>حداکثر استفاده</th>
              <th>دفعات استفاده شده</th>
              <th>سازنده</th>
              <th>محصول</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount: DiscountType, index) => (
              <tr
                key={discount._id.toString()}
                className={
                  discount.uses === discount.maxUse ? styles.finish_use : ""
                }
              >
                <td>{index + 1}</td>
                <td>{discount.code}</td>
                <td>{discount.percent}</td>
                <td>{discount.maxUse}</td>
                <td>{discount.uses}</td>
                <td>{discount.user.name}</td>
                <td>
                  {discount.product === null
                    ? "همه محصولات"
                    : discount.product.name}
                </td>
                <td id="delete__item">
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => deleteDiscountCode(discount._id)}
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

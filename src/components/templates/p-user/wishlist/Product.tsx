"use client";
import { showSwal } from "@/utils/helpers";
import styles from "./product.module.css";
import Link from "next/link";
import { IoMdStar } from "react-icons/io";
import swal from "sweetalert";
import mongoose from "mongoose";
import { useRouter } from "next/navigation";
const Product = ({
  name,
  price,
  score,
  _id,
}: {
  name: string;
  score: number;
  price: number;
  _id: mongoose.Types.ObjectId;
}) => {
  const router = useRouter();
  const removeProduct = (productId: mongoose.Types.ObjectId) => {
    swal({
      title: "آیا از حذف محصول اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "آره"],
    }).then(async (result) => {
      if (result) {
        const url = `/api/wishlist/${productId}`;
        const res = await fetch(url, {
          method: "DELETE",
        });
        if (res.status === 200) {
          return showSwal(
            "با موفقیت از لیست علاقه مندی ها شما حذف شد ...",
            "success",
            "باشه"
          ).then((res) => {
            router.refresh();
          });
        }
      }
    });
  };

  return (
    <div className={styles.card}>
      <Link href={"/product/123"}>
        <img
          width={283}
          height={283}
          src="https://set-coffee.com/wp-content/uploads/2022/03/ethiopia-430x430.png"
          alt=""
        />
      </Link>
      <p dir="rtl">{name}</p>
      <div>
        <div>
          {Array.from({ length: 5 }).map((item, index) => {
            return index <= score - 1 ? (
              <IoMdStar key={index} color="orange" />
            ) : (
              <IoMdStar key={index} color="#eee" />
            );
          })}
        </div>
        <span>{price.toLocaleString()} تومان</span>
      </div>
      <button onClick={() => removeProduct(_id)} className={styles.delete_btn}>
        حذف محصول{" "}
      </button>
    </div>
  );
};

export default Product;

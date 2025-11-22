"use client";
import { showSwal } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import React from "react";
import { CiHeart } from "react-icons/ci";

const AddToWishList = ({
  product_id,
  user,
  isInWishList,
}: {
  product_id: string;
  user: string;
  isInWishList: boolean;
}) => {
  const router = useRouter();
  const addToWishList = async () => {
    if (user !== null) {
      await fetch("http://localhost:3000/api/wishlist", {
        method: "POST",
        body: JSON.stringify({
          product: product_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (isInWishList) {
        showSwal(
          "این محصول به لیست علاقهمندی ها قبلا اضافه شده بود ...",
          "error",
          "باشه"
        );
      } else {
        showSwal("این محصول به لیست علاقهمندی ها اضافه شد", "success", "باشه");
        router.refresh()
      }
    } else {
      router.push("/login-register");
    }
  };
  return (
    <div onClick={addToWishList} style={{ cursor: "pointer" }}>
      <CiHeart fill={isInWishList ? "red" : "transparant"} />
      <span>
        {isInWishList
          ? "به علاقه مندی ها اضافه شده"
          : "افزودن به علاقه مندی ها"}
      </span>
    </div>
  );
};

export default AddToWishList;

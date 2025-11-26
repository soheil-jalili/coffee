"use client";
import React, { useState } from "react";
import styles from "../table.module.css";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";

function AddProduct() {
  const router = useRouter();

  const [input, setInput] = useState<{
    name: string;
    price: string;
    shortDescription: string;
    longDescription: string;
    weight: string;
    suitableFor: string;
    smell: string;
    tags: string;
    img: File | null;
  }>({
    name: "",
    price: "",
    shortDescription: "",
    longDescription: "",
    weight: "",
    suitableFor: "",
    smell: "",
    tags: "",
    img: null,
  });

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (files && files.length > 0) {
      setInput((prev) => ({ ...prev, img: files[0] }));
      return;
    }

    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = async () => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("price", input.price);
    formData.append("shortDescription", input.shortDescription);
    formData.append("longDescription", input.longDescription);
    formData.append("weight", input.weight);
    formData.append("suitableFor", input.suitableFor);
    formData.append("smell", input.smell);
    formData.append("tags", input.tags);
    if (input.img) {
      formData.append("img", input.img); 
    }

    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (response.status === 201) {
      return showSwal("محصول با موفقیت اضافه شد", "success", "باشه").then(_=>{
        router.refresh()
      });
    }
  };

  return (
    <section className={styles.discount}>
      <p>افزودن محصول جدید</p>
      <div className={styles.discount_main}>
        <div>
          <label>نام محصول</label>
          <input
            placeholder="لطفا نام محصول را وارد کنید"
            type="text"
            name="name"
            value={input.name}
            onChange={inputOnChange}
          />
        </div>
        <div>
          <label>مبلغ محصول</label>
          <input
            placeholder="لطفا مبلغ محصول را وارد کنید"
            type="text"
            name="price"
            value={input.price}
            onChange={inputOnChange}
          />
        </div>

        <div>
          <label>توضیحات کوتاه</label>
          <input
            placeholder="توضیحات کوتاه محصول"
            type="text"
            name="shortDescription"
            value={input.shortDescription}
            onChange={inputOnChange}
          />
        </div>
        <div>
          <label>توضیحات بلند</label>
          <input
            placeholder="توضیحات بلند محصول"
            type="text"
            name="longDescription"
            value={input.longDescription}
            onChange={inputOnChange}
          />
        </div>
        <div>
          <label>وزن</label>
          <input
            placeholder="وزن محصول"
            type="text"
            onChange={inputOnChange}
            name="weight"
            value={input.weight}
          />
        </div>
        <div>
          <label>مناسب برای:</label>
          <input
            placeholder="مناسب برای ..."
            type="text"
            name="suitableFor"
            value={input.suitableFor}
            onChange={inputOnChange}
          />
        </div>
        <div>
          <label>میزان بو</label>
          <input
            placeholder="میزان بو"
            type="text"
            onChange={inputOnChange}
            name="smell"
            value={input.smell}
          />
        </div>
        <div>
          <label>تگ های محصول</label>
          <input
            placeholder="مثال: قهوه،قهوه ترک، قهوه اسپرسو"
            type="text"
            name="tags"
            value={input.tags}
            onChange={inputOnChange}
          />
        </div>
        <div>
          <label>تصویر محصول</label>
          <input type="file" onChange={inputOnChange} />
        </div>
      </div>
      <button onClick={addProduct}>افزودن</button>
    </section>
  );
}

export default AddProduct;

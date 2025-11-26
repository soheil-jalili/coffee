"use client";
import React, { useState, useRef } from "react";
import styles from "../table.module.css";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";

function AddProduct() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

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

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProduct = async () => {
    if (!input.name.trim())
      return showSwal("لطفا نام محصول را وارد کنید", "error", "باشه");
    if (!input.price.trim() || isNaN(Number(input.price)))
      return showSwal("لطفا قیمت معتبر وارد کنید", "error", "باشه");
    if (!input.shortDescription.trim())
      return showSwal("لطفا توضیح کوتاه محصول را وارد کنید", "error", "باشه");
    if (!input.longDescription.trim())
      return showSwal("لطفا توضیح بلند محصول را وارد کنید", "error", "باشه");
    if (!input.weight.trim() || isNaN(Number(input.weight)))
      return showSwal("لطفا وزن معتبر وارد کنید", "error", "باشه");
    if (!input.suitableFor.trim())
      return showSwal("لطفا مناسب برای را وارد کنید", "error", "باشه");
    if (!input.smell.trim())
      return showSwal("لطفا نوع عطر را وارد کنید", "error", "باشه");
    if (!input.tags.trim())
      return showSwal("لطفا تگ‌ها را وارد کنید", "error", "باشه");
    if (!(input.img instanceof File))
      return showSwal("لطفا یک تصویر انتخاب کنید", "error", "باشه");

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("price", input.price.toString());
    formData.append("shortDescription", input.shortDescription);
    formData.append("longDescription", input.longDescription);
    formData.append("weight", input.weight);
    formData.append("suitableFor", input.suitableFor);
    formData.append("smell", input.smell);

    input.tags
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter((t) => t)
      .forEach((tag) => formData.append("tags", tag));

    formData.append("img", input.img);

    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (response.status === 201) {
      showSwal("محصول با موفقیت اضافه شد", "success", "باشه").then(() => {
        router.refresh();
        setInput({
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
        if (fileRef.current) fileRef.current.value = "";
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
            name="weight"
            value={input.weight}
            onChange={inputOnChange}
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
            name="smell"
            value={input.smell}
            onChange={inputOnChange}
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
          <input type="file" ref={fileRef} onChange={inputOnChange} />
        </div>
      </div>
      <button onClick={addProduct}>افزودن</button>
    </section>
  );
}

export default AddProduct;

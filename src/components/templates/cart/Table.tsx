"use client";
import Link from "next/link";
import styles from "./table.module.css";
import totalStyles from "./totals.module.css";
import { IoMdClose } from "react-icons/io";
import React, { useEffect, useState } from "react";
import stateData from "@/utils/stateData";
import Select from "react-select";
import { showSwal } from "@/utils/helpers";

const stateOptions = stateData();

const Table = () => {
  const [cart, setCart] = useState([]);
  const [stateSelectedOption, setStateSelectedOption] = useState(null);
  const [changeAddress, setChangeAddress] = useState(false);
  const [discount, setDiscount] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")!) || [];
    setCart(localCart);
  }, []);

  function calcTotalPrice() {
    let price = 0;

    if (cart.length) {
      price = cart.reduce(
        (prev, current) => prev + current.price * current.count,
        0
      );
      setTotalPrice(price);
    }
    setTotalPrice(price);
  }

  useEffect(() => calcTotalPrice(), [cart]);

  const addDiscount = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const response = await fetch("/api/discounts/use", {
      method: "PUT",
      body: JSON.stringify({
        discount: discount.trim(),
        productId: cart.map((item) => item._id),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return showSwal("کد تخفیف یافت نشد", "error", "باشه");
    } else if (response.status === 410) {
      return showSwal("کد تخفیف منقضی شده است", "error", "باشه");
    } else if (response.status === 422) {
      return showSwal("برای محصولات داخل سبد معتبر نیست ...", "error", "باشه");
    }

    if (response.status === 200) {
      const data = await response.json();

      if (data.product === null) {
        setTotalPrice(totalPrice - (totalPrice * data.percent) / 100);
      }

      return showSwal("کد تخفیف با موفقیت اعمال شد ...", "success", "باشه");
    }
  };

  return (
    <>
      {" "}
      <div className={styles.tabel_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th> جمع جزء</th>
              <th>تعداد</th>
              <th>قیمت</th>
              <th>محصول</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id.toString()}>
                <td>{(item.count * item.price).toLocaleString()} تومان</td>
                <td className={styles.counter}>
                  <div>
                    <span>-</span>
                    <p>{item.count}</p>
                    <span>+</span>
                  </div>
                </td>
                <td className={styles.price}>
                  {item.price.toLocaleString()} تومان
                </td>
                <td className={styles.product}>
                  <img
                    src="https://set-coffee.com/wp-content/uploads/2020/12/Red-box-DG--430x430.jpg"
                    alt=""
                  />
                  <Link href={"/"}>{item.name}</Link>
                </td>

                <td>
                  <IoMdClose className={styles.delete_icon} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <section>
          <button className={styles.update_btn}> بروزرسانی سبد خرید</button>
          <div>
            <button className={styles.set_off_btn} onClick={addDiscount}>
              اعمال کوپن
            </button>
            <input
              type="text"
              placeholder="کد تخفیف"
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
            />
          </div>
        </section>
      </div>
      <div className={totalStyles.totals}>
        <p className={totalStyles.totals_title}>جمع کل سبد خرید</p>

        <div className={totalStyles.subtotal}>
          <p>جمع جزء </p>
          <p>205,000 تومان</p>
        </div>

        <p className={totalStyles.motor}>
          {" "}
          پیک موتوری: <strong> 30,000 </strong>
        </p>
        <div className={totalStyles.address}>
          <p>حمل و نقل </p>
          <span>حمل و نقل به تهران (فقط شهر تهران).</span>
        </div>
        <p
          onClick={() => setChangeAddress((prev) => !prev)}
          className={totalStyles.change_address}
        >
          تغییر آدرس
        </p>
        {changeAddress && (
          <div className={totalStyles.address_details}>
            <Select
              defaultValue={stateSelectedOption}
              onChange={setStateSelectedOption}
              isClearable={true}
              placeholder={"استان"}
              isRtl={true}
              isSearchable={true}
              options={stateOptions}
            />
            <input type="text" placeholder="شهر" />
            <input type="number" placeholder="کد پستی" />
            <button onClick={() => setChangeAddress(false)}>بروزرسانی</button>
          </div>
        )}

        <div className={totalStyles.total}>
          <p>مجموع</p>
          <p>{totalPrice.toLocaleString()} تومان</p>
        </div>
        <Link href={"/checkout"}>
          <button className={totalStyles.checkout_btn}>
            ادامه جهت تصویه حساب
          </button>
        </Link>
      </div>
    </>
  );
};

export default Table;

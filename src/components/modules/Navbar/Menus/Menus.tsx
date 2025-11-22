import { authUser } from "@/utils/server-helper";
import styles from "../Navbar.module.css";
import Link from "next/link";

import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { cookies } from "next/headers";

const Menus = async () => {
  const user = await authUser();

  return (
    <ul className={styles.links}>
      <li>
        <Link href="/">صفحه اصلی</Link>
      </li>
      <li>
        <Link href="/category">فروشگاه</Link>
      </li>
      <li>
        <Link href="/blog">وبلاگ</Link>
      </li>
      <li>
        <Link href="/contact-us">تماس با ما</Link>
      </li>
      <li>
        <Link href="/about-us">درباره ما</Link>
      </li>
      <li>
        <Link href="/rules">قوانین</Link>
      </li>

      {/* Start My-account section */}
      {user !== null ? (
        <div className={styles.dropdown}>
          <Link href="/p-user">
            <IoIosArrowDown className={styles.dropdown_icons} />
            حساب کاربری
          </Link>
          <div className={styles.dropdown_content}>
            <Link href="/p-user/orders">سفارشات</Link>
            <Link href="/p-user/tickets">تیکت های پشتیبانی</Link>
            <Link href="/p-user/comments">کامنت‌ها</Link>
            <Link href="/p-user/wishlist">علاقه‌مندی‌ها</Link>
            <Link href="/p-user/account-details">جزئیات اکانت</Link>
          </div>
        </div>
      ) : (
        <li>
          <Link href="/login-register">ورود / عضویت</Link>
        </li>
      )}

      {/* Finish My-account section */}
    </ul>
  );
};
export default Menus;

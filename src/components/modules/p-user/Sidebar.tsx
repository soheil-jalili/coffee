"use client";

import styles from "./sidebar.module.css";
import { ImReply } from "react-icons/im";
import { FaComments, FaHeart, FaShoppingBag, FaUsers } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MdSms, MdLogout } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { TbListDetails } from "react-icons/tb";
import Link from "next/link";
import swal from "sweetalert";
import { showSwal } from "@/utils/helpers";

const Sidebar = ({
  user: { name, email, phoneNumber, role },
}: {
  user: {
    email: string;
    phoneNumber: string;
    name: string;
    role: string;
  };
}) => {
  const path = usePathname();
  const router = useRouter();
  const logoutHandler = async () => {
    const url = "/api/auth/signout";

    swal({
      title: "آیا از خروج اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "آره"],
    }).then((result) => {
      if (result) {
        const response = fetch(url)
          .then((res) => {
            if (res.status === 200) {
              return router.replace("/");
            }
          })
          .then((data) => {
            return showSwal("با موفقیت لاگ اوت شدین", "success", "باشه");
          })
          .then((r) => {
            router.refresh();
          });
      }
    });
  };
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar_header}>
        <p>خوش اومدی {name ? name : "ناشناس"} عزیز</p>
      </div>
      <ul className={styles.sidebar_main}>
        {path.includes("/p-user") ? (
          <>
            <Link
              href={"/p-user"}
              className={`${path === "/p-user" && styles.sidebar_link_active}`}
            >
              <ImReply />
              پیشخوان
            </Link>
            <Link
              href={"/p-user/orders"}
              className={`${
                path === "/p-user/orders" && styles.sidebar_link_active
              }`}
            >
              <FaShoppingBag />
              سفارش ها
            </Link>
            <Link
              href={"/p-user/tickets"}
              className={`${
                path === "/p-user/tickets" && styles.sidebar_link_active
              }`}
            >
              <MdSms />
              تیکت های پشتیبانی
            </Link>
            <Link
              href={"/p-user/comments"}
              className={`${
                path === "/p-user/comments" && styles.sidebar_link_active
              }`}
            >
              <FaComments />
              کامنت ها
            </Link>
            <Link
              href={"/p-user/wishlist"}
              className={`${
                path === "/p-user/wishlist" && styles.sidebar_link_active
              }`}
            >
              <FaHeart />
              علاقه مندی
            </Link>
            <Link
              href={"/p-user/account-details"}
              className={`${
                path === "/p-user/account-details" && styles.sidebar_link_active
              }`}
            >
              <TbListDetails />
              جزئیات اکانت
            </Link>
          </>
        ) : (
          <>
            <Link href={"/p-admin"} className={styles.sidebar_link_active}>
              <ImReply />
              پیشخوان
            </Link>

            <Link href={"/p-admin/products"}>
              <FaShoppingBag />
              محصولات
            </Link>
            <Link href={"/p-admin/users"}>
              <FaUsers />
              کاربران
            </Link>
            <Link href={"/p-admin/comments"}>
              <FaComments />
              کامنت ها
            </Link>

            <Link href={"/p-admin/tickets"}>
              <MdSms />
              تیکت ها
            </Link>
            <Link href={"/p-admin/discount"}>
              <MdOutlineAttachMoney />
              تخفیفات
            </Link>
          </>
        )}
      </ul>
      <div className={styles.logout} onClick={logoutHandler}>
        <MdLogout />
        خروج
      </div>
    </aside>
  );
};

export default Sidebar;

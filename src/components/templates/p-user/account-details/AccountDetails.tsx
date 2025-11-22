"use client";
import React, { useEffect } from "react";
import styles from "@/styles/p-user/accountDetails.module.css";
import swal from "sweetalert";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { useState } from "react";
import { showSwal } from "@/utils/helpers";
import { validateEmail, validatePhone } from "@/utils/auth";
import { useRouter } from "next/navigation";

const  AccountDetails = () => {
  const router = useRouter();
  const [input, setInput] = useState<{
    name: string;
    phoneNumber: string;
    email: string;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const getUserData = async () => {
    const response = await fetch("/api/auth/me");
    const data = await response.json();
    return setInput({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const updateUser = async () => {
    if (
      !input.name.trim() ||
      !input.email.trim() ||
      !input.phoneNumber.trim()
    ) {
      return showSwal("لطفا مقادیر با دقت پر فرمایید", "error", "باشه");
    }

    const isValidEmail = validateEmail(input.email);
    if (!isValidEmail) {
      return showSwal("لطفا ایمیل معتبر وارد فرمایید", "error", "باشه");
    }

    const isValidPhoneNumber = validatePhone(input.phoneNumber);
    if (!isValidPhoneNumber) {
      return showSwal("لطفا شماره موبایل معتبر وارد فرمایید", "error", "باشه");
    }

    const response = await fetch("/api/account-details", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showSwal("اطلاعات شما بروزرسانی شد ...", "success", "باشه");
      router.refresh();
    }
  };

  return (
    <main>
      <div className={styles.details}>
        <h1 className={styles.title}>
          <span> جزئیات اکانت</span>
        </h1>
        <div className={styles.details_main}>
          <section>
            <div>
              <label>نام کاربری</label>
              <input
                value={input.name}
                onChange={inputHandler}
                placeholder="لطفا نام کاربری خود را وارد کنید"
                type="text"
                name="name"
              />
            </div>
            <div>
              <label>ایمیل</label>
              <input
                value={input.email}
                onChange={inputHandler}
                placeholder="لطفا ایمیل خود را وارد کنید"
                type="text"
                name="email"
              />
            </div>
            <div>
              <label>شماره تماس</label>
              <input
                value={input.phoneNumber}
                type="text"
                onChange={inputHandler}
                name="phoneNumber"
                placeholder="لطفا شماره تماس خود را وارد کنید"
              />
            </div>
          </section>
          <section>
            <div className={styles.uploader}>
              <img src="/images/shahin.jpg" alt="" />
              <div>
                <div>
                  <button>
                    <IoCloudUploadOutline />
                    تغییر
                  </button>
                  <input type="file" name="" id="" />
                </div>
                <button>
                  <MdOutlineDelete />
                  حذف
                </button>
              </div>
            </div>
            <div>
              <label>رمز عبور</label>
              <div className={styles.password_group}>
                <input type="password" />
                <button>تغییر رمز عبور</button>
              </div>
            </div>
          </section>
        </div>
        <button
          type="submit"
          onClick={updateUser}
          className={styles.submit_btn}
        >
          ثبت تغییرات
        </button>
      </div>
    </main>
  );
};

export default AccountDetails;

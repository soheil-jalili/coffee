"use client";
import React, { useState } from "react";
import styles from "./form.module.css";
import ContactUsType from "@/types/contact-us-type";
import { showSwal } from "@/utils/helpers";
import { validateEmail, validatePhone } from "@/utils/auth";

const Form = () => {
  const [input, setInput] = useState<ContactUsType>({
    email: "",
    fullName: "",
    companyName: "",
    phoneNumber: "",
    message: "",
  });

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const send = async (event: React.MouseEvent) => {
    event.preventDefault();
    const isValidEmail = validateEmail(input.email);
    const isValidPhoneNumber = validatePhone(input.phoneNumber);
    if (!input.email.trim()) {
      return showSwal("لطفا ایمیل خود را وارد فرمایید", "error", "باشه");
    } else if (!isValidEmail) {
      return showSwal("لطفا ایمیل معتبر وارد فرمایید", "error", "باشه");
    } else if (!input.fullName.trim()) {
      return showSwal(
        "لطفا نام و نام خانوادگی خود را وارد فرمایید",
        "error",
        "باشه"
      );
    } else if (!input.phoneNumber.trim()) {
      return showSwal("لطفا شماره تماس خود را وارد فرمایید", "error", "باشه");
    } else if (!isValidPhoneNumber) {
      return showSwal("لطفا شماره تماس معتبر وارد فرمایید", "error", "باشه");
    } else if (!input.message.trim()) {
      return showSwal("لطفا درخواست خود را وارد فرمایید", "error", "باشه");
    }

    const response = await fetch("/api/contact-us", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      showSwal("اطلاعات شما با موفقیت برای ما ارسال شد ...", "success", "باشه");
      setInput({
        email: "",
        fullName: "",
        companyName: "",
        phoneNumber: "",
        message: "",
      });
    }
  };

  return (
    <form className={styles.form}>
      <span>فرم تماس با ما</span>
      <p>برای تماس با ما می توانید فرم زیر را تکمیل کنید</p>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>نام و نام خانوادگی</label>
          <input
            type="text"
            onChange={inputHandler}
            name="fullName"
            value={input.fullName}
          />
        </div>
        <div className={styles.group}>
          <label>آدرس ایمیل</label>
          <input
            type="text"
            onChange={inputHandler}
            name="email"
            value={input.email}
          />
        </div>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>شماره تماس</label>
          <input
            type="text"
            onChange={inputHandler}
            name="phoneNumber"
            value={input.phoneNumber}
          />
        </div>
        <div className={styles.group}>
          <label>نام شرکت</label>
          <input
            type="text"
            onChange={inputHandler}
            name="companyName"
            value={input.companyName}
          />
        </div>
      </div>
      <div className={styles.group}>
        <label>درخواست شما</label>
        <textarea
          id=""
          cols={30}
          rows={3}
          onChange={inputHandler}
          name="message"
          value={input.message}
        ></textarea>
      </div>
      <button onClick={send}>ارسال</button>
    </form>
  );
};

export default Form;

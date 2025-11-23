"use client";
import { useState } from "react";
import styles from "./sms.module.css";
import { showSwal } from "@/utils/helpers";
import { useRouter } from "next/navigation";

type Prop = {
  hideOtpForm: () => void;
  phoneNumber: string;
  name: string;
  email: string;
};

const Sms = ({ hideOtpForm, phoneNumber, name, email }: Prop) => {
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const registerWithOtp = async () => {
    const response = await fetch("/api/auth/sms/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        code: code.trim(),
        email: email.trim(),
      }),
    });

    const { message } = await response.json();
    if (response.status === 409) {
      return showSwal("کد شما معتبر نیست", "error", "تلاش مجدد");
    } else if (response.status === 422) {
      return showSwal("شماره موبایل شما معتبر نیست", "error", "تلاش مجدد");
    } else if (response.status === 404) {
      return showSwal("شماره موبایل شما معتبر نیست", "error", "تلاش مجدد");
    } else if (response.status === 410) {
      return showSwal("کد شما منقضی شده است", "error", "تلاش مجدد");
    }

    if (response.status === 200) {
      return showSwal(
        "ثبت نام شما با موفقیت انجام شد",
        "success",
        "ورود به پنل"
      ).then(() => {
        router.replace("/p-user");
        router.refresh();
      });
    }
  };
  return (
    <>
      <div className={styles.form}>
        <p>کد تایید</p>
        <span className={styles.code_title}>
          لطفاً کد تأیید ارسال شده را تایپ کنید
        </span>
        <span className={styles.number}>{phoneNumber}</span>
        <input
          className={styles.input}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          style={{ marginTop: "1rem" }}
          className={styles.btn}
          onClick={registerWithOtp}
        >
          ثبت کد تایید
        </button>
        <p className={styles.send_again_code}>ارسال مجدد کد یکبار مصرف</p>
      </div>
      <p
        className={styles.redirect_to_home}
        onClick={() => {
          hideOtpForm();
        }}
      >
        لغو
      </p>
    </>
  );
};

export default Sms;

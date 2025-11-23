"use client";
import { useState } from "react";
import styles from "./sms.module.css";
import { showSwal } from "@/utils/helpers";
import { useRouter } from "next/navigation";

type Prop = {
  hideOtpForm: () => void;
  phoneNumber: string;
};

const SmsLogin = ({ hideOtpForm, phoneNumber }: Prop) => {
  const [code, setCode] = useState<string>("");
  const router = useRouter();

  const loginWithOtp = async () => {
    const response = await fetch("/api/auth/sms/login/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: phoneNumber.trim(),
        code: code.trim(),
      }),
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        await showSwal("ورود موفق", "success", "باشه");
        router.replace("/p-user");
        router.refresh();
        break;
      case 422:
        showSwal("شماره موبایل معتبر نیست", "error", "باشه");
        break;
      case 404:
        showSwal("کاربر پیدا نشد", "error", "باشه");
        break;
      case 409:
        showSwal("کد وارد شده اشتباه است", "error", "باشه");
        break;
      case 410:
        showSwal("کد منقضی شده است", "error", "باشه");
        break;
      default:
        showSwal(data.message || "خطای ناشناخته", "error", "باشه");
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
          className={styles.btn}
          style={{ marginTop: "1rem" }}
          onClick={loginWithOtp}
        >
          ورود
        </button>
        <p className={styles.send_again_code}>ارسال مجدد کد یکبار مصرف</p>
      </div>
      <p className={styles.redirect_to_home} onClick={hideOtpForm}>
        لغو
      </p>
    </>
  );
};

export default SmsLogin;

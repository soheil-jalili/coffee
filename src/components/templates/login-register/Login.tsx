import React, { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Sms from "./Sms";
import { showSwal } from "@/utils/helpers";
import { validateEmail, validatePassword } from "@/utils/auth";
import { redirect, RedirectType } from "next/navigation";
import { useRouter } from "next/navigation";

type LoginType = {
  showRegisterForm: () => void;
};

const Login = ({ showRegisterForm }: LoginType) => {
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);
  const hideOtpForm = () => setIsLoginWithOtp(false);
  const [user, setUser] = useState<{
    phoneOrEmail: string;
    password: string;
  }>({
    phoneOrEmail: "",
    password: "",
  });

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();

  const loginWithPassword = async () => {
    if (!user.phoneOrEmail.trim()) {
      return showSwal(
        "یوزرنیم یا شماره تماس خود را وارد فرمایید",
        "error",
        "تلاش مجدد"
      );
    }

    if (!user.password.trim()) {
      return showSwal("پسورد خود را وارد فرمایید", "error", "تلاش مجدد");
    }

    const isValidEmail = validateEmail(user.phoneOrEmail);
    if (!isValidEmail) {
      return showSwal("ایمیل یا شماره تماس معتبر نیست", "error", "تلاش مجدد");
    }

    const isValidPassword = validatePassword(user.password);
    if (!isValidPassword) {
      return showSwal("پسورد معتبر وارد فرمایید", "error", "تلاش مجدد");
    }

    const url = "/api/auth/signin/";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: user.phoneOrEmail,
        password: user.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { message } = await response.json();
    if (response.status === 200) {
      showSwal(message, "success", "ورود به پنل ").then((result) => {
        if (result) {
          router.replace("/p-user");
        } else {
          router.replace("/");
          router.refresh();
        }
      });
    } else {
      showSwal(message, "error", "تلاش مجدد");
    }
  };

  return (
    <>
      {!isLoginWithOtp ? (
        <>
          <div className={styles.form}>
            <input
              className={styles.input}
              type="text"
              placeholder="ایمیل/شماره موبایل"
              name="phoneOrEmail"
              onChange={inputHandler}
              value={user.phoneOrEmail}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="رمز عبور"
              name="password"
              onChange={inputHandler}
              value={user.password}
            />
            <div className={styles.checkbox}>
              <input type="checkbox" name="" id="" />
              <p>مرا به یاد داشته باش</p>
            </div>
            <button className={styles.btn} onClick={loginWithPassword}>
              ورود
            </button>
            <Link href={"/forget-password"} className={styles.forgot_pass}>
              رمز عبور را فراموش کرده اید؟
            </Link>
            <button
              className={styles.btn}
              onClick={() => setIsLoginWithOtp(true)}
            >
              ورود با کد یکبار مصرف
            </button>
            <span>ایا حساب کاربری ندارید؟</span>
            <button className={styles.btn_light} onClick={showRegisterForm}>
              ثبت نام
            </button>
          </div>
          <Link href={"/"} className={styles.redirect_to_home}>
            لغو
          </Link>
        </>
      ) : (
        <Sms hideOtpForm={hideOtpForm} />
      )}
    </>
  );
};

export default Login;

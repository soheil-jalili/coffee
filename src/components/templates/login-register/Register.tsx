import styles from "./register.module.css";
import React, { useState } from "react";
import Sms from "./Sms";
import UserType from "@/types/user-type";
import { showSwal } from "@/utils/helpers";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";
import { useRouter } from "next/navigation";

type RegisterType = {
  showloginForm: () => void;
};

const Register = ({ showloginForm }: RegisterType) => {
  const router = useRouter();
  const [isRegisterWithOtp, setIsRegisterWithOtp] = useState(false);
  const [isRegisterWithPassword, setIsRegisterWithPassword] = useState(false);

  const registerWithOtp = () => setIsRegisterWithOtp(true);
  const registerWithPassword = () => setIsRegisterWithPassword(true);

  const hideOtpForm = () => setIsRegisterWithOtp(false);

  const [user, setUser] = useState<UserType>({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const signup = async () => {
    if (!user.name.trim()) {
      return showSwal(
        "لطفا نام خود را وارد فرمایید",
        "error",
        "تلاش مجدد بیناموس"
      );
    }

    const isValidPhoneNumber = validatePhone(user.phoneNumber);
    if (!isValidPhoneNumber) {
      return showSwal(
        "شماره موبایل شما معتبر نیست",
        "error",
        "تلاش مجدد بیناموس"
      );
    }

    if (user.email?.length !== 0) {
      const isValidEmail = validateEmail(user.email!);
      if (!isValidEmail) {
        return showSwal("ایمیل شما معتبر نیست", "error", "تلاش مجدد بیناموس");
      }
    }

    if (isRegisterWithPassword) {
      const isValidPassword = validatePassword(user.password!);
      if (!isValidPassword) {
        return showSwal("پسورد شما معتبر نیست", "error", "تلاش مجدد بیناموس");
      }

      const url = "/api/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        showSwal(
          "ثبت نام با موفقیت انجام شد",
          "success",
          "ورود به پنل کاربری"
        ).then((res) => {
          if (res) {
            router.replace("/p-user");
          } else {
            router.replace("/");
          }
          router.refresh();
        });
      } else {
        const { message } = await response.json();
        showSwal(message, "error", "تلاش مجدد بیناموس");
      }
    }
  };

  const sendOtp = async () => {
    const isValidPhoneNumber = validatePhone(user.phoneNumber);
    if (!isValidPhoneNumber) {
      return showSwal(
        "شماره موبایل شما معتبر نیست",
        "error",
        "تلاش مجدد بیناموس"
      );
    }
    const response = await fetch("/api/auth/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: user.phoneNumber,
        email: user.email,
      }),
    });

    const { message } = await response.json();

    if (response.status === 409 && message === "Email exist ...") {
      return showSwal("این ایمیل قبلاً ثبت شده", "error", "باشه");
    }

    if (response.status === 409) {
      return showSwal("این شماره قبلاً ثبت شده", "error", "باشه").then(
        (res) => {
          showloginForm();
        }
      );
    }

    if (response.status === 422) {
      return showSwal("شماره معتبر نیست", "error", "باشه");
    }

    if (response.status !== 201) {
      return showSwal("خطا در ارسال کد", "error", "باشه");
    }

    return showSwal("کد ورود با موفقیت ارسال شد", "success", "باشه").then(() =>
      registerWithOtp()
    );
  };
  return (
    <>
      {!isRegisterWithOtp ? (
        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="نام"
            onChange={inputHandler}
            value={user.name}
            name="name"
          />
          <input
            className={styles.input}
            type="text"
            placeholder="شماره موبایل  "
            onChange={inputHandler}
            value={user.phoneNumber}
            name="phoneNumber"
          />
          <input
            className={styles.input}
            type="email"
            placeholder="ایمیل (دلخواه)"
            onChange={inputHandler}
            value={user.email}
            name="email"
          />
          {isRegisterWithPassword && user.name.length !== 0 && (
            <input
              className={styles.input}
              type="password"
              placeholder="رمز عبور"
              onChange={inputHandler}
              value={user.password}
              name="password"
            />
          )}
          <p
            style={{ marginTop: "1rem" }}
            className={styles.btn}
            onClick={sendOtp}
          >
            ثبت نام با کد تایید
          </p>
          <button
            style={{ marginTop: ".7rem" }}
            className={styles.btn}
            onClick={() => {
              registerWithPassword();
              signup();
            }}
          >
            ثبت نام با رمزعبور
          </button>
          <p className={styles.back_to_login} onClick={showloginForm}>
            برگشت به ورود
          </p>
          <p className={styles.redirect_to_home}>لغو</p>
        </div>
      ) : (
        <Sms
          hideOtpForm={hideOtpForm}
          phoneNumber={user.phoneNumber}
          name={user.name}
          email={user.email!}
        />
      )}
    </>
  );
};

export default Register;

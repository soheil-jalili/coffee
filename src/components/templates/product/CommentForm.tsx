"use client";
import { IoMdStar } from "react-icons/io";
import styles from "./commentForm.module.css";
import React, { useEffect, useState } from "react";
import { showSwal } from "@/utils/helpers";
import { validateEmail } from "@/utils/auth";
import { useRouter } from "next/navigation";
const CommentForm = ({
  _id,
  emailLoginUser,
}: {
  _id: string;
  emailLoginUser: string;
}) => {
  const [userRate, setUserRate] = useState<number>(1);
  const [hoverRate, setHoverRate] = useState(1);
  const [remember, setRemember] = useState<boolean>(false);

  const [input, setInput] = useState<{
    username: string;
    body?: string;
    email: string;
  }>({
    username: "",
    body: "",
    email: emailLoginUser ? emailLoginUser : "",
  });

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };
  const router = useRouter();
  const submitComment = async () => {
    if (!input.body!.trim() || !input.email.trim() || !input.username.trim()) {
      return showSwal("مقادیر با دقت پر کنید", "error", "باشه");
    }
    const isValidEmail = validateEmail(input.email);
    if (!isValidEmail) {
      return showSwal("ایمیل شما معبر نیست", "error", "باشه");
    }
    const response = await fetch("/api/comments/", {
      method: "POST",
      body: JSON.stringify({
        username: input.username,
        body: input.body,
        email: input.email,
        productId: _id,
        rate: userRate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      showSwal("کامنت با موفقیت ثبت شد", "success", "باشه");
      setUserRate(1);
      setHoverRate(1);
    } else if (response.status === 401 || response.status === 403) {
      showSwal(
        "شما مجاز به کامنت گذاشتن نیستید اول باید ورود کنید ...",
        "error",
        "باشه"
      ).then((res) => {
        if (res) {
          router.push("/login-register");
        }
      });
    }
    setInput({
      body: "",
      username: input.username,
      email: input.email,
    });
  };

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setRemember(checked);
    if (event.target.checked) {
      localStorage.setItem(
        "comment-form-product-id",
        JSON.stringify({
          email: emailLoginUser || input.email,
          username: input.username,
        })
      );
    } else {
      localStorage.removeItem("comment-form-product-id");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("comment-form-product-id");
    setRemember(Boolean(saved));
  }, []);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("comment-form-product-id") || "{}"
    );

    setInput({
      email: emailLoginUser || user.email || "",
      username: user.username || "",
    });
  }, [emailLoginUser]);

  return (
    <div className={styles.form}>
      <p className={styles.title}>دیدگاه خود را بنویسید</p>
      <p>
        نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری شده‌اند{" "}
        <span style={{ color: "red" }}>*</span>
      </p>
      <div className={styles.rate}>
        <p>امتیاز شما :</p>
        <div>
          {Array.from({ length: 5 }).map((_, index) => {
            const rating = index + 1;

            return (
              <IoMdStar
                key={index}
                size={24}
                color={rating <= (hoverRate || userRate) ? "orange" : "#eee"}
                onClick={() => setUserRate(rating)}
                onMouseEnter={() => setHoverRate(rating)}
                onMouseLeave={() => setHoverRate(0)}
                style={{ cursor: "pointer", transition: "color 0.2s" }}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.group}>
        <label htmlFor="">
          دیدگاه شما
          <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          value={input.body}
          onChange={inputHandler}
          name="body"
          id="comment"
          cols={45}
          rows={8}
          required
          placeholder=""
        ></textarea>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label htmlFor="">
            نام
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={input.username}
            onChange={inputHandler}
            name="username"
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">
            ایمیل
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            value={input.email}
            onChange={inputHandler}
            name="email"
          />
        </div>
      </div>
      <div className={styles.checkbox}>
        <input type="checkbox" checked={remember} onChange={checkboxHandler} />

        <p>
          {" "}
          ذخیره نام، ایمیل و وبسایت من در مرورگر برای زمانی که دوباره دیدگاهی
          می‌نویسم.
        </p>
      </div>
      <button onClick={submitComment}>ثبت</button>
    </div>
  );
};

export default CommentForm;

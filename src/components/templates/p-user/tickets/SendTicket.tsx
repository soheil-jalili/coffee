"use client";
import { IoIosSend } from "react-icons/io";
import mongoose from "mongoose";
import styles from "@/styles/p-user/sendTicket.module.css";
import React, { useState } from "react";
import { showSwal } from "@/utils/helpers";
import { useRouter } from "next/navigation";

const SendTicket = ({
  mainDepartments,
  subDepartments,
}: {
  mainDepartments: {
    _id: mongoose.Types.ObjectId;
    title: string;
  }[];

  subDepartments: {
    _id: mongoose.Types.ObjectId;
    title: string;
    department: mongoose.Types.ObjectId;
  }[];
}) => {
  const router = useRouter();
  const [input, setInput] = useState<{
    department: string;
    subDepartment: string;
    title: string;
    priority: string;
    body: string;
  }>({
    department: "",
    subDepartment: "",
    title: "",
    priority: String(-1),
    body: "",
  });

  const inputHandler = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "department") {
      const filtered = subDepartments.filter(
        (item) => item.department.toString() === value
      );
      setInput((prev) => ({
        ...prev,
        department: value,
        subDepartment: filtered.length > 0 ? filtered[0]._id.toString() : "",
      }));
      return;
    }

    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const sendTicket = async () => {
    if (
      !input.title.trim() ||
      !input.department.trim() ||
      !input.subDepartment.trim() ||
      !input.body.trim()
    ) {
      return showSwal("لطفا مقادیر با دقت پر فرمایید", "error", "باشه");
    }

    if (!mongoose.Types.ObjectId.isValid(input.department)) {
      return showSwal("لطفا دپارتمان خود را مشخص فرمایید", "error", "باشه");
    }
    if (!mongoose.Types.ObjectId.isValid(input.subDepartment)) {
      return showSwal("لطفا نوع تیکت خود را مشخص فرمایید", "error", "باشه");
    }

    if (input.priority === String(-1)) {
      return showSwal("لطفا سطح اولویت را مشخص فرمایید", "error", "باشه");
    } else if (!["1", "2", "3"].includes(input.priority)) {
      return showSwal("لطفا سطح اولویت را مشخص فرمایید", "error", "باشه");
    }

    const response = await fetch("/api/tickets", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        priority: Number(input.priority),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { message } = await response.json();
    if (response.status === 201) {
      showSwal("تیکت شما با موفقیت ارسال شد", "success", "باشه").then((res) => {
        router.replace("/p-user/tickets");
      });
    } else {
      showSwal(message, "error", "باشه");
    }
  };

  const filteredSubs = subDepartments.filter(
    (item) => item.department.toString() === input.department.toString()
  );

  return (
    <>
      <div className={styles.content}>
        <div className={styles.group}>
          <label>دپارتمان را انتخاب کنید:</label>
          <select
            name="department"
            value={input.department}
            onChange={inputHandler}
          >
            <option value="">لطفا دپارتمان مورد را انتخاب نمایید.</option>
            {mainDepartments.map((dep) => (
              <option key={dep._id.toString()} value={dep._id.toString()}>
                {dep.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label>نوع تیکت را انتخاب کنید:</label>
          <select
            name="subDepartment"
            value={input.subDepartment}
            onChange={inputHandler}
          >
            {input.department ? (
              filteredSubs.length === 0 ? (
                <option value="no-data">فعلاً دیتایی موجود نیست</option>
              ) : (
                filteredSubs.map((item) => (
                  <option key={item._id.toString()} value={item._id.toString()}>
                    {item.title}
                  </option>
                ))
              )
            ) : (
              <option value="">لطفا یک مورد را انتخاب نمایید.</option>
            )}
          </select>
        </div>

        <div className={styles.group}>
          <label>عنوان تیکت را وارد کنید:</label>
          <input
            placeholder="عنوان..."
            type="text"
            name="title"
            value={input.title}
            onChange={inputHandler}
          />
        </div>

        <div className={styles.group}>
          <label>سطح اولویت تیکت را انتخاب کنید:</label>
          <select
            name="priority"
            value={input.priority}
            onChange={inputHandler}
          >
            <option value={-1}>لطفا یک مورد را انتخاب نمایید.</option>
            <option value={1}>بالا</option>
            <option value={2}>متوسط</option>
            <option value={3}>کم</option>
          </select>
        </div>
      </div>

      <div className={styles.group}>
        <label>محتوای تیکت را وارد نمایید:</label>
        <textarea
          rows={10}
          name="body"
          value={input.body}
          onChange={inputHandler}
        />
      </div>

      <div className={styles.uploader}>
        <span>حداکثر اندازه: 6 مگابایت</span>
        <span>فرمت‌های مجاز: jpg, png.jpeg, rar, zip</span>
        <input type="file" />
      </div>

      <button onClick={sendTicket} className={styles.btn}>
        <IoIosSend />
        ارسال تیکت
      </button>
    </>
  );
};

export default SendTicket;

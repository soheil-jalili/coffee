"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import UserType from "@/types/user-type";
import mongoose from "mongoose";
import { showSwal } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function DataTable({
  users,
  title,
}: {
  users: UserType[];
  title: string;
}) {
  const router = useRouter();

  const changeUserRole = async (_id: mongoose.Types.ObjectId) => {
    return showSwal("آیا از تغییر نقش کاربر مطمن هستید ؟", "warning", [
      "خیر",
      "آره حاجی",
    ]).then(async (res) => {
      if (res) {
        const url = "/api/users/role";
        const response = await fetch(url, {
          method: "PUT",
          body: JSON.stringify({
            _id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          return showSwal(
            "نقش کاربر با موفقیت تغییر کرد",
            "success",
            "باشه"
          ).then((res) => {
            router.refresh();
          });
        }
        const { message } = await response.json();
        return showSwal(message, "error", "باشه");
      }
    });
  };
  const deleteUser = async (_id: mongoose.Types.ObjectId) => {
    showSwal("آیا از حذف کاربر مطمن هستید ؟", "warning", ["خیر", "آره"]).then(
      async (res) => {
        if (res) {
          const url = "/api/users/delete";
          const response = await fetch(url, {
            method: "DELETE",
            body: JSON.stringify({
              _id,
            }),
          });
          if (response.status === 200) {
            return showSwal(
              "نقش کاربر با موفقیت حذف شد",
              "success",
              "باشه"
            ).then((res) => {
              router.refresh();
            });
          }
          const { message } = await response.json();
          return showSwal(message, "error", "باشه");
        }
      }
    );
  };

  const banUser = async (email: string, phoneNumber: string) => {
    showSwal("آیا از بن کردن کاربر مطمن هستید ؟", "warning", [
      "خیر",
      "آره",
    ]).then(async (res) => {
      if (res) {
        const url = "/api/users/ban";
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email,
            phoneNumber,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const { message } = await response.json();

        if (response.status === 201) {
          return showSwal("کاربر با موفقیت بن شد", "success", "باشه").then(
            (res) => {
              router.refresh();
            }
          );
        }

        return showSwal(message, "error", "باشه");
      }
    });
  };

  const updateUser = async (
    _id: mongoose.Types.ObjectId,
    name: string,
    email: string
  ) => {
    Swal.fire({
      title: "ویرایش اطلاعات کاربر",
      html: `
      <input id="swal-name" class="swal2-input" placeholder="نام جدید" value="${name}">
      <input id="swal-email" class="swal2-input" placeholder="ایمیل جدید" value="${email}">
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "ویرایش",
      cancelButtonText: "انصراف",
      preConfirm: () => {
        const newName = (
          document.getElementById("swal-name") as HTMLInputElement
        ).value;
        const newEmail = (
          document.getElementById("swal-email") as HTMLInputElement
        ).value;

        if (!newName) {
          Swal.showValidationMessage("فیلد نام را پر کنید");
          return false;
        }

        return { name: newName, email: newEmail.length === 0 ? "" : newEmail };
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const { name: newName, email: newEmail } = result.value!;

      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, name: newName, email: newEmail }),
      });

      const { message } = await response.json();

      if (response.status === 200) {
        return Swal.fire({
          title: "کاربر با موفقیت ویرایش شد",
          icon: "success",
          confirmButtonText: "باشه",
        }).then(() => router.refresh());
      }

      return Swal.fire({
        title: message,
        icon: "error",
        confirmButtonText: "باشه",
      });
    });
  };

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{title}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام و نام خانوادگی</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>ویرایش</th>
              <th>تغییر سطح</th>
              <th>حذف</th>
              <th>بن</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id!.toString()}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email ? user.email : "ایمیل یافت نشد"}</td>
                <td>{user.role === "USER" ? "کاربر عادی" : "مدیر"}</td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => {
                      updateUser(
                        user._id!,
                        user.name,
                        user.email ? user.email : "خالی"
                      );
                    }}
                  >
                    ویرایش
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => changeUserRole(user._id!)}
                  >
                    تغییر نقش
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => deleteUser(user._id!)}
                  >
                    حذف
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => banUser(user.email!, user.phoneNumber)}
                  >
                    بن
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

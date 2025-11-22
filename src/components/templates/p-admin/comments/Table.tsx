"use client";
import React from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";
import CommentType from "@/types/comment-type";
import mongoose from "mongoose";
export default function DataTable({
  comments,
  title,
}: {
  comments: CommentType[];
  title: string;
}) {
  const router = useRouter();

  const showCommentBody = (body: string) => {
    showSwal(body, undefined, "بستن");
  };

  const deleteComment = async (_id: mongoose.Types.ObjectId) => {
    const res = await showSwal("آیا از حذف این کامنت مطمن هستید ؟", "warning", [
      "خیر",
      "بله",
    ]);
    if (res) {
      await fetch("/api/comments/delete", {
        method: "DELETE",
        body: JSON.stringify({ _id }),
      });

      return showSwal("کامنت با موفقیت حذف شد", "success", "باشه").then((_) => {
        router.refresh();
      });
    }
  };

  const acceptCommentUser = async (_id: mongoose.Types.ObjectId) => {
    const res = await showSwal(
      "آیا از تایید یا رد این کامنت مطمن هستید ؟",
      "warning",
      ["خیر", "بله"]
    );
    if (res) {
      const response = await fetch("/api/comments/accept", {
        method: "PUT",
        body: JSON.stringify({ _id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();

      return showSwal(
        message === "Comment Disabled ..."
          ? "کامنت رد شد"
          : "کامنت با موفقیت تایید شد",
        "success",
        "باشه"
      ).then((_) => {
        router.refresh();
      });
    }
  };

  const userBan = async (phoneNumber: string, email: string) => {
    return showSwal("آیا از بن کردن این کاربر هستید ؟", "warning", [
      "خیر",
      "آره",
    ])
      .then(async (res) => {
        if (res) {
          const response = await fetch("/api/users/ban", {
            method: "POST",
            body: JSON.stringify({ phoneNumber, email }),
          });
          if (response.status === 422) {
            return showSwal("کاربر قبلا بن شده است", "error", "باشه");
          }
          showSwal("کاربر با موفقیت بن شد", "success", "باشه");
        }
      })
      .then((res) => {
        router.refresh();
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
              <th>کاربر</th>
              <th>ایمیل</th>
              <th>امتیاز</th>
              <th>محصول</th>
              <th>تاریخ ثبت</th>
              <th>مشاهده</th>
              <th>ویرایش</th>
              <th>حذف</th>
              <th>تایید</th>
              <th>پاسخ</th>
              <th>بن</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment: CommentType, index) => (
              <tr key={comment._id.toString()}>
                <td
                  style={{
                    backgroundColor: comment.isAccept ? "green" : "red",
                    color: "white",
                  }}
                >
                  {index + 1}
                </td>
                <td>{comment.username}</td>
                <td>{comment.email}</td>
                <td>{comment.rate}</td>
                <td>{comment.productId!.name}</td>
                <td>{new Date(comment.date).toLocaleDateString("fa-IR")}</td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => showCommentBody(comment.body)}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  <button type="button" className={styles.edit_btn}>
                    ویرایش
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => deleteComment(comment._id)}
                  >
                    حذف
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => acceptCommentUser(comment._id)}
                  >
                    {comment.isAccept ? "رد" : "تایید"}
                  </button>
                </td>
                <td>
                  <button type="button" className={styles.delete_btn}>
                    پاسخ
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() =>
                      userBan(comment.user?.phoneNumber!, comment.user?.email!)
                    }
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

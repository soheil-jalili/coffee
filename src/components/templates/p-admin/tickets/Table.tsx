"use client";
import React from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";
import { TicketType } from "@/types/ticket-type";
import mongoose from "mongoose";
export default function DataTable({
  tickets,
  title,
}: {
  tickets: TicketType[];
  title: string;
}) {
  const router = useRouter();

  const showTicketBody = (body: string) => {
    showSwal(body, undefined, "بستن");
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

  const answerTicket = async (ticket: TicketType) => {
    swal({
      title: "لطفا پاسخ مورد نظر را وارد کنید :",
      content: "input",
      buttons: "ثبت پاسخ",
    }).then(async (answer) => {
      if (answer) {
        const response = await fetch("/api/tickets/answer", {
          method: "POST",
          body: JSON.stringify({
            title: ticket.title,
            body: answer,
            department: ticket.department,
            subDepartment: ticket.subDepartment,
            priority: ticket.priority,
            user: ticket.user?._id,
            ticketID: ticket._id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) {
          return showSwal("پاسخ ثبت شد", "success", "باشه").then((res) => {
            router.refresh();
          });
        }
      }
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
              <th>عنوان</th>
              <th>دپارتمان</th>
              <th>مشاهده</th>
              <th>پاسخ</th>
              <th>بن</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket: TicketType, index) => (
              <tr key={ticket._id.toString()}>
                <td>{index + 1}</td>
                <td>{ticket.user?.name}</td>
                <td>{ticket.title}</td>
                <td>{ticket.department.title}</td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => showTicketBody(ticket.body!)}
                  >
                    مشاهده
                  </button>
                </td>
                
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => answerTicket(ticket)}
                  >
                    پاسخ
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() =>
                      userBan(ticket.user?.phoneNumber!, ticket.user?.email!)
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

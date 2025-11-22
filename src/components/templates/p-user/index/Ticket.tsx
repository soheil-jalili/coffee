import Link from "next/link";
import styles from "./ticket.module.css";
import mongoose from "mongoose";
import { TicketType } from "@/types/ticket-type";

const Ticket = ({
  _id,
  title,
  body,
  createdAt,
  hasAnswer,
  department,
}: TicketType) => {
  return (
    <Link href={`/p-user/tickets/answer/${_id}`} className={styles.ticket}>
      <div>
        <p>{title}</p>
        <p className={styles.department}>{department.title}</p>
      </div>
      <div>
        <p>{new Date(createdAt).toLocaleDateString("fa-IR")}</p>
        <p className={styles.no_answer}>
          {" "}
          {hasAnswer ? "پاسخ داده شده است" : " پاسخ داده نشده"}
        </p>
        {/* answer */}
      </div>
    </Link>
  );
};

export default Ticket;

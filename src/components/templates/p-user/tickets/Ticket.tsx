import Link from "next/link";
import styles from "./ticket.module.css";
import { TicketType } from "@/types/ticket-type";

export const Ticket = ({
  _id,
  title,
  createdAt,
  department,
  hasAnswer,
}: TicketType) => {
  console.log(department);
  return (
    <Link href={`/p-user/tickets/answer/${_id}`} className={styles.ticket}>
      <div>
        <p>{title}</p>
        <p className={styles.department}>{department.title}</p>
      </div>
      <div>
        <p>{new Date(createdAt).toLocaleDateString("fa-IR")}</p>
        <p className={hasAnswer ? styles.has_answer : styles.no_answer}>
          {hasAnswer ? "پاسخ داده شده" : "پاسخ داده نشده"}
        </p>
        {/* answer */}
      </div>
    </Link>
  );
};

export default Ticket;

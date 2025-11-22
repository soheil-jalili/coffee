import { TicketType } from "@/types/ticket-type";
import Ticket from "./Ticket";
import styles from "./tickets.module.css";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const Tickets = ({ tickets }: { tickets: TicketType[] }) => {
  return (
    <div className={styles.content}>
      <div className={styles.content_details}>
        <p>تیکت های اخیر</p>
        <Link href="/p-user/tickets">
          همه تیکت ها <FaArrowLeft />
        </Link>
      </div>

      <div>
        {tickets.length !== 0 ? (
          tickets.map((ticket: TicketType) => (
            <Ticket key={ticket._id.toString()} {...ticket} />
          ))
        ) : (
          <p className={styles.empty}>تیکتی ثبت نشده</p>
        )}
      </div>
    </div>
  );
};

export default Tickets;

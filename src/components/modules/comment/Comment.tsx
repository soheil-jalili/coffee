import { FaStar } from "react-icons/fa";

import styles from "./comment.module.css";
import CommentType from "@/types/comment-type";
const Comment = ({ username, date, body, rate }: CommentType) => {
  return (
    <section className={styles.comment}>
      <img src="/images/shahin.jpg" className={styles.avatar} alt="" />
      <div>
        <div className={styles.main_details}>
          <div className={styles.user_info}>
            <strong>{username}</strong> <p>{new Date(date).toLocaleDateString('fa-IR')}</p>
          </div>
          <div className={styles.stars} style={{ marginRight: "1rem" }}>
            {Array.from({ length: 5 }).map((item, index: number) => {
            return index <= rate - 1 ? (
              <FaStar key={index} color="orange" />
            ) : (
              <FaStar key={index} color="#eee" />
            );
          })}
          </div>
        </div>
        <p>{body}</p>
      </div>
    </section>
  );
};

export default Comment;

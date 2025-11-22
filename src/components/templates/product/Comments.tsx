import Comment from "@/components/modules/comment/Comment";
import styles from "./comments.module.css";
import CommentForm from "./CommentForm";
import CommentType from "@/types/comment-type";

type Prop = {
  comments: CommentType[];
  name: string;
  _id: string;
  emailLoginUser: string;
};
const Comments = ({ comments, name, _id, emailLoginUser }: Prop) => {

  return (
    <div>
      <p>
        نظرات (
        {comments.filter((comment: CommentType) => comment.isAccept).length}) :
      </p>
      <hr />

      <main className={styles.comments}>
        <div className={styles.user_comments}>
          <p className={styles.title}>{name}</p>
          <div>
            {comments.map((comment: CommentType) => {
              return (
                comment.isAccept && <Comment {...comment} key={comment._id} />
              );
            })}
          </div>
        </div>
        <div className={styles.form_bg}>
          <CommentForm _id={_id} emailLoginUser={emailLoginUser} />
        </div>
      </main>
    </div>
  );
};

export default Comments;

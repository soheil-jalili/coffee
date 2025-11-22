import CommentType from "@/types/comment-type";

const averageScore = (comments: CommentType[]) => {
  let sum = 0;
  comments.map((comment: CommentType) => {
    sum += comment.rate;
  });

  return sum / comments.length;
};

export default averageScore;

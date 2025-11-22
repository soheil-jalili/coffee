import CommentType from "./comment-type";

type RelatedProduct = {
  _id: string;
  name: string;
  price: number;
  comments: CommentType[];
};

export default RelatedProduct;

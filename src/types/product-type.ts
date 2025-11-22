import mongoose from "mongoose";
import CommentType from "./comment-type";

type ProductType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  score: number;
  comments: CommentType[];
};

export default ProductType;

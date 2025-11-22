import mongoose from "mongoose";
import RelatedProduct from "./related-product";
import UserType from "./user-type";

type CommentType = {
  _id: mongoose.Types.ObjectId;
  username: string;
  body: string;
  email: string;
  rate: number;
  date: string;
  isAccept: boolean;
  productId?: RelatedProduct;
  user?: UserType;
};

export default CommentType;

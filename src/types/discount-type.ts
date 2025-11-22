import mongoose from "mongoose";
import ProductType from "./product-type";
import UserType from "./user-type";

type DiscountType = {
  _id: mongoose.Types.ObjectId;
  code: string;
  percent: number;
  maxUse: number;
  uses: number;
  product: ProductType;
  user: UserType;
};

export default DiscountType;

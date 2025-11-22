import mongoose from "mongoose";
import ProductType from "./product-type";

type DiscountType = {
  _id: mongoose.Types.ObjectId;
  code: string;
  percent: number;
  maxUse: number;
  uses: number;
  product: ProductType;
};

export default DiscountType;

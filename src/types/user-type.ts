import mongoose from "mongoose";

type UserType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  role?: string;
};

export default UserType;

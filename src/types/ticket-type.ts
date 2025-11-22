import mongoose from "mongoose";
import UserType from "./user-type";

export type TicketType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  createdAt: string;
  body?: string;
  department: {
    _id: mongoose.Types.ObjectId;
    title: string;
  };
  subDepartment?: {
    _id: mongoose.Types.ObjectId;
    title: string;
    department: mongoose.Types.ObjectId;
  };
  hasAnswer: boolean;
  user?: UserType;
  priority?: number;
};

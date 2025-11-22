import { cookies } from "next/headers";
import dbConnection from "../../../../../configs/db-connection";
import { verifyToken } from "@/utils/auth";
import UserModel from "../../../../../model/User";
import mongoose from "mongoose";
import WhishlistModel from "../../../../../model/Whishlist";
import { NextRequest } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: mongoose.Types.ObjectId } }
) => {
  try {
    dbConnection();
    const token = (await cookies()).get("token");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
    const { name } = verifyToken(token.value) as { name: string };
    const userMain = await UserModel.findOne({ name });
    if (!userMain) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const _id = params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return Response.json(
        { message: "your id is not correct baby ..." },
        { status: 422 }
      );
    }
    await WhishlistModel.findOneAndDelete({ _id });

    return Response.json({ message: "Delete Wishlist ..." }, { status: 200 });
  } catch (error) {
    console.log("Error in whishlist => ", error);
    return Response.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

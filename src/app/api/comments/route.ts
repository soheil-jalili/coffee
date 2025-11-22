import { NextRequest } from "next/server";
import dbConnection from "../../../../configs/db-connection";
import CommentModel from "../../../../model/Comment";
import { verifyToken } from "@/utils/auth";
import UserModel from "../../../../model/User";
import ProductModel from "../../../../model/Product";

export const POST = async (request: NextRequest) => {
  try {
    dbConnection();
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ message: "Unathorized" }, { status: 401 });
    }

    const { name } = verifyToken(token) as { name: string };
    const user = await UserModel.findOne({ name });
    if (!user) {
      return Response.json({ message: "Unathorized" }, { status: 403 });
    }
 
    const { username, body, email, rate, productId } = await request.json();
    const comment = await CommentModel.create({
      username,
      body,
      email: user.email ? user.email : email,
      rate,
      productId,
      user: user._id,
    });
    const updateProduct = await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          comments: comment._id,
        },
      }
    );

    return Response.json(
      { message: "Comment added", data: comment },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in add comment -> ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
export const GET = async (request: NextRequest) => {
  try {
    dbConnection();
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ message: "Aunthorized" }, { status: 401 });
    }

    const { name } = verifyToken(token) as { name: string };
    const user = await UserModel.findOne({ name });
    if (!user && user.role !== "ADMIN") {
      return Response.json({ message: "Access Denied" }, { status: 403 });
    }

    const comments = await CommentModel.find({}, "-__v");
    return Response.json(comments, {
      status: 200,
    });
  } catch (error) {
    console.log("Error in get comments -> ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

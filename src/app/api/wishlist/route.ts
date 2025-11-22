import { NextRequest } from "next/server";
import dbConnection from "../../../../configs/db-connection";
import { verifyToken } from "@/utils/auth";
import UserModel from "../../../../model/User";
import WhishlistModel from "../../../../model/Whishlist";
import ProductModel from "../../../../model/Product";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
  try {
    dbConnection();
    const token = (await cookies()).get("token");

    if (!token) {
      return Response.json({ message: "Aunthorized" }, { status: 403 });
    }
    const { name } = verifyToken(token.value) as { name: string };
    const userMain = await UserModel.findOne({ name });
    if (!userMain) {
      return Response.json({ message: "Aunthorized" }, { status: 403 });
    }

    const { product } = await request.json();
    if (!product.trim()) {
      return Response.json(
        { message: "Please Enter Correct Value" },
        { status: 422 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return Response.json({ message: "Product dont exist" }, { status: 404 });
    }

    const isInWhishList = await WhishlistModel.findOne({
      user: userMain._id,
      product,
    });

    if (isInWhishList) {
      return Response.json(
        { message: "product in whishlist exist ..." },
        { status: 422 }
      );
    }

    await WhishlistModel.create({ user: userMain._id, product });

    return Response.json(
      { message: "product add to whishlist successfully" },
      { status: 201 }
    );
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



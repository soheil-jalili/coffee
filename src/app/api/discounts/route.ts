import connectToDB from "@/configs/connect_Db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import UserModel from "../../../../model/User";
import DiscountModel from "../../../../model/Discount";
import ProductModel from "../../../../model/Product";

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB();

    const token = request.cookies.get("token");
    if (!token) {
      return Response.json(
        { message: "Token does not exist!" },
        { status: 403 }
      );
    }

    const { name } = verifyToken(token.value) as { name: string };
    const user = await UserModel.findOne({ name });

    if (!user) {
      return Response.json({ message: "User not found!" }, { status: 404 });
    }

    if (!name) {
      return Response.json({ message: "Token not valid!" }, { status: 403 });
    }

    if (user.role !== "ADMIN") {
      return Response.json(
        { message: "You cannot access this route" },
        { status: 403 }
      );
    }
    const { code, percent, maxUse, product } = await request.json();

    if (product && product.trim()) {
      const existIDProduct = await ProductModel.findOne({ _id: product });
      if (!existIDProduct) {
        return Response.json(
          { message: "id product not exist" },
          { status: 404 }
        );
      }
    }

    if (!code || code.trim() === "") {
      return Response.json(
        { message: "Discount code is required" },
        { status: 422 }
      );
    }

    if (!percent || percent <= 0 || percent > 100) {
      return Response.json(
        { message: "Percent is not correct" },
        { status: 422 }
      );
    }

    const existing = await DiscountModel.findOne({ code });
    if (existing) {
      return Response.json(
        { message: "This discount code already exists" },
        { status: 409 }
      );
    }

    await DiscountModel.create({
      code,
      percent,
      maxUse,
      product: product || null,
      user,
    });

    return Response.json({ message: "Discount created!" }, { status: 201 });
  } catch (error: any) {
    console.log("Discounts API ADD Error =>", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

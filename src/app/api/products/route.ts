import { NextRequest } from "next/server";
import dbConnection from "../../../../configs/db-connection";
import ProductModel from "../../../../model/Product";
import { verifyToken } from "@/utils/auth";
import UserModel from "../../../../model/User";
import fs from "fs";
import path from "path";

export const POST = async (request: NextRequest) => {
  try {
    dbConnection();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name: userName } = verifyToken(token) as { name: string };
    const user = await UserModel.findOne({ name: userName });

    if (user.role !== "ADMIN") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    const {
      name,
      price,
      shortDescription,
      longDescription,
      weight,
      suitableFor,
      smell,
      tags,
    } = await request.json();

    const product = await ProductModel.create({
      name,
      price,
      shortDescription,
      longDescription,
      weight,
      suitableFor,
      smell,
      tags,
    });

    return Response.json(
      { message: "Product add successfully ...", data: product },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in add product ->", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
export const GET = async (request: NextRequest) => {
  try {
    dbConnection();
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = verifyToken(token) as { name: string };
    const user = await UserModel.findOne({ name });

    if (user.role !== "ADMIN") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    const products = await ProductModel.find({}, "-__v").populate("comments");
    return Response.json(
      {
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in get product ->", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  const formData = await request.formData();
  const img = formData.get("img");

  if (!(img instanceof File)) {
    return Response.json({ message: "product has not image" }, { status: 400 });
  }

  try {
    // buffer
    const buffer = Buffer.from(await img.arrayBuffer());
    const fileName = Date.now() + img.name;

    await fs.promises.writeFile(
      path.join(process.cwd(), "public/uploads/" + fileName),
      buffer
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
  return Response.json({ message: "file uploaded" }, { status: 201 });
};

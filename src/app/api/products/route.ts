import { NextRequest } from "next/server";
import dbConnection from "../../../../configs/db-connection";
import ProductModel from "../../../../model/Product";
import { verifyToken } from "@/utils/auth";
import fs from "fs";
import path from "path";
import UserModel from "../../../../model/User";

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

    const formData = await request.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const shortDescription = formData.get("shortDescription");
    const longDescription = formData.get("longDescription");
    const weight = formData.get("weight");
    const suitableFor = formData.get("suitableFor");
    const smell = formData.get("smell");
    // const tags = JSON.parse(formData.get("tags")); // for postman
    const tags = formData.getAll("tags");
    const image = formData.get("img");

    if (!(image instanceof File)) {
      return Response.json({ message: "has not image" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const newNameImage =
      Date.now() +
      image.name
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w.-]/g, "");

    const imagePath = path.join(
      process.cwd(),
      "public/uploads/" + newNameImage
    );
    await fs.promises.writeFile(imagePath, buffer);

    const product = await ProductModel.create({
      name,
      price,
      shortDescription,
      longDescription,
      weight,
      suitableFor,
      smell,
      tags,
      img: `http://localhost:3000/uploads/${newNameImage}`,
    });

    return Response.json(
      { message: "Product add successfully ...", data: product },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("Error in add product ->", error);
    return Response.json({ message: error.message }, { status: 500 });
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
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
  return Response.json({ message: "file uploaded" }, { status: 201 });
};

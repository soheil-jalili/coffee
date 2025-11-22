import { NextRequest } from "next/server";
import dbConnection from "../../../../configs/db-connection";
import { verifyToken } from "@/utils/auth";
import UserModel from "../../../../model/User";
import DepartmentModel from "../../../../model/Department";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { title } = await request.json();
    if (!title.trim()) {
      return Response.json(
        { message: "Please Enter Value ..." },
        { status: 422 }
      );
    }

    const token = request.cookies.get("token");
    if (!token) {
      return Response.json(
        { message: "The token is invalid ..." },
        { status: 422 }
      );
    }

    const userPayLoad = verifyToken(token?.value!) as {
      name: string;
    };

    if (!userPayLoad) {
      return Response.json({ message: "Unauthorized ..." }, { status: 403 });
    }
    const user = await UserModel.findOne({ name: userPayLoad.name });
    if (!user) {
      return Response.json({ message: "Unauthorized ..." }, { status: 403 });
    }

    await DepartmentModel.create({
      title,
    });

    return Response.json({ message: "Department add" }, { status: 201 });
  } catch (error) {
    console.log("Error in Department => ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  try {
    await dbConnection();

    const token = request.cookies.get("token");
    if (!token) {
      return Response.json(
        { message: "The token is invalid ..." },
        { status: 422 }
      );
    }

    const userPayLoad = verifyToken(token?.value!) as {
      name: string;
    };

    if (!userPayLoad) {
      return Response.json({ message: "Unauthorized ..." }, { status: 401 });
    }
    const user = await UserModel.findOne({ name: userPayLoad.name });
    if (!user) {
      return Response.json({ message: "Unauthorized ..." }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return Response.json({ message: "Not access ..." }, { status: 403 });
    }

    const departments = await DepartmentModel.find({} , '-__v');

    return Response.json(departments, { status: 200 });
  } catch (error) {
    console.log("Error in Department => ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

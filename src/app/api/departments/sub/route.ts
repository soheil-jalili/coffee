import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import SubDepartmentModel from "../../../../../model/SubDepartment";
import mongoose from "mongoose";
import dbConnection from "../../../../../configs/db-connection";
import UserModel from "../../../../../model/User";
import DepartmentModel from "../../../../../model/Department";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { title, department } = await request.json();
    if (!title.trim()) {
      return Response.json(
        { message: "Please Enter Value ..." },
        { status: 422 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(department)) {
      return Response.json(
        { message: "Enter Correct ID ..." },
        { status: 403 }
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

    const departmentID = await DepartmentModel.findOne({ _id: department });
    if (!departmentID) {
      return Response.json(
        { message: "department id is not correct ..." },
        { status: 403 }
      );
    }

    await SubDepartmentModel.create({
      title,
      department: departmentID._id,
    });

    return Response.json({ message: "Sub Department add" }, { status: 201 });
  } catch (error) {
    console.log("Error in Sub Department => ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

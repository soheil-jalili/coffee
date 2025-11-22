import { NextRequest } from "next/server";
import dbConnection from "../../../../configs/db-connection";
import TicketModel from "../../../../model/Ticket";
import { verifyToken } from "@/utils/auth";
import UserModel from "../../../../model/User";

import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { department, subDepartment, title, priority, body, photo } =
      await request.json();
    if (!title.trim() || !body.trim()) {
      return Response.json(
        { message: "Please Enter Value ..." },
        { status: 422 }
      );
    }

    if (priority !== 1 && priority !== 2 && priority !== 3) {
      return Response.json({ message: "please enter 1 to 3" }, { status: 422 });
    }

    if (
      !mongoose.Types.ObjectId.isValid(department) ||
      !mongoose.Types.ObjectId.isValid(subDepartment)
    ) {
      return Response.json(
        {
          message: "the department or subDepartment id incorrect",
        },
        {
          status: 422,
        }
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

    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return Response.json(
        { message: "The user id incorrect !!!" },
        { status: 422 }
      );
    }

    await TicketModel.create({
      department,
      subDepartment,
      title,
      priority,
      body,
      user: user._id,
    });

    return Response.json({ message: "Ticket add" }, { status: 201 });
  } catch (error) {
    console.log("Error in Send Ticket => ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return Response.json({ message: "token invalid" }, { status: 401 });
    }
    const payloadToken = verifyToken(token.value) as { name: string };
    if (!payloadToken) {
      return Response.json({ message: "token invalid" }, { status: 401 });
    }

    const user = await UserModel.findOne({ name: payloadToken.name });
    if (!user) {
      return Response.json({ message: "invalid token" }, { status: 403 });
    }
    if (user.role !== "ADMIN") {
      return Response.json({ message: "you cant access" }, { status: 403 });
    }

    dbConnection();
    const tickets = await TicketModel.find({}, "-__v");
    return Response.json(tickets, { status: 200 });
  } catch (error) {
    console.log("Erro in get tickets => ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

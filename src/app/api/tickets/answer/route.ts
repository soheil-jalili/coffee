import { NextRequest } from "next/server";
import dbConnection from "../../../../../configs/db-connection";
import UserModel from "../../../../../model/User";
import { verifyToken } from "@/utils/auth";
import TicketModel from "../../../../../model/Ticket";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const token = request.cookies.get("token");
    if (!token) {
      return Response.json({ message: "token not exist !!!" }, { status: 403 });
    }

    const { name } = verifyToken(token.value) as { name: string };
    const user = await UserModel.findOne({ name });

    if (!user) {
      return Response.json({ message: "User Not Found !!!" }, { status: 404 });
    }

    if (!name) {
      return Response.json({ message: "token not valid !!!" }, { status: 403 });
    }

    if (user.role !== "ADMIN") {
      return Response.json(
        { message: "You cant Access this route" },
        { status: 403 }
      );
    }
    const { title, body, department, subDepartment, priority, ticketID } =
      await request.json();
    await TicketModel.create({
      title,
      body,
      department,
      subDepartment,
      priority,
      user: user._id,
      isAnswer: true,
      hasAnswer: false,
      mainTicketID: ticketID,
    });

    const t = await TicketModel.findByIdAndUpdate(
      { _id: ticketID },
      {
        hasAnswer: true,
      }
    );

    return Response.json({ message: "answer created" }, { status: 201 });
  } catch (error) {
    console.log("Error in Answer API => ", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

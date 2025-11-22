import connectToDB from "@/configs/connect_Db";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";
import UserModel from "../../../../../model/User";
import { verifyToken } from "@/utils/auth";
import TicketModel from "../../../../../model/Ticket";

export const DELETE = async (request: NextRequest) => {
  try {
    await connectToDB();
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

    const { _id } = await request.json();

    if (!isValidObjectId(_id)) {
      return Response.json({ message: "ID is incorrect !!!" }, { status: 422 });
    }

    const ticket = await TicketModel.findOne({ _id });

    if (!ticket) {
      return Response.json({ message: "user not found !!!" }, { status: 404 });
    }

    await TicketModel.findOneAndDelete({ _id: ticket._id });

    return Response.json({ message: "User Delete !" }, { status: 200 });
  } catch (error) {
    console.log(`Ticket API DELETE Error => `, error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

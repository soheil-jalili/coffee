import connectToDB from "@/configs/connect_Db";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";
import UserModel from "../../../../../model/User";
import { validateEmail, validatePhone, verifyToken } from "@/utils/auth";
import BanModel from "../../../../../model/Ban";

export const POST = async (request: NextRequest) => {
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

    const { email, phoneNumber } = await request.json();

    if (!email.trim() || !phoneNumber.trim()) {
      return Response.json(
        { message: "please enter correct value bitch !!!" },
        { status: 422 }
      );
    }

    const isValidEmail = validateEmail(email);
    const isValidPhoneNumber = validatePhone(phoneNumber);

    if (!isValidEmail) {
      return Response.json(
        { message: "your email is fucked !!!" },
        { status: 422 }
      );
    }

    if (!isValidPhoneNumber) {
      return Response.json(
        { message: "your phone number is fucked !!!" },
        { status: 422 }
      );
    }

    const banModel = await BanModel.findOne({ email, phoneNumber });

    if (banModel) {
      return Response.json(
        { message: "user banned before !!!" },
        { status: 422 }
      );
    }

    await BanModel.create({ email, phoneNumber });
    return Response.json({ message: "User Banned !" }, { status: 201 });
  } catch (error) {
    console.log(`User API BAN Error => `, error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

import { NextRequest } from "next/server";
import UserModel from "../../../../model/User";
import connectToDB from "@/configs/connect_Db";
import {
  generateAccessToken,
  validateEmail,
  validatePhone,
  verifyToken,
} from "@/utils/auth";

export const POST = async (request: NextRequest) => {
  try {
    connectToDB();
    const { name, email, phoneNumber } = await request.json();
    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
      return Response.json({ message: "Please Enter Value" }, { status: 422 });
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json(
        { message: "Please Enter Correct Email" },
        { status: 422 }
      );
    }

    const isValidPhoneNumber = validatePhone(phoneNumber);
    if (!isValidPhoneNumber) {
      return Response.json(
        { message: "Please Enter Correct PhoneNumber" },
        { status: 422 }
      );
    }

    const token = request.cookies.get("token");
    if (!token) {
      return Response.json({ message: "Not Access" }, { status: 401 });
    }
    const tokenPayLoad = verifyToken(token?.value!) as { name: string };
    if (!tokenPayLoad) {
      return Response.json({ message: "Not Access" }, { status: 401 });
    }
    const user = await UserModel.findOne({ name: tokenPayLoad.name });
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { name, email, phoneNumber }
    );
    const accessToken = generateAccessToken({ name });

    return Response.json(
      { message: "User updated ..." },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${accessToken};path=/;httpOnly=True`,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal Server Error ..." },
      { status: 500 }
    );
  }
};

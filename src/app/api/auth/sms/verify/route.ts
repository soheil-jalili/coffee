import { NextRequest } from "next/server";
import dbConnection from "../../../../../../configs/db-connection";
import {
  generateAccessToken,
  generateRefreshToken,
  validatePhone,
} from "@/utils/auth";
import OtpModel from "../../../../../../model/Otp";
import UserModel from "../../../../../../model/User";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { phoneNumber, code, name, email } = await request.json();

    const isValidPhoneNumber = validatePhone(phoneNumber);
    if (!isValidPhoneNumber) {
      return Response.json(
        { message: "phone number is not valid" },
        { status: 422 }
      );
    }

    const otpDoc = await OtpModel.findOne({ phoneNumber });
    if (!otpDoc) {
      return Response.json(
        { message: "phone number does not exist" },
        { status: 404 }
      );
    }

    if (otpDoc.code !== code) {
      return Response.json({ message: "code is not correct" }, { status: 409 });
    }

    const now = Date.now();
    if (otpDoc.expTime <= now) {
      return Response.json({ message: "code is expired" }, { status: 410 });
    }

    const accessToken = generateAccessToken({ name });
    const refreshToken = generateRefreshToken({ name });

    const users = await UserModel.find({});
    await UserModel.create({
      name,
      phoneNumber: otpDoc.phoneNumber,
      refreshToken,
      email: email ? email : `${phoneNumber}@gmail.com`,
      role: users.length === 0 ? "ADMIN" : "USER",
    });

    return Response.json(
      { message: "Register successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${accessToken};path=/;httpOnly=true`,
        },
      }
    );
  } catch (error: any) {
    console.log("Error in Verify Sms => ", error.message);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

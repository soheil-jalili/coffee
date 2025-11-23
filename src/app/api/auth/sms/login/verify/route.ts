import { NextRequest } from "next/server";
import { generateAccessToken, validatePhone } from "@/utils/auth";
import dbConnection from "../../../../../../../configs/db-connection";
import UserModel from "../../../../../../../model/User";
import OtpModel from "../../../../../../../model/Otp";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { phoneNumber, code } = await request.json();

    if (!validatePhone(phoneNumber)) {
      return Response.json(
        { message: "Phone number is not valid" },
        { status: 422 }
      );
    }

    const otpDoc = await OtpModel.findOne({ phoneNumber });
    if (!otpDoc) {
      return Response.json(
        { message: "Phone number does not exist" },
        { status: 404 }
      );
    }

    if (otpDoc.code.toString() !== code.toString()) {
      return Response.json({ message: "Code is not correct" }, { status: 409 });
    }

    if (otpDoc.expTime <= Date.now()) {
      return Response.json({ message: "Code is expired" }, { status: 410 });
    }

    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const accessToken = generateAccessToken({ name: user.name });

    return Response.json(
      { message: "Login successful" },
      {
        status: 200,
        headers: { "Set-Cookie": `token=${accessToken};path=/;httpOnly=true` },
      }
    );
  } catch (error: any) {
    console.log("Error in Verify Login Sms => ", error.message);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

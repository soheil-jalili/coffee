import { NextRequest } from "next/server";
import dbConnection from "../../../../../../configs/db-connection";
import { validatePhone } from "@/utils/auth";
import UserModel from "../../../../../../model/User";
import OtpModel from "../../../../../../model/Otp";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { phoneNumber } = await request.json();

    if (!phoneNumber.trim()) {
      return Response.json(
        { message: "Please enter phone number" },
        { status: 422 }
      );
    }

    const isValidPhoneNumber = validatePhone(phoneNumber);
    if (!isValidPhoneNumber) {
      return Response.json(
        { message: "Please enter valid phone number" },
        { status: 422 }
      );
    }

    const isPhoneExist = await UserModel.findOne({ phoneNumber });
    if (!isPhoneExist) {
      return Response.json(
        { message: "Phone number does not exist" },
        { status: 404 }
      );
    }

    const now = Date.now();
    const expTime = now + 300_000; // 5 minutes

    const code = Math.floor(Math.random() * 90000) + 10000; // 5-digit code

    await OtpModel.create({
      phoneNumber,
      code,
      expTime,
    });

    return Response.json(
      { message: "Code sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error in send code login => ", error.message);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

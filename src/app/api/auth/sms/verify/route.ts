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
    const { phoneNumber, code, name } = await request.json();

    const isValidPhoneNumber = validatePhone(phoneNumber);
    if (!isValidPhoneNumber) {
      return Response.json(
        { message: "phone number is not valid" },
        { status: 422 }
      );
    }

    const userPhoneNumberExist = await OtpModel.findOne({ phoneNumber, code });

    if (!userPhoneNumberExist) {
      return Response.json(
        { message: "phone number does not exist" },
        { status: 404 }
      );
    }

    if (userPhoneNumberExist.code !== code) {
      return Response.json({ message: "code is not correct" }, { status: 409 });
    }

    const date = new Date();
    const now = date.getTime();

    if (!(userPhoneNumberExist.expTime > now)) {
      return Response.json({ message: "code is expired" }, { status: 410 });
    }

    const accessToken = generateAccessToken({
      name,
    });
    const refreshToken = generateRefreshToken({
      name,
    });

    await UserModel.create({
      name,
      phoneNumber: userPhoneNumberExist.phoneNumber,
      refreshToken,
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

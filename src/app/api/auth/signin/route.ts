import {
  generateAccessToken,
  generateRefreshToken,
  validateEmail,
  validatePassword,
  verifyPassword,
} from "@/utils/auth";
import { NextRequest } from "next/server";
import UserModel from "../../../../../model/User";
import dbConnection from "../../../../../configs/db-connection";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { email, password } = await request.json();
    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);

    if (!isValidEmail || !isValidPassword) {
      return Response.json(
        { message: "ایمیل یا پسورد شما اشتباه است" },
        { status: 419 }
      );
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return Response.json(
        { message: "یوزرنیم با این مشخصات وجود ندارد" },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { message: "یوزرنیم یا پسورد اشتباه است" },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken({ name: user.name });
    const refreshToken = generateRefreshToken({ name: user.name });
    // await UserModel.findByIdAndUpdate(user._id, { refreshToken });
    await UserModel.findOneAndUpdate(
      { email },
      {
        $set: { refreshToken },
      }
    );
    return Response.json(
      { message: "لاگین با موفقیت انجام شد" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${accessToken};path=/;httpOnly=true`,
        },
      }
    );
  } catch (error) {
    console.log("Signin Error ->", error);
    return Response.json({ message: error }, { status: 500 });
  }
};

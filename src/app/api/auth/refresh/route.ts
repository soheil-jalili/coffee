import { NextRequest } from "next/server";
import dbConnection from "../../../../../configs/db-connection";
import UserModel from "../../../../../model/User";
import { verify } from "jsonwebtoken";
import { generateAccessToken } from "@/utils/auth";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const refreshToken = request.cookies.get("refresh-token")?.value;

    if (!refreshToken) {
      return Response.json(
        { message: "User Aunthorized ..." },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
      return Response.json(
        { message: "User Aunthorized ..." },
        { status: 401 }
      );
    }

    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY!);
    const newAccessToken = generateAccessToken({ name: user.name });

    return Response.json("new access token generated ...", {
      status: 200,
      headers: {
        "Set-Cookie": `token=${newAccessToken};path=/;httpOnly=true`,
      },
    });
  } catch (error: any) {
    console.log("Error in refresh token route => ", error.message);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

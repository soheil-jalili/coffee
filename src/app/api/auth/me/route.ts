import connectToDB from "@/configs/connect_Db";
import { verifyToken } from "@/utils/auth";
import { NextRequest } from "next/server";
import UserModel from "../../../../../model/User";
import { cookies } from "next/headers";

export const GET = async (request: NextRequest) => {
  try {
    const token = (await cookies()).get("token");
    let user = null;

    if (token) {
      const {name} = await verifyToken(token.value) as {name :string}
      if (name) {
        user = await UserModel.findOne(
          { name },
          "-password -refreshToken -__v"
        );
      }
      return Response.json(user);
    } else {
      return Response.json(
        {
          data: null,
          message: "Not access !!",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log("Error in get me => ", error);
    return Response.json({ message: "Internal Server Error" });
  }
};

import { NextRequest } from "next/server";
import dbConnection from "../../../../../configs/db-connection";
import UserModel from "../../../../../model/User";
import { generateAccessToken, hashPassword } from "@/utils/auth";

export const POST = async (request: NextRequest) => {
  await dbConnection();

  const { name, phoneNumber, email, password } = await request.json();

  const isUserExist = await UserModel.findOne({
    $or: [{ name }, { phoneNumber }, { email }],
  });

  if (isUserExist) {
    return Response.json(
      { message: "The username or email or phone exist already !!!" },
      { status: 422 }
    );
  }
  const hashedPassword = await hashPassword(password);
  const accessToken = generateAccessToken({ name });
  const users = await UserModel.find({});

  await UserModel.create({
    name,
    phoneNumber,
    email,
    password: hashedPassword,
    role: users.length === 0 ? "ADMIN" : "USER",
  });

  return Response.json(
    { message: "register successfully.." },
    {
      status: 201,
      headers: {
        "Set-Cookie": `token=${accessToken};path=/;httpOnly=true`,
      },
    }
  );
};

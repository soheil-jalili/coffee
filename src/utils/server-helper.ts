import connectToDB from "@/configs/connect_Db";
import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import UserModel from "../../model/User";
const authUser = async () => {
  connectToDB();
  const token = (await cookies()).get("token");
  let user = null;

  if (token) {
    const tokenPayload = verifyToken(token.value) as { name: string };
    if (tokenPayload) {
      user = await UserModel.findOne({ name: tokenPayload.name });
    }
  }

  return user;
};

export { authUser };

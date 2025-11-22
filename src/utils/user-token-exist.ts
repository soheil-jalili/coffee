import { verifyToken } from "./auth";
import UserModel from "../../model/User";
import connectToDB from "@/configs/connect_Db";

const userTokenExist = async (token: string) => {
  let user = null;
  if (token) {
    const payload = verifyToken(token) as { name: string };
    if (payload) {
      connectToDB();
      user = await UserModel.findOne({ name: payload.name });
    }
  }

  return user;
};

export default userTokenExist;

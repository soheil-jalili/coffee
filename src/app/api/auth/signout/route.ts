import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = verifyToken(token.value) as { name: string };
    if (!name) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    (await cookies()).delete("token");
    return NextResponse.json(
      { message: "Signout successfully ..." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in signout => ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

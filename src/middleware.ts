import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "./utils/auth";
import connectToDB from "./configs/connect_Db";
import UserModel from "../model/User";
import { authUser } from "./utils/server-helper";
import userTokenExist from "./utils/user-token-exist";
import { cookies } from "next/headers";

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("token");
//   const pathname = request.nextUrl.pathname;

//   if (token && pathname.startsWith("/login-register")) {
//     return NextResponse.redirect(new URL("/p-user", request.url));
//   }

//   if (
//     !token &&
//     (pathname.startsWith("/wishlist") || pathname.startsWith("/p-user"))
//   ) {
//     return NextResponse.redirect(new URL("/login-register", request.url));
//   }

//   const response = NextResponse.next();
//   response.headers.set("pathname", pathname);
//   return response;
// }

// export const config = {
//   matcher: ["/wishlist/:path*", "/login-register", "/p-user/:path*"],
// };

export const runtime = "nodejs";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  let isValid = false;

  try {
    if (token) {
      verifyToken(token);
      isValid = true;
    }
  } catch (err) {
    isValid = false;
  }

  if (pathname.startsWith("/p-user") || pathname.startsWith("/wishlist")) {
    if (!isValid) {
      return NextResponse.redirect(new URL("/login-register", request.url));
    }
  }
  const response = NextResponse.next();
  response.headers.set("pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/p-user/:path*", "/wishlist/:path*"],
};

import { NextRequest } from "next/server";
import dbConnection from "../../../../configs/db-connection";
import { validateEmail, validatePhone, verifyToken } from "@/utils/auth";
import UserModel from "../../../../model/User";
import ContactModel from "../../../../model/Contact";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { email, fullName, companyName, phoneNumber, message } =
      await request.json();

    if (
      !email.trim() ||
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return Response.json(
        { message: "Please Enter All Fields ..." },
        { status: 422 }
      );
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json(
        { message: "Please Enter Valid Email ..." },
        { status: 400 }
      );
    }
    const isValidPhoneNumber = validatePhone(phoneNumber);
    if (!isValidPhoneNumber) {
      return Response.json(
        { message: "Please Enter Valid PhoneNumber ..." },
        { status: 400 }
      );
    }

    const contact = await ContactModel.create({
      email,
      fullName,
      phoneNumber,
      message,
      companyName,
    });

    return Response.json(
      { message: "Contact Added ...", data: contact },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in add contact-us => ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
export const GET = async (request: NextRequest) => {
  try {
    await dbConnection();
    const token = request.cookies.get("token");
    if (!token) {
      return Response.json({ message: "Aunthorized ..." }, { status: 403 });
    }

    const { name } = verifyToken(token.value) as { name: string };
    const user = await UserModel.findOne({ name });
    if (!user) {
      return Response.json({ message: "Aunthorized ..." }, { status: 403 });
    }

    if (user.role !== "ADMIN") {
      return Response.json({ message: "Access Denied ..." }, { status: 403 });
    }

    const contacts = await ContactModel.find({}, "-__v");

    return Response.json(contacts, { status: 200 });
  } catch (error) {
    console.log("Error in get contact-us => ", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

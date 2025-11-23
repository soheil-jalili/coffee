import connectToDB from "@/configs/connect_Db";
import { NextRequest } from "next/server";
import OtpModel from "../../../../../../model/Otp";
import UserModel from "../../../../../../model/User";

const request = require("request");

export async function POST(req: NextRequest) {
  connectToDB();
  const body = await req.json();
  const { phoneNumber } = body;

  const user = await UserModel.findOne({ phoneNumber });

  if (user) {
    return Response.json(
      { message: "این شماره تلفن قبلاً ثبت شده است" },
      { status: 409 }
    );
  }

  const now = new Date();
  const expTime = now.getTime() + 300_000; // 5 Mins

  const code = Math.floor(Math.random() * 99999);

  request.post(
    {
      url: "http://ippanel.com/api/select",
      body: {
        op: "pattern",
        user: "09921558293",
        pass: "sabzlearn1212",
        fromNum: "3000505",
        toNum: phoneNumber,
        patternCode: "jqcrkffb9sevvss",
        inputData: [{ "verification-code": code }],
      },
      json: true,
    },
    async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
        await OtpModel.create({
          phoneNumber: phoneNumber,
          code,
          expTime,
        });
        console.log(response.body);
      } else {
        console.log("whatever you want");
      }
    }
  );

  return Response.json(
    { message: "Code sent successfully :))" },
    { status: 201 }
  );
}

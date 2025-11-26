import { compare, hash } from "bcryptjs";
import { verify, sign } from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await compare(password, hashedPassword);
};

export const generateAccessToken = (payload: { name: string }) => {
  return sign({ ...payload }, process.env.ACCESS_TOKEN_SECRET_KEY!, {
    expiresIn: "15s",
  });
};

export const generateRefreshToken = (payload: { name: string }) => {
  return sign({ ...payload }, process.env.REFRESH_TOKEN_SECRET_KEY!, {
    expiresIn: "15d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!);
  } catch (error) {
    console.log("Token verify failed ->", error);
    return false;
  }
};

export const validateEmail = (email: string) => {
  const pattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
  return pattern.test(email);
};
export const validatePhone = (phone: string) => {
  const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;
  return pattern.test(phone);
};

export const validatePassword = (password: string) => {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(password);
};

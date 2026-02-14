import jwt from "jsonwebtoken";
import crypto from "crypto";

// Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

// Refresh Token (raw)
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

import "dotenv/config";
import jwt from "jsonwebtoken";

const payload = {
  id: 6,
};

const JwtSecret = process.env.JWT_SECRET || "";

const token = jwt.sign(payload, JwtSecret, {
  expiresIn: "1d",
});

console.log(token);

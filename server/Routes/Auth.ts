import { Router } from "express";
import {
  getDashboardData,
  login,
  register,
  verify,
} from "../Controllers/Auth.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/verify", verify);
authRouter.get("/dashboard/:userId", getDashboardData);

export default authRouter;

import { Router } from "express";
import { login, register, verify } from "../Controllers/Auth.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/verify", verify);

export default authRouter;

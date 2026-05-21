import { Router, type NextFunction, type Request, type Response} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();


router.post("/signup",userController.createUser);
router.get("/login",userController.loginUser);


export const userRoute = router
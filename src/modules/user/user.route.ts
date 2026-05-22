import { Router} from "express";
import { userController } from "./user.controller";

const router = Router();


router.post("/signup",userController.createUser);
router.get("/login",userController.loginUser);


export const userRoute = router
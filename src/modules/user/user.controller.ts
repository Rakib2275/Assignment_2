import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body)
    // console.log(result)
    sendResponse(res,{
      statusCode: 201,
      success: true,
      message: "User registered Successfully",
      data: result.rows[0],
    })
  } catch (error: any) {
    sendResponse(res,{
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    })
  }
}


const loginUser = async(req : Request,res:Response) =>{
    try {
        const result = await userService.loginUserIntoDB(req.body)

      res.status(200).json({
      success: true,
      message: "User Login successfully",
      data: result,
      })
    } catch (error : any) {
        res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
    }
}



export const userController = {
    createUser,
    loginUser
}
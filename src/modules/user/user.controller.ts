import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";
import bcrypt from "bcryptjs";
import config from "../../config";
import jwt from "jsonwebtoken"

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body)
//   const { name, email, password, age } = req.body;
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

// const getAllUsers = async (req: Request, res: Response) => {
//   console.log("controller",req.user)
//   try {
//     const result = await userService.getAllUserDB()
//     res.status(200).json({
//       success: true,
//       message: "User retrived successfully",
//       data: result.rows,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       error: error,
//     });
//   }
// }

const loginUser = async(req : Request,res:Response) =>{
    try {
        const result = await userService.loginUserIntoDB(req.body)
        
      // const {refreshToken} = result;
      // res.cookie("refreshToken",refreshToken,{
      //   secure: false,
      //   httpOnly : true,
      //   sameSite : 'lax'
      // })

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

// const getUpdateUser = async (req: Request, res: Response) => {
//   const { id } = req.params;
  

//   // console.log("Id: ",id)

//   try {
//     const result =await userService.getUpdateUserDB(req.body,id as string);
//     if (result.rows.length === 0) {
//       res.status(404).json({
//         success: false,
//         message: "User Not Found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User update successfully",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       error: error,
//     });
//   }
// }

// const getDeleteUser = async(req:Request,res:Response) =>{
//     const {id} = req.params;

//     try {

//       const result = await userService.getDeleteUserDB(id as string)


//     if (result.rowCount === 0) {
//       res.status(404).json({
//         success: false,
//         message: "User Not Found",
//       });
//     }

//       res.status(200).json({
//       success: true,
//       message: "User Deleted successfully",
//       data: result.rows[0],
//     });
        
//     } catch (error :any) {
//         res.status(500).json({
//       success: false,
//       message: error.message,
//       error: error,
//     });
//     }
// }

export const userController = {
    createUser,
    // getAllUsers,
    loginUser,
    // getUpdateUser,
    // getDeleteUser
}
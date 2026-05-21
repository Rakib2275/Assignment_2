import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs"
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../../config";

const createUserIntoDB = async (payLoad : IUser) =>{
    const {name,email,password,role} = payLoad;

    const hashPassword = await bcrypt.hash(password,10)
    // console.log(hashPassword)
    const result = await pool.query(
      `
        INSERT INTO users(name,email,password,role) 
        VALUES($1,$2,$3,COALESCE($4,'user'))
        RETURNING *
        `,
      [name, email, hashPassword,role],
    );
    delete result.rows[0].password;
    return result;
}

// const getAllUserDB = async () =>{
//   const result = await pool.query(`
//       SELECT * FROM users
//   `);
//   return result;
// }

const loginUserIntoDB = async(payload: 
{email:string,password:string}
)=>{
    const {email,password} = payload;
    
    const userData = await pool.query(`
      SELECT * FROM users WHERE email=$1  
        
    `,[email])
    if(userData.rows.length === 0){
        throw new Error("Invalid Credentials!")
    }

    const user = userData.rows[0];
    
    const matchPassword = await bcrypt.compare(password,user.password);

    if(!matchPassword){
        throw new Error("Invalid Password")
    }

    const jwtpayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        email: user.email
    }

    const Token = jwt.sign(jwtpayload,config.secret as string,{
        expiresIn : "1d"
    })
    // const refreshToken = jwt.sign(jwtpayload,config.refresh_secret as string,{
    //     expiresIn : "1d"
    // })

    return {
      Token,
      user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at : user.created_at,
      updated_at : user.updated_at
    },
    };
}

// const getUpdateUserDB = async(payLoad : IUser,id:string) =>{
//   const {name,password} = payLoad;
//   const result = await pool.query(
//       `
//        UPDATE users
//         SET name=COALESCE($1,name),
//         password=COALESCE($2,password),
//         age=COALESCE($3,age),
//         is_active=COALESCE($4,is_active)
//         WHERE id=$5 RETURNING *
//     `,
//       [name, password, id],
//     );
//     return result;
// }

// const getDeleteUserDB = async(id:string)=>{
//   const result = await pool.query(`
//             DELETE FROM users WHERE id=$1
//         `, [id])

//         return result
// }

export const userService = {
    createUserIntoDB,
    loginUserIntoDB
}
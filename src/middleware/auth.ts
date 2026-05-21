import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      // 1. Check header
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      // 2. Extract token
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      // 3. Verify token
      const decoded = jwt.verify(
        token as string,
        config.secret as string
      ) as JwtPayload;

      // 4. Validate payload
      if (!decoded?.id) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }

      // 5. Get user from DB (IMPORTANT: using id not email)
      const userData = await pool.query(
        `SELECT id, name, email, role FROM users WHERE id=$1`,
        [decoded.id]
      );

      if (userData.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      const user = userData.rows[0];

      // 6. Role based access control
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! No access",
        });
      }

      // 7. Attach user to request
      req.user = user;

      // console.log("AUTH USER:", req.user);

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Forbidden!",
      });
    }
  };
};

export default auth;
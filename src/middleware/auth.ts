import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      const decoded = jwt.verify(
        token as string,
        config.secret as string
      ) as JwtPayload;

      if (!decoded?.id) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }

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

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! No access",
        });
      }

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
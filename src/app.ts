import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
// import { profileRoute } from "./modules/profile/profile.route";
// import { authRoute } from "./modules/auth/auth.route";
import fs from "fs"
import logger from "./middleware/logger";
import CookieParser from "cookie-parser"
import cors from "cors"
import globalErrorHandler from "./middleware/globalErrorHandle";
import { issuesRoute } from "./modules/issues/issues.route";

const app: Application = express();

app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(logger)


app.get("/", (req: Request, res: Response) => {
  // res.send("Hello Bangladesh")
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

app.use('/api/auth',userRoute)
app.use('/api/issues',issuesRoute)

app.use(globalErrorHandler);

export default app
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = process.env.CORS_ORIGIN;

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import lessonRouter from "./routes/lesson.route.js";
import quizeRouter from "./routes/quize.route.js";
import progressRouter from "./routes/progress.route.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/quizzes", quizeRouter);
app.use("/api/v1/progress", progressRouter);
app.get("/", (req, res) => {
  res.send("API is running ");
});

export { app };

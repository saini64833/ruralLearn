import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// API routes
import userRouter from "./routes/user.route.js";
import lessonRouter from "./routes/lesson.route.js";
import quizeRouter from "./routes/quize.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/quizzes", quizeRouter);

// health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

export { app };

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://your-frontend.vercel.app",
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

// 🔥 Serve frontend build (Node 22 SAFE)
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "frontend/dist")));

// ✅ REGEX fallback (THIS IS THE FIX)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend/dist/index.html")
  );
});

export { app };

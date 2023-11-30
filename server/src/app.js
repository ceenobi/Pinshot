import "dotenv/config";
import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/user.js";
import pinRoutes from "./routes/pin.js";
import commentRoutes from "./routes/comment.js";
import searchRoutes from "./routes/search.js";

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/user", authRoutes);
app.use("/api/pin", pinRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/search", searchRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "An unknown error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;

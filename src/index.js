import express from "express";
import userRouter from "./user/user.routes.js";
import TransactionRouter from "./transaction/transactionroute.js";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Fixed CORS
app.use(cors({
  origin: process.env.DOMAIN || "*",
  credentials: false,
}));

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.json({ message: "Setup Success 🚀" });
});

app.use("/api/user", userRouter);
app.use("/api/transaction", TransactionRouter);

// ================= PORT =================
const PORT = process.env.PORT;

// ================= DATABASE + SERVER START =================
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected ✅");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed ❌", err);
  });

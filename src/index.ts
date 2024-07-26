import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { productRouter } from "./routes/productRouter";
import { seedRouter } from "./routes/seedRouter";
import { userRouter } from "./routes/userRouter";
import { orderRouter } from "./routes/orderRouter";
import { keyRouter } from "./routes/keyRouter";
import uploadRouter from "./routes/uploadRouter";
import { Request, Response } from "express";

// fetching env variables
dotenv.config();

// initialize our app
const app = express();

// setting up cors middleware
app.use(
  cors({
    credentials: true,
    origin: ["https://e-commerce-front-uops.onrender.com"],
  })
);

// middleware for parsing json data
app.use(express.json());
// middleware for parsing url encoded data
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// middleware for our routes
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/key", keyRouter);

const PORT = 8000;

// get
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running properly" });
});

//connecting to mongoDb
mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("error while connecting to mongoDB");
  });

// starting our server
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export { app, server };

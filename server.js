import express from "express";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import colors from "colors";
import userRouter from "./routes/user.js";
import connectToMongoDB from "./config/db.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

const corsOptions = {
  credentials: true,
  origin: ["https://movix2053.netlify.app/", "http://localhost:3001"],
};

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello from movix backend</h1>");
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 `.bgCyan.black);
  connectToMongoDB(process.env.MONGODB_URI);
});

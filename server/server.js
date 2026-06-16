import express from "express";
import cors from "cors";
import "dotenv/config";
import { connect } from "mongoose";
import connectDB from "./config/db.js";

const app = express();
const port = 5000;

await connectDB();

//middleware
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => res.send("Server is Live!"));

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

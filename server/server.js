import express from "express";
import cors from "cors";
import "dotenv/config";
import { connect } from "mongoose";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRouter.js";
import stripeWebhooks from "./controllers/stripeWebhooks.js";

const app = express();
const port = process.env.PORT || 5001;

await connectDB();

//stripe webhooks route
app.use(
  "api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks,
);

//middleware
app.use(express.json());

app.use(cors());

app.use(clerkMiddleware({ clockSkewInMs: 60000 }));

app.get("/", (req, res) => res.send("Server is Live..."));

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

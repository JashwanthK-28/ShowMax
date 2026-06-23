import express from "express";
import {
  createBooking,
  getOccupiedSeats,
  verifyBooking,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", createBooking);
bookingRouter.post("/verify", verifyBooking);
bookingRouter.get("/seats/:showId", getOccupiedSeats);

export default bookingRouter;

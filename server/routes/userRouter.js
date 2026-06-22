import express from "express";
import {
  getFavouriteMovies,
  getUserBookings,
  updateFavourite,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/bookings", getUserBookings);
userRouter.get("/update-favourite", updateFavourite);
userRouter.get("/favourites", getFavouriteMovies);

export default userRouter;

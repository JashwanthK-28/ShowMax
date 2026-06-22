import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
  try {
    const authState = req.auth();
    console.log("getUserBookings - authState:", authState);
    const user = authState?.userId;
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: No valid session found" });
    }

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log("Error in getUserBookings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const authState = req.auth();
    console.log("updateFavourite - authState:", authState);
    const userId = authState?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No valid session found" });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favourites) {
      user.privateMetadata.favourites = [];
    }

    if (!user.privateMetadata.favourites.includes(movieId)) {
      user.privateMetadata.favourites.push(movieId);
    } else {
      user.privateMetadata.favourites = user.privateMetadata.favourites.filter((item) => item !== movieId);
    }
    await clerkClient.users.updateUser(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({
      success: true,
      message: "Favourite movies updated successfully",
    });
  } catch (error) {
    console.log("Error in updateFavourite:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavouriteMovies = async (req, res) => {
  try {
    const authState = req.auth();
    console.log("getFavouriteMovies - authState:", authState);
    const userId = authState?.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No valid session found" });
    }

    const user = await clerkClient.users.getUser(userId);
    const favouriteMovies = user.privateMetadata.favourites || [];

    const movies = await Movie.find({ _id: { $in: favouriteMovies } });
    res.json({ success: true, movies });
  } catch (error) {
    console.log("Error in getFavouriteMovies:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

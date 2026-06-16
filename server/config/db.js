import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connection successful"),
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/showmax`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;

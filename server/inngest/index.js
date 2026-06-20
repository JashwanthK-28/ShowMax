import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

//func to save user data in database
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const payload = event.data;
    const { id, first_name, last_name, email_addresses, image_url } = payload;
    const email =
      email_addresses && email_addresses.length > 0
        ? typeof email_addresses[0] === "string"
          ? email_addresses[0]
          : email_addresses[0].email_address
        : "";

    const userData = {
      _id: id,
      email: email,
      name: first_name + (last_name ? " " + last_name : ""),
      image: image_url || "",
    };

    const user = await User.create(userData);
    return { success: true, userId: user._id };
  },
);

//delete user from database

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const payload = event.data;
    const { id } = payload;
    await User.findByIdAndDelete(id);
    return { success: true, userId: id };
  },
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const payload = event.data;

    const { id, first_name, last_name, email_addresses, image_url } = payload;
    const email =
      email_addresses && email_addresses.length > 0
        ? typeof email_addresses[0] === "string"
          ? email_addresses[0]
          : email_addresses[0].email_address
        : "";

    const userData = {
      email: email,
      name: first_name + (last_name ? " " + last_name : ""),
      image: image_url || "",
    };

    await User.findByIdAndUpdate(id, userData, { upsert: true });
    return { success: true, userId: id };
  },
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];

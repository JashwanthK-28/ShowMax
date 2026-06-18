import { Inngest } from "inngest";
import User from "../models/user.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

//func to save user data in database
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      const payload = event.data.data ? event.data.data : event.data;
      console.log("Creation Payload:", payload);
      const { id, first_name, last_name, email_addresses, image_url } = payload;
      const email = email_addresses && email_addresses.length > 0
        ? (typeof email_addresses[0] === 'string' ? email_addresses[0] : email_addresses[0].email_address)
        : payload.email || "";

      const userData = {
        _id: id,
        email: email,
        name: first_name + (last_name ? " " + last_name : ""),
        image: image_url || "",
      };
      await User.create(userData);
      console.log("User created successfully in DB:", id);
    } catch (error) {
      console.error("Error creating user in DB:", error);
    }
  },
);

//delete user from database

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      const payload = event.data.data ? event.data.data : event.data;
      const { id } = payload;
      await User.findByIdAndDelete(id);
      console.log("User deleted successfully from DB:", id);
    } catch (error) {
      console.error("Error deleting user in DB:", error);
    }
  },
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    try {
      const payload = event.data.data ? event.data.data : event.data;
      console.log("Updation Payload:", payload);
      const { id, first_name, last_name, email_addresses, image_url } = payload;
      const email = email_addresses && email_addresses.length > 0
        ? (typeof email_addresses[0] === 'string' ? email_addresses[0] : email_addresses[0].email_address)
        : payload.email || "";

      const userData = {
        _id: id,
        email: email,
        name: first_name + (last_name ? " " + last_name : ""),
        image: image_url || "",
      };
      await User.findByIdAndUpdate(id, userData, { upsert: true });
      console.log("User updated successfully in DB:", id);
    } catch (error) {
      console.error("Error updating user in DB:", error);
    }
  },
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];

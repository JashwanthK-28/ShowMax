import { Inngest, step } from "inngest";
import User from "../models/User.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import sendEmail from "../config/nodemailer.js";

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

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  {
    id: "release-seats-and-delete-booking",
    triggers: [{ event: "app/checkpayment" }],
  },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      //if payment is not made,release the seats and delete booking
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified("occupiedSeats");
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    });
  },
);

//booking confirmation email for user
const sendBookingConfirmationEmail = inngest.createFunction(
  {
    id: "send-booking-confirmation-email",
    triggers: [{ event: "app/show.booked" }],
  },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");

    await sendEmail({
      to: booking.user.email,
      subject: `Payment confirmation "${booking.show.movie.title}" booked!"`,
      body: `<div class="showmax-email-body" style="margin: 0; padding: 20px 0; font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0d0d13; color: #ffffff; width: 100%; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #14141f; border: 1px solid #222235; border-radius: 8px; overflow: hidden;">
        
        <tr>
            <td align="center" style="background: linear-gradient(135deg, #e50914 0%, #9e060e 100%); padding: 25px; border-bottom: 3px solid #ff1e27;">
                <h1 style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #ffffff; margin: 0;">ShowMax</h1>
                <p style="font-size: 14px; margin: 5px 0 0 0; color: #f0f0f0;">Booking Confirmed!</p>
            </td>
        </tr>

        <tr>
            <td style="padding: 25px;">
                <p style="font-size: 15px; margin: 0 0 20px 0; color: #ffffff;">Hi <strong>${booking.user.name}</strong>, your tickets are ready! Present this stub at the entrance.</p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1c1c2e; border-radius: 6px; border: 1px solid #2d2d44; margin-bottom: 20px;">
                    <tr>
                        <td style="background-color: #25253b; padding: 15px 20px; border-bottom: 2px dashed #14141f;">
                            <h2 style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0;">${booking.show.movie.title}</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                                <tr>
                                    <td width="50%" style="padding-bottom: 15px;">
                                        <span style="font-size: 10px; color: #7a7a9a; text-transform: uppercase; display: block; margin-bottom: 2px;">Date & Time</span>
                                        <strong style="color: #ffffff;">${new Date(booking.show.showDateTime).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })} <br/> ${new Date(booking.show.showDateTime).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}</strong>
                                    </td>
                                    <td width="50%" style="padding-bottom: 15px;">
                                        <span style="font-size: 10px; color: #7a7a9a; text-transform: uppercase; display: block; margin-bottom: 2px;">Seats</span>
                                        <strong style="color: #ff1e27;">${booking.bookedSeats.join(", ")}</strong>
                                    </td>
                                </tr>
                                <tr>
                                   
                                    <td width="50%">
                                        <span style="font-size: 10px; color: #7a7a9a; text-transform: uppercase; display: block; margin-bottom: 2px;">Total Paid</span>
                                        <strong style="color: #ffffff;">${booking.amount}</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                   
                <p style="font-size: 11px; color: #a0a0b8; margin: 0; text-align: center; line-height: 1.4;">Please arrive 15 minutes early. Outside food is not permitted.</p>
            </td>
        </tr>

        <tr>
            <td align="center" style="padding: 20px; background-color: #0b0b10; border-top: 1px solid #222235; font-size: 10px; color: #62627a;">
                Questions? Contact Support<br>
                &copy; 2026 Showmax Cinemas.
            </td>
        </tr>
    </table>
</div>`,
    });
  },
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
];

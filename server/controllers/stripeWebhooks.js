import stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error:${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { bookingId } = session.metadata || {};

        if (bookingId) {
          await Booking.findByIdAndUpdate(bookingId, {
            isPaid: true,
            paymentLink: "",
          });
          console.log(
            `Booking ${bookingId} marked as paid via checkout.session.completed`,
          );
          // trigger confirmation email
          await inngest.send({
            name: "app/show.booked",
            data: { bookingId },
          });
        }
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        if (sessionList && sessionList.data && sessionList.data.length > 0) {
          const session = sessionList.data[0];
          const { bookingId } = session.metadata || {};
          if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, {
              isPaid: true,
              paymentLink: "",
            });
            // trigger confirmation email
            await inngest.send({
              name: "app/show.booked",
              data: { bookingId },
            });
          }
        }
        break;
      }
      default:
        console.log("Unhandled event type: ", event.type);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Error in stripeWebhooks:", error);
    res.status(500).send("Webhook error");
  }
};

export default stripeWebhooks;

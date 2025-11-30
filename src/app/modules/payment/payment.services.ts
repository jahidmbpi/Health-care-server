import Stripe from "stripe";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  console.log("hello stripe");
  switch (event.type) {
    case "checkout.session.completed":
      {
        const session = event.data.object as any;
        const appoinmentId = session.metadata?.appointmentId;
        const paymentId = session.metadata?.paymentId;
        const email = session.customer_email;
        console.log("this  is session", session);
        console.log("this  is appoinmentId", appoinmentId);
        console.log("this  is paymentId", paymentId);
        console.log("this  is email", email);
      }

      break;
    case "payment_intent.payment_failed":
      {
        const intent = event.data.object as any;
        console.log("intent", intent);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const paymentServices = {
  handleStripeWebhookEvent,
};

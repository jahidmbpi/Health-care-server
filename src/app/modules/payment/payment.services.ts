import Stripe from "stripe";
import { prisma } from "../../config/prisma";
import { PamentStatus } from "@prisma/client";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  console.log("hello stripe");
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const appoinmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      await prisma.appoinment.update({
        where: {
          id: appoinmentId,
        },
        data: {
          paymentStatus:
            session.payment_status === "paid"
              ? PamentStatus.PAID
              : PamentStatus.UNPAID,
        },
      });

      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status:
            session.payment_status === "paid"
              ? PamentStatus.PAID
              : PamentStatus.UNPAID,
          paymentGetwayData: session,
        },
      });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const paymentServices = {
  handleStripeWebhookEvent,
};

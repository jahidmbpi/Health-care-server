import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { stripe } from "../../config/stripe";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config";
const endpointSecret = envVars.STRIPE_ENDPOINT_SECRET;

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    let event;

    if (endpointSecret) {
      const signature = req.headers["stripe-signature"];
      if (!signature || typeof signature !== "string") {
        return res.status(400).send("Missing Stripe Signature");
      }
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err: any) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }
    if (!event) {
      return res.status(400).send("Stripe event is missing");
    }
    const result = await paymentServices.handleStripeWebhookEvent(event);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Webhook req send successfully",
      data: "",
    });
  }
);

export const apymentController = {
  handleStripeWebhookEvent,
};

import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY_LIVE ?? ""
);

export { stripe };

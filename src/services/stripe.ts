import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY, //primeiro param = chave
  {
    /*informações obrigatórias*/
    apiVersion: "2020-08-27",
    appInfo: {
      name: "Ignews",
      version: "0.1.0",
    },
  }
);

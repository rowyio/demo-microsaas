import { Package } from "@/lib/packages";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    creditPackage: Package;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const data = req.body.creditPackage;
      const session = await stripe.checkout.sessions.create({
        metadata: {
          purchasedPackage: JSON.stringify(data),
        },
        payment_method_types: ["card"],
        mode: "payment",
        success_url: "http://localhost:3000/dashboard?payment_status=success",
        cancel_url: "http://localhost:3000/dashboard?payment_status=cancel",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${data.limit} Credit Pack`,
              },
              unit_amount: data.price * 100,
            },
            quantity: 1,
          },
        ],
      });
      res.json({ url: session.url });
    } catch (error: any) {
      res.status(200).json({ error: error.message });
    }
  }
}

import Stripe from "stripe";
import jwt from "jsonwebtoken";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});


function getBearer(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}


export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }


  try {
    const token = getBearer(req);
    if (!token) return res.status(401).json({ error: "Missing token" });


    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }


    if (!payload?.pro) return res.status(403).json({ error: "Not Pro" });


    const stripeCustomerId = payload.stripeCustomerId;
    if (!stripeCustomerId) {
      return res
        .status(400)
        .json({ error: "Missing stripeCustomerId in token" });
    }


    const returnUrl =
      (req.body && req.body.returnUrl) ||
      "https://growthledgerpro.vercel.app/app/settings";


    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });


    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest, type NextResponse } from "next/server";
import db from "@/utils/db";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin");
  const { bookingId } = await req.json();

  const booking = await db.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      instrument: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  if (!booking) {
    return Response.json(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const {
    orderTotal,
    startTime,
    instrument: { image, name },
  } = booking;
  const startDate = startTime.toLocaleDateString("en-US");
  const startHour = startTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { bookingId: booking.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: `${name}`,
              images: [image],
              description: `Learn this wonderful instrument with me on ${startDate} at ${startHour}. I'll be waiting for you!`,
            },
            unit_amount: orderTotal * 100,
          },
        },
      ],
      mode: "payment",
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    });
    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

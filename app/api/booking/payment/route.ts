import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";

const paymentSchema = z.object({
  bookingId: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId, amount, paymentMethod } = paymentSchema.parse(body);

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.customerId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (booking.type !== "RENT") {
      return NextResponse.json(
        { error: "Payment only available for rent bookings" },
        { status: 400 }
      );
    }

    // TODO: Integrate with Stripe
    // For now, simulate payment success
    const paymentIntentId = `pi_${Date.now()}`;

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "PAID",
        paymentAmount: amount,
        paymentMethod,
        paymentIntentId,
        paymentDate: new Date(),
        status: "CONFIRMED",
      },
    });

    // Create revenue record
    await prisma.revenue.create({
      data: {
        ownerId: booking.ownerId,
        propertyId: booking.propertyId,
        bookingId: bookingId,
        amount,
        type: "RENT",
        description: `Rent payment for ${booking.property.title}`,
      },
    });

    return NextResponse.json(
      {
        message: "Payment processed successfully",
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}


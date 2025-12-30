import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";

const createRatingSchema = z.object({
  bookingId: z.string(),
  ratedId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
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
    const { bookingId, ratedId, rating, comment } = createRatingSchema.parse(body);

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Can only rate completed bookings" },
        { status: 400 }
      );
    }

    // Verify user is part of this booking
    if (booking.customerId !== userId && booking.ownerId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Verify rated user is the other party
    if (ratedId !== booking.customerId && ratedId !== booking.ownerId) {
      return NextResponse.json(
        { error: "Invalid user to rate" },
        { status: 400 }
      );
    }

    if (ratedId === userId) {
      return NextResponse.json(
        { error: "Cannot rate yourself" },
        { status: 400 }
      );
    }

    // Check if rating already exists
    const existingRating = await prisma.rating.findUnique({
      where: {
        bookingId_raterId: {
          bookingId,
          raterId: userId,
        },
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "Rating already submitted" },
        { status: 400 }
      );
    }

    // Create rating
    const newRating = await prisma.rating.create({
      data: {
        bookingId,
        raterId: userId,
        ratedId,
        rating,
        comment,
      },
    });

    return NextResponse.json(
      {
        message: "Rating submitted successfully",
        rating: newRating,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";

const createBookingSchema = z.object({
  propertyId: z.string(),
  type: z.enum(["RENT", "BUY"]),
  meetingDate: z.string().optional(),
  meetingLocation: z.string().optional(),
  meetingNotes: z.string().optional(),
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
    const data = createBookingSchema.parse(body);

    // Get property
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.ownerId === userId) {
      return NextResponse.json(
        { error: "Cannot book your own property" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId: data.propertyId,
        customerId: userId,
        ownerId: property.ownerId,
        type: data.type,
        status: "PENDING",
        paymentStatus: data.type === "RENT" ? "PENDING" : undefined,
        meetingDate: data.meetingDate ? new Date(data.meetingDate) : undefined,
        meetingLocation: data.meetingLocation,
        meetingNotes: data.meetingNotes,
      },
    });

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking,
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

    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}


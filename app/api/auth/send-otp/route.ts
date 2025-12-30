import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, getOTPExpiration, sendOTPEmail } from "@/lib/auth";
import { z } from "zod";

const sendOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = sendOTPSchema.parse(body);

    // Generate OTP
    const code = generateOTP();
    const expiresAt = getOTPExpiration();

    // Delete any existing unused OTPs for this email
    await prisma.oTP.deleteMany({
      where: {
        email,
        used: false,
      },
    });

    // Create new OTP
    await prisma.oTP.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send OTP email
    await sendOTPEmail(email, code);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOTPExpired } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = verifyOTPSchema.parse(body);

    // Find OTP
    const otp = await prisma.oTP.findFirst({
      where: {
        email,
        code,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (isOTPExpired(otp.expiresAt)) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user (customer by default)
      user = await prisma.user.create({
        data: {
          email,
          role: "CUSTOMER",
        },
      });
    }

    // Create session (simplified - in production use proper session management)
    const cookieStore = await cookies();
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        message: "OTP verified successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
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

    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["CUSTOMER", "OWNER"]).default("CUSTOMER"),
  documents: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, role, documents } = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update user details
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: name || existingUser.name,
          phone: phone || existingUser.phone,
          role: role || existingUser.role,
          verificationDocuments: documents
            ? { files: documents }
            : existingUser.verificationDocuments,
        },
      });

      // Set session
      const cookieStore = await cookies();
      cookieStore.set("user_id", updatedUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json(
        {
          message: "Account updated successfully",
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
          },
        },
        { status: 200 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        role,
        verificationDocuments: documents ? { files: documents } : undefined,
        verificationStatus: role === "OWNER" ? "PENDING" : undefined,
      },
    });

    // Set session
    const cookieStore = await cookies();
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
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

    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}


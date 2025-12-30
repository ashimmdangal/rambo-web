import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["CUSTOMER", "OWNER"]).default("CUSTOMER"),
  documents: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();
    const { email, name, phone, role, documents } = signupSchema.parse(body);

    // Get the current user from Supabase session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the email matches
    if (user.email !== email) {
      return NextResponse.json(
        { error: "Email mismatch" },
        { status: 400 }
      );
    }

    // Check if user profile already exists
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
          verificationStatus: role === "OWNER" ? "PENDING" : existingUser.verificationStatus,
        },
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

    // Create new user profile
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        role,
        verificationDocuments: documents ? { files: documents } : undefined,
        verificationStatus: role === "OWNER" ? "PENDING" : undefined,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
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
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
          },
        },
        { status: 200 }
      );
    }

    // Create new user profile
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        role,
        verificationDocuments: documents ? { files: documents } : undefined,
        verificationStatus: role === "OWNER" ? "PENDING" : undefined,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
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


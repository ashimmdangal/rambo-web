import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { isBookmarked: false },
        { status: 200 }
      );
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId: params.propertyId,
        },
      },
    });

    return NextResponse.json(
      { isBookmarked: !!bookmark },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { isBookmarked: false },
      { status: 200 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if bookmark exists
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId: params.propertyId,
        },
      },
    });

    if (existing) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_propertyId: {
            userId,
            propertyId: params.propertyId,
          },
        },
      });

      return NextResponse.json(
        { message: "Bookmark removed", isBookmarked: false },
        { status: 200 }
      );
    } else {
      // Create bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          propertyId: params.propertyId,
        },
      });

      return NextResponse.json(
        { message: "Bookmark added", isBookmarked: true },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: "Failed to toggle bookmark" },
      { status: 500 }
    );
  }
}


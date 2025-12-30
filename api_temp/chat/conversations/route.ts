import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participant2: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Format conversations with last message and unread count
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = conv.messages[0] || null;
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            readAt: null,
          },
        });

        return {
          id: conv.id,
          participant1: conv.participant1,
          participant2: conv.participant2,
          property: conv.property,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt.toISOString(),
                senderId: lastMessage.sender.id,
              }
            : null,
          updatedAt: conv.updatedAt.toISOString(),
          unreadCount,
        };
      })
    );

    return NextResponse.json(
      { conversations: formattedConversations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

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
    const { participant2Id, propertyId } = body;

    if (!participant2Id) {
      return NextResponse.json(
        { error: "participant2Id is required" },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            participant1Id: userId,
            participant2Id,
            propertyId: propertyId || null,
          },
          {
            participant1Id: participant2Id,
            participant2Id: userId,
            propertyId: propertyId || null,
          },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { conversation: existing },
        { status: 200 }
      );
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participant1Id: userId,
        participant2Id,
        propertyId: propertyId || null,
      },
      include: {
        participant1: true,
        participant2: true,
        property: true,
      },
    });

    return NextResponse.json(
      { conversation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}


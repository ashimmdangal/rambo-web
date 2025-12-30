"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Clock } from "lucide-react";
import Image from "next/image";

interface Conversation {
  id: string;
  participant1: { id: string; name: string; email: string };
  participant2: { id: string; name: string; email: string };
  property?: { id: string; title: string; images: string[] };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  updatedAt: string;
  unreadCount: number;
}

export default function ChatList() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/chat/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    // This would need the current user ID - simplified for now
    return conversation.participant2;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground mb-4">
          No conversations yet
        </p>
        <p className="text-sm text-muted-foreground">
          Start a conversation from a property page
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="divide-y divide-border">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          return (
            <button
              key={conversation.id}
              onClick={() => router.push(`/chat/${conversation.id}`)}
              className="w-full p-4 hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-start gap-4">
                {conversation.property?.images?.[0] ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={conversation.property.images[0]}
                      alt={conversation.property.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {otherParticipant.name || otherParticipant.email}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conversation.property && (
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {conversation.property.title}
                    </p>
                  )}
                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content || "Attachment"}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0">
                    <span className="w-5 h-5 bg-accent text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


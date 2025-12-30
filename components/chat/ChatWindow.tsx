"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  conversationId: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const router = useRouter();
  const [conversation, setConversation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversation();
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchConversation, 2000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setConversation(data.conversation);
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  const otherParticipant =
    conversation.participant1.id === conversation.currentUserId
      ? conversation.participant2
      : conversation.participant1;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="glassmorphism border-b border-border p-4">
        <div className="container mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/chat")}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h2 className="font-semibold text-foreground">
              {otherParticipant.name || otherParticipant.email}
            </h2>
            {conversation.property && (
              <p className="text-sm text-muted-foreground">
                {conversation.property.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList conversationId={conversationId} />
      </div>

      {/* Input */}
      <div className="border-t border-border">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}


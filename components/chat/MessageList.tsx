"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Paperclip, File } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content?: string;
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
    size: number;
  }>;
  createdAt: string;
  readAt?: string;
}

interface MessageListProps {
  conversationId: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user ID from cookie (simplified - in production use proper auth)
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUserId(data.user.id);
        }
      });

    fetchMessages();
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwn = message.senderId === currentUserId;
        return (
          <div
            key={message.id}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwn
                  ? "bg-accent text-primary"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.attachments && message.attachments.length > 0 && (
                <div className="space-y-2 mb-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {attachment.type.startsWith("image/") ? (
                        <Image
                          src={attachment.url}
                          alt={attachment.name}
                          width={200}
                          height={200}
                          className="rounded-lg"
                          unoptimized
                        />
                      ) : (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-background/50 rounded"
                        >
                          <File className="w-4 h-4" />
                          <span className="text-sm">{attachment.name}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {message.content && (
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              )}
              <p className="text-xs mt-1 opacity-70">
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}


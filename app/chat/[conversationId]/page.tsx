"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";
import MessageInput from "@/components/chat/MessageInput";

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ChatWindow conversationId={conversationId} />
    </div>
  );
}


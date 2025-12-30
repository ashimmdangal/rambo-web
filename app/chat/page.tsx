"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Search } from "lucide-react";
import ChatList from "@/components/chat/ChatList";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold text-primary">Messages</h1>
        </div>
        <ChatList />
      </div>
    </div>
  );
}


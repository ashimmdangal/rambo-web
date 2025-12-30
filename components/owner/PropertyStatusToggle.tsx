"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyStatusToggleProps {
  propertyId: string;
  currentStatus: "AVAILABLE" | "RENTED" | "BOUGHT";
  onStatusChange?: (status: "AVAILABLE" | "RENTED" | "BOUGHT") => void;
}

export default function PropertyStatusToggle({
  propertyId,
  currentStatus,
  onStatusChange,
}: PropertyStatusToggleProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions: Array<{
    value: "AVAILABLE" | "RENTED" | "BOUGHT";
    label: string;
    color: string;
  }> = [
    { value: "AVAILABLE", label: "Available", color: "bg-green-500" },
    { value: "RENTED", label: "Rented", color: "bg-blue-500" },
    { value: "BOUGHT", label: "Bought", color: "bg-purple-500" },
  ];

  const handleStatusChange = async (
    newStatus: "AVAILABLE" | "RENTED" | "BOUGHT"
  ) => {
    if (newStatus === status) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/property/${propertyId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {statusOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleStatusChange(option.value)}
          disabled={isLoading}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            "border-2",
            status === option.value
              ? "border-accent bg-accent/20 text-accent"
              : "border-border bg-background text-muted-foreground hover:border-accent/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center gap-2"
          )}
        >
          {isLoading && status === option.value ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === option.value ? (
            <Check className="w-4 h-4" />
          ) : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}


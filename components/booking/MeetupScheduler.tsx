"use client";

import { useState } from "react";
import { Calendar, MapPin, Loader2 } from "lucide-react";

interface Property {
  id: string;
  title: string;
}

interface MeetupSchedulerProps {
  property: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MeetupScheduler({
  property,
  onSuccess,
  onCancel,
}: MeetupSchedulerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    meetingDate: "",
    meetingTime: "",
    meetingLocation: "",
    meetingNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create booking with meetup details
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          type: "BUY",
          meetingDate: `${formData.meetingDate}T${formData.meetingTime}`,
          meetingLocation: formData.meetingLocation,
          meetingNotes: formData.meetingNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule viewing");
      }

      onSuccess();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to schedule viewing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">
          Physical meetup required for purchase
        </p>
        <p className="text-sm text-foreground">
          Schedule a viewing to see this property in person
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Preferred Date
        </label>
        <input
          type="date"
          value={formData.meetingDate}
          onChange={(e) =>
            setFormData({ ...formData, meetingDate: e.target.value })
          }
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Preferred Time
        </label>
        <input
          type="time"
          value={formData.meetingTime}
          onChange={(e) =>
            setFormData({ ...formData, meetingTime: e.target.value })
          }
          className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Meeting Location
        </label>
        <input
          type="text"
          value={formData.meetingLocation}
          onChange={(e) =>
            setFormData({ ...formData, meetingLocation: e.target.value })
          }
          placeholder="Property address or preferred meeting point"
          className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Additional Notes
        </label>
        <textarea
          value={formData.meetingNotes}
          onChange={(e) =>
            setFormData({ ...formData, meetingNotes: e.target.value })
          }
          placeholder="Any special requests or questions..."
          rows={4}
          className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-2.5 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2.5 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            "Schedule Viewing"
          )}
        </button>
      </div>
    </form>
  );
}


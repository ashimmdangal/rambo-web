"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import PaymentForm from "./PaymentForm";
import MeetupScheduler from "./MeetupScheduler";

interface Property {
  id: string;
  title: string;
  category: "RENT" | "BUY";
  price: number;
  owner: {
    id: string;
    name: string;
  };
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export default function BookingModal({
  isOpen,
  onClose,
  property,
}: BookingModalProps) {
  const [step, setStep] = useState<"booking" | "payment" | "success">("booking");

  const handleBookingSuccess = () => {
    if (property.category === "RENT") {
      setStep("payment");
    } else {
      setStep("success");
    }
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  const handleClose = () => {
    setStep("booking");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === "success"
          ? "Booking Confirmed!"
          : property.category === "RENT"
          ? "Book Property"
          : "Schedule Viewing"
      }
      size="lg"
    >
      {step === "booking" && (
        <div className="space-y-6">
          {property.category === "RENT" ? (
            <PaymentForm
              property={property}
              onSuccess={handlePaymentSuccess}
              onCancel={handleClose}
            />
          ) : (
            <MeetupScheduler
              property={property}
              onSuccess={handleBookingSuccess}
              onCancel={handleClose}
            />
          )}
        </div>
      )}

      {step === "payment" && (
        <PaymentForm
          property={property}
          onSuccess={handlePaymentSuccess}
          onCancel={handleClose}
        />
      )}

      {step === "success" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-display font-semibold text-primary mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-muted-foreground mb-6">
            {property.category === "RENT"
              ? "Your payment has been processed. You'll receive a confirmation email shortly."
              : "Your viewing has been scheduled. The owner will contact you to confirm the details."}
          </p>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
}


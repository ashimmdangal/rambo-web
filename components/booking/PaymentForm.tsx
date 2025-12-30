"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
}

interface PaymentFormProps {
  property: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({
  property,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create booking first
      const bookingResponse = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          type: "RENT",
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking");
      }

      const bookingData = await bookingResponse.json();

      // Process payment
      const paymentResponse = await fetch("/api/booking/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.booking.id,
          amount: property.price,
          paymentMethod: "card",
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Payment failed");
      }

      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="text-2xl font-display font-bold text-primary">
            ${property.price.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Monthly rent payment</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={cardDetails.number}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, number: e.target.value })
            }
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full pl-12 pr-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={cardDetails.expiry}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, expiry: e.target.value })
            }
            placeholder="MM/YY"
            maxLength={5}
            className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            CVV
          </label>
          <input
            type="text"
            value={cardDetails.cvv}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cvv: e.target.value })
            }
            placeholder="123"
            maxLength={4}
            className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardDetails.name}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, name: e.target.value })
          }
          placeholder="John Doe"
          className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          required
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
          disabled={isProcessing}
          className="flex-1 px-6 py-2.5 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${property.price.toLocaleString()}`
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured and encrypted
      </p>
    </form>
  );
}


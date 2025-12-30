"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import OTPVerification from "./OTPVerification";
import { supabase } from "@/lib/supabase";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSuccess,
}: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Only allow existing users to sign in
        },
      });

      if (error) {
        throw error;
      }

      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (error) {
        throw error;
      }

      // Success - close modal and refresh
      onSuccess?.();
      handleClose();
      window.location.reload(); // Refresh to update auth state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  const handleClose = () => {
    setEmail("");
    setStep("email");
    setError("");
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === "email" ? "Sign In" : "Verify Your Email"}
      size="md"
    >
      {step === "email" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendOTP();
                }
              }}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            onClick={handleSendOTP}
            disabled={isLoading || !email}
            className="w-full px-6 py-3 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </div>
      ) : (
        <OTPVerification
          email={email}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          isLoading={isLoading}
        />
      )}

      {error && step === "otp" && (
        <div className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}
    </Modal>
  );
}


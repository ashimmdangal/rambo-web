"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OTPVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
}

export default function OTPVerification({
  email,
  onVerify,
  onResend,
  isLoading = false,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);
    
    // Focus the last filled input or submit if complete
    const lastIndex = Math.min(pastedData.length - 1, 5);
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    } else {
      inputRefs.current[lastIndex + 1]?.focus();
    }
  };

  const handleSubmit = async (code?: string) => {
    const codeToVerify = code || otp.join("");
    if (codeToVerify.length === 6) {
      await onVerify(codeToVerify);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await onResend();
    setIsResending(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-medium text-foreground">{email}</p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={isLoading}
            className={cn(
              "w-12 h-14 text-center text-xl font-semibold border-2 border-border rounded-lg",
              "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all"
            )}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying...</span>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isLoading}
          className="text-sm text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? "Resending..." : "Resend code"}
        </button>
      </div>
    </div>
  );
}


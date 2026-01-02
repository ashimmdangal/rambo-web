"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import OTPVerification from "./OTPVerification";
import { supabase } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [step, setStep] = useState<"signup" | "owner" | "otp">("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Send OTP via Supabase
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            role: isOwner ? "OWNER" : "CUSTOMER",
          },
        },
      });

      if (error) {
        throw error;
      }

      // Move to OTP verification step
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
        email: formData.email,
        token: code,
        type: 'signup',
      });

      if (error) {
        throw error;
      }

      // Upload documents to Supabase Storage if owner
      let documentUrls: string[] = [];
      if (isOwner && documents.length > 0) {
        for (const doc of documents) {
          const fileExt = doc.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `verification-documents/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('apitemp')
            .upload(filePath, doc);

          if (uploadError) {
            throw new Error(`Failed to upload ${doc.name}: ${uploadError.message}`);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('apitemp')
            .getPublicUrl(filePath);

          documentUrls.push(publicUrl);
        }
      }

      // After successful verification, create user profile in our database
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          role: isOwner ? "OWNER" : "CUSTOMER",
          documents: documentUrls,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      // Success
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toggle Owner Mode */}
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => {
              setIsOwner(!isOwner);
              setStep(!isOwner ? "owner" : "signup");
            }}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all",
              isOwner
                ? "bg-accent text-primary"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {isOwner ? "✓ Owner Mode" : "Are you an Owner? Join here"}
          </button>
        </div>

        {/* Regular Sign Up Form */}
        {step === "signup" && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </>
        )}

        {/* Owner Sign Up Form */}
        {step === "owner" && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="john@realestate.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Verification Documents
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload ID, business license, or property ownership documents
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
                  <input
                    type="file"
                    id="documents"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="documents"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-foreground">
                      Click to upload documents
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (max 10MB each)
                    </span>
                  </label>
                </div>

                {/* Uploaded Documents */}
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-md"
                      >
                        <span className="text-sm text-foreground truncate flex-1">
                          {doc.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="p-1 hover:bg-background rounded"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        {step !== "otp" && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Continue"
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              {isOwner
                ? "Your account will be reviewed. You'll receive an email once verified."
                : "By signing up, you agree to our Terms of Service and Privacy Policy."}
            </p>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === "otp" && (
          <div className="pt-4">
            <OTPVerification
              email={formData.email}
              onVerify={handleVerifyOTP}
              onResend={handleResendOTP}
              isLoading={isLoading}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}


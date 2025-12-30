import crypto from "crypto";

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generate OTP expiration time (10 minutes from now)
 */
export function getOTPExpiration(): Date {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 10);
  return expiration;
}

/**
 * Check if OTP is expired
 */
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Send OTP email (mock implementation - replace with actual email service)
 */
export async function sendOTPEmail(email: string, code: string): Promise<void> {
  // TODO: Integrate with Resend, SendGrid, or similar email service
  console.log(`Sending OTP ${code} to ${email}`);
  
  // For development, log the OTP
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${email}: ${code}`);
  }
  
  // In production, use actual email service:
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM!,
  //   to: email,
  //   subject: "Your Rambo Verification Code",
  //   html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  // });
}


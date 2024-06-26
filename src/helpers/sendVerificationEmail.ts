import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// humne isme sendVerificationEmail function  banaya hai aur is function me user ko email send karne ke liye hume sendVerificationEmail teplate se email, username, verifyCode lene hoga.
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "DERIVE SOLARS || Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification email send successfully.." };
  } catch (Emailerror) {
    console.error("Error sending verification email", Emailerror);
    return { success: false, message: "Failed to verification email" };
  }
}

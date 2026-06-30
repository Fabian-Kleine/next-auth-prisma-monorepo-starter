"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  createVerificationToken,
} from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email/senders/send-verification-email";
import { sendPasswordResetEmail } from "@/lib/email/senders/send-password-reset-email";

export interface AuthFormState {
  error?: string;
  success?: string;
}

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hashed } });

  const token = await createVerificationToken(email);
  await sendVerificationEmail({
    email,
    name,
    verificationUrl: `${appUrl()}/verify?token=${token}`,
  });

  return { success: "Account created. Check your email to verify your address." };
}

export async function resendVerificationAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });

  // Always report success to avoid leaking which emails are registered.
  if (user && !user.emailVerified) {
    const token = await createVerificationToken(email);
    await sendVerificationEmail({
      email,
      name: user.name ?? "there",
      verificationUrl: `${appUrl()}/verify?token=${token}`,
    });
  }

  return { success: "If that account exists and is unverified, a new link is on its way." };
}

export async function forgotPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = await createPasswordResetToken(email);
    await sendPasswordResetEmail({
      email,
      name: user.name ?? "there",
      resetUrl: `${appUrl()}/reset-password?token=${token}`,
    });
  }

  return { success: "If that account exists, a password reset link is on its way." };
}

export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const email = await consumePasswordResetToken(parsed.data.token);
  if (!email) {
    return { error: "This reset link is invalid or has expired." };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({ where: { email }, data: { password: hashed } });

  return { success: "Your password has been reset. You can now sign in." };
}

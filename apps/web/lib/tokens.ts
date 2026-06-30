import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

/** Create (replacing any existing) an email-verification token for an address. */
export async function createVerificationToken(email: string): Promise<string> {
  const token = randomUUID();
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + VERIFICATION_TTL_MS),
    },
  });
  return token;
}

/** Validate a verification token, mark the user verified, and consume the token. */
export async function consumeVerificationToken(token: string): Promise<string | null> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record) return null;

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return null;
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token } });
  return record.identifier;
}

export async function createPasswordResetToken(email: string): Promise<string> {
  const token = randomUUID();
  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires: new Date(Date.now() + RESET_TTL_MS),
    },
  });
  return token;
}

export async function consumePasswordResetToken(token: string): Promise<string | null> {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) return null;

  if (record.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return null;
  }

  await prisma.passwordResetToken.delete({ where: { token } });
  return record.email;
}

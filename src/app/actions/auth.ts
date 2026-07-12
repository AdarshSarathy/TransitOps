"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const VALID_ROLES = [
  "Fleet Manager",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst",
] as const;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface LoginState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();

  // ── Input validation ─────────────────────────────────────────────────
  if (!email || !password || !role) {
    return { error: "All fields are required." };
  }

  if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    return { error: "Invalid role selected." };
  }

  // ── Fetch user ───────────────────────────────────────────────────────
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Invalid credentials." };
  }

  // ── Check lockout ────────────────────────────────────────────────────
  if (
    user.failedAttempts >= MAX_FAILED_ATTEMPTS &&
    user.lockedUntil &&
    user.lockedUntil > new Date()
  ) {
    const minutesLeft = Math.ceil(
      (user.lockedUntil.getTime() - Date.now()) / 60000
    );
    return {
      error: `Account locked. Try again in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.`,
    };
  }

  // ── Verify password ─────────────────────────────────────────────────
  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    const newAttempts = user.failedAttempts + 1;
    const updateData: { failedAttempts: number; lockedUntil?: Date } = {
      failedAttempts: newAttempts,
    };

    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const remaining = MAX_FAILED_ATTEMPTS - newAttempts;
    if (remaining > 0) {
      return {
        error: `Invalid credentials. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`,
      };
    }
    return { error: "Account locked after 5 failed attempts. Try again in 15 minutes." };
  }

  // ── Verify role match ───────────────────────────────────────────────
  if (user.role !== role) {
    return { error: "Role does not match the account." };
  }

  // ── Success — reset counter & create session ─────────────────────────
  await prisma.user.update({
    where: { id: user.id },
    data: { failedAttempts: 0, lockedUntil: null },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

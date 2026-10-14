import { randomInt } from "node:crypto";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { OtpCodeModel } from "@/models";
import { hashPassword } from "@/lib/auth";
import { sendSms } from "@/lib/sms";
import { normalizeIranianMobile } from "@/lib/phone";
import { fail, ok } from "@/lib/api";
import { getIntegration } from "@/lib/integrations/service";

const input = z.object({
  phone: z.string().trim().min(10).max(20),
  purpose: z.enum(["booking", "login", "register"]).default("booking"),
});

export async function POST(req: Request) {
  try {
    const p = input.safeParse(await req.json());
    if (!p.success) return fail("Invalid OTP request", 422, p.error.flatten());
    
    let phone: string;
    try {
      phone = normalizeIranianMobile(p.data.phone);
    } catch {
      return fail("Invalid phone number", 422);
    }

    if (!await getIntegration("sms")) {
      return fail("No active SMS provider is configured in the admin panel", 503);
    }

    const code = String(randomInt(100000, 1000000));
    const codeHash = await hashPassword(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Strictly persist in database
    await connectDB();
    const windowStart = new Date(Date.now() - 10 * 60 * 1000);
    const recent = await OtpCodeModel.countDocuments({
      phone,
      purpose: p.data.purpose,
      createdAt: { $gte: windowStart },
    });
    if (recent >= 5) {
      return fail("Too many OTP requests. Try again later.", 429);
    }

    await OtpCodeModel.create({
      phone,
      codeHash,
      purpose: p.data.purpose,
      expiresAt,
    });

    try {
      await sendSms(phone, "کد تأیید کلینیک: " + code);
    } catch (error) {
      try {
        await OtpCodeModel.deleteOne({ phone, purpose: p.data.purpose, codeHash });
      } catch {}
      throw error;
    }

    return ok({
      expiresAt,
      debugCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to send OTP", 500);
  }
}

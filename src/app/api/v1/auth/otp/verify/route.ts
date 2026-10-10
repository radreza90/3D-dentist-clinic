import { z } from "zod";
import { connectDB } from "@/lib/db";
import { OtpCodeModel } from "@/models";
import { verifyPassword, signOtpVerificationToken } from "@/lib/auth";
import { normalizeIranianMobile } from "@/lib/phone";
import { fail, ok } from "@/lib/api";

const input=z.object({
  phone:z.string().trim().min(10).max(20),
  code:z.string().regex(/^\d{6}$/),
  purpose:z.enum(["booking","login","register"]).default("booking"),
});

export async function POST(req:Request){
  try{
    const p=input.safeParse(await req.json());
    if(!p.success)return fail("Invalid OTP verification",422,p.error.flatten());
    let phone:string;
    try{phone=normalizeIranianMobile(p.data.phone);}catch{return fail("Invalid phone number",422);}

    let otp: any = null;
    try {
      await connectDB();
      otp=await OtpCodeModel.findOne({
        phone,purpose:p.data.purpose,usedAt:null,expiresAt:{$gt:new Date()},
      }).sort({createdAt:-1});
    } catch {}

    const { inMemoryOtp } = await import("@/lib/memory-store");
    const memKey = phone+":"+p.data.purpose;
    const memOtp = inMemoryOtp.get(memKey);

    if(!otp && (!memOtp || memOtp.usedAt !== null || memOtp.expiresAt.getTime() <= Date.now())) {
      return fail("OTP is invalid or expired",400);
    }

    const targetHash = otp ? otp.codeHash : memOtp!.codeHash;
    const attempts = otp ? (otp.attempts || 0) : memOtp!.attempts;
    if(attempts >= 5) return fail("Too many attempts. Request a new OTP.",429);

    const valid=await verifyPassword(p.data.code, targetHash);
    if(!valid){
      if(otp) {
        try { await OtpCodeModel.updateOne({_id:otp._id},{$inc:{attempts:1}}); } catch {}
      }
      if(memOtp) memOtp.attempts += 1;
      return fail("OTP is invalid",400);
    }

    if(otp) {
      try {
        await OtpCodeModel.updateOne({_id:otp._id},{$set:{usedAt:new Date()}});
      } catch {}
    }
    if(memOtp) {
      memOtp.usedAt = new Date();
    }

    const verificationToken=await signOtpVerificationToken(phone,p.data.purpose);
    return ok({verificationToken,phone,purpose:p.data.purpose});
  }catch(e){return fail(e instanceof Error?e.message:"Unable to verify OTP",500);}
}

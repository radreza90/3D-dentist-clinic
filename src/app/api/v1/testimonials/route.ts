import { connectDB } from "@/lib/db";
import { TestimonialModel } from "@/models";
import { ok, fail } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const items = await TestimonialModel.find({ status: "published" })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return ok(items);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to load testimonials", 500);
  }
}

import { connectDB } from "@/lib/db";
import { TestimonialModel } from "@/models";
import { getAuth, can } from "@/lib/rbac";
import { ok, fail } from "@/lib/api";

function normalizeLocalized(value: unknown) {
  if (typeof value === "string") return { fa: value.trim(), en: "" };
  if (typeof value !== "object" || value === null) return { fa: "", en: "" };
  const item = value as Record<string, unknown>;
  return {
    fa: typeof item.fa === "string" ? item.fa.trim() : "",
    en: typeof item.en === "string" ? item.en.trim() : "",
  };
}

export async function GET(req: Request) {
  const auth = await getAuth(req as never);
  if (!auth || !can(String(auth.role), "content:read")) return fail("Forbidden", 403);

  try {
    await connectDB();
    const items = await TestimonialModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return ok(items);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to load testimonials", 500);
  }
}

export async function POST(req: Request) {
  const auth = await getAuth(req as never);
  if (!auth || !can(String(auth.role), "content:write")) return fail("Forbidden", 403);

  try {
    const body = await req.json();
    const patientName = normalizeLocalized(body?.patientName);
    if (!patientName.fa && !patientName.en) {
      return fail("نام مراجعه‌کننده الزامی است", 422);
    }

    const treatment = normalizeLocalized(body?.treatment);
    const comment = normalizeLocalized(body?.comment);
    const videoUrl = typeof body?.videoUrl === "string" ? body.videoUrl.trim() : "";
    const coverImageUrl = typeof body?.coverImageUrl === "string" ? body.coverImageUrl.trim() : "";
    const rating = Math.min(5, Math.max(1, Number(body?.rating) || 5));
    const status = ["published", "draft", "archived"].includes(body?.status) ? body.status : "published";
    const sortOrder = Number(body?.sortOrder) || 0;
    const featured = Boolean(body?.featured);

    await connectDB();
    const created = await TestimonialModel.create({
      patientName,
      treatment,
      comment,
      videoUrl,
      coverImageUrl,
      rating,
      status,
      sortOrder,
      featured,
    });

    return ok(created, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to create testimonial", 500);
  }
}

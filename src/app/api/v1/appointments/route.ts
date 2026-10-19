import { connectDB } from "@/lib/db";
import { AppointmentModel, ServiceModel } from "@/models";
import { ok, fail } from "@/lib/api";
import { can, getAuth } from "@/lib/rbac";
import { normalizeIranianMobile } from "@/lib/phone";

export async function GET(req: Request) {
  try {
    const auth = await getAuth(req as never);
    if (!auth) return fail("Authentication required", 401);
    let items: any[] = [];
    try {
      await connectDB();
      const filter = can(String(auth.role), "appointments:read")
        ? { status: { $nin: ["cancelled"] } }
        : { userId: String(auth.sub), status: { $nin: ["cancelled"] } };

      items = await AppointmentModel.find(filter)
        .populate("serviceId", "title")
        .populate("doctorId", "name")
        .sort({ startsAt: 1 })
        .limit(100)
        .lean();
    } catch {}
    return ok(items);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to load appointments", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serviceId = String(body.serviceId || "").trim();
    const name = String(body.name || "").trim();
    const rawPhone = String(body.phone || "").trim();
    const date = String(body.date || "").trim();
    const time = String(body.time || "10:00").trim();
    const note = String(body.note || "").trim();

    if (!serviceId) {
      return fail("انتخاب نوع خدمت الزامی است", 422);
    }
    if (!name || name.length < 3) {
      return fail("نام و نام خانوادگی را به صورت کامل وارد کنید (حداقل ۳ حرف)", 422);
    }

    let phone: string;
    try {
      phone = normalizeIranianMobile(rawPhone);
    } catch {
      return fail("شماره موبایل وارد شده معتبر نیست", 422);
    }

    await connectDB();
    const service = await ServiceModel.findOne({ _id: serviceId, status: "published" }).lean();
    if (!service) {
      return fail("خدمت انتخاب شده معتبر نیست یا غیرفعال شده است", 404);
    }

    // Determine appointment start and end times
    let startsAt: Date;
    let endsAt: Date;

    if (body.startsAt && body.endsAt) {
      startsAt = new Date(body.startsAt);
      endsAt = new Date(body.endsAt);
    } else {
      const datePart = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(Date.now() + 86400000).toISOString().split("T")[0];
      const [hours, minutes] = (time.includes(":") ? time.split(":") : ["10", "00"]).map(Number);
      startsAt = new Date(`${datePart}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000Z`);
      endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
    }

    const slotKey = `${startsAt.toISOString().split("T")[0]}_${startsAt.getUTCHours()}:${startsAt.getUTCMinutes()}_${serviceId}_${phone.slice(-4)}`;

    // Assign doctor if selected by patient, otherwise null for admin triage
    const doctorIdToAssign = body.doctorId && body.doctorId !== "any" && /^[a-f\d]{24}$/i.test(String(body.doctorId))
      ? String(body.doctorId)
      : null;

    const appointment = await AppointmentModel.create({
      patientSnapshot: {
        name,
        phone,
      },
      serviceId: service._id,
      doctorId: doctorIdToAssign,
      startsAt,
      endsAt,
      timezone: "Asia/Tehran",
      slotKey,
      customerNote: note,
      status: "paid_pending_assignment",
      paymentStatus: "unpaid",
      source: "web",
    });

    return ok({
      appointmentId: appointment._id,
      serviceTitle: service.title?.fa || service.slug,
      startsAt: appointment.startsAt,
      status: appointment.status,
      message: "درخواست رزرو نوبت شما با موفقیت ثبت شد و پس از بررسی و هماهنگی پزشک توسط پذیرش کلینیک با شما تماس گرفته خواهد شد.",
    }, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا در ثبت نوبت", 500);
  }
}

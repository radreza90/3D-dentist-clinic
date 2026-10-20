import { connectDB } from "@/lib/db";
import { AppointmentModel, ScheduleExceptionModel, ScheduleModel, ServiceModel, SiteSettingsModel } from "@/models";
import { ok, fail } from "@/lib/api";
import { can, getAuth } from "@/lib/rbac";
import { normalizeIranianMobile } from "@/lib/phone";
import { weekdayForDate } from "@/lib/timezone";

function localDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter(part => part.type !== "literal").map(part => [part.type, part.value]));

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minute: Number(values.hour) * 60 + Number(values.minute),
  };
}

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

    let startsAt: Date;
    let endsAt: Date;

    if (body.startsAt !== undefined || body.endsAt !== undefined) {
      if (typeof body.startsAt !== "string" || typeof body.endsAt !== "string") {
        return fail("زمان شروع و پایان نوبت معتبر نیست", 422);
      }
      startsAt = new Date(body.startsAt);
      endsAt = new Date(body.endsAt);
    } else {
      const datePart = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(Date.now() + 86400000).toISOString().split("T")[0];
      const [hours, minutes] = (time.includes(":") ? time.split(":") : ["10", "00"]).map(Number);
      startsAt = new Date(`${datePart}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000Z`);
      endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
    }

    const duration = endsAt.getTime() - startsAt.getTime();
    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime()) ||
      startsAt.getTime() <= Date.now() ||
      duration < 5 * 60 * 1000 ||
      duration > 4 * 60 * 60 * 1000
    ) {
      return fail("زمان نوبت معتبر نیست یا گذشته است", 422);
    }

    let timezone = "Asia/Tehran";
    if (body.startsAt !== undefined) {
      const settings = await SiteSettingsModel.findOne({ key: "main" }).select("timezone").lean();
      timezone = settings?.timezone || process.env.CLINIC_TIMEZONE || timezone;
      const local = localDateParts(startsAt, timezone);
      const weekday = weekdayForDate(local.date, timezone);
      const exception = await ScheduleExceptionModel.findOne({ date: local.date, doctorId: null }).lean();
      if (exception?.closed) {
        return fail("کلینیک در این تاریخ تعطیل است", 409);
      }

      let schedules = await ScheduleModel.find({ active: true, dayOfWeek: weekday, doctorId: null }).lean();
      if (!schedules.length) {
        schedules = await ScheduleModel.find({ active: true, dayOfWeek: weekday }).lean();
      }
      if (!schedules.length) {
        schedules = [{ startMinutes: 540, endMinutes: 1020, slotDuration: 30 }];
      }

      const appointmentMinutes = duration / 60000;
      const matchesSchedule = startsAt.getUTCSeconds() === 0 &&
        startsAt.getUTCMilliseconds() === 0 &&
        schedules.some(schedule =>
          local.minute >= schedule.startMinutes &&
          local.minute + appointmentMinutes <= schedule.endMinutes &&
          (local.minute - schedule.startMinutes) % schedule.slotDuration === 0 &&
          appointmentMinutes === schedule.slotDuration
        );
      if (!matchesSchedule) {
        return fail("زمان انتخاب‌شده در برنامه نوبت‌دهی کلینیک نیست", 409);
      }
    }

    const slotKey = startsAt.toISOString();
    const occupied = await AppointmentModel.exists({
      startsAt: { $lt: endsAt },
      endsAt: { $gt: startsAt },
      status: { $in: ["pending_payment", "paid_pending_assignment", "confirmed"] },
    });
    if (occupied) {
      return fail("این زمان نوبت پیش‌تر رزرو شده است", 409);
    }

    const appointment = await AppointmentModel.create({
      patientSnapshot: {
        name,
        phone,
      },
      serviceId: service._id,
      doctorId: null,
      startsAt,
      endsAt,
      timezone,
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
    if (typeof e === "object" && e !== null && "code" in e && (e as { code?: number }).code === 11000) {
      return fail("این زمان نوبت پیش‌تر رزرو شده است", 409);
    }
    return fail(e instanceof Error ? e.message : "خطا در ثبت نوبت", 500);
  }
}

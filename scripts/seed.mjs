import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
if (!adminEmail || !adminPassword) throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required");

await mongoose.connect(uri);

const localized = { type: { fa: String, en: String }, default: () => ({ fa: "", en: "" }) };
const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  passwordHash: String, firstName: String, lastName: String, role: String, isActive: Boolean, lastLoginAt: Date
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  slug: { type: String, unique: true, index: true },
  title: localized, excerpt: localized, content: localized,
  suitableFor: localized, benefits: localized, limitations: localized, careInstructions: localized,
  bookingFee: { type: Number, default: 0 }, currency: { type: String, default: "IRR" },
  status: { type: String, default: "published" },
  duration: String, warranty: String, category: String
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
  slug: { type: String, unique: true, index: true },
  name: localized, shortBio: localized, bio: localized,
  specialty: String, medicalCode: String, university: localized,
  clinicDays: String, image: String, status: { type: String, default: "published" }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  slug: { type: String, unique: true, index: true },
  title: localized, excerpt: localized, content: localized,
  category: String, readTime: String, date: String, coverUrl: String,
  status: { type: String, default: "published" }
}, { timestamps: true });

const siteSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  clinicName: localized, description: localized,
  phones: [String], whatsapp: String, address: localized, timezone: String
}, { timestamps: true });

const scheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, default: null },
  dayOfWeek: { type: Number, required: true },
  startMinutes: { type: Number, required: true },
  endMinutes: { type: Number, required: true },
  slotDuration: { type: Number, default: 30 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const integrationSchema = new mongoose.Schema({
  key: { type: String, unique: true, index: true },
  type: String, provider: String,
  name: { fa: String, en: String },
  description: { fa: String, en: String },
  enabled: Boolean, isDefault: Boolean,
  configEncrypted: String, configVersion: Number
}, { timestamps: true });

const User = mongoose.models.SeedUser || mongoose.model("SeedUser", userSchema, "users");
const Service = mongoose.models.SeedService || mongoose.model("SeedService", serviceSchema, "services");
const Doctor = mongoose.models.SeedDoctor || mongoose.model("SeedDoctor", doctorSchema, "doctors");
const BlogPost = mongoose.models.SeedBlogPost || mongoose.model("SeedBlogPost", blogSchema, "blogposts");
const Site = mongoose.models.SeedSite || mongoose.model("SeedSite", siteSchema, "sitesettings");
const Schedule = mongoose.models.SeedSchedule || mongoose.model("SeedSchedule", scheduleSchema, "schedules");
const Integration = mongoose.models.SeedIntegration || mongoose.model("SeedIntegration", integrationSchema, "integrations");

// Admin user
await User.findOneAndUpdate(
  { email: adminEmail.toLowerCase() },
  { email: adminEmail.toLowerCase(), passwordHash: await bcrypt.hash(adminPassword, 12), role: "super_admin", isActive: true },
  { upsert: true, setDefaultsOnInsert: true }
);

// Published services
const servicesData = [
  {
    slug: "implant",
    title: { fa: "ایمپلنت دیجیتال و فوری", en: "Digital & Immediate Dental Implants" },
    excerpt: { fa: "کاشت دندان با راهنمای جراحی سه‌بعدی بدون برش لثه و درد، با برندهای معتبر اشترومن و نوبل بایوکر سوئیس.", en: "Guided 3D implant surgery with zero flap." },
    category: "surgical",
    duration: "۱ تا ۲ جلسه",
    warranty: "گارانتی مادام‌العمر",
    status: "published"
  },
  {
    slug: "laminate",
    title: { fa: "لمینت سرامیکی فوق‌نازک E-Max", en: "Ultra-Thin E-Max Ceramic Veneers" },
    excerpt: { fa: "طراحی لبخند طبیعی با سرامیک ای‌مکس آلمانی به ضخامت ۰.۳ میلیمتر بدون تراش مینا و مقاومت بی‌نظیر.", en: "Ultra-thin minimal-prep ceramic veneers." },
    category: "cosmetic",
    duration: "۲ جلسه (۷ روز)",
    warranty: "۱۵ سال گارانتی کتبی",
    status: "published"
  },
  {
    slug: "composite",
    title: { fa: "کامپوزیت ونیر زیبایی و لایه‌بندی", en: "Layered Cosmetic Composite Veneers" },
    excerpt: { fa: "اصلاح فرم، رنگ و بستن فواصل دندانی در یک جلسه با کامپوزیت‌های نانو سرامیک توکویاما ژاپن و گرادیا.", en: "Single-visit smile makeover with nano-ceramics." },
    category: "cosmetic",
    duration: "۱ جلسه",
    warranty: "۵ سال خدمات پالیش",
    status: "published"
  },
  {
    slug: "smile-design",
    title: { fa: "طراحی مهندسی و دیجیتال لبخند (DSD)", en: "Digital Smile Design Architecture" },
    excerpt: { fa: "شبیه‌سازی سه‌بعدی چهره و فرم دندان‌ها قبل از شروع درمان متناسب با خطوط لبخند و فرم صورت شما.", en: "3D facial smile architecture and mock-up." },
    category: "cosmetic",
    duration: "۱ جلسه آنالیز",
    warranty: "تضمین رضایت پیش از اجرا",
    status: "published"
  },
  {
    slug: "bleaching",
    title: { fa: "بلیچینگ سفیدکننده مطب و خانگی", en: "Professional In-Office & Home Bleaching" },
    excerpt: { fa: "سفید کردن دندان‌ها با لیزر و ژل‌های استاندارد اولترادنت آمریکا بدون حساسیت دندانی تا ۸ درجه روشن‌تر.", en: "Laser-assisted whitening up to 8 shades." },
    category: "cosmetic",
    duration: "۴۵ دقیقه",
    warranty: "پایداری ماندگار",
    status: "published"
  },
  {
    slug: "root-canal",
    title: { fa: "درمان ریشه تخصصی میکروسکوپی", en: "Microscopic Endodontic Root Canal" },
    excerpt: { fa: "عصب‌کشی دقیق با روتاری دیجیتال و هدایت میکروسکوپ جراحی جهت نجات دندان‌های آسیب‌دیده با ماندگاری کامل.", en: "Painless rotary endodontic treatment." },
    category: "restorative",
    duration: "۱ جلسه",
    warranty: "تضمین سلامت ریشه",
    status: "published"
  },
];

for (const s of servicesData) {
  await Service.findOneAndUpdate(
    { slug: s.slug },
    { ...s, bookingFee: 0, currency: "IRR" },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

// Published Doctors
const doctorsData = [
  {
    slug: "dr-alireza-moradi",
    name: { fa: "دکتر علیرضا مرادی", en: "Dr. Alireza Moradi" },
    specialty: "فوق تخصص جراحی لثه و ایمپلنتولوژی",
    medicalCode: "نظام پزشکی: ۷۸۲۱۰",
    university: { fa: "استاد دانشگاه و عضو انجمن ایمپلنتولوژی اروپا (EAO)", en: "EAO Board Member" },
    shortBio: { fa: "بیش از ۱۶ سال تجربه در جراحی‌های پیچیده فک، بازسازی استخوان و کاشت فوری ایمپلنت‌های دیجیتال بدون برش.", en: "Senior implantologist & periodontist." },
    clinicDays: "شنبه، دوشنبه، چهارشنبه (عصر)",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    status: "published"
  },
  {
    slug: "dr-maryam-afshar",
    name: { fa: "دکتر مریم افشار", en: "Dr. Maryam Afshar" },
    specialty: "متخصص دندانپزشکی ترمیمی و زیبایی",
    medicalCode: "نظام پزشکی: ۹۱۴۰۵",
    university: { fa: "فارغ‌التحصیل ممتاز دانشگاه تهران و عضو آکادمی دندانپزشکی زیبایی آمریکا (AACD)", en: "AACD Active Member" },
    shortBio: { fa: "هنرمند طراحی لبخند، فوق تخصص در لمینت‌های سرامیکی فوق‌نازک کانتورینگ و درمان‌های بدون تراش مینا.", en: "Cosmetic dentistry & smile design specialist." },
    clinicDays: "یکشنبه، سه‌شنبه، پنجشنبه (صبح و عصر)",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    status: "published"
  },
  {
    slug: "dr-farhad-kamali",
    name: { fa: "دکتر فرهاد کمالی", en: "Dr. Farhad Kamali" },
    specialty: "متخصص درمان ریشه (اندودنتیست)",
    medicalCode: "نظام پزشکی: ۸۴۶۲۰",
    university: { fa: "بورد تخصصی اندودانتیکس و فلوشیپ میکروسرجری ریشه از آلمان", en: "Microscopic Endodontics Fellowship" },
    shortBio: { fa: "درمان تخصصی کانال‌های کلسیفیه و جراحی‌های انتهای ریشه با بهره‌گیری از میکروسکوپ پیشرفته زایس آلمان.", en: "Microscopic root canal specialist." },
    clinicDays: "شنبه تا چهارشنبه (با هماهنگی)",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    status: "published"
  }
];

for (const d of doctorsData) {
  await Doctor.findOneAndUpdate(
    { slug: d.slug },
    d,
    { upsert: true, setDefaultsOnInsert: true }
  );
}

// Published Blog Posts
const blogData = [
  {
    slug: "digital-implant-guide",
    title: { fa: "راهنمای جامع ایمپلنت دیجیتال؛ چرا بدون درد و خونریزی است؟", en: "Complete Guide to Digital Implants" },
    excerpt: { fa: "بررسی تفاوت جراحی هدایت‌شده کامپیوتری با روش‌های سنتی و چرایی بهبودی ۲ برابری بافت استخوان و لثه.", en: "Why guided 3D implants heal twice as fast." },
    category: "ایمپلنت و جراحی",
    readTime: "۵ دقیقه مطالعه",
    date: "۲۲ بهمن ۱۴۰۳",
    coverUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    status: "published"
  },
  {
    slug: "laminate-vs-composite",
    title: { fa: "لمینت سرامیکی یا کامپوزیت ونیر؟ مقایسه جامع ماندگاری و هزینه", en: "Ceramic Laminates vs Composite Veneers" },
    excerpt: { fa: "پاسخ تخصصی به پرتکرارترین دوراهی مراجعین زیبایی همراه با تحلیل طول عمر و مراقبت‌های بالینی هر روش.", en: "A clinical comparison between veneers." },
    category: "زیبایی و طراحی لبخند",
    readTime: "۶ دقیقه مطالعه",
    date: "۱۴ بهمن ۱۴۰۳",
    coverUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    status: "published"
  },
  {
    slug: "post-op-care",
    title: { fa: "مراقبت‌های حیاتی پس از کاشت دندان برای تضمین پیوند استخوان", en: "Vital Care Instructions After Dental Implants" },
    excerpt: { fa: "نکات تغذیه‌ای، شستشو و داروهای الزامی در ۲ هفته طلایی پس از درمان برای پیشگیری از تحلیل استخوان.", en: "Nutritional and oral hygiene advice after surgery." },
    category: "مراقبت‌های درمانی",
    readTime: "۴ دقیقه مطالعه",
    date: "۰۲ بهمن ۱۴۰۳",
    coverUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    status: "published"
  }
];

for (const b of blogData) {
  await BlogPost.findOneAndUpdate(
    { slug: b.slug },
    b,
    { upsert: true, setDefaultsOnInsert: true }
  );
}

// Schedules for standard clinic days (Saturday to Thursday: 09:00 - 18:00)
for (let day = 0; day <= 5; day++) {
  await Schedule.findOneAndUpdate(
    { doctorId: null, dayOfWeek: day },
    { doctorId: null, dayOfWeek: day, startMinutes: 540, endMinutes: 1080, slotDuration: 30, active: true },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

// Site settings
await Site.findOneAndUpdate(
  { key: "main" },
  {
    key: "main",
    clinicName: { fa: "کلینیک فوق‌تخصصی دندانپزشکی و معماری لبخند", en: "Specialized Dental & Smile Architecture Clinic" },
    description: { fa: "ارائه خدمات برتر دندانپزشکی دیجیتال، ایمپلنت و زیبایی با استانداردهای نوین بین‌المللی", en: "Excellence in digital dentistry" },
    phones: ["۰۲۱-۸۸۸۸۰۱۲۰", "۰۹۱۲۰۰۰۰۰۰۰"],
    whatsapp: "09120000000",
    address: { fa: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، برج سروستان، طبقه ۵", en: "Tehran, Valiasr St, Sarvestan Tower, Fl 5" },
    timezone: process.env.CLINIC_TIMEZONE || "Asia/Tehran"
  },
  { upsert: true, setDefaultsOnInsert: true }
);

// Integrations
const integrationModules = [
  ["payment", "mock", "درگاه آزمایشی", "Mock Gateway", "درگاه آزمایشی فقط برای توسعه", "Development-only mock gateway", process.env.NODE_ENV !== "production"],
  ["payment", "zarinpal", "زرین‌پال", "ZarinPal", "درگاه پرداخت آنلاین زرین‌پال", "ZarinPal online payment gateway", false],
  ["sms", "console", "پیامک کنسول", "Console SMS", "نمایش پیامک در لاگ؛ فقط برای توسعه", "Logs SMS to the server console; development only", process.env.NODE_ENV !== "production"],
  ["sms", "ippanel", "IPPanel", "IPPanel", "پنل پیامک IPPanel برای OTP و یادآوری نوبت", "IPPanel SMS for OTP and appointment reminders", false],
];

for (const [type, provider, fa, en, descriptionFa, descriptionEn, enabled] of integrationModules) {
  await Integration.findOneAndUpdate(
    { type, provider },
    {
      $setOnInsert: {
        key: type + "." + provider,
        type, provider,
        name: { fa, en },
        description: { fa: descriptionFa, en: descriptionEn },
        configEncrypted: "",
        configVersion: 1,
        enabled,
        isDefault: enabled
      }
    },
    { upsert: true }
  );
}

await mongoose.disconnect();
console.log("Database seeded with published services, doctors, articles, and clinic schedules.");

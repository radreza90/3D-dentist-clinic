import { ServiceModel, DoctorModel, BlogPostModel } from "@/models";
import { connectDB } from "@/lib/db";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeBookingWidget } from "@/components/home/HomeBookingWidget";
import { HomeDoctors } from "@/components/home/HomeDoctors";
import { HomePortfolio } from "@/components/home/HomePortfolio";
import { HomeReviews } from "@/components/home/HomeReviews";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeJournal } from "@/components/home/HomeJournal";
import { HomeContactLocation } from "@/components/home/HomeContactLocation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let services: any[] = [];
  let doctors: any[] = [];
  let posts: any[] = [];

  try {
    await connectDB();
    [services, doctors, posts] = await Promise.all([
      ServiceModel.find({ status: "published" }).sort({ createdAt: 1 }).limit(9).lean().catch(() => []),
      DoctorModel.find({ status: "published" }).sort({ createdAt: 1 }).limit(6).lean().catch(() => []),
      BlogPostModel.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).limit(3).lean().catch(() => []),
    ]);
  } catch {
    // Graceful fallback to static luxury data
  }

  // Format services if present in database
  const formattedServices = services?.map((s: any) => ({
    _id: String(s._id),
    slug: s.slug,
    title: {
      fa: s.title?.fa || s.slug,
      en: s.title?.en || "",
    },
    excerpt: {
      fa: s.excerpt?.fa || "",
      en: s.excerpt?.en || "",
    },
    category: s.category || "cosmetic",
    duration: s.duration || "۱ جلسه",
    warranty: s.warranty || "گارانتی اصالت",
    suitableFor: s.suitableFor?.fa || "",
  })) || [];

  // Format doctors if present in database
  const formattedDoctors = doctors?.map((d: any) => ({
    _id: String(d._id),
    slug: d.slug,
    name: {
      fa: d.name?.fa || "",
      en: d.name?.en || "",
    },
    shortBio: {
      fa: d.shortBio?.fa || "",
      en: d.shortBio?.en || "",
    },
    specialty: d.specialty || "متخصص دندانپزشکی",
    medicalCode: d.medicalCode || "کد نظام پزشکی",
    university: d.university?.fa || "دانشگاه علوم پزشکی",
    clinicDays: d.clinicDays || "روزهای حضور: هماهنگی با پذیرش",
    image: d.image || undefined,
  })) || [];

  // Format blog posts if present in database
  const formattedPosts = posts?.map((p: any) => ({
    _id: String(p._id),
    slug: p.slug,
    title: {
      fa: p.title?.fa || "",
      en: p.title?.en || "",
    },
    excerpt: {
      fa: p.excerpt?.fa || "",
      en: p.excerpt?.en || "",
    },
    category: p.category || "مقاله علمی",
    readTime: p.readTime || "۴ دقیقه مطالعه",
    date: p.date || "جدید",
    image: p.coverUrl || undefined,
  })) || [];

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#302A21] selection:bg-[#A09B7C]/20 selection:text-[#625D45]">
      {/* ۱. هیرو اشرافی و تأثیرگذار */}
      <HomeHero />

      {/* ۲. نوار اعتماد و آمار کلینیک */}
      <HomeStats />

      {/* ۳. بخش خدمات تخصصی کلینیک */}
      <HomeServices services={formattedServices} />

      {/* ۴. ویجت هوشمند رزرو نوبت آنلاین سریع */}
      <HomeBookingWidget />

      {/* ۵. کادر پزشکان و جراحان متخصص */}
      <HomeDoctors doctors={formattedDoctors} />

      {/* ۶. اسلایدر مقایسه‌ای Before & After دگرگونی لبخند */}
      <HomePortfolio />

      {/* ۷. نظرات و داستان‌های لبخند بیماران */}
      <HomeReviews />

      {/* ۸. پاسخ به پرسش‌های متداول با آکاردئون هوشمند */}
      <HomeFaq />

      {/* ۹. مجله علمی و مقالات سلامت دندان */}
      <HomeJournal posts={formattedPosts} />

      {/* ۱۰. اطلاعات تماس، ساعات کاری و نقشه کلینیک */}
      <HomeContactLocation />
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Gem, 
  Stethoscope, 
  Smile
} from "lucide-react";

export interface ServiceItem {
  _id: string;
  slug: string;
  title: { fa: string; en: string };
  excerpt?: { fa: string; en: string };
  category?: string;
  duration?: string;
  warranty?: string;
  suitableFor?: string;
}

interface HomeServicesProps {
  services: ServiceItem[];
}

export function HomeServices({ services }: HomeServicesProps) {
  const [activeTab, setActiveTab] = useState("all");

  const fallbackServices: ServiceItem[] = [
    {
      _id: "1",
      slug: "implant",
      title: { fa: "ایمپلنت دیجیتال و کاشت فوری", en: "Digital Guided Dental Implants" },
      excerpt: { 
        fa: "جایگزینی دندان‌های از دست رفته با فیکسچرهای اروپایی و گاید جراحی ۳ بعدی بدون برش لثه و درد.",
        en: "Minimally invasive implant surgery with computer-guided surgical templates."
      },
      category: "surgery",
      duration: "۱ الی ۲ جلسه",
      warranty: "گارانتی مادام‌العمر",
      suitableFor: "افراد با دندان از دست رفته یا بی‌دندانی کامل",
    },
    {
      _id: "2",
      slug: "laminate",
      title: { fa: "لمینت سرامیکی فوق‌نازک E-max", en: "Ultra-thin Ceramic Veneers" },
      excerpt: { 
        fa: "اصلاح دائمی رنگ، فرم و نامنظمی دندان‌ها با پوسته‌های سرامیکی با ضخامت ۰.۳ میلیمتر بدون تراش دندان.",
        en: "Premium smile makeover with ultra-natural translucent ceramics."
      },
      category: "cosmetic",
      duration: "۲ جلسه (۱۰ روزه)",
      warranty: "گارانتی کتبی ۱۰ ساله",
      suitableFor: "بستن فاصله، بدشکلی و زردی مقاوم به بلیچینگ",
    },
    {
      _id: "3",
      slug: "composite",
      title: { fa: "کامپوزیت ونیر لایه‌ای نچرال", en: "Layered Composite Veneers" },
      excerpt: { 
        fa: "طراحی لبخند در یک جلسه با برندهای سرامیک‌بیس ژاپنی و سوئیسی با تکنیک لایه‌گذاری طبیعی و بدون تراش.",
        en: "Same-day artistic smile transformation using premium nanohybrid composites."
      },
      category: "cosmetic",
      duration: "۱ جلسه (۴ ساعت)",
      warranty: "۳ سال پالیش رایگان",
      suitableFor: "اصلاح نامرتبی‌های خفیف و رنگ دندان",
    },
    {
      _id: "4",
      slug: "root-canal",
      title: { fa: "درمان ریشه میکروسکوپی (عصب‌کشی)", en: "Microscopic Root Canal Therapy" },
      excerpt: { 
        fa: "پاکسازی و درمان دقیق کانال‌های دندان با روتاری دیجیتال و میکروسکوپ جراحی جهت نجات دندان‌های آسیب‌دیده.",
        en: "Precision endodontic therapy preserving your natural tooth foundation."
      },
      category: "general",
      duration: "۱ جلسه (۴۵ دقیقه)",
      warranty: "تضمین سلامت ریشه",
      suitableFor: "دردهای شبانه، پوسیدگی‌های عمیق و عفونت",
    },
    {
      _id: "5",
      slug: "orthodontics",
      title: { fa: "ارتودنسی نامرئی و شفاف (اینویزیلاین)", en: "Clear Invisible Aligners" },
      excerpt: { 
        fa: "مرتب‌سازی تخصصی دندان‌ها بدون سیم‌کشی فلزی با پلاک‌های شفاف و متحرک آمریکایی بدون ایجاد محدودیت غذایی.",
        en: "Discreet alignment therapy with custom-molded transparent trays."
      },
      category: "cosmetic",
      duration: "۶ الی ۱۲ ماه",
      warranty: "تضمین تثبیت نهایی",
      suitableFor: "بزرگسالان و جوانان مایل به ارتودنسی نامرئی",
    },
    {
      _id: "6",
      slug: "bleaching",
      title: { fa: "سفید کردن دندان‌ها (بلیچینگ آفیس)", en: "In-Office Laser Teeth Whitening" },
      excerpt: { 
        fa: "روشن‌سازی دندان‌ها تا ۶ درجه در یک جلسه با ژل‌های ضدحساسیت و فعال‌سازی توسط اشعه لیزر ایمن.",
        en: "Fast and safe whitening brightening your enamel shade."
      },
      category: "cosmetic",
      duration: "۱ جلسه (۶۰ دقیقه)",
      warranty: "تثبیت ماندگاری ۲ ساله",
      suitableFor: "زردی ناشی از چای، قهوه و دخانیات",
    },
  ];

  const displayList = services && services.length > 0 ? services : fallbackServices;

  const categories = [
    { id: "all", label: "همه خدمات تخصصی" },
    { id: "cosmetic", label: "زیبایی و طراحی لبخند" },
    { id: "surgery", label: "ایمپلنت و جراحی دیجیتال" },
    { id: "general", label: "درمان ریشه و ترمیمی" },
  ];

  const filteredList = displayList.filter(item => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      
      {/* Seamless Ambient Light Glow */}
      <div 
        className="absolute top-20 right-1/4 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ background: "#A09B7C" }}
      />
      <div 
        className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ background: "#D8AE98" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <span>درمان‌های پیشرفته کلینیک</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#A09B7C]">استاندارد جهانی</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            تکنولوژی نوین برای لبخندی طبیعی و ماندگار
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            تمامی مراحل درمان با استفاده از تجهیزات تمام‌دیجیتال، اسکنرهای نوری پیشرفته و مواد بیوسازگار انجام می‌پذیرد.
          </p>

          {/* Seamless Category Filter Segmented Control */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#FCFAF6] shadow-[0_4px_20px_rgba(48,42,33,0.04)] gap-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeTab === cat.id
                      ? "bg-[#A09B7C] text-white shadow-xs"
                      : "text-[#817C70] hover:text-[#302A21]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seamless Services Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredList.map((service, idx) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                key={service.slug || service._id}
                className="rounded-3xl bg-[#FCFAF6] p-7 flex flex-col justify-between shadow-[0_12px_40px_rgba(48,42,33,0.03)] hover:shadow-[0_24px_55px_rgba(160,155,124,0.12)] hover:-translate-y-1 transition-all duration-300 group text-right"
              >
                <div className="space-y-4">
                  {/* Icon & Unboxed Warranty Metadata */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#A09B7C]/15 text-[#625D45] flex items-center justify-center group-hover:bg-[#A09B7C] group-hover:text-white transition-all duration-300">
                      {idx % 3 === 0 ? (
                        <Gem className="w-6 h-6 text-[#A09B7C] group-hover:text-white transition-colors" />
                      ) : idx % 3 === 1 ? (
                        <Smile className="w-6 h-6 text-[#A09B7C] group-hover:text-white transition-colors" />
                      ) : (
                        <Stethoscope className="w-6 h-6 text-[#A09B7C] group-hover:text-white transition-colors" />
                      )}
                    </div>

                    {service.warranty && (
                      <span className="text-xs font-semibold text-[#817C70] flex items-center gap-1.5 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A09B7C]" />
                        <span>{service.warranty}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & English Subtitle */}
                  <div>
                    <h3 className="text-lg font-bold text-[#302A21] group-hover:text-[#625D45] transition-colors">
                      {service.title.fa}
                    </h3>
                    {service.title.en && (
                      <p className="text-xs text-[#817C70] dir-ltr text-right mt-1 font-mono">
                        {service.title.en}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#817C70] leading-relaxed">
                    {service.excerpt?.fa}
                  </p>

                  {/* Unboxed Metadata details */}
                  <div className="pt-2 text-xs text-[#817C70] flex items-center gap-3">
                    {service.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#A09B7C]" />
                        <span>طول درمان: {service.duration}</span>
                      </span>
                    )}
                  </div>

                  {service.suitableFor && (
                    <div className="text-xs text-[#817C70] flex items-start gap-1.5 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A09B7C] shrink-0 mt-0.5" />
                      <span>مناسب برای: {service.suitableFor}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Link */}
                <div className="pt-6 mt-4 border-t border-[#E8E2D5]/40 flex items-center justify-between">
                  <a
                    href="#booking"
                    className="text-xs font-semibold text-[#A09B7C] hover:text-[#625D45] flex items-center gap-1.5 transition-colors"
                  >
                    <span>رزرو وقت این خدمت</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[11px] text-[#817C70]">مشاوره رایگان</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

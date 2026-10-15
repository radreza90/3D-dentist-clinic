"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { 
  Scan, 
  Cpu, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link";

export function HomeTechnology() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "scanner",
      icon: Scan,
      title: "اسکن دیجیتال ۳D دهان",
      enTitle: "Intraoral 3D Scanning",
      badge: "دقت ۲۰ میکرون",
      description: "حذف کامل خمیرهای قالب‌گیری سنتی. ثبت میلی‌متری تمامی شیارها و بافت دندان توسط دوربین نوری پرسرعت در کمتر از ۳ دقیقه.",
      specs: ["بدون احساس تهوع یا ناراحتی", "انتقال آنی به لابراتوار دیجیتال", "شبیه‌سازی دقیق بایت فکی"],
    },
    {
      id: "dsd",
      icon: Sparkles,
      title: "طراحی دیجیتال لبخند (DSD)",
      enTitle: "Digital Smile Design",
      badge: "هوش مصنوعی و آنالیز چهره",
      description: "طراحی هندسی لبخند متناسب با تناسبات لب، بینی و خط چانه بیمار، به شما امکان می‌دهد قبل از لمس اولین دندان، فرم نهایی را ببینید.",
      specs: ["تطابق با بیومکانیک صورت", "امکان تغییر فرم دندان در مانیتور", "تأیید طرح درمان توسط مراجع"],
    },
    {
      id: "cadcam",
      icon: Cpu,
      title: "تراش میکرونی CAD/CAM",
      enTitle: "Robotic Milling",
      badge: "سرامیک زیرکونیا و E-max",
      description: "ساخت اختصاصی روکش‌ها و لمینت‌های سرامیکی با دستگاه‌های فرز ۵ محوره با صیقل دست‌ساز اساتید دندانسازی کلینیک.",
      specs: ["فیت حاشیه‌ای بی‌نقص", "ماندگاری رنگ تا سال‌ها", "سازگاری کامل با لثه"],
    },
    {
      id: "cbct",
      icon: Layers,
      title: "تصویربرداری ۳D CBCT",
      enTitle: "Guided Implantology",
      badge: "پرتونگاری کم‌دوز Ultra Low",
      description: "بررسی عمق و تراکم استخوان فک در زوایای ۳۶۰ درجه برای کاشت ایمپلنت با شابلون جراحی کامپیوتری بدون برش وسیع.",
      specs: ["حداقل خونریزی و تورم", "بهبود بسیار سریع دوره نقاهت", "موفقیت ۹۹.۸٪ کاشت"],
    },
  ];

  return (
    <section id="technology" className="py-24 sm:py-32 relative bg-[#F7F4EE] overflow-hidden text-right border-t border-[#E8E2D5]/60">
      
      {/* Subtle organic light accent */}
      <div 
        className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ background: "#D8AE98" }}
      />
      <div 
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "#A09B7C" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4 max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A09B7C]/15 text-[#625D45] text-xs font-semibold">
            <Scan className="w-3.5 h-3.5 text-[#A09B7C]" />
            <span>اسکرول تریگر · معماری دیجیتال کلینیک</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#302A21] leading-tight tracking-tight">
            دقت میکرونی با تکنولوژی
            <br />
            <span className="text-[#A09B7C]">سه‌بعدی و هوش مصنوعی</span>
          </h2>

          <p className="text-sm sm:text-base text-[#817C70] leading-relaxed">
            ما هنر زیبایی‌شناسی دندانپزشکی را با مدرن‌ترین تجهیزات تصویربرداری و اسکن سه‌بعدی ترکیب کرده‌ایم تا هر درمان با پیش‌بینی‌پذیری کامل و بدون درد انجام شود.
          </p>
        </div>

        {/* Layout Grid: 3D Inspection Canvas Area + Interactive Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Right Column: 4 Interactive Feature Tabs (RTL) */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isActive = activeFeature === idx;

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => setActiveFeature(idx)}
                  className={`p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-300 border ${
                    isActive 
                      ? "bg-[#FCFAF6] border-[#A09B7C] shadow-[0_16px_40px_rgba(160,155,124,0.14)]" 
                      : "bg-[#FCFAF6]/60 border-[#E8E2D5]/70 hover:border-[#A09B7C]/50 hover:bg-[#FCFAF6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                        isActive ? "bg-[#625D45] text-white" : "bg-[#A09B7C]/15 text-[#625D45]"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#302A21]">
                          {feature.title}
                        </h3>
                        <span className="text-xs text-[#817C70] font-mono">
                          {feature.enTitle}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#A09B7C]/10 text-[#625D45] whitespace-nowrap">
                      {feature.badge}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-[#E8E2D5]/70 space-y-3"
                    >
                      <p className="text-xs sm:text-sm text-[#817C70] leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {feature.specs.map((spec) => (
                          <div key={spec} className="flex items-center gap-2 text-xs text-[#302A21] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#A09B7C] shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Left Column: Spatial Visual Anchor & 3D Stage Callout */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-lg aspect-square rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              
              {/* Concentric Decorative Architectural Rings */}
              <div className="absolute inset-0 rounded-full border border-[#E8E2D5]/80 pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-dashed border-[#A09B7C]/40 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-[#D8AE98]/30 pointer-events-none" />

              {/* The fixed 3D canvas hovers seamlessly right in this space on desktop scroll! */}
              <div className="relative z-10 space-y-4 max-w-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#E8E2D5] text-xs font-semibold text-[#625D45] shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#D8AE98]" />
                  <span>اسکن آناتومیک زنده · تحلیل تاج و ریشه</span>
                </div>

                <div className="h-44 sm:h-52 flex items-center justify-center">
                  {/* Subtle placeholder for layout flow; the 3D model glides here smoothly */}
                </div>

                <p className="text-xs text-[#817C70] leading-relaxed">
                  با اسکرول در این بخش، زاویه دندان برای نمایش شیارهای اکلوزال و لایه‌های مینا تغییر می‌کند.
                </p>

                <div className="pt-2">
                  <Link
                    href="#booking"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#625D45] hover:text-[#302A21] transition-colors"
                  >
                    <span>رزرو اسکن دیجیتال در ویزیت اول</span>
                    <ArrowUpRight className="w-4 h-4 text-[#A09B7C]" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  SlidersHorizontal,
  CalendarCheck
} from "lucide-react";

export interface PortfolioCase {
  id: string;
  title: string;
  description: string;
  treatment: string;
  doctor: string;
  duration: string;
  beforeImg: string;
  afterImg: string;
}

export function HomePortfolio() {
  const cases: PortfolioCase[] = [
    {
      id: "case-1",
      title: "اصلاح کامل طرح لبخند با ۸ واحد لمینت سرامیکی E-max",
      description: "بیمار ۳۲ ساله با شکایت از کوتاهی دندان‌ها، لکه‌های تتراسایکلین و نامرتبی خفیف قدامی. درمان بدون تراش با شید رنگ طبیعی BL3 انجام شد.",
      treatment: "لمینت سرامیکی E-max",
      doctor: "دکتر مریم احمدی",
      duration: "۲ جلسه (۱۰ روز کاری)",
      beforeImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "case-2",
      title: "کاشت ایمپلنت فوری و پروتز زیرکونیا در ناحیه زیبایی",
      description: "جایگزینی دندان پیشین از دست رفته با فیکسچر اشترومن سوئیس و بازسازی قرینه خط لثه با پروتکل تمام دیجیتال بدون جراحی باز.",
      treatment: "ایمپلنت دیجیتال فوری",
      doctor: "دکتر علی رضایی",
      duration: "۱ جلسه جراحی + تحویل پروتز",
      beforeImg: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
      afterImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "case-3",
      title: "بستن فاصله بین دندانی (دیاستم) با کامپوزیت لایه‌ای نچرال",
      description: "بستن فواصل دندان‌های قدامی فک بالا بدون کوچک‌ترین آسیب یا تراش مینای دندان در یک جلسه با هنر لایه‌گذاری رنگ‌های انسیزال و دنتین.",
      treatment: "کامپوزیت ونیر لایه‌ای",
      doctor: "دکتر مریم احمدی",
      duration: "۱ جلسه (۳ ساعت)",
      beforeImg: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
      afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100

  const currentCase = cases[selectedCaseIdx];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : ('clientX' in e ? e.clientX : undefined);
    if (clientX === undefined) return;
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      
      {/* Ambient Seamless Lighting */}
      <div 
        className="absolute top-1/2 right-10 w-96 h-96 rounded-full blur-[150px] opacity-25 pointer-events-none"
        style={{ background: "#D8AE98" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <span>دگرگونی لبخند مراجعین</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#A09B7C]">قبل و بعد از درمان</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            نتیجه واقعی هنر و دقت پزشکان کلینیک
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            اهرم تعاملی را به چپ و راست حرکت دهید تا نتیجه تغییر لبخند مراجعین را قبل و بعد از درمان مقایسه کنید.
          </p>

          {/* Seamless Case Switcher Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#FCFAF6] shadow-[0_4px_20px_rgba(48,42,33,0.04)] gap-1">
              {cases.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    selectedCaseIdx === idx
                      ? "bg-[#A09B7C] text-white shadow-xs"
                      : "text-[#817C70] hover:text-[#302A21]"
                  }`}
                >
                  کیس {idx + 1}: {c.treatment}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Interactive Showcase - Seamless Card */}
        <div className="rounded-3xl bg-[#FCFAF6] p-7 sm:p-10 shadow-[0_20px_50px_rgba(48,42,33,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Interactive Before/After Split Viewer */}
            <div className="lg:col-span-7">
              <div 
                className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(48,42,33,0.08)] select-none bg-black/5 cursor-ew-resize"
                onMouseMove={(e) => {
                  if (e.buttons === 1) handleSliderMove(e);
                }}
                onClick={handleSliderMove}
                onTouchMove={handleSliderMove}
              >
                {/* After Image (Background) */}
                <Image
                  src={currentCase.afterImg}
                  alt="بعد از درمان"
                  fill
                  className="object-cover object-center pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Before Image (Clipped Overlay) */}
                <div 
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="absolute inset-0 w-full h-full" style={{ width: `calc(100% * 100 / ${sliderPosition})` }}>
                    <Image
                      src={currentCase.beforeImg}
                      alt="قبل از درمان"
                      fill
                      className="object-cover object-center pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Dividing Line & Draggable Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-md"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#A09B7C] text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                </div>

                {/* Labels on image */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                    قبل از درمان
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-[#A09B7C]/90 backdrop-blur-md text-white text-[11px] font-medium">
                    بعد از درمان (نتیجه نهایی)
                  </span>
                </div>

                {/* Interaction Instruction */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-[#302A21]/70 backdrop-blur-md text-white/90 text-[10px]">
                    برای مقایسه، خط سفید را بکشید یا کلیک کنید
                  </span>
                </div>
              </div>
            </div>

            {/* Case Information Narrative */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-right">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-[#A09B7C]">
                  {currentCase.treatment}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#302A21] leading-snug">
                  {currentCase.title}
                </h3>

                <p className="text-sm text-[#817C70] leading-relaxed">
                  {currentCase.description}
                </p>

                {/* Unboxed Metadata details */}
                <div className="pt-4 border-t border-[#E8E2D5]/40 space-y-2 text-xs text-[#817C70]">
                  <div className="flex items-center justify-between">
                    <span>پزشک معالج:</span>
                    <strong className="text-[#302A21] font-semibold">{currentCase.doctor}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>طول دوره درمان:</span>
                    <strong className="text-[#302A21] font-semibold">{currentCase.duration}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ماندگاری نتیجه:</span>
                    <strong className="text-[#302A21] font-semibold">تضمین کتبی مادام‌العمر</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <a
                  href="#booking"
                  className="w-full py-3.5 rounded-full bg-[#A09B7C] hover:bg-[#7F795D] text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(160,155,124,0.3)]"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>درخواست مشاوره برای درمان مشابه</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

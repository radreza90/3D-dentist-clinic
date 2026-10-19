"use client";

import Image from "next/image";
import { ArrowLeft, Check, Heart, Sparkles } from "lucide-react";

export function SampleHero() {
  return (
    <section aria-label="معرفی کلینیک" className="relative pt-32 pb-16 overflow-hidden" id="top">
      {/* Ambient background glows */}
      <div className="sample-ambient sample-ambient-one" aria-hidden="true" />
      <div className="sample-ambient sample-ambient-two" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Right Column: Hero Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-right z-10">
            <div className="sample-eyebrow mb-5">
              <span className="w-2 h-2 rounded-full bg-[#A09B7C] animate-pulse" />
              <span>به کلینیک تخصصی دندانپزشکی خوش آمدید</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black leading-[1.35] tracking-tight text-[#302A21] mb-6">
              آرامش در درمان،
              <br />
              <span className="font-light text-[#7F795D]">زیبایی در </span>
              <span className="relative inline-block text-[#302A21]">
                لبخند شما.
                <span 
                  className="absolute bottom-1 right-0 left-0 h-3.5 -z-10 rounded-full opacity-60 -rotate-1"
                  style={{ background: "linear-gradient(90deg, #d1cfbc, #A09B7C)" }}
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#756F62] leading-relaxed mb-8 max-w-xl">
              مراقبت خوب با شنیدن شروع می‌شود. از بررسی سلامت دهان و دندان تا انتخاب درمان‌های زیبایی و ترمیمی، تلاش می‌کنیم مسیر تصمیم‌گیری برای شما روشن، قابل‌فهم و آرام باشد.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#appointment"
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
                style={{ 
                  background: "linear-gradient(140deg, #625D45, #343128)",
                  boxShadow: "0 12px 30px rgba(98, 93, 69, 0.25)"
                }}
              >
                <span>درخواست مشاوره</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-bold text-[#302A21] border border-white/80 bg-white/70 backdrop-blur-md shadow-sm transition-transform hover:-translate-y-1 hover:bg-white"
              >
                <span>آشنایی با خدمات</span>
                <ArrowLeft className="w-4 h-4 text-[#A09B7C]" />
              </a>
            </div>

            <div className="flex items-center gap-2 mt-8 text-xs text-[#8A8476]">
              <span className="w-2 h-2 rounded-full bg-[#A09B7C]" />
              <span>نوبت‌دهی آنلاین ۲۴ ساعته · مشاوره اولیه اختصاصی</span>
            </div>
          </div>

          {/* Left Column: Visual Frame */}
          <div className="lg:col-span-6 relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-[4/4.4]">
              
              {/* Backing decorative glow */}
              <div 
                className="absolute inset-4 -inset-y-4 rounded-3xl opacity-75 filter blur-xl -z-10"
                style={{ background: "radial-gradient(circle at 60% 40%, #d1cfbc, #A09B7C)" }}
              />

              {/* Main Photo Frame */}
              <div className="relative w-full h-full rounded-[36px] overflow-hidden border-4 border-white/90 shadow-2xl bg-[#eae7dc] transform -rotate-1 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85"
                  alt="محیط مدرن و آرام کلینیک دندانپزشکی"
                  fill
                  className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/40 via-transparent to-transparent" />
                
                {/* Bottom Image Label */}
                <div className="absolute bottom-5 right-5 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-white shadow-lg text-right">
                  <div className="w-9 h-9 rounded-full bg-[#d1cfbc]/60 text-[#625D45] flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <b className="block text-xs font-bold text-[#302A21]">مراقبت با دقت</b>
                    <small className="block text-[10px] text-[#756F62]">آرامش در هر مرحله درمان</small>
                  </div>
                </div>
              </div>

              {/* Floating Glass Pill on top-left */}
              <div className="sample-float-glass">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d1cfbc] to-white text-[#625D45] flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-5 h-5 text-[#A09B7C]" />
                </div>
                <div className="text-right">
                  <strong className="block text-xs font-bold text-[#302A21] whitespace-nowrap">
                    یک لبخند، یک مسیر شخصی
                  </strong>
                  <small className="block text-[10px] text-[#756F62] whitespace-nowrap">
                    از معاینه تا انتخاب درمان
                  </small>
                </div>
              </div>

              {/* Side watermark word */}
              <div 
                className="absolute -bottom-7 left-6 text-[10px] font-black tracking-[0.2em] text-[#A09B7C]/40 uppercase select-none pointer-events-none"
                dir="ltr"
              >
                SMILE IN DETAILS
              </div>
            </div>
          </div>

        </div>

        {/* Micro Strip with 4 Pillars */}
        <div className="mt-14 sample-micro-strip flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#625D45]">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#A09B7C]" />
            <span>توضیح روشن مراحل درمان</span>
          </div>
          <span className="hidden md:block w-px h-5 bg-[#E8E2D5]" />
          
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#A09B7C]" />
            <span>توجه به نیاز هر مراجعه‌کننده</span>
          </div>
          <span className="hidden md:block w-px h-5 bg-[#E8E2D5]" />

          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#A09B7C]" />
            <span>تصمیم‌گیری بر اساس معاینه بالینی</span>
          </div>
          <span className="hidden md:block w-px h-5 bg-[#E8E2D5]" />

          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#A09B7C]" />
            <span>مراقبت و پیگیری آگاهانه</span>
          </div>
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  PhoneCall,
  HelpCircle
} from "lucide-react";

export function HomeFaq() {
  const faqs = [
    {
      id: "1",
      question: "آیا کاشت ایمپلنت دندان همراه با درد و خونریزی است؟",
      answer: "خیر؛ در کلینیک ما با استفاده از اسکن سه‌بعدی و شابلون جراحی دیجیتال (Guided Surgery)، ایمپلنت بدون نیاز به برش وسیع لثه و بخیه کاشته می‌شود. همراه با سیستم بی‌حسی دیجیتال کامپیوتری، در حین جراحی و پس از آن دردی احساس نخواهید کرد.",
    },
    {
      id: "2",
      question: "تفاوت اصلی لمینت سرامیکی و کامپوزیت ونیر چیست؟",
      answer: "لمینت سرامیکی E-max در لابراتوار اختصاصی ساخته می‌شود، ضخامت بسیار کم (۰.۳ میلیمتر) دارد، رنگ‌پذیری آن صفر است و ماندگاری بالای ۱۵ سال دارد. کامپوزیت در یک جلسه مستقیماً روی دندان کار می‌شود، هزینه کمتری دارد اما نیازمند مراقبت بیشتر و پالیش سالانه است.",
    },
    {
      id: "3",
      question: "آیا امکان پرداخت اقساطی برای درمان‌های ایمپلنت و زیبایی وجود دارد؟",
      answer: "بله، کلینیک برای رفاه مراجعین شرایط پرداخت اقساطی بدون کارمزد و بهره را فراهم کرده است. شرایط اقساط متناسب با برنامه زمانی درمان و با چک صیادی تنظیم می‌گردد.",
    },
    {
      id: "4",
      question: "آیا بیمه‌های تکمیلی درمان‌های کلینیک را پوشش می‌دهند؟",
      answer: "برای تمامی درمان‌های تخصصی (جراحی، کشیدن، عصب‌کشی، پروتز و ایمپلنت)، گواهی و فاکتور رسمی معتبر جهت ارائه به تمامی شرکت‌های بیمه تکمیلی (دانا، آسیا، البرز، ایران، معلم و...) صادر می‌گردد.",
    },
    {
      id: "5",
      question: "معاینه و مشاوره اولیه چه مراحلی دارد؟",
      answer: "در جلسه اول، وضعیت فک و دندان‌ها به صورت بالینی و دیجیتال بررسی شده، عکس‌ها ارزیابی می‌شوند و طرح درمان شخصی‌سازی شده به همراه زمان‌بندی و برآورد دقیق هزینه در اختیارتان قرار می‌گیرد.",
    },
  ];

  const [openId, setOpenId] = useState<string | null>("1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      
      {/* Seamless Ambient Light */}
      <div 
        className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: "#A09B7C" }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#A09B7C]" />
            <span>پاسخ به سوالات مراجعین</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#A09B7C]">راهنمای جامع بالینی</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            پرسش‌های متداول مراجعین گرامی
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            پاسخ موثق پزشکان کلینیک به پرتکرارترین سوالات پیرامون روش‌های درمان، هزینه‌ها و مراقبت‌های بالینی.
          </p>
        </div>

        {/* Seamless Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-3xl bg-[#FCFAF6] border transition-all duration-300 overflow-hidden text-right ${
                  isOpen 
                    ? "border-[#A09B7C]/40 shadow-[0_16px_40px_rgba(160,155,124,0.1)]" 
                    : "border-[#E8E2D5]/35 shadow-[0_6px_24px_rgba(48,42,33,0.02)] hover:border-[#A09B7C]/25"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-right cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-base sm:text-lg leading-snug transition-colors ${
                    isOpen ? "text-[#625D45]" : "text-[#302A21]"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-[#A09B7C] text-white" : "bg-[#F7F4EE] text-[#817C70]"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Resilient smooth CSS grid expansion */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 sm:px-7 pb-6 text-sm sm:text-base text-[#817C70] leading-relaxed border-t border-[#E8E2D5]/40 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Help Prompt */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-[#FCFAF6] border border-[#E8E2D5]/40 shadow-[0_12px_40px_rgba(48,42,33,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="font-bold text-base text-[#302A21]">سوال دیگری درباره درمان خود دارید؟</h4>
            <p className="text-xs text-[#817C70] mt-1">مشاوران پزشکی ما آماده پاسخگویی صبورانه به تمامی سوالات شما هستند.</p>
          </div>
          <a
            href="tel:02188880120"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors whitespace-nowrap shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>تماس فوری با پذیرش</span>
          </a>
        </div>

      </div>
    </section>
  );
}

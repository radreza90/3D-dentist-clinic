"use client";

import { motion } from "motion/react";
import { 
  CalendarCheck, 
  ArrowLeft
} from "lucide-react";
import { Hero3DCanvas } from "./Hero3DCanvas";

export function HomeHero() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden">
      
      {/* Seamless Ambient Lighting - Warm Rose Gold & Khaki glows */}
      <div 
        className="absolute top-10 right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-35 pointer-events-none"
        style={{ background: "#A09B7C" }}
      />
      <div 
        className="absolute bottom-10 left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 pointer-events-none"
        style={{ background: "#D8AE98" }}
      />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column: High-End Editorial Typography */}
          <div className="lg:col-span-6 flex flex-col items-start text-right space-y-6">
            
            {/* Clean Unboxed Kicker (No Pill Badges) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs sm:text-sm font-medium tracking-wide text-[#817C70] flex items-center gap-2"
            >
              <span>دندانپزشکی تخصصی دیجیتال</span>
              <span className="text-[#C2BFA9]">·</span>
              <span>طراحی مهندسی لبخند</span>
              <span className="text-[#C2BFA9]">·</span>
              <span className="text-[#A09B7C] font-semibold">تهران</span>
            </motion.div>

            {/* Display Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#302A21] leading-[1.25] text-balance"
            >
              لبخند اصیل،
              <br />
              <span className="text-[#A09B7C]">هنر دندانپزشکی فردا</span>
            </motion.h1>

            {/* Subtitle / Value Proposition */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#817C70] leading-relaxed max-w-xl text-pretty"
            >
              هم‌نشینی دانش پزشکی، متریال‌های بایوکامپتیبل آلمانی و هنر ظریف اساتید دانشگاه. 
              تجربه‌ای آرام، بدون درد و با ضمانت کتبی ماندگاری درمان در فضایی مدرن و مینیمال.
            </motion.p>

            {/* Single Primary Action + Secondary Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <a 
                href="#booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] active:bg-[#625D45] transition-all duration-200 shadow-[0_8px_25px_rgba(160,155,124,0.3)] hover:shadow-[0_12px_32px_rgba(160,155,124,0.4)]"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>رزرو اختصاصی نوبت آنلاین</span>
              </a>

              <a 
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-[#302A21] hover:text-[#625D45] hover:bg-[#FCFAF6]/60 transition-all duration-200"
              >
                <span>مشاهده خدمات تخصصی</span>
                <ArrowLeft className="w-4 h-4 text-[#A09B7C]" />
              </a>
            </motion.div>

            {/* Quantitative Proof Strip - Clean Unboxed Numbers */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#817C70]"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#302A21] tabular-nums font-mono">۹۹.۴٪</span>
                <span>رضایت مراجعین</span>
              </div>
              <span className="text-[#C2BFA9]">·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#302A21] tabular-nums font-mono">۱۵,۰۰۰+</span>
                <span>لبخند دگرگون‌شده</span>
              </div>
              <span className="text-[#C2BFA9]">·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#302A21] tabular-nums font-mono">۱۰ سال</span>
                <span>گارانتی رسمی ایمپلنت</span>
              </div>
            </motion.div>

          </div>

          {/* Left Column: Interactive 3D Canvas */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <Hero3DCanvas />
          </div>

        </div>
      </div>

    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { 
  Award, 
  Smile, 
  ShieldCheck, 
  HeartHandshake
} from "lucide-react";

export function HomeStats() {
  const stats = [
    {
      icon: Award,
      value: "+۱۵ سال",
      title: "سابقه تخصصی کلینیک",
      description: "تجربه درخشان در درمان‌های پیچیده جراحی فک و زیبایی",
    },
    {
      icon: Smile,
      value: "+۱۲,۵۰۰",
      title: "لبخند رضایت‌بخش",
      description: "کاشت موفق ایمپلنت و لمینت‌های سرامیکی بدون بازگشت",
    },
    {
      icon: ShieldCheck,
      value: "۹۹.۶٪",
      title: "شاخص رضایت مراجعین",
      description: "بر اساس نظرسنجی‌های دوره‌ای و ترخیص بیماران",
    },
    {
      icon: HeartHandshake,
      value: "۱۰۰٪",
      title: "آرامش کامل درمان",
      description: "به‌کارگیری پروتکل‌های مدرن بدون درد و استرس",
    },
  ];

  return (
    <section id="stats" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Subtle organic light accent */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 rounded-full blur-[100px] opacity-25 pointer-events-none"
        style={{ background: "#A09B7C" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-7 sm:p-8 rounded-3xl bg-[#FCFAF6]/90 backdrop-blur-md shadow-[0_12px_40px_rgba(48,42,33,0.03)] hover:shadow-[0_20px_50px_rgba(160,155,124,0.12)] transition-all duration-300 group text-right"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#A09B7C]/15 text-[#625D45] flex items-center justify-center mb-6 group-hover:bg-[#A09B7C] group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6 text-[#A09B7C] group-hover:text-white transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight tabular-nums font-mono">
                    {stat.value}
                  </div>
                  <h3 className="text-base font-semibold text-[#302A21]">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-[#817C70] leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

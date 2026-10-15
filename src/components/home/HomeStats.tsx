"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { 
  Award, 
  Smile, 
  ShieldCheck, 
  HeartHandshake
} from "lucide-react";

interface CounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

function AnimatedCounter({ target, prefix = "", suffix = "", decimals = 0, duration = 1.8 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = ease * target;
      setCount(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, target, duration]);

  const formatted = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString("fa-IR");

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function HomeStats() {
  const stats = [
    {
      icon: Award,
      target: 15,
      prefix: "+",
      suffix: " سال",
      decimals: 0,
      title: "سابقه تخصصی کلینیک",
      description: "تجربه درخشان در درمان‌های پیچیده جراحی فک، ایمپلنت و زیبایی",
    },
    {
      icon: Smile,
      target: 15000,
      prefix: "+",
      suffix: "",
      decimals: 0,
      title: "لبخند رضایت‌بخش",
      description: "کاشت موفق ایمپلنت دیجیتال و لمینت‌های سرامیکی بدون بازگشت",
    },
    {
      icon: ShieldCheck,
      target: 99.8,
      prefix: "",
      suffix: "٪",
      decimals: 1,
      title: "شاخص رضایت مراجعین",
      description: "بر اساس نظرسنجی‌های دوره‌ای ترخیص و استانداردهای بالینی",
    },
    {
      icon: HeartHandshake,
      target: 100,
      prefix: "",
      suffix: "٪",
      decimals: 0,
      title: "آرامش کامل درمان",
      description: "به‌کارگیری پروتکل‌های مدرن بدون درد با بی‌حسی کامپیوتری",
    },
  ];

  return (
    <section id="stats" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#F7F4EE] to-[#EFECE3]">
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
                className="p-7 sm:p-8 rounded-3xl bg-[#FCFAF6]/90 backdrop-blur-md shadow-[0_12px_40px_rgba(48,42,33,0.04)] hover:shadow-[0_20px_50px_rgba(160,155,124,0.15)] transition-all duration-300 group text-right border border-[#E8E2D5]/70"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#A09B7C]/15 text-[#625D45] flex items-center justify-center mb-6 group-hover:bg-[#625D45] group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6 text-[#A09B7C] group-hover:text-white transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight">
                    <AnimatedCounter 
                      target={stat.target} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix} 
                      decimals={stat.decimals}
                    />
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

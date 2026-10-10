"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  MapPin, 
  Clock, 
  ArrowUp
} from "lucide-react";

export function SiteFooter() {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-20 pt-16 pb-12 bg-[#FCFAF6] text-[#302A21] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 text-right">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-xl bg-[#A09B7C]/15 flex items-center justify-center text-[#625D45] group-hover:bg-[#A09B7C] group-hover:text-white transition-all">
                <span className="text-sm font-serif font-bold">R</span>
              </span>
              <span className="text-lg font-bold tracking-tight text-[#302A21]">
                کلینیک دندانپزشکی دکتر راد
              </span>
            </Link>
            <p className="text-xs text-[#817C70] leading-relaxed">
              ارائه خدمات فوق‌تخصصی دندانپزشکی، طراحی دیجیتال لبخند و کاشت ایمپلنت با بالاترین استانداردهای بالینی و تجهیزات نوین اروپایی.
            </p>
            <div className="text-xs text-[#817C70] pt-2">
              <span>شماره پروانه نظام پزشکی: <strong>۹۸۳۴۲</strong></span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#302A21]">خدمات برگزیده</h4>
            <ul className="space-y-2 text-xs text-[#817C70]">
              <li>
                <a href="#services" className="hover:text-[#302A21] transition-colors">ایمپلنت دیجیتال فوری</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#302A21] transition-colors">لمینت سرامیکی E-max</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#302A21] transition-colors">کامپوزیت ونیر لایه‌ای</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#302A21] transition-colors">درمان ریشه میکروسکوپی</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#302A21] transition-colors">ارتودنسی نامرئی شفاف</a>
              </li>
            </ul>
          </div>

          {/* Clinic Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#302A21]">ساعات کاری و پذیرش</h4>
            <div className="space-y-2 text-xs text-[#817C70]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A09B7C] shrink-0" />
                <span>شنبه تا چهارشنبه: ۸:۳۰ الی ۲۱:۰۰</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A09B7C] shrink-0" />
                <span>پنج‌شنبه‌ها: ۸:۳۰ الی ۱۸:۰۰</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A09B7C] shrink-0" />
                <span>جمعه‌ها: پذیرش اورژانس ۱۰ الی ۱۶</span>
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#302A21]">ارتباط مستقیم</h4>
            <div className="space-y-2.5 text-xs text-[#817C70]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A09B7C] shrink-0 mt-0.5" />
                <span>تهران، خیابان ولیعصر، بالاتر از میدان ونک، برج نگین، طبقه ۴</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A09B7C] shrink-0" />
                <a href="tel:02188880120" className="hover:text-[#302A21] dir-ltr font-mono font-bold">۰۲۱-۸۸۸۸۰۱۲۰</a>
              </div>
              <div className="pt-2">
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors shadow-xs"
                >
                  رزرو وقت ویزیت آنلاین
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Quiet legal copy & Back to Top */}
        <div className="pt-8 border-t border-[#E8E2D5]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#817C70]">
          <p>© {new Date().getFullYear()} تمامی حقوق برای کلینیک دندانپزشکی دکتر راد محفوظ است.</p>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-[#302A21] transition-colors cursor-pointer"
          >
            <span>بازگشت به ابتدای صفحه</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#A09B7C]" />
          </button>
        </div>

      </div>
    </footer>
  );
}

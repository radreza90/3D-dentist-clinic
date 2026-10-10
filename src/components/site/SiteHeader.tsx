"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarCheck, 
  Menu, 
  X,
  PhoneCall
} from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#FCFAF6]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(48,42,33,0.04)] py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group whitespace-nowrap shrink-0">
            <span className="w-9 h-9 rounded-xl bg-[#A09B7C]/15 flex items-center justify-center text-[#625D45] group-hover:bg-[#A09B7C] group-hover:text-white transition-all duration-300">
              <span className="text-base font-serif font-bold">R</span>
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#302A21]">
              کلینیک دندانپزشکی دکتر راد
            </span>
          </Link>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#817C70]">
            <a 
              href="#services" 
              className="hover:text-[#302A21] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#A09B7C]"
            >
              خدمات تخصصی
            </a>
            <a 
              href="#booking" 
              className="hover:text-[#302A21] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#A09B7C]"
            >
              رزرو نوبت
            </a>
            <a 
              href="#doctors" 
              className="hover:text-[#302A21] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#A09B7C]"
            >
              کادر متخصصان
            </a>
            <a 
              href="#portfolio" 
              className="hover:text-[#302A21] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#A09B7C]"
            >
              نتایج درمان
            </a>
            <a 
              href="#contact" 
              className="hover:text-[#302A21] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#A09B7C]"
            >
              اطلاعات تماس
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href="tel:02188880120"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#A09B7C]" />
              <span className="dir-ltr font-mono">۰۲۱-۸۸۸۸۰۱۲۰</span>
            </a>
            <a 
              href="#booking" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] active:bg-[#625D45] transition-all duration-200 shadow-[0_4px_16px_rgba(160,155,124,0.25)] hover:shadow-[0_6px_20px_rgba(160,155,124,0.35)] whitespace-nowrap shrink-0"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>رزرو آنلاین نوبت</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#302A21] hover:bg-[#FCFAF6] transition-colors"
              aria-label="منوی سایت"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FCFAF6]/98 backdrop-blur-xl border-b border-[#E8E2D5]/40 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 text-sm font-medium text-[#302A21]">
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              خدمات تخصصی
            </a>
            <a 
              href="#booking" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              رزرو نوبت
            </a>
            <a 
              href="#doctors" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              کادر متخصصان
            </a>
            <a 
              href="#portfolio" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              نتایج درمان
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              اطلاعات تماس
            </a>
          </div>
          <div className="pt-4 border-t border-[#E8E2D5]/50 flex flex-col gap-2.5">
            <a 
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>رزرو آنلاین نوبت</span>
            </a>
            <a 
              href="tel:02188880120"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-[#302A21] bg-[#F7F4EE]"
            >
              <PhoneCall className="w-4 h-4 text-[#A09B7C]" />
              <span className="dir-ltr font-mono">۰۲۱-۸۸۸۸۰۱۲۰</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

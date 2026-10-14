"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarCheck, 
  Menu, 
  X,
  Search
} from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      const sections = ["contact", "journal", "portfolio", "doctors", "services"];
      let found = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            found = id;
            break;
          }
        }
      }
      if (window.scrollY < 200) found = "home";
      setActiveNav(found);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-[#FCFAF6]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(48,42,33,0.06)] py-3 text-[#302A21]" 
          : "bg-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          
          {/* Right: Clinic Brand & Minimalist Tooth Logo */}
          <Link href="/" className="flex items-center gap-3 group whitespace-nowrap shrink-0">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              scrolled || !isHome 
                ? "bg-[#A09B7C]/15 text-[#625D45]" 
                : "bg-white/15 backdrop-blur-sm text-white border border-white/25"
            }`}>
              {/* Minimalist Dental Tooth Line Icon */}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M12 2C8 2 5 4.5 5 8c0 3.5 1.5 7.5 2 11 .5 3.5 2.5 3 3.5 0 .8-2.4 1.5-2.5 1.5-2.5s.7.1 1.5 2.5c1 3 3 3.5 3.5 0 .5-3.5 2-7.5 2-11 0-3.5-3-6-7-6z" />
              </svg>
            </div>
            <div className="flex flex-col text-right">
              <span className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                scrolled || !isHome ? "text-[#302A21]" : "text-white"
              }`}>
                کلینیک دندانپزشکی
              </span>
              <span className={`text-[10px] tracking-wider uppercase font-sans transition-colors ${
                scrolled || !isHome ? "text-[#817C70]" : "text-white/80"
              }`}>
                Smile & Health
              </span>
            </div>
          </Link>

          {/* Center: Horizontal Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link 
              href="/"
              className={`relative py-1 transition-colors ${
                activeNav === "home" 
                  ? (scrolled || !isHome ? "text-[#625D45] font-semibold" : "text-white font-semibold") 
                  : (scrolled || !isHome ? "text-[#817C70] hover:text-[#302A21]" : "text-white/80 hover:text-white")
              }`}
            >
              <span>صفحه اصلی</span>
              {activeNav === "home" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A09B7C] rounded-full" />
              )}
            </Link>

            <a 
              href="#services" 
              className={`relative py-1 transition-colors ${
                activeNav === "services" 
                  ? (scrolled || !isHome ? "text-[#625D45] font-semibold" : "text-white font-semibold") 
                  : (scrolled || !isHome ? "text-[#817C70] hover:text-[#302A21]" : "text-white/80 hover:text-white")
              }`}
            >
              <span>خدمات</span>
              {activeNav === "services" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A09B7C] rounded-full" />
              )}
            </a>

            <a 
              href="#doctors" 
              className={`relative py-1 transition-colors ${
                activeNav === "doctors" 
                  ? (scrolled || !isHome ? "text-[#625D45] font-semibold" : "text-white font-semibold") 
                  : (scrolled || !isHome ? "text-[#817C70] hover:text-[#302A21]" : "text-white/80 hover:text-white")
              }`}
            >
              <span>دکترها</span>
              {activeNav === "doctors" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A09B7C] rounded-full" />
              )}
            </a>

            <a 
              href="#portfolio" 
              className={`relative py-1 transition-colors ${
                activeNav === "portfolio" 
                  ? (scrolled || !isHome ? "text-[#625D45] font-semibold" : "text-white font-semibold") 
                  : (scrolled || !isHome ? "text-[#817C70] hover:text-[#302A21]" : "text-white/80 hover:text-white")
              }`}
            >
              <span>نمونه کارها</span>
              {activeNav === "portfolio" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A09B7C] rounded-full" />
              )}
            </a>

            <a 
              href="#journal" 
              className={`relative py-1 transition-colors ${
                activeNav === "journal" 
                  ? (scrolled || !isHome ? "text-[#625D45] font-semibold" : "text-white font-semibold") 
                  : (scrolled || !isHome ? "text-[#817C70] hover:text-[#302A21]" : "text-white/80 hover:text-white")
              }`}
            >
              <span>مقالات</span>
              {activeNav === "journal" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A09B7C] rounded-full" />
              )}
            </a>

            <a 
              href="#about" 
              className={`relative py-1 transition-colors ${
                activeNav === "about" 
                  ? (scrolled || !isHome ? "text-[#625D45] font-semibold" : "text-white font-semibold") 
                  : (scrolled || !isHome ? "text-[#817C70] hover:text-[#302A21]" : "text-white/80 hover:text-white")
              }`}
            >
              <span>درباره ما</span>
            </a>

            <a 
              href="#contact" 
              className={`relative py-1 transition-colors ${
                activeNav === "contact" 
                  ? (scrolled || !isHome ? "text-[#625D45] font-semibold" : "text-white font-semibold") 
                  : (scrolled || !isHome ? "text-[#817C70] hover:text-[#302A21]" : "text-white/80 hover:text-white")
              }`}
            >
              <span>تماس با ما</span>
              {activeNav === "contact" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A09B7C] rounded-full" />
              )}
            </a>
          </nav>

          {/* Left: Search & Primary "رزرو نوبت" CTA Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Search Icon Button */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("services");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`p-2.5 rounded-full transition-colors ${
                scrolled || !isHome 
                  ? "text-[#817C70] hover:text-[#302A21] hover:bg-[#F7F4EE]" 
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
              aria-label="جستجو در خدمات کلینیک"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Main Booking Button (Warm Deep Bronze / Khaki Pill) */}
            <a 
              href="#booking" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#625D45] hover:bg-[#7F795D] active:bg-[#4E4A37] transition-all duration-200 shadow-[0_4px_16px_rgba(48,42,33,0.25)] hover:shadow-[0_6px_22px_rgba(48,42,33,0.35)] whitespace-nowrap"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>رزرو نوبت</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${
                scrolled || !isHome ? "text-[#302A21] hover:bg-[#F7F4EE]" : "text-white hover:bg-white/10"
              }`}
              aria-label="منوی سایت"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFAF6]/98 backdrop-blur-xl border-b border-[#E8E2D5]/60 px-6 py-6 space-y-4 shadow-2xl text-[#302A21]">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              صفحه اصلی
            </Link>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              خدمات
            </a>
            <a 
              href="#doctors" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              دکترها
            </a>
            <a 
              href="#portfolio" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              نمونه کارها
            </a>
            <a 
              href="#journal" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              مقالات
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#A09B7C] transition-colors"
            >
              تماس با ما
            </a>
          </div>
          <div className="pt-4 border-t border-[#E8E2D5]/60">
            <a 
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white bg-[#625D45] hover:bg-[#7F795D]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>رزرو نوبت</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

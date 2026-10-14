"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export interface BlogPostItem {
  _id: string;
  slug: string;
  title: { fa: string; en: string };
  excerpt?: { fa: string; en: string };
  category?: string;
  readTime?: string;
  date?: string;
  image?: string;
}

interface HomeJournalProps {
  posts?: BlogPostItem[];
}

export function HomeJournal({ posts = [] }: HomeJournalProps) {
  // Canonical 3 articles matching image.png exactly
  const defaultArticles = [
    {
      slug: "all-about-dental-implants",
      title: "همه چیز درباره ایمپلنت دندان",
      date: "۱۴۰۳/۰۶/۱۵",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "children-teeth-care-guide",
      title: "چگونه از دندان‌های کودکان مراقبت کنیم؟",
      date: "۱۴۰۳/۰۶/۲۸",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "post-implant-essential-tips",
      title: "نکات مهم بعد از ایمپلنت دندان",
      date: "۱۴۰۳/۰۷/۱۰",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section id="journal" className="py-24 sm:py-32 relative bg-[#F7F4EE] overflow-hidden text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Right Column in RTL: Intro & View All Button (Matching image.png) */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col items-start space-y-5 order-1 lg:order-2">
            <span className="text-xs font-semibold text-[#817C70] tracking-wider">
              مقالات و مطالب
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#302A21] leading-tight tracking-tight">
              مطالب مفید برای سلامت دهان و دندان
            </h2>

            <p className="text-sm sm:text-base text-[#817C70] leading-relaxed text-pretty">
              جدیدترین مقالات و نکات مراقبتی برای داشتن دندان‌هایی سالم و زیبا.
            </p>

            <div className="pt-2">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold text-[#302A21] border border-[#A09B7C]/60 hover:bg-[#A09B7C] hover:text-white transition-all duration-200"
              >
                <span>مشاهده همه مقالات</span>
              </Link>
            </div>
          </div>

          {/* Left Column in RTL: 3 Article Cards + Navigation Buttons (Matching image.png) */}
          <div className="lg:col-span-8 lg:col-start-1 order-2 lg:order-1 relative">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {defaultArticles.map((article, idx) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col justify-between rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5]/70 overflow-hidden hover:shadow-[0_16px_35px_rgba(160,155,124,0.18)] hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    <div>
                      {/* Article Cover Image */}
                      <div className="relative aspect-16/10 w-full bg-[#E8E2D5]/40 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover group-hover:scale-104 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Title & Date */}
                      <div className="p-4 space-y-2">
                        <h3 className="text-xs sm:text-sm font-bold text-[#302A21] group-hover:text-[#625D45] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-[11px] text-[#817C70] font-mono">
                          {article.date}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Link Affordance */}
                    <div className="px-4 pb-4 pt-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#A09B7C] group-hover:text-[#625D45] transition-colors">
                      <span>مطالعه بیشتر</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Left circular navigation arrow */}
            <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D5] shadow-md flex items-center justify-center text-[#302A21] hover:bg-[#F7F4EE] transition-colors"
                aria-label="مقاله قبلی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Right circular navigation arrow */}
            <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D5] shadow-md flex items-center justify-center text-[#302A21] hover:bg-[#F7F4EE] transition-colors"
                aria-label="مقاله بعدی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

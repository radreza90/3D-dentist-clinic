"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  ArrowLeft
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
  posts: BlogPostItem[];
}

export function HomeJournal({ posts }: HomeJournalProps) {
  const fallbackPosts: BlogPostItem[] = [
    {
      _id: "1",
      slug: "laminate-care-guide",
      title: { 
        fa: "راهنمای طلایی مراقبت از لمینت سرامیکی و کامپوزیت برای ماندگاری بیش از ۱۵ سال",
        en: "Golden Care Guide for Ceramic Laminate & Composite Longevity"
      },
      excerpt: {
        fa: "نکات حیاتی درباره نوع خمیردندان مناسب، نخ‌دندان، محافظ شبانه (نایت‌گارد) و عادات غذایی که درخشش لبخندتان را حفظ می‌کنند.",
        en: "Essential tips to protect your dental veneers and ensure long-lasting brilliant smile."
      },
      category: "زیبایی و لمینت",
      readTime: "۵ دقیقه",
      date: "۱۴ آبان ۱۴۰۳",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "2",
      slug: "digital-implant-technology",
      title: { 
        fa: "ایمپلنت دیجیتال چیست و چرا دوره نقاهت و درد آن تقریباً به صفر رسیده است؟",
        en: "What is Digital Guided Implant and How it Eliminates Post-Op Pain"
      },
      excerpt: {
        fa: "بررسی تفاوت جراحی سنتی با راهنمای دیجیتال سه بعدی، کاهش زمان جراحی به ۱۵ دقیقه و جوش خوردن سریع‌تر به استخوان فک.",
        en: "Comparing traditional flap surgery with computer-guided flapless implant placement."
      },
      category: "ایمپلنت و جراحی",
      readTime: "۴ دقیقه",
      date: "۲۸ مهر ۱۴۰۳",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "3",
      slug: "teeth-whitening-vs-scaling",
      title: { 
        fa: "تفاوت جرم‌گیری دندان با بلیچینگ؛ کدام‌یک برای روشن‌تر شدن لبخند مناسب‌تر است؟",
        en: "Scaling vs. Bleaching: Which Treatment Restores Your Natural Brightness?"
      },
      excerpt: {
        fa: "بررسی جامع نقش جرم‌گیری در سلامت بافت لثه و مقایسه آن با تاثیر درمانی بلیچینگ شیمیایی و لیزری بر تغییر تنالیته رنگ دندان.",
        en: "Comprehensive comparison between periodontal scaling and clinical whitening."
      },
      category: "بهداشت و ترمیمی",
      readTime: "۳ دقیقه",
      date: "۱۰ مهر ۱۴۰۳",
      image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const displayList = posts && posts.length > 0 ? posts : fallbackPosts;

  return (
    <section id="journal" className="py-24 relative overflow-hidden">
      
      {/* Ambient Seamless Lighting */}
      <div 
        className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: "#D8AE98" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="text-right space-y-4 max-w-xl">
            <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center gap-2">
              <span>دانشنامه و مقالات</span>
              <span className="text-[#C2BFA9]">·</span>
              <span className="text-[#A09B7C]">پژوهش‌های روز دندانپزشکی</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
              مجله سلامت و زیبایی دندان
            </h2>

            <p className="text-base text-[#817C70] leading-relaxed text-pretty">
              جدیدترین یافته‌های علمی، راهنماهای گام‌به‌گام مراقبت و توصیه‌های کاربردی متخصصین کلینیک.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A09B7C] hover:text-[#625D45] transition-colors self-start md:self-auto shrink-0 group"
          >
            <span>مشاهده همه مقالات مجله</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Seamless Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayList.map((post, idx) => (
            <motion.article
              key={post.slug || post._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl bg-[#FCFAF6] overflow-hidden flex flex-col justify-between shadow-[0_12px_40px_rgba(48,42,33,0.03)] hover:shadow-[0_24px_55px_rgba(160,155,124,0.12)] hover:-translate-y-1 transition-all duration-300 group text-right"
            >
              <div>
                {/* Image Box */}
                <div className="relative aspect-16/9 w-full bg-[#E8E2D5]/30 overflow-hidden">
                  <Image
                    src={post.image || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"}
                    alt={post.title.fa}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Clean unboxed category overlay */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-[#FCFAF6]/90 backdrop-blur-sm text-[#302A21] text-[11px] font-medium">
                      {post.category || "مقاله علمی"}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-7 space-y-3">
                  <div className="text-xs text-[#817C70] flex items-center gap-2">
                    <span>{post.readTime || "۴ دقیقه مطالعه"}</span>
                    <span className="text-[#C2BFA9]">·</span>
                    <span>{post.date || "آبان ۱۴۰۳"}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#302A21] group-hover:text-[#625D45] transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title.fa}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#817C70] leading-relaxed line-clamp-3">
                    {post.excerpt?.fa}
                  </p>
                </div>
              </div>

              {/* Read Action */}
              <div className="p-7 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-[#A09B7C] group-hover:text-[#625D45] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>ادامه مطالعه مقاله</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>

            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

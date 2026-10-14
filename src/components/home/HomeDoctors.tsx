"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  Calendar, 
  ArrowLeft
} from "lucide-react";

export interface DoctorItem {
  _id: string;
  slug: string;
  name: { fa: string; en: string };
  shortBio?: { fa: string; en: string };
  specialty?: string;
  medicalCode?: string;
  university?: string;
  clinicDays?: string;
  image?: string;
}

interface HomeDoctorsProps {
  doctors: DoctorItem[];
}

export function HomeDoctors({ doctors }: HomeDoctorsProps) {
  const fallbackDoctors: DoctorItem[] = [
    {
      _id: "1",
      slug: "dr-ahmadi",
      name: { fa: "دکتر مریم احمدی", en: "Dr. Maryam Ahmadi" },
      shortBio: { 
        fa: "متخصص دندانپزشکی ترمیمی و زیبایی، دارای بورد تخصصی و عضو انجمن دندانپزشکان زیبایی آمریکا (AACD). بیش از ۱۲ سال سابقه در طراحی لبخند با لمینت سرامیکی.",
        en: "Specialist in Aesthetic and Restorative Dentistry, Board Certified."
      },
      specialty: "متخصص ترمیمی و زیبایی · بورد تخصصی",
      medicalCode: "نظام پزشکی: ۹۸۳۴۲",
      university: "دانشگاه علوم پزشکی تهران",
      clinicDays: "شنبه، دوشنبه و چهارشنبه",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "2",
      slug: "dr-rezaei",
      name: { fa: "دکتر علی رضایی", en: "Dr. Ali Rezaei" },
      shortBio: { 
        fa: "جراح فک و صورت، فلوشیپ ایمپلنت‌های پیشرفته و بازسازی استخوان فک از دانشگاه زوریخ سوئیس. متخصص در کاشت دندان دیجیتال یک‌روزه بدون درد.",
        en: "Oral & Maxillofacial Surgeon, Advanced Implantology Fellow."
      },
      specialty: "جراح فک و صورت · فلوشیپ ایمپلنت سوئیس",
      medicalCode: "نظام پزشکی: ۱۰۴۱۵۵",
      university: "دانشگاه شهید بهشتی",
      clinicDays: "یک‌شنبه، سه‌شنبه و پنج‌شنبه",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "3",
      slug: "dr-pirouz",
      name: { fa: "دکتر کاوه پیروز", en: "Dr. Kaveh Pirouz" },
      shortBio: { 
        fa: "متخصص درمان ریشه (اندودنتیست)، پژوهشگر و استاد دانشگاه با تجربه بیش از ۸۰۰۰ درمان موفق ریشه و جراحی‌های اپیکواکتومی با بزرگنمایی میکروسکوپی.",
        en: "Endodontist & Microsurgical Root Specialist."
      },
      specialty: "متخصص درمان ریشه · میکروسکوپیست",
      medicalCode: "نظام پزشکی: ۱۱۲۴۰۹",
      university: "دانشگاه علوم پزشکی ایران",
      clinicDays: "شنبه تا چهارشنبه (عصرها)",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const displayDoctors = doctors && doctors.length > 0 ? doctors : fallbackDoctors;

  return (
    <section id="doctors" className="py-24 relative overflow-hidden">
      
      {/* Ambient Seamless Lighting */}
      <div 
        className="absolute top-1/2 left-10 w-96 h-96 rounded-full blur-[150px] opacity-25 pointer-events-none"
        style={{ background: "#A09B7C" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <span>کادر درمان و اساتید</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#A09B7C]">بورد تخصصی</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            پزشکان متخصص و جراحان برجسته کلینیک
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            درمان شما توسط اساتید دانشگاه و متخصصین دارای بورد رسمی کشوری، با تلفیق هنر و جدیدترین گایدلاین‌های پزشکی انجام می‌پذیرد.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDoctors.map((doctor, idx) => (
            <motion.article
              key={doctor.slug || doctor._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl bg-[#FCFAF6] overflow-hidden flex flex-col justify-between shadow-[0_12px_40px_rgba(48,42,33,0.03)] hover:shadow-[0_24px_55px_rgba(160,155,124,0.14)] hover:-translate-y-1 transition-all duration-300 group text-right"
            >
              <div>
                {/* Doctor Portrait Header */}
                <div className="relative aspect-4/3 w-full bg-[#E8E2D5]/30 overflow-hidden">
                  <Image
                    src={doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"}
                    alt={doctor.name.fa}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#302A21]/75 via-transparent to-transparent" />

                  {/* Clean unboxed medical code */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-[#FCFAF6]/90 backdrop-blur-sm text-[#302A21] text-[11px] font-medium font-mono">
                      {doctor.medicalCode || "پزشک رسمی"}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 right-4 left-4 text-white">
                    <h3 className="font-bold text-lg text-white">
                      {doctor.name.fa}
                    </h3>
                    <p className="text-xs text-[#D8AE98] font-mono dir-ltr text-right mt-0.5">
                      {doctor.name.en}
                    </p>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-7 space-y-4">
                  {/* Specialty text */}
                  <div className="text-xs font-semibold text-[#625D45]">
                    {doctor.specialty}
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-[#817C70] leading-relaxed line-clamp-3">
                    {doctor.shortBio?.fa}
                  </p>

                  {/* Meta Specs */}
                  <div className="space-y-2 pt-3 border-t border-[#E8E2D5]/40 text-xs text-[#817C70]">
                    {doctor.university && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#A09B7C] shrink-0" />
                        <span>دانش‌آموخته: <strong className="text-[#302A21] font-medium">{doctor.university}</strong></span>
                      </div>
                    )}
                    {doctor.clinicDays && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#A09B7C] shrink-0" />
                        <span>روزهای حضور: <strong className="text-[#302A21] font-medium">{doctor.clinicDays}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-7 pt-0">
                <Link
                  href={`/booking?doctor=${doctor.slug}`}
                  className="w-full py-3 rounded-full bg-[#A09B7C]/15 hover:bg-[#A09B7C] text-[#625D45] hover:text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                  <span>رزرو نوبت با {doctor.name.fa}</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
                </Link>
              </div>

            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

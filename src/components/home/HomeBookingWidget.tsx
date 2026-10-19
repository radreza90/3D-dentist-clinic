"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  CalendarCheck, 
  Clock, 
  ArrowLeft, 
  Check, 
  Stethoscope
} from "lucide-react";

type HomeBookingWidgetProps = {
  services?: Array<{
    _id: string;
    slug: string;
    title: { fa?: string; en?: string } | string;
    duration?: string;
    warranty?: string;
    note?: string;
  }>;
};

export function HomeBookingWidget({ services }: HomeBookingWidgetProps) {
  const router = useRouter();

  const [servicesList, setServicesList] = useState<Array<{
    id: string;
    title: string;
    duration: string;
    note: string;
  }>>(() => {
    if (services && services.length > 0) {
      return services.map(s => ({
        id: s._id,
        title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
        duration: s.duration || "۱ جلسه",
        note: s.warranty || "پذیرش دیجیتال",
      }));
    }
    return [];
  });

  useEffect(() => {
    if (services && services.length > 0) {
      const mapped = services.map(s => ({
        id: s._id,
        title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
        duration: s.duration || "۱ جلسه",
        note: s.warranty || "پذیرش دیجیتال",
      }));
      setServicesList(mapped);
      setSelectedService(prev => prev || mapped[0]?.id || "");
      return;
    }

    fetch("/api/v1/services", { cache: "no-store" })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((s: any) => ({
            id: s._id,
            title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
            duration: s.duration || "۱ جلسه",
            note: s.warranty || "پذیرش دیجیتال",
          }));
          setServicesList(mapped);
          setSelectedService(prev => prev || mapped[0]?.id || "");
        }
      })
      .catch(err => {
        console.error("Error fetching services for HomeBookingWidget:", err);
      });
  }, [services]);

  const doctorsList = [
    { id: "any", name: "اولین نوبت خالی با هر پزشک متخصص", spec: "سریع‌ترین زمان ممکن پذیرش" },
    { id: "dr-ahmadi", name: "دکتر علیرضا مرادی", spec: "متخصص جراحی لثه و ایمپلنتولوژی" },
    { id: "dr-rezaei", name: "دکتر مریم افشار", spec: "متخصص دندانپزشکی ترمیمی و زیبایی" },
    { id: "dr-pirouz", name: "دکتر فرهاد کمالی", spec: "متخصص درمان ریشه (اندودنتیست)" },
  ];

  const timeSlots = [
    { id: "today-pm", label: "امروز - نوبت عصر (۱۶:۰۰ الی ۱۸:۰۰)" },
    { id: "tomorrow-am", label: "فردا - نوبت صبح (۱۰:۰۰ الی ۱۲:۳۰)" },
    { id: "tomorrow-pm", label: "فردا - نوبت عصر (۱۶:۳۰ الی ۱۹:۰۰)" },
    { id: "next-day", label: "دو روز بعد - نوبت عصر (۱۵:۰۰ الی ۱۸:۳۰)" },
  ];

  const [selectedService, setSelectedService] = useState(servicesList[0]?.id || "");
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0].id);
  const [selectedTime, setSelectedTime] = useState(timeSlots[1].id);
  const [currentStep, setCurrentStep] = useState(1);

  const selectedServiceObj = servicesList.find(s => s.id === selectedService) || servicesList[0] || {
    id: "",
    title: "خدمت دندانپزشکی",
    duration: "۱ جلسه",
    note: "پذیرش دیجیتال"
  };
  const selectedDoctorObj = doctorsList.find(d => d.id === selectedDoctor) || doctorsList[0];
  const selectedTimeObj = timeSlots.find(t => t.id === selectedTime) || timeSlots[0];

  const handleProceed = () => {
    router.push(`/booking?service=${selectedService}&doctor=${selectedDoctor}`);
  };

  return (
    <section id="booking" className="py-24 relative overflow-hidden">
      
      {/* Ambient Seamless Lighting Orbs */}
      <div 
        className="absolute top-1/3 left-10 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ background: "#A09B7C" }}
      />
      <div 
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ background: "#D8AE98" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <span>سیستم پذیرش دیجیتال</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#A09B7C]">نوبت‌دهی آنی</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            رزرو اختصاصی و هوشمند نوبت کلینیک
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            در ۳ گام ساده درمان مدنظر خود را برگزینید، پزشک و زمان ایده‌آل را مشخص کنید و پیامک تاییدیه دریافت نمایید.
          </p>
        </div>

        {/* Wizard Main Seamless Surface */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#FCFAF6] p-7 sm:p-10 shadow-[0_20px_50px_rgba(48,42,33,0.04)]">
          
          {/* Step Indicator Header (Clean Unboxed Numbers) */}
          <div className="grid grid-cols-3 gap-4 pb-8 border-b border-[#E8E2D5]/40 text-center">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 1 ? "bg-[#A09B7C] text-white" : "bg-[#F7F4EE] text-[#817C70]"
              }`}>
                ۱
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${
                currentStep === 1 ? "text-[#302A21]" : "text-[#817C70]"
              }`}>
                انتخاب نوع خدمت
              </span>
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 2 ? "bg-[#A09B7C] text-white" : "bg-[#F7F4EE] text-[#817C70]"
              }`}>
                ۲
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${
                currentStep === 2 ? "text-[#302A21]" : "text-[#817C70]"
              }`}>
                پزشک معالج
              </span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 3 ? "bg-[#A09B7C] text-white" : "bg-[#F7F4EE] text-[#817C70]"
              }`}>
                ۳
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${
                currentStep === 3 ? "text-[#302A21]" : "text-[#817C70]"
              }`}>
                زمان و تایید نهایی
              </span>
            </button>
          </div>

          {/* Wizard Content Steps */}
          <div className="py-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-[#302A21]">مرحله اول: خدمت مدنظر خود را مشخص فرمایید</h3>
                    <p className="text-xs text-[#817C70] mt-1">مشاوران بالینی جهت هماهنگی دقیق‌تر قبل از حضور با شما تماس خواهند گرفت.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {servicesList.map(srv => {
                      const isSelected = selectedService === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv.id)}
                          className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#A09B7C]/15 shadow-sm"
                              : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-[#817C70]">{srv.note}</span>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isSelected ? "bg-[#A09B7C] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                            }`}>
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#302A21]">{srv.title}</h4>
                            <p className="text-xs text-[#817C70] mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#A09B7C]" />
                              <span>{srv.duration}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors cursor-pointer shadow-xs"
                    >
                      <span>ادامه: انتخاب پزشک معالج</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-[#302A21]">مرحله دوم: پزشک متخصص مورد نظر</h3>
                    <p className="text-xs text-[#817C70] mt-1">امکان انتخاب اولین زمان خالی عمومی یا رزرو با پزشک خاص</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctorsList.map(doc => {
                      const isSelected = selectedDoctor === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctor(doc.id)}
                          className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex items-center justify-between gap-4 ${
                            isSelected
                              ? "bg-[#A09B7C]/15 shadow-sm"
                              : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#A09B7C]/20 flex items-center justify-center text-[#625D45] shrink-0">
                              <Stethoscope className="w-5 h-5 text-[#A09B7C]" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-[#302A21]">{doc.name}</h4>
                              <p className="text-xs text-[#817C70] mt-0.5">{doc.spec}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-[#A09B7C] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-full text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors cursor-pointer"
                    >
                      مرحله قبل
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors cursor-pointer shadow-xs"
                    >
                      <span>ادامه: انتخاب بازه زمانی</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-[#302A21]">مرحله سوم: بازه زمانی پیشنهادی و ثبت نوبت</h3>
                    <p className="text-xs text-[#817C70] mt-1">مشخصات نوبت شما با اولویت VIP رزرو خواهد شد.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {timeSlots.map(ts => {
                      const isSelected = selectedTime === ts.id;
                      return (
                        <div
                          key={ts.id}
                          onClick={() => setSelectedTime(ts.id)}
                          className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex items-center justify-between gap-4 ${
                            isSelected
                              ? "bg-[#A09B7C]/15 shadow-sm"
                              : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-[#A09B7C]" />
                            <span className="text-sm font-semibold text-[#302A21]">{ts.label}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-[#A09B7C] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary of Selection */}
                  <div className="p-6 rounded-2xl bg-[#F7F4EE] space-y-2 text-right">
                    <div className="text-xs font-semibold text-[#817C70]">خلاصه پیش‌فاکتور زمان‌بندی:</div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#302A21]">
                      <span>خدمت: <strong className="text-[#625D45]">{selectedServiceObj.title}</strong></span>
                      <span className="text-[#C2BFA9]">·</span>
                      <span>پزشک: <strong className="text-[#625D45]">{selectedDoctorObj.name}</strong></span>
                      <span className="text-[#C2BFA9]">·</span>
                      <span>زمان: <strong className="text-[#625D45]">{selectedTimeObj.label}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 rounded-full text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors cursor-pointer"
                    >
                      مرحله قبل
                    </button>
                    <button
                      onClick={handleProceed}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors cursor-pointer shadow-[0_6px_20px_rgba(160,155,124,0.3)]"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>تایید و تکمیل فرم نهایی در صفحه نوبت‌دهی</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

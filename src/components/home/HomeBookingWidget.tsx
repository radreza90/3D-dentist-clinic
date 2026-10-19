"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  CalendarCheck, 
  Clock, 
  ArrowLeft, 
  Check, 
  Stethoscope,
  User,
  Phone,
  FileText,
  Loader2
} from "lucide-react";

export type FormattedService = {
  _id: string;
  slug: string;
  title: { fa?: string; en?: string } | string;
  duration?: string;
  warranty?: string;
  excerpt?: { fa?: string; en?: string };
  category?: string;
};

export type FormattedDoctor = {
  _id: string;
  slug: string;
  name: { fa?: string; en?: string } | string;
  specialty?: string;
  medicalCode?: string;
  clinicDays?: string;
  image?: string;
};

type HomeBookingWidgetProps = {
  services?: FormattedService[];
  doctors?: FormattedDoctor[];
};

export function HomeBookingWidget({ services = [], doctors = [] }: HomeBookingWidgetProps) {
  const router = useRouter();

  const [servicesList, setServicesList] = useState<Array<{
    id: string;
    slug: string;
    title: string;
    duration: string;
    note: string;
  }>>(() => {
    if (services && services.length > 0) {
      return services.map(s => ({
        id: s._id,
        slug: s.slug,
        title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
        duration: s.duration || "۱ جلسه",
        note: s.warranty || "پذیرش دیجیتال",
      }));
    }
    return [];
  });

  const [doctorsList, setDoctorsList] = useState<Array<{
    id: string;
    slug: string;
    name: string;
    spec: string;
    image?: string;
  }>>(() => {
    if (doctors && doctors.length > 0) {
      return doctors.map(d => ({
        id: d._id,
        slug: d.slug,
        name: typeof d.name === "string" ? d.name : (d.name?.fa || d.name?.en || d.slug),
        spec: d.specialty || "متخصص دندانپزشکی",
        image: d.image,
      }));
    }
    return [];
  });

  const [loadingServices, setLoadingServices] = useState<boolean>(services.length === 0);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(doctors.length === 0);

  const timeSlots = [
    { id: "today-pm", label: "امروز - نوبت عصر (۱۶:۰۰ الی ۱۸:۰۰)", rawTime: "16:00", daysOffset: 0 },
    { id: "tomorrow-am", label: "فردا - نوبت صبح (۱۰:۰۰ الی ۱۲:۳۰)", rawTime: "10:00", daysOffset: 1 },
    { id: "tomorrow-pm", label: "فردا - نوبت عصر (۱۶:۳۰ الی ۱۹:۰۰)", rawTime: "16:30", daysOffset: 1 },
    { id: "next-day", label: "دو روز بعد - نوبت عصر (۱۵:۰۰ الی ۱۸:۳۰)", rawTime: "15:00", daysOffset: 2 },
  ];

  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("any");
  const [selectedTime, setSelectedTime] = useState<string>(timeSlots[1].id);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form inputs for direct booking into database
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientNote, setPatientNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    appointmentId: string;
    serviceTitle: string;
    status: string;
    message: string;
  } | null>(null);

  // Fetch services from DB if not passed or empty
  useEffect(() => {
    if (services && services.length > 0) {
      const mapped = services.map(s => ({
        id: s._id,
        slug: s.slug,
        title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
        duration: s.duration || "۱ جلسه",
        note: s.warranty || "پذیرش دیجیتال",
      }));
      setServicesList(mapped);
      setSelectedService(prev => prev || mapped[0]?.id || "");
      setLoadingServices(false);
      return;
    }

    setLoadingServices(true);
    fetch("/api/v1/services", { cache: "no-store" })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((s: { _id: string; slug: string; title: { fa?: string; en?: string } | string; duration?: string; warranty?: string }) => ({
            id: s._id,
            slug: s.slug,
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
      })
      .finally(() => setLoadingServices(false));
  }, [services]);

  // Fetch doctors from DB if not passed or empty
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      const mapped = doctors.map(d => ({
        id: d._id,
        slug: d.slug,
        name: typeof d.name === "string" ? d.name : (d.name?.fa || d.name?.en || d.slug),
        spec: d.specialty || "متخصص دندانپزشکی",
        image: d.image,
      }));
      setDoctorsList(mapped);
      setLoadingDoctors(false);
      return;
    }

    setLoadingDoctors(true);
    fetch("/api/v1/doctors", { cache: "no-store" })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((d: { _id: string; slug: string; name: { fa?: string; en?: string } | string; specialty?: string; image?: string }) => ({
            id: d._id,
            slug: d.slug,
            name: typeof d.name === "string" ? d.name : (d.name?.fa || d.name?.en || d.slug),
            spec: d.specialty || "متخصص دندانپزشکی",
            image: d.image,
          }));
          setDoctorsList(mapped);
        }
      })
      .catch(err => {
        console.error("Error fetching doctors for HomeBookingWidget:", err);
      })
      .finally(() => setLoadingDoctors(false));
  }, [doctors]);

  const allDoctorOptions = [
    { id: "any", slug: "any", name: "اولین نوبت خالی با هر پزشک متخصص", spec: "سریع‌ترین زمان ممکن پذیرش", image: undefined },
    ...doctorsList,
  ];

  const selectedServiceObj = servicesList.find(s => s.id === selectedService) || servicesList[0] || {
    id: "",
    slug: "",
    title: "خدمت دندانپزشکی",
    duration: "۱ جلسه",
    note: "پذیرش دیجیتال"
  };

  const selectedDoctorObj = allDoctorOptions.find(d => d.id === selectedDoctor) || allDoctorOptions[0];
  const selectedTimeObj = timeSlots.find(t => t.id === selectedTime) || timeSlots[0];

  // Direct database appointment submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceObj.id) {
      setSubmitError("لطفاً ابتدا خدمت مورد نظر را انتخاب فرمایید.");
      return;
    }
    if (!patientName.trim() || patientName.trim().length < 3) {
      setSubmitError("لطفاً نام و نام خانوادگی را کامل وارد کنید (حداقل ۳ حرف).");
      return;
    }
    if (!patientPhone.trim() || !/^(\+98|0)?9\d{9}$/.test(patientPhone.trim().replace(/\s+/g, ""))) {
      setSubmitError("لطفاً یک شماره موبایل معتبر ۱۱ رقمی وارد نمایید (مانند ۰۹۱۲۳۴۵۶۷۸۹).");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + (selectedTimeObj.daysOffset || 0));
      const dateString = targetDate.toISOString().split("T")[0];

      const res = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceObj.id,
          doctorId: selectedDoctor !== "any" ? selectedDoctor : null,
          name: patientName.trim(),
          phone: patientPhone.trim(),
          date: dateString,
          time: selectedTimeObj.rawTime || "10:00",
          note: patientNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "خطا در ثبت نوبت در پایگاه داده.");
      }

      setBookingSuccess(data.data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "خطای ارتباط با سرور کلینیک.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setBookingSuccess(null);
    setCurrentStep(1);
    setPatientName("");
    setPatientPhone("");
    setPatientNote("");
    setSubmitError("");
  };

  const handleProceedToBookingPage = () => {
    const sParam = selectedServiceObj.slug || selectedServiceObj.id;
    router.push(`/booking?service=${encodeURIComponent(sParam)}&doctor=${encodeURIComponent(selectedDoctor)}`);
  };

  return (
    <section id="appointment" className="py-24 relative overflow-hidden bg-[#F7F4EE]">
      {/* Invisible anchor target for #booking compatibility */}
      <span id="booking" className="sr-only" />

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
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#FCFAF6] p-7 sm:p-10 shadow-[0_20px_50px_rgba(48,42,33,0.04)] border border-[#E8E2D5]/50">
          
          {/* Step Indicator Header (Clean Unboxed Numbers) */}
          <div className="grid grid-cols-3 gap-4 pb-8 border-b border-[#E8E2D5]/40 text-center">
            <button
              type="button"
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
              type="button"
              onClick={() => {
                if (selectedService || servicesList.length > 0) setCurrentStep(2);
              }}
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
              type="button"
              onClick={() => {
                if (selectedService || servicesList.length > 0) setCurrentStep(3);
              }}
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

          {/* Success Screen after direct booking */}
          {bookingSuccess ? (
            <div className="py-10 text-right space-y-6 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[#A09B7C]/20 text-[#625D45] flex items-center justify-center">
                <Check className="w-8 h-8 text-[#625D45]" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#302A21]">
                  درخواست نوبت شما با موفقیت در پایگاه‌داده ثبت شد
                </h3>
                <p className="text-sm text-[#817C70] mt-2 leading-relaxed">
                  {bookingSuccess.message || "اطلاعات رزرو شما در سیستم پذیرش ذخیره گردید و پیامک تایید ارسال خواهد شد."}
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-[#F7F4EE] space-y-3 border border-[#E8E2D5]/60">
                <div className="text-xs font-semibold text-[#817C70]">اطلاعات رزرو ثبت شده در دیتابیس:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#302A21]">
                  <div>خدمت انتخابی: <strong className="text-[#625D45]">{bookingSuccess.serviceTitle || selectedServiceObj.title}</strong></div>
                  <div>پزشک معالج: <strong className="text-[#625D45]">{selectedDoctorObj.name}</strong></div>
                  <div>کد پیگیری نوبت: <strong className="text-[#625D45]">{String(bookingSuccess.appointmentId).slice(-6).toUpperCase()}</strong></div>
                  <div>زمان نوبت: <strong>{selectedTimeObj.label}</strong></div>
                  <div>بیمار: <strong>{patientName} ({patientPhone})</strong></div>
                  <div>وضعیت: <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">در انتظار بررسی پذیرش</span></div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleResetBooking}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors cursor-pointer shadow-xs"
                >
                  <span>ثبت نوبت جدید</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Wizard Content Steps */
            <div className="py-8">
              <AnimatePresence mode="wait">
                {/* STEP 1: SERVICE SELECTION FROM DATABASE */}
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
                      <p className="text-xs text-[#817C70] mt-1">
                        تمامی خدمات به صورت زنده از پایگاه داده کلینیک فراخوانی می‌شوند؛ مشاوران بالینی قبل از حضور با شما هماهنگ خواهند شد.
                      </p>
                    </div>

                    {loadingServices ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="p-5 rounded-2xl bg-[#F7F4EE] animate-pulse h-28" />
                        ))}
                      </div>
                    ) : servicesList.length === 0 ? (
                      <div className="text-center py-8 p-6 rounded-2xl bg-[#F7F4EE] space-y-3">
                        <p className="text-xs sm:text-sm text-[#756F62]">در حال ارتباط با پایگاه داده کلینیک...</p>
                        <button
                          type="button"
                          onClick={() => {
                            setLoadingServices(true);
                            fetch("/api/v1/services", { cache: "no-store" })
                              .then(r => r.json())
                              .then(res => {
                                if (res.success && Array.isArray(res.data)) {
                                  const mapped = res.data.map((s: { _id: string; slug: string; title: { fa?: string; en?: string } | string; duration?: string; warranty?: string }) => ({
                                    id: s._id,
                                    slug: s.slug,
                                    title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
                                    duration: s.duration || "۱ جلسه",
                                    note: s.warranty || "پذیرش دیجیتال",
                                  }));
                                  setServicesList(mapped);
                                  setSelectedService(mapped[0]?.id || "");
                                }
                              })
                              .finally(() => setLoadingServices(false));
                          }}
                          className="text-xs font-bold text-[#A09B7C] hover:underline cursor-pointer"
                        >
                          تلاش مجدد برای دریافت از دیتابیس
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {servicesList.map(srv => {
                          const isSelected = (selectedService === srv.id) || (!selectedService && srv.id === servicesList[0]?.id);
                          return (
                            <div
                              key={srv.id}
                              onClick={() => {
                                setSelectedService(srv.id);
                                setSubmitError("");
                              }}
                              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex flex-col justify-between ${
                                isSelected
                                  ? "bg-[#A09B7C]/15 shadow-sm border border-[#A09B7C]/30"
                                  : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE] border border-transparent"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#817C70]">{srv.note}</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
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
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedService && servicesList.length > 0) {
                            setSelectedService(servicesList[0].id);
                          }
                          setCurrentStep(2);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>ادامه: انتخاب پزشک معالج</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: DOCTOR SELECTION FROM DATABASE */}
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
                      <p className="text-xs text-[#817C70] mt-1">
                        امکان انتخاب اولین زمان خالی عمومی یا رزرو با هر یک از پزشکان ثبت‌شده در پایگاه‌داده کلینیک
                      </p>
                    </div>

                    {loadingDoctors ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="p-5 rounded-2xl bg-[#F7F4EE] animate-pulse h-20" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {allDoctorOptions.map(doc => {
                          const isSelected = selectedDoctor === doc.id;
                          return (
                            <div
                              key={doc.id}
                              onClick={() => setSelectedDoctor(doc.id)}
                              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex items-center justify-between gap-4 ${
                                isSelected
                                  ? "bg-[#A09B7C]/15 shadow-sm border border-[#A09B7C]/30"
                                  : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE] border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {doc.image ? (
                                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#E8E2D5]">
                                    <Image
                                      src={doc.image}
                                      alt={doc.name}
                                      fill
                                      className="object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-11 h-11 rounded-xl bg-[#A09B7C]/20 flex items-center justify-center text-[#625D45] shrink-0">
                                    <Stethoscope className="w-5 h-5 text-[#A09B7C]" />
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-bold text-sm text-[#302A21]">{doc.name}</h4>
                                  <p className="text-xs text-[#817C70] mt-0.5">{doc.spec}</p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isSelected ? "bg-[#A09B7C] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                              }`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-5 py-2.5 rounded-full text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors cursor-pointer"
                      >
                        مرحله قبل
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>ادامه: انتخاب بازه زمانی</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: TIME SELECTION & FINAL PERSISTENCE TO DATABASE */}
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
                      <p className="text-xs text-[#817C70] mt-1">مشخصات نوبت شما با اولویت VIP در دیتابیس ثبت خواهد شد.</p>
                    </div>

                    {/* Time Slots Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {timeSlots.map(ts => {
                        const isSelected = selectedTime === ts.id;
                        return (
                          <div
                            key={ts.id}
                            onClick={() => setSelectedTime(ts.id)}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex items-center justify-between gap-4 ${
                              isSelected
                                ? "bg-[#A09B7C]/15 shadow-sm border border-[#A09B7C]/30"
                                : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE] border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-[#A09B7C]" />
                              <span className="text-sm font-semibold text-[#302A21]">{ts.label}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? "bg-[#A09B7C] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                            }`}>
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary of Selection */}
                    <div className="p-6 rounded-2xl bg-[#F7F4EE] space-y-2 text-right border border-[#E8E2D5]/60">
                      <div className="text-xs font-semibold text-[#817C70]">خلاصه پیش‌فاکتور زمان‌بندی:</div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#302A21]">
                        <span>خدمت: <strong className="text-[#625D45]">{selectedServiceObj.title}</strong></span>
                        <span className="text-[#C2BFA9]">·</span>
                        <span>پزشک: <strong className="text-[#625D45]">{selectedDoctorObj.name}</strong></span>
                        <span className="text-[#C2BFA9]">·</span>
                        <span>زمان: <strong className="text-[#625D45]">{selectedTimeObj.label}</strong></span>
                      </div>
                    </div>

                    {/* Direct Booking Form Fields (Persistent Database Saving) */}
                    <form onSubmit={handleSubmitBooking} className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5] space-y-4 text-right">
                      <div className="text-xs font-bold text-[#302A21]">مشخصات مراجعه‌کننده جهت ثبت در پایگاه داده:</div>
                      
                      {submitError && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                          {submitError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#756F62] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#A09B7C]" />
                            <span>نام و نام خانوادگی *</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: سارا محمدی"
                            value={patientName}
                            onChange={e => setPatientName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E8E2D5] text-xs sm:text-sm text-[#302A21] focus:outline-hidden focus:border-[#A09B7C]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#756F62] flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#A09B7C]" />
                            <span>شماره موبایل *</span>
                          </label>
                          <input
                            type="tel"
                            required
                            dir="ltr"
                            placeholder="09123456789"
                            value={patientPhone}
                            onChange={e => setPatientPhone(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E8E2D5] text-xs sm:text-sm text-[#302A21] focus:outline-hidden focus:border-[#A09B7C]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#756F62] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#A09B7C]" />
                          <span>توضیحات و ترجیحات (اختیاری)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="مثلاً: حساسیت دارویی، ترجیح ساعت دقیق‌تر و..."
                          value={patientNote}
                          onChange={e => setPatientNote(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E8E2D5] text-xs sm:text-sm text-[#302A21] focus:outline-hidden focus:border-[#A09B7C]"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#E8E2D5]/50">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="px-5 py-2.5 rounded-full text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors cursor-pointer"
                        >
                          مرحله قبل
                        </button>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={handleProceedToBookingPage}
                            className="px-4 py-3 rounded-full text-xs font-semibold text-[#625D45] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
                          >
                            انتقال به درگاه تفصیلی نوبت‌دهی
                          </button>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#A09B7C] hover:bg-[#7F795D] disabled:opacity-50 transition-colors cursor-pointer shadow-[0_6px_20px_rgba(160,155,124,0.3)]"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>در حال ثبت نوبت در دیتابیس...</span>
                              </>
                            ) : (
                              <>
                                <CalendarCheck className="w-4 h-4" />
                                <span>ثبت قطعی نوبت در سامانه کلینیک</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

import {connectDB} from "@/lib/db"; import {SiteSettingsModel} from "@/models"; import {ok} from "@/lib/api";
const defaultSite = {
  key: "main",
  clinicName: { fa: "کلینیک دندانپزشکی", en: "Dental Clinic" },
  description: { fa: "خدمات تخصصی دندانپزشکی، پزشکان مجرب و نوبت‌دهی آنلاین.", en: "Specialized dental care, experienced doctors, and online booking." },
  phones: ["021-88888888"],
  whatsapp: "+989120000000",
  address: { fa: "تهران، خیابان ولیعصر، پلاک ۱", en: "No. 1, Vali-e-Asr St, Tehran" },
  timezone: "Asia/Tehran",
  appointmentSms: { enabled: true, includeAppointmentTime: true, includeDoctorName: false, template: "نوبت شما تأیید شد. زمان: {appointmentTime}" },
  socials: { instagram: "https://instagram.com", whatsapp: "https://whatsapp.com", telegram: "https://telegram.org" }
};
export async function GET(){try{await connectDB();const data=await SiteSettingsModel.findOne({key:"main"}).lean();return ok(data||defaultSite);}catch{return ok(defaultSite);}}
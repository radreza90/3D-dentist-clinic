import {connectDB} from "@/lib/db"; import {ServiceModel} from "@/models"; import {ok} from "@/lib/api";
const defaultServices = [
  { _id: "srv-implant", slug: "implant", title: { fa: "ایمپلنت دندان", en: "Dental Implants" }, bookingFee: 500000, currency: "IRR", status: "published" },
  { _id: "srv-laminate", slug: "laminate", title: { fa: "لمینت سرامیکی", en: "Ceramic Laminates" }, bookingFee: 500000, currency: "IRR", status: "published" },
  { _id: "srv-composite", slug: "composite", title: { fa: "کامپوزیت ونیر", en: "Composite Veneers" }, bookingFee: 300000, currency: "IRR", status: "published" },
  { _id: "srv-root-canal", slug: "root-canal", title: { fa: "عصب‌کشی (درمان ریشه)", en: "Root Canal Treatment" }, bookingFee: 300000, currency: "IRR", status: "published" },
  { _id: "srv-bleaching", slug: "bleaching", title: { fa: "بلیچینگ و سفیدکردن دندان", en: "Teeth Bleaching" }, bookingFee: 200000, currency: "IRR", status: "published" },
];
export async function GET(){
  try{
    await connectDB();
    const items=await ServiceModel.find({status:"published"}).sort({createdAt:-1}).lean();
    return ok(items && items.length > 0 ? items : defaultServices);
  }catch{
    return ok(defaultServices);
  }
}
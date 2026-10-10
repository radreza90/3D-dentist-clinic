import Link from "next/link";
import { ServiceModel } from "@/models";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";

export const dynamic="force-dynamic";

export default async function ServicesPage(){
  let services: any[] = [];
  try {
    await connectDB();
    services = await ServiceModel.find({status:"published"}).sort({createdAt:1}).lean();
  } catch {
    // fallback
  }
  if (!services || services.length === 0) {
    services = [
      { _id: "1", slug: "implant", title: { fa: "ایمپلنت دندان", en: "Dental Implants" }, excerpt: { fa: "کاشت دندان با جدیدترین روش‌ها و بهترین برندها", en: "Dental implants with advanced techniques" } },
      { _id: "2", slug: "laminate", title: { fa: "لمینت سرامیکی", en: "Ceramic Laminates" }, excerpt: { fa: "اصلاح طرح لبخند با لمینت‌های باکیفیت و طبیعی", en: "Smile makeover with natural ceramic veneers" } },
      { _id: "3", slug: "composite", title: { fa: "کامپوزیت دندان", en: "Composite Veneers" }, excerpt: { fa: "ترمیم و زیباسازی دندان‌ها بدون تراش در یک جلسه", en: "Aesthetic dental composite bonding" } },
      { _id: "4", slug: "root-canal", title: { fa: "درمان ریشه (عصب‌کشی)", en: "Root Canal Treatment" }, excerpt: { fa: "درمان تخصصی و بدون درد ریشه دندان", en: "Specialized pain-free endodontic care" } },
    ];
  }
  return <main style={{maxWidth:1200,margin:"0 auto",padding:"48px 24px"}}>
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20}}>
      <div>
        <h1><Localized value={{fa:"خدمات دندانپزشکی",en:"Dental Services"}}/></h1>
        <p><Localized value={{fa:"خدمات تخصصی کلینیک را بررسی کنید.",en:"Explore our dental services and treatment options."}}/></p>
      </div>
      <Link href="/"><Localized value={{fa:"صفحه اصلی",en:"Home"}}/></Link>
    </header>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18,marginTop:32}}>
      {services.map(service=><article key={String(service._id)} style={{border:"1px solid #ddd",borderRadius:16,padding:20}}>
        <h2><Link href={"/services/"+service.slug}><Localized value={service.title}/></Link></h2>
        <p><Localized value={service.excerpt}/></p>
        <Link href={"/services/"+service.slug}><Localized value={{fa:"مشاهده جزئیات ←",en:"View details →"}}/></Link>
      </article>)}
    </div>
  </main>;
}
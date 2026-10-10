import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceModel } from "@/models";
import { sanitizeLocalizedHtml } from "@/lib/sanitize";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";

type Props={params:Promise<{slug:string}>};

const defaultServicesMap: Record<string, any> = {
  implant: {
    slug: "implant",
    title: { fa: "ایمپلنت دندان", en: "Dental Implants" },
    excerpt: { fa: "کاشت دندان با جدیدترین تکنیک‌ها و ماندگاری بسیار بالا", en: "Dental implants with advanced techniques and long-term durability" },
    content: { fa: "<p>ایمپلنت دندان جایگزینی دائمی و مقاوم برای ریشه دندان از دست رفته است و ظاهری کاملاً طبیعی ایجاد می‌کند.</p>", en: "<p>Dental implants are permanent fixtures replacing the root of missing teeth, providing natural aesthetics and function.</p>" },
    suitableFor: { fa: "<p>افرادی که به دلیل تروما یا پوسیدگی دندان خود را از دست داده‌اند و سلامت عمومی لثه دارند.</p>", en: "<p>Patients who have lost teeth due to trauma or decay and have healthy gums.</p>" },
    benefits: { fa: "<p>حفظ ساختار استخوان فک، عدم آسیب به دندان‌های مجاور، طول عمر بسیار بالا.</p>", en: "<p>Preserves jawbone density, protects adjacent teeth, and offers lifelong durability.</p>" },
    limitations: { fa: "<p>در افراد با دیابت کنترل‌نشده یا مصرف‌کنندگان خاص داروها نیاز به ارزیابی دقیق‌تر دارد.</p>", en: "<p>Requires consultation in patients with uncontrolled diabetes or bone-related conditions.</p>" },
    careInstructions: { fa: "<p>استفاده منظم از نخ دندان و واترپیک و ویزیت‌های دوره‌ای ۶ ماهه.</p>", en: "<p>Regular flossing, water flosser usage, and biannual dental examinations.</p>" },
  },
  laminate: {
    slug: "laminate",
    title: { fa: "لمینت سرامیکی", en: "Ceramic Laminates" },
    excerpt: { fa: "اصلاح طرح لبخند با لمینت‌های سرامیکی طبیعی و درخشان", en: "Smile makeover with ultra-thin natural ceramic veneers" },
    content: { fa: "<p>پوسته‌های ظریف و مستحکم سرامیکی که برای اصلاح رنگ، فرم و فواصل دندان‌ها طراحی می‌شوند.</p>", en: "<p>Thin, durable ceramic shells custom-crafted to enhance tooth shade, shape, and alignment.</p>" },
    suitableFor: { fa: "<p>افرادی که به دنبال لبخندی درخشان، یکنواخت و هماهنگ هستند.</p>", en: "<p>Patients seeking a harmonious, radiant, and symmetrical smile.</p>" },
    benefits: { fa: "<p>مقاومت فوق‌العاده در برابر تغییر رنگ، درخشندگی طبیعی مشابه مینای دندان.</p>", en: "<p>Superior stain resistance and lifelike optical translucency.</p>" },
    limitations: { fa: "<p>در موارد دندان‌قروچه شدید نیاز به استفاده از نایت‌گارد است.</p>", en: "<p>Night guard recommended for patients with bruxism.</p>" },
    careInstructions: { fa: "<p>رعایت بهداشت دهان و پرهیز از اعمال فشار شدید به لبه دندان‌ها.</p>", en: "<p>Practice standard oral hygiene and avoid biting hard objects.</p>" },
  },
};

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  let service: any = null;
  try {
    await connectDB();
    service=await ServiceModel.findOne({slug,status:"published"}).lean();
  } catch {}
  if (!service) service = defaultServicesMap[slug];
  if(!service)return {title:"Service not found"};
  const title=service.seo?.title?.fa||service.title?.fa||service.title?.en||"Dental Service";
  const description=service.seo?.description?.fa||service.excerpt?.fa||"";
  const canonical=service.seo?.canonical?.fa||undefined;
  return {
    title,
    description,
    alternates:canonical?{canonical}:undefined,
    robots:service.seo?.robots?{index:service.seo.robots.index,follow:service.seo.robots.follow}:undefined,
    openGraph:{title:service.seo?.ogTitle?.fa||title,description:service.seo?.ogDescription?.fa||description,type:"article",url:canonical},
  };
}

export default async function ServiceDetailPage({params}:Props){
  const {slug}=await params;
  let service: any = null;
  try {
    await connectDB();
    service=await ServiceModel.findOne({slug,status:"published"}).lean();
  } catch {}
  if (!service) service = defaultServicesMap[slug];
  if(!service)notFound();
  const content=sanitizeLocalizedHtml(service.content);
  const suitable=sanitizeLocalizedHtml(service.suitableFor);
  const benefits=sanitizeLocalizedHtml(service.benefits);
  const limitations=sanitizeLocalizedHtml(service.limitations);
  const care=sanitizeLocalizedHtml(service.careInstructions);

  return <main style={{maxWidth:900,margin:"0 auto",padding:"48px 24px"}}>
    <nav style={{marginBottom:24}}><Link href="/services"><Localized value={{fa:"خدمات",en:"Services"}}/></Link> / <span><Localized value={service.title}/></span></nav>
    <h1><Localized value={service.title}/></h1>
    <p style={{fontSize:18,color:"#555"}}><Localized value={service.excerpt}/></p>
    <section style={{marginTop:32}}><Localized value={content} html/></section>

    <section style={{marginTop:32}}><h2><Localized value={{fa:"مناسب چه کسانی است؟",en:"Who is it for?"}}/></h2><Localized value={suitable} html/></section>
    <section style={{marginTop:32}}><h2><Localized value={{fa:"مزایا",en:"Benefits"}}/></h2><Localized value={benefits} html/></section>
    <section style={{marginTop:32}}><h2><Localized value={{fa:"محدودیت‌ها",en:"Limitations"}}/></h2><Localized value={limitations} html/></section>
    <section style={{marginTop:32}}><h2><Localized value={{fa:"مراقبت‌های بعد از درمان",en:"Aftercare"}}/></h2><Localized value={care} html/></section>

    {service.faqs?.length?<section style={{marginTop:32}}>
      <h2><Localized value={{fa:"سؤالات متداول",en:"Frequently Asked Questions"}}/></h2>
      {service.faqs.map((faq:any,index:number)=><details key={index} style={{borderTop:"1px solid #ddd",padding:"14px 0"}}>
        <summary><Localized value={faq.question}/></summary>
        <div style={{marginTop:10}}><Localized value={sanitizeLocalizedHtml(faq.answer)} html/></div>
      </details>)}
    </section>:null}

    <section style={{marginTop:40,padding:24,borderRadius:16,background:"#f5f7fa"}}>
      <h2><Localized value={{fa:"برای این خدمت وقت بگیرید",en:"Book this treatment"}}/></h2>
      <p><Localized value={{fa:"برای انتخاب زمان مناسب و ثبت درخواست رزرو، وارد بخش نوبت‌دهی شوید.",en:"Choose a suitable time and submit your booking request."}}/></p>
      <Link href={"/booking?service="+encodeURIComponent(service.slug)} style={{display:"inline-block",padding:"12px 18px",borderRadius:10,background:"#111",color:"#fff"}}>
        <Localized value={{fa:"درخواست نوبت",en:"Book an appointment"}}/>
      </Link>
    </section>
  </main>;
}
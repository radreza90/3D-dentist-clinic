import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DoctorModel, MediaModel } from "@/models";
import { sanitizeRichHtml } from "@/lib/sanitize";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";

type Props={params:Promise<{slug:string}>};

const defaultDoctorsMap: Record<string, any> = {
  "dr-ahmadi": {
    slug: "dr-ahmadi",
    name: { fa: "دکتر مریم احمدی", en: "Dr. Maryam Ahmadi" },
    shortBio: { fa: "متخصص دندانپزشکی ترمیمی و زیبایی، دارای بورد تخصصی", en: "Specialist in Aesthetic and Restorative Dentistry" },
    bio: { fa: "<p>دکتر مریم احمدی با بیش از ۱۲ سال سابقه درخشان در زمینه طراحی لبخند، لمینت‌های سرامیکی و ترمیم‌های زیبایی دندان.</p>", en: "<p>Dr. Maryam Ahmadi has over 12 years of clinical excellence in cosmetic dentistry, ceramic veneers, and smile makeovers.</p>" },
    university: { fa: "دانشگاه علوم پزشکی تهران", en: "Tehran University of Medical Sciences" },
    certificates: [
      { title: { fa: "بورد تخصصی دندانپزشکی ترمیمی", en: "Board Certification in Restorative Dentistry" }, issuer: { fa: "وزارت بهداشت", en: "Ministry of Health" }, year: "1395" }
    ],
    courses: [
      { title: { fa: "دوره پیشرفته لمینت سرامیکی", en: "Advanced Aesthetic Veneers Masterclass" }, provider: { fa: "انجمن دندانپزشکان زیبایی سوئیس", en: "Swiss Aesthetic Dental Society" }, year: "2019" }
    ]
  },
  "dr-rezaei": {
    slug: "dr-rezaei",
    name: { fa: "دکتر علی رضایی", en: "Dr. Ali Rezaei" },
    shortBio: { fa: "جراح فک و صورت و فلوشیپ ایمپلنت‌های پیشرفته", en: "Oral & Maxillofacial Surgeon, Implantology Fellow" },
    bio: { fa: "<p>متخصص جراحی دهان، فک و صورت با تسلط بر جراحی‌های پیچیده بازسازی استخوان و ایمپلنت‌های فوری.</p>", en: "<p>Specialist in oral and maxillofacial surgery with extensive expertise in bone augmentation and immediate implant placement.</p>" },
    university: { fa: "دانشگاه علوم پزشکی شهید بهشتی", en: "Shahid Beheshti University of Medical Sciences" },
    certificates: [
      { title: { fa: "فلوشیپ بین‌المللی ایمپلنتولوژی", en: "International Fellowship in Implantology" }, issuer: { fa: "ICOI", en: "ICOI" }, year: "2021" }
    ]
  }
};

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  let doctor: any = null;
  try {
    await connectDB();
    doctor=await DoctorModel.findOne({slug,status:"published"}).lean();
  } catch {}
  if (!doctor) doctor = defaultDoctorsMap[slug];
  if(!doctor)return {title:"Doctor not found"};
  const title=doctor.seo?.title?.fa||doctor.name?.fa||doctor.name?.en||"Doctor";
  return {title,description:doctor.seo?.description?.fa||doctor.shortBio?.fa||"",alternates:doctor.seo?.canonical?.fa?{canonical:doctor.seo.canonical.fa}:undefined,robots:doctor.seo?.robots||undefined};
}

export default async function DoctorDetail({params}:Props){
  const {slug}=await params;
  let doctor: any = null;
  try {
    await connectDB();
    doctor=await DoctorModel.findOne({slug,status:"published"}).lean();
  } catch {}
  if (!doctor) doctor = defaultDoctorsMap[slug];
  if(!doctor)notFound();
  let photo: any = null;
  try {
    photo=doctor.photoMediaId?await MediaModel.findById(doctor.photoMediaId).lean():null;
  } catch {}
  return <main style={{maxWidth:900,margin:"0 auto",padding:"48px 24px"}}>
    <Link href="/doctors"><Localized value={{fa:"← بازگشت به پزشکان",en:"← Back to doctors"}}/></Link>
    <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:24,alignItems:"start",marginTop:24}}>
      <div>{photo?<img src={photo.url} alt={photo.alt?.fa||""} style={{width:180,height:180,objectFit:"cover",borderRadius:"50%"}}/>:<div style={{width:180,height:180,borderRadius:"50%",background:"#eee"}}/>}</div>
      <div><h1><Localized value={doctor.name}/></h1><p><Localized value={doctor.shortBio}/></p></div>
    </div>
    <section style={{marginTop:32}}><h2><Localized value={{fa:"بیوگرافی",en:"Biography"}}/></h2><Localized value={{fa:sanitizeRichHtml(doctor.bio?.fa),en:sanitizeRichHtml(doctor.bio?.en)}} html/></section>
    <section style={{marginTop:32}}><h2><Localized value={{fa:"دانشگاه",en:"University"}}/></h2><Localized value={doctor.university}/></section>
    {doctor.certificates?.length?<section style={{marginTop:32}}><h2><Localized value={{fa:"مدارک و گواهی‌ها",en:"Certificates"}}/></h2>{doctor.certificates.map((c:any,i:number)=><div key={i} style={{padding:"12px 0",borderTop:"1px solid #ddd"}}><strong><Localized value={c.title}/></strong><div><Localized value={c.issuer}/>{c.year?" • "+c.year:""}</div></div>)}</section>:null}
    {doctor.courses?.length?<section style={{marginTop:32}}><h2><Localized value={{fa:"دوره‌ها",en:"Courses"}}/></h2>{doctor.courses.map((c:any,i:number)=><div key={i} style={{padding:"12px 0",borderTop:"1px solid #ddd"}}><strong><Localized value={c.title}/></strong><div><Localized value={c.provider}/>{c.year?" • "+c.year:""}</div></div>)}</section>:null}
    {doctor.credentials?.length?<section style={{marginTop:32}}><h2><Localized value={{fa:"سوابق و صلاحیت‌ها",en:"Credentials"}}/></h2>{doctor.credentials.map((c:any,i:number)=><div key={i} style={{padding:"12px 0",borderTop:"1px solid #ddd"}}><strong><Localized value={c.title}/></strong><div><Localized value={{fa:sanitizeRichHtml(c.description?.fa),en:sanitizeRichHtml(c.description?.en)}} html/></div></div>)}</section>:null}
  </main>;
}
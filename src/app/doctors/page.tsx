import Link from "next/link";
import { DoctorModel } from "@/models";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";

export const dynamic="force-dynamic";

export default async function DoctorsPage(){
  let doctors: any[] = [];
  try {
    await connectDB();
    doctors = await DoctorModel.find({status:"published"}).sort({createdAt:1}).lean();
  } catch {
    // fallback
  }
  if (!doctors || doctors.length === 0) {
    doctors = [
      { _id: "1", slug: "dr-ahmadi", name: { fa: "دکتر مریم احمدی", en: "Dr. Maryam Ahmadi" }, shortBio: { fa: "متخصص دندانپزشکی ترمیمی و زیبایی، دارای بورد تخصصی", en: "Specialist in Aesthetic and Restorative Dentistry" } },
      { _id: "2", slug: "dr-rezaei", name: { fa: "دکتر علی رضایی", en: "Dr. Ali Rezaei" }, shortBio: { fa: "جراح فک و صورت و فلوشیپ ایمپلنت‌های پیشرفته", en: "Oral & Maxillofacial Surgeon, Implantology Fellow" } },
    ];
  }
  return <main style={{maxWidth:1200,margin:"0 auto",padding:"48px 24px"}}>
    <h1><Localized value={{fa:"پزشکان کلینیک",en:"Our Doctors"}}/></h1>
    <p><Localized value={{fa:"با تیم درمانی و سوابق حرفه‌ای پزشکان آشنا شوید.",en:"Meet our dental team and explore their professional credentials."}}/></p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginTop:32}}>
      {doctors.map(doctor=><article key={String(doctor._id)} style={{border:"1px solid #ddd",borderRadius:16,padding:20}}>
        {doctor.photoMediaId?<div style={{height:220,marginBottom:16,background:"#f2f3f5",borderRadius:12}}/>:null}
        <h2><Link href={"/doctors/"+doctor.slug}><Localized value={doctor.name}/></Link></h2>
        <p><Localized value={doctor.shortBio}/></p>
        <Link href={"/doctors/"+doctor.slug}><Localized value={{fa:"مشاهده پروفایل ←",en:"View profile →"}}/></Link>
      </article>)}
    </div>
  </main>;
}
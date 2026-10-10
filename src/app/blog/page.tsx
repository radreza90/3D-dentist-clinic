import Link from "next/link";
import { BlogPostModel } from "@/models";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";

export const dynamic="force-dynamic";

export default async function BlogPage(){
  let posts: any[] = [];
  try {
    await connectDB();
    posts = await BlogPostModel.find({status:"published"}).sort({publishedAt:-1,createdAt:-1}).limit(50).lean();
  } catch {
    // fallback
  }
  if (!posts || posts.length === 0) {
    posts = [
      { _id: "1", slug: "dental-hygiene-tips", title: { fa: "اصول مراقبت روزانه از دندان‌ها و لثه", en: "Daily Oral Hygiene Essentials" }, excerpt: { fa: "نکات کلیدی مسواک زدن صحیح، استفاده از نخ دندان و جلوگیری از پوسیدگی", en: "Key practices for brushing, flossing, and preventing cavities" } },
      { _id: "2", slug: "implants-vs-bridges", title: { fa: "مقایسه ایمپلنت دندان و بریج سنتی", en: "Dental Implants vs Traditional Bridges" }, excerpt: { fa: "مزایا، معایب و طول عمر هر روش در جایگزینی دندان‌های از دست رفته", en: "Pros, cons, and longevity of missing teeth replacement options" } },
    ];
  }
  return <main style={{maxWidth:1200,margin:"0 auto",padding:"48px 24px"}}>
    <h1><Localized value={{fa:"مجله دندانپزشکی",en:"Dental Journal"}}/></h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginTop:32}}>
      {posts.map(post=><article key={String(post._id)} style={{border:"1px solid #ddd",borderRadius:16,padding:20}}>
        <h2><Link href={"/blog/"+post.slug}><Localized value={post.title}/></Link></h2>
        <p><Localized value={post.excerpt}/></p>
        <Link href={"/blog/"+post.slug}><Localized value={{fa:"ادامه مطلب ←",en:"Read article →"}}/></Link>
      </article>)}
    </div>
  </main>;
}
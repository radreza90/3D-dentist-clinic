import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostModel } from "@/models";
import { sanitizeLocalizedHtml } from "@/lib/sanitize";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";

type Props={params:Promise<{slug:string}>};

const defaultArticles: Record<string, any> = {
  "dental-hygiene-tips": {
    slug: "dental-hygiene-tips",
    title: { fa: "اصول مراقبت روزانه از دندان‌ها و لثه", en: "Daily Oral Hygiene Essentials" },
    excerpt: { fa: "نکات کلیدی مسواک زدن صحیح، استفاده از نخ دندان و جلوگیری از پوسیدگی", en: "Key practices for brushing, flossing, and preventing cavities" },
    publishedAt: new Date().toISOString(),
    content: {
      fa: "<p>مراقبت مناسب از دندان‌ها و لثه پایه‌گذار سلامت کل بدن است. مسواک زدن دو بار در روز با خمیردندان حاوی فلوراید و کشیدن روزانه نخ دندان مانع تشکیل پلاک میکروبی می‌شود.</p>",
      en: "<p>Proper oral hygiene is essential for overall well-being. Brushing twice daily with fluoride toothpaste and flossing once a day prevents bacterial plaque buildup.</p>"
    }
  },
  "implants-vs-bridges": {
    slug: "implants-vs-bridges",
    title: { fa: "مقایسه ایمپلنت دندان و بریج سنتی", en: "Dental Implants vs Traditional Bridges" },
    excerpt: { fa: "مزایا، معایب و طول عمر هر روش در جایگزینی دندان‌های از دست رفته", en: "Pros, cons, and longevity of missing teeth replacement options" },
    publishedAt: new Date().toISOString(),
    content: {
      fa: "<p>ایمپلنت دندان مستقل از دندان‌های همجوار عمل می‌کند و از تحلیل استخوان فک جلوگیری می‌نماید، در حالی که در روش بریج نیاز به تراشیدن دندان‌های کناری است.</p>",
      en: "<p>Dental implants preserve adjacent natural teeth and prevent bone loss, whereas traditional dental bridges require grinding down adjacent teeth for support.</p>"
    }
  }
};

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  let post: any = null;
  try {
    await connectDB();
    post=await BlogPostModel.findOne({slug,status:"published"}).lean();
  } catch {}
  if (!post) post = defaultArticles[slug];
  if(!post)return {title:"Article not found"};
  const title=post.seo?.title?.fa||post.title?.fa||post.title?.en||"Dental Article";
  const description=post.seo?.description?.fa||post.excerpt?.fa||"";
  return {title,description,alternates:post.seo?.canonical?.fa?{canonical:post.seo.canonical.fa}:undefined,robots:post.seo?.robots||undefined};
}

export default async function BlogPostPage({params}:Props){
  const {slug}=await params;
  let post: any = null;
  try {
    await connectDB();
    post=await BlogPostModel.findOne({slug,status:"published"}).lean();
  } catch {}
  if (!post) post = defaultArticles[slug];
  if(!post)notFound();
  const content=sanitizeLocalizedHtml(post.content);
  return <main style={{maxWidth:900,margin:"0 auto",padding:"48px 24px"}}>
    <Link href="/blog"><Localized value={{fa:"← بازگشت به مقالات",en:"← Back to articles"}}/></Link>
    <h1 style={{marginTop:24}}><Localized value={post.title}/></h1>
    <p style={{color:"#666"}}><Localized value={post.excerpt}/></p>
    {post.publishedAt?<time dateTime={new Date(post.publishedAt).toISOString()}>{new Date(post.publishedAt).toLocaleDateString("fa-IR")}</time>:null}
    <article style={{marginTop:32,lineHeight:2}}><Localized value={content} html/></article>
  </main>;
}
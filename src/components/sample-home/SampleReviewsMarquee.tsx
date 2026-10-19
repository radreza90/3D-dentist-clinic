"use client";

import { useState } from "react";
import { FormattedTestimonial } from "./SampleVideoDeck";
import { Pause, Play } from "lucide-react";

type SampleReviewsMarqueeProps = {
  testimonials: FormattedTestimonial[];
};

export function SampleReviewsMarquee({ testimonials }: SampleReviewsMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Filter items that have meaningful comments
  const items = testimonials.filter((t) => t.comment?.fa);
  if (items.length === 0) return null;

  // Duplicate items for continuous smooth marquee loop
  const marqueeItems = [...items, ...items, ...items];

  return (
    <section className="py-16 relative bg-[#F7F4EE] border-t border-[#E8E2D5]" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-16">
          <div>
            <div className="sample-kicker">
              <span className="sample-kicker-line" />
              <span>نظر شما مهم است</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3]">
              از تجربه‌ها،
              <br />
              <em className="not-italic text-[#A09B7C]">بیشتر می‌آموزیم.</em>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 max-w-md text-right">
            <p className="text-sm text-[#756F62] leading-relaxed">
              بازخوردهای واقعی مراجعین درباره روند درمان و مشاوره‌ها. با لمس کارت‌ها حرکت متوقف خواهد شد.
            </p>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#625D45] bg-white border border-[#E8E2D5] shadow-xs hover:bg-[#FCFAF6] transition"
              aria-pressed={isPaused}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#625D45]" />
                  <span>ادامه حرکت نظرات</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-[#625D45]" />
                  <span>توقف حرکت نظرات</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Marquee Track */}
      <div className="sample-reviews-marquee">
        <div className={`sample-reviews-track ${isPaused ? "is-paused" : ""}`}>
          {marqueeItems.map((item, index) => {
            const firstLetter = item.patientName.fa.charAt(0) || "م";
            return (
              <article key={`${item._id}-${index}`} className="sample-review-ticket">
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-[#A09B7C]">
                  <span>تجربه تایید شده مراجعه</span>
                  <span className="text-amber-500 font-bold">
                    {"★".repeat(item.rating || 5)}
                  </span>
                </div>

                <p className="text-sm text-[#463F32] leading-relaxed line-clamp-4 my-2">
                  «{item.comment?.fa}»
                </p>

                <footer className="flex items-center gap-3 pt-4 border-t border-[#E8E2D5]/70 mt-3">
                  <div className="w-9 h-9 rounded-full bg-[#d1cfbc]/60 text-[#625D45] font-black text-sm flex items-center justify-center shrink-0">
                    {firstLetter}
                  </div>
                  <div className="text-right">
                    <strong className="block text-xs font-bold text-[#302A21]">
                      {item.patientName.fa}
                    </strong>
                    <small className="block text-[10px] text-[#756F62]">
                      {item.treatment?.fa || "مراجعه‌کننده کلینیک"}
                    </small>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

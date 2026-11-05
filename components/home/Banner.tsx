"use client";

import { useEffect, useState, useTransition } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Banner() {
  const [isMounted, setIsMounted] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[550px] md:h-[650px] bg-slate-950 animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden bg-slate-950">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect={"fade"}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        <SwiperSlide className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop"
            alt="Library Banner 1"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-6 w-full text-left">
            <span className="inline-block rounded-full bg-[#00A8E8]/20 text-[#00A8E8] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4 border border-[#00A8E8]/30">
              Welcome to BookNook
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
              Discover Your Next Great Read Today
            </h1>
            <p className="text-base md:text-lg text-slate-300 mt-4 max-w-xl">
              Explore a vast collection of books, borrow seamlessly, and manage
              your reading journey all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/books"
                className="inline-flex items-center justify-center rounded-md bg-[#00A8E8] px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-[#0095d1] transition-colors"
              >
                Explore Catalog <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/add-book"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-lg hover:bg-slate-100 transition-colors"
              >
                Contribute Book
              </Link>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            alt="Library Banner 2"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-6 w-full text-left">
            <span className="inline-block rounded-full bg-[#00A8E8]/20 text-[#00A8E8] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4 border border-[#00A8E8]/30">
              Smart Library
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
              Borrow, Track, and Enjoy Reading
            </h1>
            <p className="text-base md:text-lg text-slate-300 mt-4 max-w-xl">
              Keep track of your borrowed books with ease and return them right
              on time with our modern dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/books"
                className="inline-flex items-center justify-center rounded-md bg-[#00A8E8] px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-[#0095d1] transition-colors"
              >
                Browse Books <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/add-book"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-lg hover:bg-slate-100 transition-colors"
              >
                Contribute Book
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&auto=format&fit=crop"
            alt="Library Banner 3"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-6 w-full text-left">
            <span className="inline-block rounded-full bg-[#00A8E8]/20 text-[#00A8E8] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4 border border-[#00A8E8]/30">
              Community Powered
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
              Share Books, Grow the Shelf Together
            </h1>
            <p className="text-base md:text-lg text-slate-300 mt-4 max-w-xl">
              Contribute the books you love to the catalog and help fellow
              readers discover their next favorite story.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/add-book"
                className="inline-flex items-center justify-center rounded-md bg-[#00A8E8] px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-[#0095d1] transition-colors"
              >
                Contribute a Book <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/books"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-lg hover:bg-slate-100 transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
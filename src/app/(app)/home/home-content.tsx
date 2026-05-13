"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

const serviceImages = [
  { src: "/service-dropshipping-live.jpg", alt: "Dropshipping" },
  { src: "/service-warehousing-live.jpg", alt: "Warehousing" },
  { src: "/service-trucking-live.jpg", alt: "OTR Trucking" },
  { src: "/service-drayage-live.jpg", alt: "Drayage" },
];

function ServiceCategoryIcon({ type }: { type: "threepl" | "transport" | "overseas" }) {
  return (
    <div className="b612-float-up flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[rgba(20,170,60,0.3)] text-black">
      {type === "threepl" && (
        <svg className="h-[31px] w-[25px]" fill="currentColor" viewBox="54 43.5 92 113" aria-hidden="true">
          <path d="M109.061 43.5H54v113h92v-76l-36.939-37zm2.468 14.411l20.086 20.117h-20.086V57.911zm-49.103 90.148V51.941h40.676v34.527h34.471v61.591H62.426z" />
        </svg>
      )}
      {type === "transport" && (
        <svg className="h-[24px] w-[31px]" fill="currentColor" viewBox="32.5 47.5 135 105" aria-hidden="true">
          <path d="M167.5 97.708l-24.343-27.845h-17.651V47.5H32.5v88.026h19.018c.409 9.427 8.244 16.974 17.844 16.974 9.596 0 17.426-7.546 17.835-16.974h24.598c.408 9.427 8.243 16.974 17.843 16.974 9.596 0 17.429-7.546 17.837-16.974H167.5V97.708zM40.934 55.869h76.14v71.29h-76.14v-71.29zm28.428 88.264c-4.951 0-9.015-3.795-9.412-8.607h18.813c-.393 4.811-4.455 8.607-9.401 8.607zm60.278 0c-4.95 0-9.016-3.795-9.409-8.607h18.813c-.396 4.811-4.459 8.607-9.404 8.607zm29.426-16.974h-33.561V78.231h13.803l19.758 22.6v26.328z" />
        </svg>
      )}
      {type === "overseas" && (
        <svg className="h-[27px] w-[31px]" fill="currentColor" viewBox="128 170.667 768 682.666" aria-hidden="true">
          <path d="M640 725.333v-128h128v128h85.333v128h-128v-128h-42.666v128h-128v-128zm213.333-128H768v-51.2l-256-256-256 256V768h256v85.333H170.667V554.667H128l384-384 384 384h-42.667z" />
        </svg>
      )}
    </div>
  );
}

function TestimonialQuoteIcon() {
  return (
    <svg
      className="b612-float-up h-[30px] w-10 fill-white"
      preserveAspectRatio="xMidYMid meet"
      viewBox="-0.02 -0.005 54.82 38.305"
      aria-hidden="true"
    >
      <path d="M2.1 37.4v-.5c4.4-.9 8.5-3.1 11.6-6.5 2.8-3.3 4.5-7.4 4.7-11.7-2.6 3.1-5.5 4.6-8.7 4.6-1.9 0-3.7-.5-5.3-1.5-1.4-.8-2.6-2.1-3.3-3.7C.3 16.4 0 14.5 0 12.7-.2 9.3 1.1 6 3.4 3.5 5.7 1.2 8.8-.1 12 0c3.2-.1 6.3 1.3 8.3 3.7 2.1 2.5 3.2 6.1 3.2 10.8 0 2-.2 4-.6 5.9-.4 2-1.2 4-2.2 5.8-1.1 2.1-2.6 3.9-4.3 5.6-1.8 1.7-3.8 3.2-6 4.3-2.1 1.1-4.3 1.8-6.6 2.2l-1.7-.9z" />
      <path d="M33.4 37.4v-.5c4.4-.9 8.5-3.1 11.6-6.5 2.8-3.3 4.5-7.4 4.7-11.7-2.6 3.1-5.5 4.6-8.7 4.6-1.9 0-3.7-.5-5.3-1.5-1.5-.9-2.6-2.2-3.3-3.8-.8-1.7-1.1-3.6-1.1-5.4-.2-3.4 1.1-6.7 3.4-9.2C37 1.2 40.1-.1 43.3 0c3.2-.1 6.3 1.3 8.3 3.7 2.1 2.5 3.2 6.1 3.2 10.8 0 2-.2 4-.6 5.9-.4 2-1.2 4-2.2 5.8-1.1 2.1-2.6 3.9-4.3 5.6-1.8 1.7-3.8 3.2-6 4.3-2.1 1.1-4.3 1.8-6.6 2.2l-1.7-.9z" />
    </svg>
  );
}

export function HomeContent() {
  const { t } = useTranslation();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/file.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-5 sm:px-10 lg:px-20">
          <h1 className="b612-float-in max-w-[650px] text-[32px] font-bold leading-[1.2em] tracking-[-0.03em] text-white [font-family:'Helvetica_W01',Arial,sans-serif] sm:text-[38px]">
            {t.hero.title}
            <br />
            {t.hero.subtitle}
          </h1>
          <p className="b612-float-in mt-[19px] max-w-[650px] text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.hero.description}
          </p>
          <Link
            href="mailto:FF@B612timainc.com?subject=Quote%20from%20website"
            className="b612-float-in b612-live-button mt-[20px] flex h-[45px] w-[160px] items-center justify-center rounded-[10px] bg-[#14AA3C] text-[16px] font-normal uppercase leading-[1.5em] tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif] hover:bg-[#14AA3C]"
          >
            {t.hero.cta}
          </Link>
        </div>
      </section>

      {/* ── About / Fulfillment ── */}
      <section id="about" className="bg-white py-[50px]">
        <div className="b612-about-shell mx-auto grid items-stretch bg-[#F5F5F5] lg:grid-cols-2">
          <div className="b612-about-content flex flex-col justify-start">
            <h3 className="b612-float-in text-[20px] font-bold leading-[1.4em] text-[#14AA3C] [font-family:'Helvetica_W01',Arial,sans-serif]">
              {t.about.tag}
            </h3>
            <h2 className="b612-float-in mt-5 whitespace-pre-line text-[32px] font-bold leading-[1.2em] tracking-[-0.03em] text-black [font-family:'Helvetica_W01',Arial,sans-serif] sm:text-[38px]">
              {t.about.title}
            </h2>
            <p className="b612-float-in mt-5 max-w-[400px] text-[16px] font-normal leading-[1.6em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
              {t.about.description}
            </p>
            <div className="b612-float-in mt-5">
              <Link
                href="/about"
                className="b612-live-button flex h-[45px] w-[160px] items-center justify-center rounded-[10px] bg-[#14AA3C] text-[16px] font-normal leading-[1.5em] tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif] hover:bg-[#14AA3C]"
              >
                {t.about.cta}
              </Link>
            </div>
          </div>
          <div className="relative min-h-[450px] lg:min-h-0">
            <Image
              src="/about-container-yard.jpg"
              alt="Container Yard_edited.jpg"
              fill
              sizes="(min-width: 1024px) 490px, calc(100vw - 40px)"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ── Service Categories (3-column text) ── */}
      <section className="bg-white py-[50px]">
        <div className="b612-services-strip mx-auto grid bg-[#F5F5F5] sm:grid-cols-3">
          {(["threepl", "transport", "overseas"] as const).map((key) => (
            <div key={key} className="px-6 pb-[50px] pt-[50px] sm:w-full">
              <ServiceCategoryIcon type={key} />
              <h3 className="b612-float-up mt-5 text-[20px] font-bold leading-[1.4em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {t.serviceCategories[key].title}
              </h3>
              <ol className="b612-float-up mt-5 list-decimal space-y-0 pl-5 text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {t.serviceCategories[key].items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ── Warehouse Advantage (image bg) ── */}
      <section className="relative min-h-[618px] overflow-hidden bg-black">
        <Image
          src="/warehouse-advantage.jpg"
          alt="Image by Jacques Dillies"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="relative z-10 px-5 pb-[50px] pt-[52px] sm:px-10 lg:px-20">
          <h2 className="b612-float-in max-w-[650px] whitespace-pre-line text-[32px] font-bold leading-[1.2em] tracking-[-0.03em] text-white [font-family:'Helvetica_W01',Arial,sans-serif] sm:text-[38px]">
            {t.advantage.title}
          </h2>
          <div className="mt-5 space-y-5">
            {(["flexibility", "logistics", "customerService"] as const).map((key) => (
              <div key={key} className="b612-float-in">
                <h3 className="text-[20px] font-bold leading-[1.4em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {t.advantage[key].title}
                </h3>
                <p className="max-w-[900px] text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {t.advantage[key].description}
                </p>
              </div>
            ))}
          </div>
          <div className="b612-float-in mt-5">
            <Link
              href="mailto:FF@B612timainc.com?subject=Quote%20from%20website"
              className="b612-live-button flex h-[45px] w-[160px] items-center justify-center rounded-[10px] bg-[#14AA3C] text-[16px] font-normal uppercase leading-[1.5em] tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif] hover:bg-[#14AA3C]"
            >
              {t.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Services (image gallery) ── */}
      <section id="services" className="bg-white">
        <div className="b612-services-strip mx-auto">
          <h2 className="my-[50px] max-w-[907px] text-left text-[38px] font-bold leading-[1.2em] tracking-[-0.03em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.ourServices.title}
          </h2>
          <div className="grid gap-x-5 gap-y-5 pb-[50px] sm:grid-cols-2">
            {serviceImages.map((img, i) => (
              <article key={img.src} className="bg-white">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 480px, calc(100vw - 40px)"
                    className="object-cover object-center"
                  />
                </div>
                <div className="min-h-[213px] pt-[15px]">
                  <h3 className="text-[20px] font-bold leading-[25px] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                    {t.ourServices.cards[i].title}
                  </h3>
                  <p className="mb-4 mt-[6px] text-[15px] font-normal leading-[18px] text-[#747474] [font-family:'Avenir_LT_W01',Arial,sans-serif]">
                    {t.ourServices.cards[i].subtitle}
                  </p>
                  <button
                    type="button"
                    className="flex h-[45px] w-[190px] items-center justify-center rounded-[10px] bg-[#14AA3C] text-[15px] font-bold leading-[18px] text-white transition-colors duration-200 [font-family:'Helvetica_W01',Arial,sans-serif] hover:bg-[#2DBE55]"
                  >
                    {t.ourServices.learnMore}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client Testimonials ── */}
      <section id="contact" className="relative min-h-[551px] overflow-hidden bg-black">
        <Image
          src="/testimonials-bg-live.jpg"
          alt="搬入新屋"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-80"
        />
        <div className="relative z-10">
          <div className="b612-services-strip mx-auto pt-[99px]">
            <h2 className="b612-float-up mb-[50px] mx-[10px] text-center text-[38px] font-bold leading-[1.2em] tracking-[-0.03em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
              {t.testimonials.title}
            </h2>
          </div>
          <div className="b612-services-strip mx-auto grid pb-[10px] sm:grid-cols-3">
            {t.testimonials.items.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <TestimonialQuoteIcon />
                <p className="b612-float-up mx-[10px] mt-[35px] max-w-[307px] text-center text-[16px] font-normal leading-[1.88em] tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {`"${item.quote}"`}
                </p>
                <p className="b612-float-up mx-[10px] mt-9 max-w-[307px] text-center text-[14px] font-bold leading-[1.67em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {`${item.name}, ${item.role}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

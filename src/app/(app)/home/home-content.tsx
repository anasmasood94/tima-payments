"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

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
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-5 sm:px-10 lg:px-20">
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl">
            {t.hero.title}
            <br />
            {t.hero.subtitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">{t.hero.description}</p>
          <Link
            href="/register"
            className="mt-10 rounded-sm bg-brand px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-brand-dark"
          >
            {t.hero.cta}
          </Link>
        </div>
      </section>

      {/* ── About / Fulfillment ── */}
      <section id="about" className="bg-white px-5 py-10 sm:px-10 lg:px-20">
        <div className="grid items-stretch overflow-hidden rounded-md bg-panel lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-20 lg:py-20">
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand">{t.about.tag}</h3>
            <h2 className="mt-4 whitespace-pre-line text-3xl font-bold leading-snug text-ink sm:text-4xl">
              {t.about.title}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-body">{t.about.description}</p>
            <div className="mt-8">
              <Link
                href="/catalog"
                className="inline-block rounded-full bg-brand px-7 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-brand-dark"
              >
                {t.about.cta}
              </Link>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image src="/container-yard.jpg" alt="Container yard" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── Service Categories (3-column text) ── */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:grid-cols-3 sm:gap-16 sm:px-10 lg:px-20">
          {(["threepl", "transport", "overseas"] as const).map((key, idx) => (
            <div key={key} className="flex flex-col items-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                {idx === 0 && (
                  <svg className="h-7 w-7 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                )}
                {idx === 1 && (
                  <svg className="h-7 w-7 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                )}
                {idx === 2 && (
                  <svg className="h-7 w-7 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                )}
              </div>
              <h3 className="text-center text-base font-bold text-ink">
                {t.serviceCategories[key].title}
              </h3>
              <ol className="mt-4 list-inside list-decimal space-y-2 text-left text-sm leading-relaxed text-body">
                {t.serviceCategories[key].items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ── Warehouse Advantage (image bg) ── */}
      <section className="relative">
        <Image src="/warehouse.jpg" alt="Warehouse interior" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-3xl px-5 py-10 sm:px-10 lg:px-20 lg:py-16">
          <h2 className="whitespace-pre-line text-3xl font-bold text-white sm:text-4xl">
            {t.advantage.title}
          </h2>
          <div className="mt-10 space-y-6">
            {(["flexibility", "logistics", "customerService"] as const).map((key) => (
              <div key={key}>
                <h3 className="text-base font-bold text-white">{t.advantage[key].title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{t.advantage[key].description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/register"
              className="inline-block rounded-full bg-brand px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-brand-dark"
            >
              {t.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Services (image cards) ── */}
      <section id="services" className="bg-white py-20">
        <div className="px-5 sm:px-10 lg:px-20">
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">{t.ourServices.title}</h2>
          <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2">
            {[
              { src: "/dropshipping.jpg", alt: "Dropshipping" },
              { src: "/warehousing-service.jpg", alt: "Warehousing" },
              { src: "/trucking.jpg", alt: "OTR Trucking" },
              { src: "/drayage.jpg", alt: "Drayage" },
            ].map((img, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-md bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-ink">{t.ourServices.cards[i].title}</h3>
                  <p className="mt-1 text-sm text-body">{t.ourServices.cards[i].subtitle}</p>
                  <button className="mt-3 text-sm font-semibold text-brand transition hover:text-brand-dark">
                    {t.ourServices.learnMore}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client Testimonials ── */}
      <section id="contact" className="relative py-20">
        <Image src="/moving.jpg" alt="Testimonials background" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 px-5 sm:px-10 lg:px-20">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{t.testimonials.title}</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {t.testimonials.items.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <svg className="mb-4 h-10 w-10 text-brand" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="text-sm italic leading-relaxed text-white/90">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="text-sm font-bold text-white">{item.name} {item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

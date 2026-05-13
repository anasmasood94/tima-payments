"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/language-context";

export function AboutContent() {
  const { t } = useTranslation();

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative h-[50vh] min-h-[340px] overflow-hidden">
        <Image src="/nsplsh.jpg" alt="Container port" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-20 text-center">
          <h1 className="text-5xl font-bold text-white sm:text-6xl">{t.aboutPage.title}</h1>
        </div>
      </section>

      {/* ── Company Intro ── */}
      <section className="bg-white px-20 py-10">
        <div className="grid items-stretch overflow-hidden rounded-md bg-panel lg:grid-cols-2">
          <div className="flex flex-col justify-center px-14 py-16 lg:px-20">
            <h2 className="text-2xl font-bold leading-snug text-neutral-800 sm:text-3xl">
              {t.aboutPage.subtitle}
            </h2>
            <p className="mt-5 text-[15px] font-medium text-neutral-700">{t.aboutPage.intro}</p>
            <div className="mt-6 space-y-5 text-[15px] leading-[1.8] text-neutral-600">
              <p>{t.aboutPage.description1}</p>
              <p>{t.aboutPage.description2}</p>
              <p>{t.aboutPage.description3}</p>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image src="/nsplsh2.jpg" alt="Warehouse interior" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── End-to-End Solutions ── */}
      <section className="relative py-24">
        <Image src="/11062b.jpg" alt="Logistics facility aerial" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-4xl px-20 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.aboutPage.endToEnd.title}</h2>
          <p className="mt-6 text-[15px] leading-[1.8] text-neutral-300">{t.aboutPage.endToEnd.description}</p>
        </div>
      </section>

      {/* ── Workflow Automation + Process Steps ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-20 text-center">
          <h2 className="text-3xl font-bold text-neutral-800 sm:text-4xl">{t.aboutPage.workflow.title}</h2>
          <p className="mx-auto mt-6 max-w-3xl text-[15px] leading-[1.8] text-neutral-500">
            {t.aboutPage.workflow.description}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1200px] gap-12 px-20 sm:grid-cols-2">
          {[
            { src: "/Order Booking.avif", alt: "Order Booking" },
            { src: "/Dispatch_Routing.jpg", alt: "Dispatch & Routing" },
            { src: "/Warehousing.jpg", alt: "Warehousing" },
            { src: "/Delivery_Proof .jpg", alt: "Delivery Proof" },
          ].map((img, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-sm">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
              <div className="px-5 py-6">
                <h3 className="text-lg font-bold text-neutral-800">{t.aboutPage.steps[i].title}</h3>
                <p className="mt-3 text-[14px] leading-[1.8] text-neutral-500">{t.aboutPage.steps[i].description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cost Tracking ── */}
      <section className="bg-[#e8f5f0] py-24">
        <div className="mx-auto max-w-4xl px-20 text-center">
          <h2 className="text-3xl font-bold text-neutral-800 sm:text-4xl">{t.aboutPage.costSection.title}</h2>
          <p className="mt-4 text-[15px] text-neutral-500">{t.aboutPage.costSection.subtitle}</p>
          <a
            href="mailto:FF@B612timainc.com?subject=Quote%20from%20website"
            className="mt-6 inline-block rounded-full bg-brand px-8 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-brand-dark"
          >
            {t.aboutPage.costSection.cta}
          </a>
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl gap-10 px-20 sm:grid-cols-2 lg:grid-cols-4">
          {t.aboutPage.costFeatures.map((feat, i) => (
            <div key={i}>
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white">
                {i === 0 && (
                  <svg className="h-10 w-10 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                )}
                {i === 1 && (
                  <svg className="h-10 w-10 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                )}
                {i === 2 && (
                  <svg className="h-10 w-10 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                )}
                {i === 3 && (
                  <svg className="h-10 w-10 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                )}
              </div>
              <h3 className="text-sm font-bold text-neutral-800">{feat.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.8] text-neutral-500">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-20">
          <h2 className="text-center text-5xl font-bold text-neutral-800">{t.aboutPage.faqTitle}</h2>
          <div className="mt-16 divide-y divide-neutral-200">
            {t.aboutPage.faqs.map((faq, i) => (
              <FaqItem key={i} index={i + 1} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ index, question, answer }: { index: number; question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  const parts: { type: "text" | "bullets"; content: string[] }[] = [];
  const lines = answer.split("\n");
  for (const line of lines) {
    if (line.startsWith("• ")) {
      const last = parts[parts.length - 1];
      if (last?.type === "bullets") {
        last.content.push(line.slice(2));
      } else {
        parts.push({ type: "bullets", content: [line.slice(2)] });
      }
    } else {
      parts.push({ type: "text", content: [line] });
    }
  }

  return (
    <div className="py-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg font-bold text-neutral-800">
          {index}. {question}
        </span>
        <svg
          className={`ml-6 h-5 w-5 shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-4 text-[15px] leading-[1.8] text-neutral-500">
          {parts.map((part, i) =>
            part.type === "bullets" ? (
              <ul key={i} className="my-2 list-disc space-y-1 pl-6">
                {part.content.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className={i > 0 ? "mt-1" : ""}>{part.content[0]}</p>
            )
          )}
        </div>
      )}
    </div>
  );
}

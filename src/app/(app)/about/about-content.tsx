"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/language-context";

const workflowImages = [
  { src: "/workflow-order-booking-live.jpg", alt: "Image by NEW DATA SERVICES" },
  { src: "/workflow-warehousing-live.jpg", alt: "Image by Alberto Rodriguez" },
  { src: "/workflow-dispatch-routing-live.jpg", alt: "Image by Marcin Jozwiak" },
  { src: "/workflow-delivery-proof-live.jpg", alt: "Image by Lukas Blazek" },
];

const costFeatureImages = [
  { src: "/cost-tracking-live.png", alt: "Business chart icon" },
  { src: "/cost-sandbox-live.jpg", alt: "Cost sandbox chart" },
  { src: "/cost-bargaining-live.jpg", alt: "Bargaining cockpit chart" },
  { src: "/cost-dashboard-live.jpg", alt: "Funding dashboard checklist" },
];

export function AboutContent() {
  const { locale, t } = useTranslation();

  useEffect(() => {
    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>(".b612-float-in, .b612-float-up, .b612-fade-in")
    );

    if (animatedElements.length === 0) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animatedElements.forEach((element) => element.classList.add("b612-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("b612-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [locale]);

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative min-h-[600px] overflow-hidden bg-black">
        <Image
          src="/about-hero-live.jpg"
          alt="Container port"
          fill
          priority
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto h-[600px] w-[980px] max-w-full">
          <h1 className="absolute left-1/2 top-[272px] w-[450px] max-w-[calc(100vw-40px)] -translate-x-1/2 text-center text-[57px] font-bold leading-[1.2em] tracking-[-0.03em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.title}
          </h1>
        </div>
      </section>

      {/* ── Company Intro ── */}
      <section className="bg-white py-[50px]">
        <div className="b612-services-strip mx-auto grid min-h-[600px] items-stretch overflow-hidden bg-[#F5F5F5] lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="w-full max-w-[490px] pb-[41px] pt-10">
              <h2 className="b612-float-in mb-5 text-[38px] font-bold leading-[1.2em] tracking-[-0.03em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {t.aboutPage.subtitle === "A Fulfillment Logistics Company" ? (
                  <>
                    A Fulfillment
                    <br />
                    Logistics Company
                  </>
                ) : (
                  t.aboutPage.subtitle
                )}
              </h2>
              <div className="b612-float-in space-y-6 text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                <p>{t.aboutPage.intro}</p>
                <p>{t.aboutPage.description1}</p>
                <p>{t.aboutPage.description2}</p>
                <p>{t.aboutPage.description3}</p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[600px]">
            <Image
              src="/about-warehouse-live.jpg"
              alt="Warehouse interior"
              fill
              quality={100}
              className="object-cover"
              sizes="(min-width: 1024px) 1800px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ── End-to-End Solutions ── */}
      <section className="relative min-h-[400px] overflow-hidden bg-[#00060F]">
        <Image
          src="/11062b.jpg"
          alt="Logistics facility aerial"
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto w-[980px] max-w-full pt-[115px] text-center">
          <h2 className="b612-float-up mb-5 text-[38px] font-bold leading-[1.4em] tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.endToEnd.title}
          </h2>
          <p className="b612-float-up text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.endToEnd.description}
          </p>
        </div>
      </section>

      {/* ── Workflow Automation + Process Steps ── */}
      <section className="overflow-hidden bg-white">
        <div className="mx-auto my-[50px] w-[980px] max-w-full text-center">
          <h2 className="b612-float-up mx-auto mb-5 w-[490px] max-w-[calc(100vw_-_40px)] text-[38px] font-bold leading-[1.2em] tracking-[-0.03em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.workflow.title}
          </h2>
          <p className="b612-float-up text-center text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.workflow.description}
          </p>
        </div>

        <div className="mx-auto mb-[50px] grid w-[calc(100%_-_80px)] max-w-[1200px] gap-x-[50px] gap-y-[50px] sm:grid-cols-2">
          {workflowImages.map((img, i) => (
            <div
              key={img.src}
              className="b612-float-up overflow-hidden rounded-[30px] border border-[#D9D9D9] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
            >
              <div className="relative aspect-[575/300] w-full overflow-hidden rounded-t-[30px] border-[10px] border-white">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 555px, calc(100vw - 40px)"
                />
              </div>
              <div className="px-[17px] pb-[30px] pt-[10px]">
                <h3 className="mb-5 text-[24px] font-bold leading-[1.3em] tracking-[-0.01em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {t.aboutPage.steps[i].title}
                </h3>
                <p className="text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {t.aboutPage.steps[i].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cost Tracking ── */}
      <section className="overflow-hidden bg-[linear-gradient(135deg,#DEF5F1_0%,#ECF9F7_48.77193183229681%,#FFFFFF_100%)]">
        <div className="b612-float-up mx-auto my-[50px] w-[650px] max-w-[calc(100%_-_40px)] text-center">
          <h2 className="mb-5 text-[38px] font-bold leading-[1.2em] tracking-[-0.03em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.costSection.title}
          </h2>
          <p className="mx-auto mb-5 w-[608px] max-w-full text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.costSection.subtitle}
          </p>
          <a
            href="mailto:FF@B612timainc.com?subject=Quote%20from%20website"
            className="b612-live-button inline-flex h-[45px] w-[180px] items-center justify-center rounded-[10px] bg-[#14AA3C] text-[16px] font-normal leading-none tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif] hover:bg-[#14AA3C]"
          >
            {t.aboutPage.costSection.cta}
          </a>
        </div>

        <div className="mx-auto mb-[50px] flex w-[1200px] justify-between">
          {t.aboutPage.costFeatures.map((feat, i) => (
            <div key={costFeatureImages[i].src} className="b612-float-up w-[285px] overflow-hidden rounded-[30px] bg-white">
              <div className="relative mb-5 ml-[27px] mt-5 h-[126px] w-[200px]">
                <Image
                  src={costFeatureImages[i].src}
                  alt={costFeatureImages[i].alt}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <h3 className="mb-5 ml-[27px] w-[230px] text-[20px] font-bold leading-[1.4em] tracking-[-0.02em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {feat.title}
              </h3>
              <p className="mb-5 ml-[27px] w-[230px] text-[16px] font-normal leading-[1.5em] tracking-[-0.01em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white pb-5 pt-[30px]">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 lg:px-20">
          <h2 className="mb-[42px] text-center text-[38px] font-bold leading-[1.4em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
            {t.aboutPage.faqTitle}
          </h2>
          <div className="divide-y divide-[#F5F5F5]">
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
  const [open, setOpen] = useState(index === 1);

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
    <div className="py-8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[20px] font-bold leading-[1.4em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
          {index}. {question}
        </span>
        <svg
          className={`ml-6 h-6 w-6 shrink-0 text-black transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M18.2546728,8.18171329 L18.9617796,8.88882007 L12.5952867,15.2537133 L12.5978964,15.2558012 L11.8907896,15.962908 L11.8882867,15.9607133 L11.8874628,15.9617796 L11.180356,15.2546728 L11.1812867,15.2527133 L4.81828671,8.88882007 L5.52539349,8.18171329 L11.8882867,14.5457133 L18.2546728,8.18171329 Z"
          />
        </svg>
      </button>
      {open && (
        <div className="mt-5 text-[16px] font-normal leading-[24px] text-[#747474] [font-family:'Helvetica_W01',Arial,sans-serif]">
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

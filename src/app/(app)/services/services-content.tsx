"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/language-context";

const additionalImages = [
  "/services/UPS.jpg",
  "/services/Discounted_Shipping.jpg",
  "/services/Shipment_Booking.jpg",
  "/services/Customs_Service.jpg",
];

function OtrTruckingBody() {
  const { t } = useTranslation();
  const copy = t.servicesPage.otrTrucking;

  return (
    <div className="text-[16px] font-normal leading-[1.6em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
      <p>{copy.description1}</p>
      <p className="h-4" aria-hidden="true">
        &nbsp;
      </p>
      <p>{copy.description2}</p>
      <p className="h-4" aria-hidden="true">
        &nbsp;
      </p>
      <p>{copy.description3}</p>
    </div>
  );
}

function DrayageBody({ items }: { items: readonly string[] }) {
  const { t } = useTranslation();
  const copy = t.servicesPage.drayage;

  return (
    <>
      <p className="mb-5 text-[16px] font-normal leading-normal tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
        {copy.description}
      </p>
      <div className="mb-[40px]">
        <h3 className="text-[16px] font-bold leading-[1.6em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
          {copy.specialTitle}
        </h3>
        <ul className="b612-services-list list-disc pl-5 text-[15px] font-normal leading-[1.6em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
          {items.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function WarehousingBody() {
  const { t } = useTranslation();
  const copy = t.servicesPage.warehousing;

  return (
    <div className="text-[16px] font-normal leading-normal tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
      <p>{copy.description1}</p>
      <p className="h-4" aria-hidden="true">
        &nbsp;
      </p>
      <p>{copy.description2}</p>
      <p className="h-4" aria-hidden="true">
        &nbsp;
      </p>
      <p>{copy.description3}</p>
    </div>
  );
}

export function ServicesContent() {
  const { locale, t } = useTranslation();
  const svc = t.servicesPage;

  useEffect(() => {
    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".b612-float-in, .b612-float-in-right, .b612-float-up, .b612-fade-in"
      )
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
          src="/services-hero-live.jpg"
          alt={svc.images.hero}
          fill
          priority
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="relative z-10 flex h-[600px] w-full flex-col items-start justify-start px-4 pt-[196px] sm:px-10 lg:px-20">
          <h1 className="b612-float-in-right w-[490px] max-w-full text-[38px] font-bold leading-[1.2em] tracking-[-0.03em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
            {svc.title}
          </h1>
          <p className="b612-float-in-right mt-5 w-[490px] max-w-full text-[16px] font-normal leading-[1.6em] tracking-[-0.01em] text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
            {svc.subtitle}
          </p>
          <Link
            href="/about"
            className="b612-float-in-right b612-live-button mt-5 flex h-[45px] w-[180px] items-center justify-center rounded-[10px] bg-[#14AA3C] text-[16px] font-normal leading-none tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif] hover:bg-[#14AA3C]"
          >
            {svc.cta}
          </Link>
        </div>
      </section>

      {/* ── DROPSHIPPING — text left, image right ── */}
      <section className="bg-white py-[50px]">
        <div className="b612-services-strip mx-auto grid items-stretch overflow-hidden bg-[#F5F5F5] lg:h-[551px] lg:grid-cols-2">
          <div className="w-full lg:h-[551px]">
            <div className="mx-auto w-full max-w-[490px]">
              <h2 className="b612-float-in mb-5 pt-[25px] text-[24px] font-bold leading-[1.2em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {svc.dropshipping.title}
              </h2>
              <p className="b612-float-in mb-5 text-[16px] font-normal leading-normal tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {svc.dropshipping.description}
              </p>
              <div className="b612-float-in mb-[27px]">
                <h3 className="text-[16px] font-bold leading-[1.6em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {svc.dropshipping.specialTitle}
                </h3>
                <ul className="b612-services-list list-disc pl-5 text-[16px] font-normal leading-[1.6em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                  {svc.dropshipping.items.map((item, i) => (
                    <li key={i}>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="relative min-h-[300px] lg:h-[551px]">
            <Image
              src="/services/DROPSHIPPING.jpg"
              alt={svc.images.dropshipping}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 490px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ── WAREHOUSING — image left, text right ── */}
      <section className="bg-white py-[50px]">
        <div className="b612-services-strip mx-auto grid items-stretch overflow-hidden bg-[#F5F5F5] lg:h-[602px] lg:grid-cols-2">
          <div className="relative min-h-[300px] lg:h-[602px]">
            <Image
              src="/services/WAREHOUSING.jpg"
              alt={svc.images.warehousing}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 490px, 100vw"
            />
          </div>
          <div className="w-full lg:h-[602px]">
            <div className="b612-float-in-right mx-auto w-full max-w-[490px]">
              <h2 className="mb-5 pt-[53px] text-[24px] font-bold leading-[1.2em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {svc.warehousing.title}
              </h2>
              <div className="mb-[58px]">
                <WarehousingBody />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OTR TRUCKING — text left, image right ── */}
      <section className="bg-white py-[50px]">
        <div className="b612-services-strip mx-auto grid items-stretch overflow-hidden bg-[#F5F5F5] lg:h-[550px] lg:grid-cols-2">
          <div className="w-full lg:h-[550px]">
            <div className="mx-auto w-full max-w-[490px]">
              <h2 className="b612-float-in mb-5 pt-[57px] text-[24px] font-bold leading-[1.2em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {svc.otrTrucking.title}
              </h2>
              <div className="b612-float-in mb-[58px]">
                <OtrTruckingBody />
              </div>
            </div>
          </div>
          <div className="relative min-h-[300px] lg:h-[550px]">
            <Image
              src="/services/TRUCKING.jpg"
              alt={svc.images.otrTrucking}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 490px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ── DRAYAGE — image left, text right ── */}
      <section className="bg-white py-[50px]">
        <div className="b612-services-strip mx-auto grid items-stretch overflow-hidden bg-[#F5F5F5] lg:h-[601px] lg:grid-cols-2">
          <div className="relative min-h-[300px] lg:h-[601px]">
            <Image
              src="/services/DRAYAGE.jpg"
              alt={svc.images.drayage}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 490px, 100vw"
            />
          </div>
          <div className="w-full lg:h-[601px]">
            <div className="b612-float-in-right mx-auto w-full max-w-[490px]">
              <h2 className="mb-5 pt-[38px] text-[24px] font-bold leading-[1.2em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {svc.drayage.title}
              </h2>
              <DrayageBody items={svc.drayage.items} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Additional Services — live: comp-marwfq7m / marwki8i / marwm5h9 ── */}
      <section className="bg-white">
        <div className="b612-services-strip mx-auto">
          <h2 className="b612-float-in-right my-[50px] text-[38px] font-bold leading-[1.2em] tracking-[-0.03em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
            {svc.additionalServices.title}
          </h2>
          <div className="mb-[50px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {svc.additionalServices.cards.map((card, i) => (
              <article key={i} className="flex flex-col bg-[#F5F5F5]">
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                  <Image
                    src={additionalImages[i]}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 230px, 50vw"
                  />
                </div>
                <div className="box-border px-[30px] py-[15px]">
                  <h3 className="mb-[6px] text-[20px] font-bold leading-[1.4em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                    {card.title}
                  </h3>
                  <p className="text-[16px] font-normal leading-[1.5em] text-[#747474] [font-family:'Helvetica_W01',Arial,sans-serif]">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

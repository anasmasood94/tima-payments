"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

const additionalImages = [
  "/services/UPS.jpg",
  "/services/Discounted_Shipping.jpg",
  "/services/Shipment_Booking.jpg",
  "/services/Customs_Service.jpg",
];

export function ServicesContent() {
  const { t } = useTranslation();
  const svc = t.servicesPage;

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <Image
          src="/services/Services.jpg"
          alt="Logistics facility aerial"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-start justify-end px-20 pb-20">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {svc.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-neutral-200">
            {svc.subtitle}
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block rounded-full bg-brand px-8 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-brand-dark"
          >
            {svc.cta}
          </Link>
        </div>
      </section>

      {/* ── DROPSHIPPING — text left, image right ── */}
      <section className="px-10 py-14 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-stretch overflow-hidden md:grid-cols-2">
          <div className="flex flex-col justify-center bg-neutral-100 px-10 py-10 lg:px-14">
            <h2 className="text-xl font-bold text-neutral-800">
              {svc.dropshipping.title}
            </h2>
            <p className="mt-4 text-[13px] leading-[1.8] text-neutral-600">
              {svc.dropshipping.description}
            </p>
            <h3 className="mt-6 text-sm font-bold text-neutral-800">
              {svc.dropshipping.specialTitle}
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-[1.8] text-neutral-600">
              {svc.dropshipping.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[400px]">
            <Image
              src="/services/DROPSHIPPING.jpg"
              alt="Dropshipping service"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── WAREHOUSING — image left, text right ── */}
      <section className="px-10 py-14 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-stretch overflow-hidden md:grid-cols-2">
          <div className="relative min-h-[400px]">
            <Image
              src="/services/WAREHOUSING.jpg"
              alt="Warehousing operations"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-neutral-100 px-10 py-10 lg:px-14">
            <h2 className="text-xl font-bold text-neutral-800">
              {svc.warehousing.title}
            </h2>
            <div className="mt-4 space-y-4 text-[13px] leading-[1.8] text-neutral-600">
              <p>{svc.warehousing.description1}</p>
              <p>{svc.warehousing.description2}</p>
              <p>{svc.warehousing.description3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OTR TRUCKING — text left, image right ── */}
      <section className="bg-neutral-50 px-10 py-14 lg:px-20">
        <div className="mx-auto grid max-w-7xl overflow-hidden md:grid-cols-2">
          <div className="flex flex-col justify-center py-8 pr-10 lg:pr-14">
            <h2 className="text-xl font-bold text-neutral-800">
              {svc.otrTrucking.title}
            </h2>
            <div className="mt-4 space-y-4 text-[13px] leading-[1.8] text-neutral-600">
              <p>{svc.otrTrucking.description1}</p>
              <p>{svc.otrTrucking.description2}</p>
              <p>{svc.otrTrucking.description3}</p>
            </div>
          </div>
          <div className="relative min-h-[400px]">
            <Image
              src="/services/TRUCKING.jpg"
              alt="OTR trucking"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── DRAYAGE — image left, text right ── */}
      <section className="px-10 py-14 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-stretch overflow-hidden md:grid-cols-2">
          <div className="relative min-h-[400px]">
            <Image
              src="/services/DRAYAGE.jpg"
              alt="Drayage service"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-neutral-100 px-10 py-10 lg:px-14">
            <h2 className="text-xl font-bold text-neutral-800">
              {svc.drayage.title}
            </h2>
            <p className="mt-4 text-[13px] leading-[1.8] text-neutral-600">
              {svc.drayage.description}
            </p>
            <h3 className="mt-6 text-sm font-bold text-neutral-800">
              {svc.drayage.specialTitle}
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-[1.8] text-neutral-600">
              {svc.drayage.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Additional Services ── */}
      <section className="px-10 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
            {svc.additionalServices.title}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {svc.additionalServices.cards.map((card, i) => (
              <div key={i}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={additionalImages[i]}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="pt-5">
                  <h3 className="text-sm font-bold text-neutral-800">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.7] text-neutral-500">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

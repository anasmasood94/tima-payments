"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/language-context";

export function ContactContent() {
  const { t } = useTranslation();
  const c = t.contactPage;
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = `Quote Request from ${fd.get("companyName") || "Website"}`;
    const body = [
      `Company: ${fd.get("companyName")}`,
      `Name: ${fd.get("firstName")} ${fd.get("lastName")}`,
      `Email: ${fd.get("email")}`,
      `Phone: ${fd.get("phone")}`,
      `Shipment ETA: ${fd.get("shipmentEta")}`,
      `Message: ${fd.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:FF@B612TimaInc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="/hero-port.jpg"
          alt="Contact us"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {c.heroTitle}
          </h1>
        </div>
      </section>

      {/* ── Content: Info + Form ── */}
      <section className="px-10 py-16 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          {/* Left — Company info + price quote guide */}
          <div>
            <p className="text-lg font-medium text-neutral-500">{c.brandLabel}</p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-800 sm:text-3xl">
              {c.partnerTitle}
            </h2>
            <h3 className="mt-6 text-base font-bold text-brand">{c.guideTitle}</h3>

            <div className="mt-6">
              <p className="text-sm font-bold text-neutral-800">{c.drayageTitle}</p>
              <ul className="mt-2 space-y-1 text-[13px] leading-[1.7] text-neutral-600">
                {c.drayageFields.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold text-neutral-800">{c.otrTitle}</p>
              <ul className="mt-2 space-y-1 text-[13px] leading-[1.7] text-neutral-600">
                {c.otrFields.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Contact form */}
          <div>
            <h2 className="text-xl font-bold text-neutral-800 sm:text-2xl">
              {c.formTitle}
            </h2>

            {submitted ? (
              <p className="mt-8 text-brand font-medium">{c.successMessage}</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm text-neutral-600">{c.companyName}</label>
                  <input
                    name="companyName"
                    type="text"
                    className="mt-1 w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-neutral-600">
                      {c.firstName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="mt-1 w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600">{c.lastName}</label>
                    <input
                      name="lastName"
                      type="text"
                      className="mt-1 w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-600">
                    {c.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600">{c.phone}</label>
                  <input
                    name="phone"
                    type="tel"
                    className="mt-1 w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600">{c.shipmentEta}</label>
                  <input
                    name="shipmentEta"
                    type="date"
                    className="mt-1 w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600">{c.message}</label>
                  <input
                    name="message"
                    type="text"
                    className="mt-1 w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-brand px-10 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-brand-dark"
                >
                  {c.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Google Maps with two pins ── */}
      <section className="w-full">
        <OfficeMap />
      </section>
    </>
  );
}

const OFFICES = [
  { lat: 34.0407, lng: -117.6118, label: "2090 S. Baker Ave, Ontario, CA 91761" },
  { lat: 22.6369, lng: 114.0237, label: "深圳市深宝茂大厦813" },
];

function OfficeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).google?.maps) {
      initMap();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?callback=__initContactMap`;
    script.async = true;
    script.defer = true;
    (window as any).__initContactMap = () => {
      setLoaded(true);
      initMap();
    };
    document.head.appendChild(script);
    return () => {
      delete (window as any).__initContactMap;
    };
  }, []);

  useEffect(() => {
    if (loaded) initMap();
  }, [loaded]);

  function initMap() {
    if (!mapRef.current || !(window as any).google?.maps) return;
    const google = (window as any).google;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 30, lng: -30 },
      zoom: 2,
      mapTypeControl: true,
      streetViewControl: true,
      zoomControl: true,
    });
    OFFICES.forEach((office) => {
      const marker = new google.maps.Marker({
        position: { lat: office.lat, lng: office.lng },
        map,
        title: office.label,
      });
      const infoWindow = new google.maps.InfoWindow({ content: `<div style="font-size:13px;max-width:200px"><strong>${office.label}</strong><br/><a href="https://maps.google.com/?q=${encodeURIComponent(office.label)}" target="_blank" style="color:#1a73e8">Directions</a></div>` });
      marker.addListener("click", () => infoWindow.open(map, marker));
    });
  }

  return <div ref={mapRef} className="h-[400px] w-full bg-neutral-100" />;
}

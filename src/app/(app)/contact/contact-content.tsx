"use client";

import Image from "next/image";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import {
  ContactCalendarIcon,
  ContactPhoneChevronIcon,
  ContactPhoneGlobeIcon,
} from "./contact-form-icons";

const contactLabelClass =
  "block text-[16px] font-normal leading-[1.5em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]";
const contactInputClass =
  "w-full min-w-0 bg-transparent py-3 text-[16px] font-normal leading-[1.5em] text-black outline-none [font-family:'Helvetica_W01',Arial,sans-serif]";

export function ContactContent() {
  const { t } = useTranslation();
  const c = t.contactPage;
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const m = c.mailto;
    const company = String(fd.get("companyName") || m.defaultCompany);
    const subject = `${m.subjectPrefix} ${company}`;
    const body = [
      `${m.company}: ${fd.get("companyName")}`,
      `${m.name}: ${fd.get("firstName")} ${fd.get("lastName")}`,
      `${m.email}: ${fd.get("email")}`,
      `${m.phone}: ${fd.get("phone")}`,
      `${m.shipmentEta}: ${fd.get("shipmentEta")}`,
      `${m.message}: ${fd.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${c.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <>
      {/* ── Hero — live: comp-marnx8o4 (980×600) / comp-marnx8o62 ── */}
      <section className="relative min-h-[600px] overflow-hidden bg-black">
        <Image
          src="/contact-hero-live.jpg"
          alt="Contact us"
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
        />
        <h1 className="absolute left-1/2 top-[272px] w-[450px] max-w-[calc(100vw-40px)] -translate-x-1/2 text-center text-[56px] font-bold leading-normal tracking-normal text-white [font-family:'Helvetica_W01',Arial,sans-serif]">
          {c.heroTitle}
        </h1>
      </section>

      {/* ── Info + Form — live: comp-marwskd7 / marwswkp 980×490+490 ── */}
      <section className="bg-white">
        {/* Live: marwswkp 980px strip = 490px + 490px columns, 480px content blocks */}
        <div className="b612-services-strip mx-auto mb-[22px] mt-[50px]">
          <div className="mx-auto grid w-full max-w-[980px] max-lg:grid-cols-1 lg:grid-cols-[490px_490px]">
          <div className="w-full lg:w-[490px]">
            <div className="mx-auto w-full max-w-[480px]">
            <p className="mb-5 text-[20px] font-normal leading-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
              {c.brandLabel}
            </p>
            <h2 className="mb-6 text-[38px] font-bold leading-[1.2em] tracking-normal text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
              {c.partnerTitle}
            </h2>
            <h3 className="mb-5 text-[20px] font-bold leading-normal text-[#14AA3C] [font-family:'Helvetica_W01',Arial,sans-serif]">
              {c.guideTitle}
            </h3>

            <div className="mb-5 text-[16px] font-normal leading-[1.5em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
              <p className="font-bold">{c.drayageTitle}</p>
              {c.drayageFields.map((field, i) => (
                <p key={i}>{field}</p>
              ))}
            </div>

            <div className="mb-14 text-[16px] font-normal leading-[1.5em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
              <p className="font-bold">{c.otrTitle}</p>
              {c.otrFields.map((field, i) => (
                <p key={i}>{field}</p>
              ))}
            </div>
            </div>
          </div>

          <div className="w-full lg:w-[490px]">
            <div className="mx-auto w-full max-w-[480px] lg:ml-[10px] lg:mr-auto">
            <h2 className="mb-6 text-[24px] font-bold leading-[1.2em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
              {c.formTitle}
            </h2>

            {submitted ? (
              <p className="mt-5 text-[16px] font-normal leading-[1.5em] text-black [font-family:'Helvetica_W01',Arial,sans-serif]">
                {c.successMessage}
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <ContactFormField label={c.companyName}>
                  <input name="companyName" type="text" className={contactInputClass} />
                </ContactFormField>

                <div className="mb-5 grid grid-cols-2 gap-5">
                  <ContactFormField label={c.firstName} requiredMarker={c.requiredMarker}>
                    <input
                      name="firstName"
                      type="text"
                      required
                      className={contactInputClass}
                    />
                  </ContactFormField>
                  <ContactFormField label={c.lastName}>
                    <input name="lastName" type="text" className={contactInputClass} />
                  </ContactFormField>
                </div>

                <ContactFormField label={c.email} requiredMarker={c.requiredMarker}>
                  <input name="email" type="email" required className={contactInputClass} />
                </ContactFormField>

                <ContactFormField label={c.phone} composite>
                  <div className="flex items-stretch border-b-2 border-black">
                    <button
                      type="button"
                      className="flex shrink-0 items-center gap-0.5 px-1 py-2 text-[#595959]"
                      aria-label={c.phoneCountryAriaLabel}
                    >
                      <ContactPhoneGlobeIcon />
                      <ContactPhoneChevronIcon />
                    </button>
                    <input name="phone" type="tel" className={contactInputClass} />
                  </div>
                </ContactFormField>

                <ContactFormField label={c.shipmentEta} composite>
                  <div className="flex items-stretch border-b-2 border-black">
                    <button
                      type="button"
                      className="shrink-0 px-1 py-2 text-[#595959]"
                      aria-label={c.datePickerAriaLabel}
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector(
                          'input[name="shipmentEta"]'
                        ) as HTMLInputElement | null;
                        input?.showPicker?.();
                        input?.focus();
                      }}
                    >
                      <ContactCalendarIcon />
                    </button>
                    <input
                      name="shipmentEta"
                      type="date"
                      className={`${contactInputClass} [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:opacity-0`}
                    />
                  </div>
                </ContactFormField>

                <ContactFormField label={c.message}>
                  <input name="message" type="text" className={contactInputClass} />
                </ContactFormField>

                <button
                  type="submit"
                  className="mt-5 rounded-[10px] bg-[#14AA3C] px-6 py-[11px] text-[16px] font-normal leading-[1.4em] text-white transition hover:bg-[#14AA3C] [font-family:'Helvetica_W01',Arial,sans-serif]"
                >
                  {c.submit}
                </button>
              </form>
            )}
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <OfficeMap />
      </section>
    </>
  );
}

function ContactFormField({
  label,
  requiredMarker,
  children,
  composite = false,
}: {
  label: string;
  requiredMarker?: string;
  children: ReactNode;
  composite?: boolean;
}) {
  return (
    <div className="mb-5">
      <label className={contactLabelClass}>
        {label}
        {requiredMarker ? (
          <span aria-hidden="true" className="ml-0.5">
            {requiredMarker}
          </span>
        ) : null}
      </label>
      {composite ? children : <div className="border-b-2 border-black">{children}</div>}
    </div>
  );
}

function OfficeMap() {
  const { t } = useTranslation();
  const c = t.contactPage;
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if ((window as { google?: { maps?: unknown } }).google?.maps) {
      initMap();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?callback=__initContactMap";
    script.async = true;
    script.defer = true;
    (window as { __initContactMap?: () => void }).__initContactMap = () => {
      setLoaded(true);
      initMap();
    };
    document.head.appendChild(script);
    return () => {
      delete (window as { __initContactMap?: () => void }).__initContactMap;
    };
  }, []);

  useEffect(() => {
    if (loaded) initMap();
  }, [loaded]);

  function initMap() {
    type GMaps = {
      Map: new (el: HTMLElement, opts: object) => object;
      Marker: new (opts: object) => { addListener: (event: string, fn: () => void) => void };
      InfoWindow: new (opts: { content?: string }) => { open: (map: object, marker: object) => void };
    };
    const g = (window as { google?: { maps: GMaps } }).google;
    if (!mapRef.current || !g?.maps) return;

    const map = new g.maps.Map(mapRef.current, {
      center: { lat: 30, lng: -30 },
      zoom: 2,
      mapTypeControl: true,
      streetViewControl: true,
      zoomControl: true,
    });

    c.offices.forEach((office) => {
      const marker = new g.maps.Marker({
        position: { lat: office.lat, lng: office.lng },
        map,
        title: office.label,
      });
      const infoWindow = new g.maps.InfoWindow({
        content: `<div style="padding:8px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.4"><strong>${office.label}</strong><br/><a href="https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}" target="_blank" rel="noopener noreferrer">${c.directions}</a></div>`,
      });
      marker.addListener("click", () => infoWindow.open(map, marker));
    });
  }

  return <div ref={mapRef} className="h-[350px] w-full bg-neutral-100" />;
}

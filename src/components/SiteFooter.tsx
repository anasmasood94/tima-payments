"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

const footerSocialLinks = [
  { href: "https://www.facebook.com/wix", label: "Facebook", src: "/social-facebook-live.png" },
  { href: "https://www.instagram.com/wix", label: "Instagram", src: "/social-instagram-live.png" },
  { href: "https://www.twitter.com/wix", label: "Twitter", src: "/social-twitter-live.png" },
  { href: "https://www.tiktok.com/@wix", label: "Link", src: "/social-link-live.png" },
];

export function SiteFooter({ loggedIn }: { loggedIn?: boolean }) {
  const { t } = useTranslation();

  return (
    <footer className={`mt-auto bg-[#F7F7F7] text-black [font-family:'Helvetica_W01',Arial,sans-serif] ${loggedIn ? "border-t border-line" : ""}`}>
      <div className="b612-services-strip mx-auto grid gap-10 pb-[72px] pt-[50px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {/* Brand + Business Hours */}
        <div>
          <h3 className="text-[24px] font-bold leading-[1.2em] text-black">和 仓</h3>
          <h4 className="text-[24px] font-bold leading-[1.2em] text-black">B612 Tima Inc.</h4>
          <p className="mt-[23px] text-[16px] font-bold uppercase leading-[1.5em] text-black">
            {t.footer.businessHours}
          </p>
          <p className="text-[16px] font-normal leading-[1.5em] text-black">{t.footer.hours}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[20px] font-bold leading-[1.4em] text-black">{t.footer.quickLinks}</h4>
          <ul className="mt-[27px] text-[16px] font-normal leading-[1.8em] text-black">
            <li>
              <Link href="/home" className="text-black transition-colors hover:text-black">{t.nav.home}</Link>
            </li>
            <li>
              <Link href="/about" className="text-black transition-colors hover:text-black">{t.nav.aboutUs}</Link>
            </li>
            <li>
              <Link href="/services" className="text-black transition-colors hover:text-black">Service</Link>
            </li>
            <li>
              <Link href="/contact" className="text-black transition-colors hover:text-black">{t.nav.contact}</Link>
            </li>
          </ul>
        </div>

        {/* Office in China */}
        <div>
          <h4 className="text-[20px] font-bold leading-[1.4em] text-black">{t.footer.officeChina}</h4>
          <ul className="mt-[27px] text-[16px] font-normal leading-[1.35em] text-black">
            <li>
              <a href="mailto:FF@B612TimaInc.com" className="text-black transition-colors hover:text-black">
                FF@B612TimaInc.com
              </a>
            </li>
            <li>深宝茂大厦 · 813单元</li>
            <li>广东省深圳市龙华区</li>
            <li>民治街道民福北路67号</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[20px] font-bold leading-[1.4em] text-black">{t.footer.contact}</h4>
          <ul className="mt-[27px] text-[16px] font-normal leading-[1.35em] text-black">
            <li>909-703-1305</li>
            <li>
              <a href="mailto:FF@B612TimaInc.com" className="text-black transition-colors hover:text-black">
                FF@B612TimaInc.com
              </a>
            </li>
            <li>2090 s. baker ave ontario ca 91761</li>
            <li>深圳市深宝茂大厦813</li>
          </ul>
          {/* Social icons */}
          <div className="mt-[25px] flex items-center gap-[10px]">
            {footerSocialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                <img src={item.src} alt={item.label} width={24} height={24} className="h-6 w-6 object-cover" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="b612-services-strip mx-auto border-t border-black/70">
        <p className="py-[24px] text-center text-[16px] font-normal leading-[1.5em] text-black">
          &copy; 2026 {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}

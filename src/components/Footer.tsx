import { Instagram, MessageCircle, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import { BrandLockup } from "@/components/BrandLockup";
import { buildWhatsAppUrl } from "@/lib/contact";

const pageLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/cart", label: "Cart" },
  { to: "/feed", label: "Instagram" },
  { to: "/booking", label: "Booking" }
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: buildWhatsAppUrl("Hi Studio Nail, I would like to chat about an order."), label: "WhatsApp", icon: MessageCircle },
  { href: "tel:+910000000000", label: "Call Studio", icon: Phone }
];

export function Footer() {
  return (
    <footer className="page-shell pb-28 pt-2 md:pb-8">
      <div className="surface-panel overflow-hidden rounded-[2rem] px-5 py-6 sm:px-7 sm:py-8">
        <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr_0.85fr]">
          <div className="space-y-4">
            <BrandLockup size="md" />
            <p className="max-w-md text-sm leading-7 text-secondary">
              Premium press-on sets, custom sizing guidance, and handcrafted nail art delivered straight to your door.
            </p>
          </div>

          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand">Explore</p>
            <div className="mt-4 flex flex-col gap-3">
              {pageLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="rounded-full bg-white/70 px-4 py-3 text-sm font-semibold text-brand-ink transition hover:text-brand"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand">Connect</p>
            <div className="mt-4 flex flex-col gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center gap-3 rounded-full bg-white/70 px-4 py-3 text-sm font-semibold text-brand-ink transition hover:text-brand"
                  >
                    <Icon className="h-4 w-4 text-brand" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

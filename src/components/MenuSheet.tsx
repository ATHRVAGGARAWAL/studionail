import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { BrandLockup } from "@/components/BrandLockup";

interface MenuSheetProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { to: "/", title: "Home", copy: "Editorial landing and featured drops" },
  { to: "/shop", title: "Shop", copy: "Browse curated press-on collections" },
  { to: "/cart", title: "Cart", copy: "Review items and continue checkout" },
  { to: "/feed", title: "Feed", copy: "Preview the studio's latest visual stories" },
  { to: "/booking", title: "Booking", copy: "Tap through service, date, and confirmation" }
];

export function MenuSheet({ open, onClose }: MenuSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] md:hidden" aria-modal="true" role="dialog">
      <button
        type="button"
        aria-label="Close navigation menu"
        className="absolute inset-0 bg-brand-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="surface-panel absolute inset-x-3 top-4 rounded-[2rem] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand/75">Navigate</p>
            <BrandLockup size="md" />
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-[1.5rem] px-4 py-4 transition ${
                  isActive ? "bg-brand text-white" : "bg-white/70 text-brand-ink"
                }`
              }
            >
              <p className="text-sm font-bold uppercase tracking-[0.22em]">{link.title}</p>
              <p className="mt-1 text-sm leading-6 opacity-80">{link.copy}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

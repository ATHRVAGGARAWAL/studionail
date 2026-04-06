import { Menu, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { BrandLockup } from "@/components/BrandLockup";

interface HeaderProps {
  cartCount: number;
  onMenuClick: () => void;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/cart", label: "Cart" },
  { to: "/feed", label: "Feed" },
  { to: "/booking", label: "Book" }
];

export function Header({ cartCount, onMenuClick }: HeaderProps) {
  return (
    <header className="glass-bar fixed inset-x-0 top-0 z-50">
      <div className="page-shell flex h-[4.5rem] items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-brand shadow-[0_10px_24px_rgba(182,13,61,0.08)] transition active:scale-95 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <NavLink to="/" className="min-w-0">
            <BrandLockup size="sm" />
          </NavLink>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[0.24em] transition ${
                  isActive ? "bg-brand text-white" : "text-secondary hover:bg-white/70 hover:text-brand"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/booking"
            className="hidden min-h-11 items-center rounded-full border border-brand/15 bg-white/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-brand transition hover:-translate-y-0.5 md:inline-flex"
          >
            Book visit
          </NavLink>
          <NavLink
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-brand shadow-[0_10px_24px_rgba(182,13,61,0.08)] transition active:scale-95"
            aria-label="Open shopping bag"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[0.62rem] font-bold text-white">
              {cartCount}
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

import { CalendarDays, House, Sparkles, Store } from "lucide-react";
import { NavLink } from "react-router-dom";

const mobileLinks = [
  { to: "/", label: "Home", icon: House },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/feed", label: "Feed", icon: Sparkles },
  { to: "/booking", label: "Book", icon: CalendarDays }
];

export function MobileNav() {
  return (
    <nav className="surface-panel fixed inset-x-3 bottom-3 z-50 rounded-[2rem] px-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2 md:hidden">
      <ul className="grid grid-cols-4 gap-1">
        {mobileLinks.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex min-h-[3.5rem] flex-col items-center justify-center rounded-[1.25rem] px-2 py-2 text-[0.6rem] font-bold uppercase tracking-[0.24em] transition ${
                  isActive ? "bg-brand text-white shadow-[0_16px_28px_rgba(182,13,61,0.22)]" : "text-secondary"
                }`
              }
            >
              <Icon className="mb-1 h-4 w-4" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

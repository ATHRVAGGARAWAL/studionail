import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MenuSheet } from "@/components/MenuSheet";
import { MobileNav } from "@/components/MobileNav";

interface AppShellProps {
  cartCount: number;
  notice: string | null;
  whatsappHref: string;
  onDismissNotice: () => void;
  children: ReactNode;
}

export function AppShell({ cartCount, notice, whatsappHref, onDismissNotice, children }: AppShellProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <Header cartCount={cartCount} onMenuClick={() => setMenuOpen(true)} />
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className={`mobile-safe pt-[4.5rem] ${isAdminRoute ? "pb-0" : ""}`}>
        {children}
        {!isAdminRoute ? <Footer /> : null}
      </div>
      {!isAdminRoute ? <MobileNav /> : null}
      {!isAdminRoute ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-[65] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_32px_rgba(37,211,102,0.28)] transition hover:-translate-y-0.5 md:bottom-6"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/18 text-[0.82rem]">
            WA
          </span>
          WhatsApp
        </a>
      ) : null}
      {notice ? (
        <div className="pointer-events-none fixed inset-x-4 bottom-[calc(8.75rem+env(safe-area-inset-bottom))] z-[70] flex justify-center md:bottom-6">
          <button
            type="button"
            onClick={onDismissNotice}
            className="pointer-events-auto rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_18px_32px_rgba(182,13,61,0.28)]"
          >
            {notice}
          </button>
        </div>
      ) : null}
    </>
  );
}

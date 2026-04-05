import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { BookingPage } from "@/pages/BookingPage";
import { AdminPage } from "@/pages/AdminPage";
import { CartPage } from "@/pages/CartPage";
import { FeedPage } from "@/pages/FeedPage";
import { HomePage } from "@/pages/HomePage";
import { ShopPage } from "@/pages/ShopPage";
import { buildWhatsAppUrl } from "@/lib/contact";
import { type Product } from "@/data/storefront";
import { StoreProvider, useStore } from "@/state/store";

function AppContent() {
  const { orders, placeOrder } = useStore();
  const [notice, setNotice] = useState<string | null>(null);
  const cartCount = orders.filter((order) => order.status !== "Completed").length;

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  function handleAddToBag(product: Product, size: string) {
    const order = placeOrder({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      size,
      unitPrice: product.price,
      channel: "Site"
    });

    if (!order) {
      setNotice(`${product.name} is sold out`);
      return;
    }

    setNotice(`${product.name} added to bag`);
  }

  const whatsappHref = buildWhatsAppUrl(
    "Hi Studio Nail, I would like help choosing a press-on set from the shop."
  );

  return (
    <AppShell
      cartCount={cartCount}
      notice={notice}
      whatsappHref={whatsappHref}
      onDismissNotice={() => setNotice(null)}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage onAddToBag={handleAddToBag} whatsappHref={whatsappHref} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </StoreProvider>
  );
}

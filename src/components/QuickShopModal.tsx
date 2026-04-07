import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, Truck, X } from "lucide-react";
import { type Product } from "@/data/storefront";
import { buildWhatsAppUrl } from "@/lib/contact";

interface QuickShopModalProps {
  product: Product | null;
  onAddToBag: (product: Product, size: string) => void;
  onClose: () => void;
  preselectedSize?: string;
}

const sizes = ["XS", "S", "M", "L"] as const;

export function QuickShopModal({ product, onAddToBag, onClose, preselectedSize }: QuickShopModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("S");

  useEffect(() => {
    if (!product) {
      return undefined;
    }

    setSelectedSize(preselectedSize ?? "S");

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, product, preselectedSize]);

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80]" aria-modal="true" role="dialog">
      <button
        type="button"
        aria-label="Close quick shop"
        onClick={onClose}
        className="absolute inset-0 bg-brand-ink/25 backdrop-blur-sm"
      />

      <div className="surface-panel absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-t-[2rem] bg-brand-mist md:inset-y-0 md:right-0 md:left-auto md:w-[29rem] md:rounded-none md:rounded-l-[2rem]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between bg-surface-low px-5 py-4">
            <div>
              <p className="editorial-text text-[1.7rem] font-black italic text-brand-ink">Quick Select</p>
              <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">
                Editorial product sheet
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick shop"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="hide-scrollbar flex-1 overflow-y-auto">
            <div className="relative">
              <div className="aspect-[4/5] bg-surface-high">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="absolute right-0 top-10 rounded-l-full bg-brand px-7 py-3 text-white shadow-[0_16px_32px_rgba(182,13,61,0.26)]">
                <p className="editorial-text text-[1.8rem] font-black italic">${product.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-8 px-6 py-6">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand/75">
                  {product.reviewCount} reviews
                </p>
                <h2 className="editorial-text mt-3 text-[2.7rem] font-black uppercase leading-[0.88] text-brand-ink">
                  {product.name}
                </h2>
                <p className="mt-2 text-base italic text-secondary">Available in: {product.finish}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Set size</p>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand">
                    {product.shape}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex min-h-[2.75rem] items-center justify-center rounded-[0.8rem] border px-2 text-[0.78rem] font-bold transition ${
                        selectedSize === size
                          ? "cta-gradient border-transparent text-white"
                          : "border-outline-soft bg-white/72 text-brand-ink"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {preselectedSize && !sizes.includes(preselectedSize as any) && (
                    <button
                      type="button"
                      onClick={() => setSelectedSize(preselectedSize)}
                      className={`flex min-h-[2.75rem] items-center justify-center rounded-[0.8rem] border px-2 text-[0.78rem] font-bold transition ${
                        selectedSize === preselectedSize
                          ? "cta-gradient border-transparent text-white"
                          : "border-outline-soft bg-white/72 text-brand-ink"
                      }`}
                    >
                      Custom
                    </button>
                  )}
                </div>
              </div>

              <div className="surface-panel-soft flex items-center gap-3 rounded-[1.25rem] px-4 py-4 text-secondary">
                <Truck className="h-5 w-5 text-brand" />
                <p className="text-sm leading-6 text-brand-ink">
                  Ready to ship. Free 2-day priority delivery included.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  onAddToBag(product, selectedSize);
                  onClose();
                }}
                disabled={product.stock <= 0}
                className="cta-gradient flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-6 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {product.stock <= 0 ? "Sold out" : "Add to bag"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={buildWhatsAppUrl(
                  `Hi Studio Nail, I would like to ask about ${product.name} in size ${selectedSize}.`
                )}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-3 rounded-full border border-outline-soft bg-white/72 px-6 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-ink transition hover:border-brand hover:text-brand"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Heart } from "lucide-react";
import { type Product } from "@/data/storefront";

interface ProductCardProps {
  product: Product;
  onQuickShop: (product: Product) => void;
}

export function ProductCard({ product, onQuickShop }: ProductCardProps) {
  const soldOut = product.stock <= 0;

  return (
    <article className="group flex flex-col">
      <div className="surface-panel relative overflow-hidden rounded-[1.15rem] p-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[0.85rem] bg-surface-high">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          {product.badge ? (
            <span className="absolute left-2 top-2 rounded-full bg-brand px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white">
              {product.badge}
            </span>
          ) : null}
          <span
            className={`absolute right-2 bottom-2 rounded-full px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.22em] ${
              soldOut ? "bg-ink text-white" : "bg-white/82 text-brand-ink"
            }`}
          >
            {soldOut ? "Sold out" : `${product.stock} in stock`}
          </span>
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-brand shadow-[0_10px_24px_rgba(75,33,49,0.08)] transition active:scale-95"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-1 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="editorial-text text-[1.05rem] font-bold leading-tight text-brand-ink">
              {product.name}
            </h3>
            <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-secondary">
              {product.shape} · {product.finish}
            </p>
          </div>
          <span className="text-sm font-bold text-brand">${product.price}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-[0.82rem] leading-6 text-secondary">
          {product.description}
        </p>
        <button
          type="button"
          onClick={() => onQuickShop(product)}
          disabled={soldOut}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-outline-soft/70 bg-white/70 px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-ink transition hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-outline-soft/50 disabled:bg-white/40 disabled:text-secondary"
        >
          {soldOut ? "Sold out" : "Quick shop"}
        </button>
      </div>
    </article>
  );
}

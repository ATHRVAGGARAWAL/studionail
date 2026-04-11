import { Heart } from "lucide-react";
import { type Product } from "@/data/storefront";

interface ProductCardProps {
  product: Product;
  onQuickShop: (product: Product) => void;
}

export function ProductCard({ product, onQuickShop }: ProductCardProps) {
  const soldOut = product.stock <= 0;

  return (
    <article
      className="group flex cursor-pointer flex-col"
      onClick={() => onQuickShop(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onQuickShop(product);
        }
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[0.4rem] bg-surface-high">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        {product.badge ? (
          <span className="absolute left-1.5 top-1.5 bg-brand px-1.5 py-0.5 text-[0.45rem] font-bold uppercase tracking-[0.16em] text-white sm:left-2 sm:top-2 sm:px-2 sm:text-[0.52rem]">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={`Save ${product.name}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/65 text-brand opacity-100 backdrop-blur transition active:scale-95 sm:bottom-2 sm:right-2 sm:h-8 sm:w-8 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="pt-2 sm:pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="editorial-text line-clamp-2 text-[0.82rem] font-bold leading-[1.02] text-brand-ink sm:text-[0.98rem]">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-1 text-[0.58rem] font-medium leading-tight text-secondary/80 sm:text-[0.64rem]">
              {product.finish}
            </p>
          </div>
          <span className="shrink-0 text-[0.8rem] font-bold text-brand sm:text-[0.88rem]">${product.price}</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.18em] text-secondary sm:text-[0.56rem]">
            {product.shape}
          </p>
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.18em] text-secondary sm:text-[0.56rem]">
            {soldOut ? "Sold out" : `${product.stock} left`}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickShop(product);
          }}
          disabled={soldOut}
          className="mt-2 flex min-h-8 w-full items-center justify-center border border-outline-soft/25 px-2.5 py-2 text-[0.5rem] font-bold uppercase tracking-[0.18em] text-brand-ink transition hover:border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-outline-soft/30 disabled:bg-white/50 disabled:text-secondary sm:text-[0.56rem]"
        >
          {soldOut ? "Sold out" : "Shop now"}
        </button>
      </div>
    </article>
  );
}

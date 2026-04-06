import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { QuickShopModal } from "@/components/QuickShopModal";
import { type Product, type ProductCategory } from "@/data/storefront";
import { useStore } from "@/state/store";

interface ShopPageProps {
  onAddToBag: (product: Product, size: string) => void;
  whatsappHref: string;
}

interface ShopFilter {
  id: string;
  label: string;
  matches: (product: Product) => boolean;
}

const categories: ProductCategory[] = ["All", "Minimalist", "Avant-Garde", "Neon", "Signature"];

const shopFilters: ShopFilter[] = [
  { id: "all", label: "All", matches: () => true },
  ...categories.slice(1).map((category) => ({
    id: `category-${category}`,
    label: category,
    matches: (product: Product) => product.category === category
  })),
  {
    id: "in-stock",
    label: "In stock",
    matches: (product: Product) => product.stock > 0
  },
  {
    id: "low-stock",
    label: "Low stock",
    matches: (product: Product) => product.stock > 0 && product.stock <= 3
  },
  {
    id: "new",
    label: "New",
    matches: (product: Product) => product.badge?.toLowerCase() === "new"
  },
  {
    id: "best-sellers",
    label: "Best sellers",
    matches: (product: Product) =>
      product.badge?.toLowerCase().includes("best") === true || product.reviewCount >= 50
  }
];

export function ShopPage({ onAddToBag, whatsappHref }: ShopPageProps) {
  const { products } = useStore();
  const [activeFilterId, setActiveFilterId] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const activeFilter = shopFilters.find((filter) => filter.id === activeFilterId) ?? shopFilters[0];

  const filteredProducts = products.filter((product) => {
    const matchesFilter = activeFilter.matches(product);
    const matchesQuery =
      normalizedQuery.length === 0
        ? true
        : [product.name, product.description, product.shape, product.finish, product.category]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <main className="page-shell pb-8 pt-3 sm:pt-6">
        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.34em] text-brand sm:text-[0.66rem]">
              Summer 2026 collection
            </p>
            <h1 className="editorial-text mt-2 max-w-[12rem] text-[1.75rem] font-black leading-[0.88] text-brand-ink sm:max-w-2xl sm:text-[3rem] md:text-[3.8rem]">
              The Electric <span className="italic text-secondary">Artisan Series</span>
            </h1>
            <p className="mt-2 text-[0.72rem] leading-5 text-secondary sm:hidden">
              {filteredProducts.length} of {products.length} curated styles
            </p>
          </div>

          <div className="md:col-span-5 lg:col-span-4 md:max-w-md md:justify-self-end">
            <div className="space-y-2.5">
              <label className="relative block">
                <span className="sr-only">Search products</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search curated styles..."
                  className="w-full rounded-[1.25rem] border border-transparent bg-white/70 px-4 py-3 pr-11 text-[0.82rem] text-brand-ink shadow-[0_10px_24px_rgba(75,33,49,0.05)] outline-none transition focus:border-brand/10 focus:ring-2 focus:ring-brand/15 sm:text-sm"
                />
                <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              </label>

              <div
                className="hide-scrollbar flex gap-2 overflow-x-auto pb-1"
                role="toolbar"
                aria-label="Shop filters"
              >
                {shopFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilterId(filter.id)}
                    aria-pressed={activeFilterId === filter.id}
                    aria-label={`Filter products by ${filter.label}`}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.56rem] font-bold uppercase tracking-[0.22em] transition sm:px-4 sm:text-[0.62rem] ${
                      activeFilterId === filter.id
                        ? "bg-brand text-white shadow-[0_10px_20px_rgba(186,19,64,0.18)]"
                        : "bg-[rgba(229,226,224,0.8)] text-secondary hover:bg-[rgba(251,214,229,0.95)] hover:text-brand-ink"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="hidden items-center justify-between text-[0.7rem] text-secondary sm:flex">
                <span>{filteredProducts.length} styles showing</span>
                <div className="flex items-center gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/72 px-3 py-2 font-semibold text-brand-ink transition hover:text-brand"
                  >
                    WhatsApp
                  </a>
                  <Link
                    to="/booking"
                    className="rounded-full bg-white/72 px-3 py-2 font-semibold text-brand-ink transition hover:text-brand"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickShop={setSelectedProduct} />
          ))}
        </section>

        {filteredProducts.length === 0 ? (
          <section className="surface-panel mt-8 rounded-[1.5rem] px-5 py-10 text-center">
            <p className="editorial-text text-[1.8rem] font-black text-brand-ink">No matching sets.</p>
            <p className="mt-2 text-sm leading-7 text-secondary">
              Try another filter or clear the search to see the full collection.
            </p>
          </section>
        ) : null}
      </main>

      <QuickShopModal product={selectedProduct} onAddToBag={onAddToBag} onClose={() => setSelectedProduct(null)} />
    </>
  );
}

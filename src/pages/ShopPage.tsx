import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { QuickShopModal } from "@/components/QuickShopModal";
import { SectionIntro } from "@/components/SectionIntro";
import { type Product, type ProductCategory } from "@/data/storefront";
import { useStore } from "@/state/store";

interface ShopPageProps {
  onAddToBag: (product: Product, size: string) => void;
  whatsappHref: string;
}

const categories: ProductCategory[] = ["All", "Minimalist", "Avant-Garde", "Neon", "Signature"];

export function ShopPage({ onAddToBag, whatsappHref }: ShopPageProps) {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("All");
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = activeCategory === "All" ? true : product.category === activeCategory;
        const matchesQuery =
          normalizedQuery.length === 0
            ? true
            : [product.name, product.description, product.shape, product.finish, product.category]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      }),
    [activeCategory, normalizedQuery, products]
  );

  const inStockCount = products.filter((product) => product.stock > 0).length;
  const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 3).length;

  return (
    <>
      <main className="page-shell space-y-6 pb-8 pt-6">
        <section className="surface-panel overflow-hidden rounded-[2rem] px-5 py-6 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-4">
              <SectionIntro
                eyebrow="Summer 2026 collection"
                title="Shop the set grid with a thumb-first layout."
                description="The product list now opens with a compact intro, search, and category strip so the cards can breathe on smaller screens instead of collapsing into a tight desktop pattern."
              />
              <div className="flex flex-wrap gap-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-ink">
                <span className="rounded-full bg-white/72 px-3 py-2">Live stock {inStockCount}</span>
                <span className="rounded-full bg-white/72 px-3 py-2">Low stock {lowStockCount}</span>
                <span className="rounded-full bg-white/72 px-3 py-2">WhatsApp ready</span>
              </div>
            </div>

            <div className="space-y-3 lg:ml-auto lg:max-w-md">
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-gradient flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
                >
                  WhatsApp contact
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/booking"
                  className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-outline-soft bg-white/72 px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-brand-ink"
                >
                  Book custom
                </Link>
              </div>

              <label className="surface-panel flex min-h-12 items-center gap-3 rounded-full px-4">
                <Search className="h-4 w-4 text-secondary" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search styles, finishes, or shapes"
                  className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-secondary"
                />
              </label>

              <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-11 whitespace-nowrap rounded-full px-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] transition ${
                      activeCategory === category ? "bg-brand text-white" : "bg-white/72 text-secondary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickShop={setSelectedProduct} />
          ))}
        </section>

        {filteredProducts.length === 0 ? (
          <section className="surface-panel rounded-[1.75rem] px-5 py-10 text-center">
            <p className="editorial-text text-[2rem] font-black text-brand-ink">No matching sets.</p>
            <p className="mt-2 text-sm leading-7 text-secondary">
              Try a broader search term or switch back to the full collection filter.
            </p>
          </section>
        ) : null}
      </main>

      <QuickShopModal
        product={selectedProduct}
        onAddToBag={onAddToBag}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

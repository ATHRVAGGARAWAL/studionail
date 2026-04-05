import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, CheckCircle2, Package, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { SectionIntro } from "@/components/SectionIntro";
import { type ProductCategory } from "@/data/storefront";
import { useStore, type OrderStatus } from "@/state/store";

const categoryOptions: Exclude<ProductCategory, "All">[] = [
  "Minimalist",
  "Avant-Garde",
  "Neon",
  "Signature"
];

const statusFlow: OrderStatus[] = ["New", "Processing", "Completed"];

const initialDraft = {
  name: "",
  price: "",
  stock: "6",
  badge: "",
  category: "Minimalist" as Exclude<ProductCategory, "All">,
  shape: "",
  finish: "",
  description: "",
  image: ""
};

export function AdminPage() {
  const { products, orders, addProduct, deleteProduct, updateProductStock, adjustProductStock, updateOrderStatus } =
    useStore();
  const [draft, setDraft] = useState(initialDraft);

  const sortedOrders = useMemo(
    () => [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [orders]
  );

  const stats = useMemo(() => {
    const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 3).length;
    const completed = orders.filter((order) => order.status === "Completed").length;

    return {
      products: products.length,
      lowStock,
      orders: orders.length,
      completed
    };
  }, [orders, products]);

  function resetDraft() {
    setDraft(initialDraft);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.name.trim() || !draft.image.trim() || !draft.description.trim() || !draft.shape.trim()) {
      return;
    }

    addProduct({
      name: draft.name.trim(),
      price: Number(draft.price) || 0,
      stock: Number(draft.stock) || 0,
      badge: draft.badge.trim() || undefined,
      category: draft.category,
      shape: draft.shape.trim(),
      finish: draft.finish.trim(),
      description: draft.description.trim(),
      image: draft.image.trim(),
      reviewCount: 0
    });

    resetDraft();
  }

  return (
    <main className="page-shell space-y-6 pb-8 pt-6">
      <section className="surface-panel overflow-hidden rounded-[2rem] px-5 py-6 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <SectionIntro
            eyebrow="Admin dashboard"
            title="Manage orders, stock, and your product catalog."
            description="This dashboard gives you a local working console for the shop data. Orders can be advanced through processing states, while product stock and catalog entries are editable from the same screen."
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Products</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">{stats.products}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Orders</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">{stats.orders}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Low stock</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">{stats.lowStock}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Completed</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">{stats.completed}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Add product</p>
              <h2 className="editorial-text text-[1.65rem] font-black text-brand-ink">Create a new set</h2>
            </div>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Name</span>
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                  placeholder="e.g. Peach Halo"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Price</span>
                <input
                  value={draft.price}
                  onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                  placeholder="42"
                  inputMode="decimal"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Stock</span>
                <input
                  value={draft.stock}
                  onChange={(event) => setDraft((current) => ({ ...current, stock: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                  placeholder="6"
                  inputMode="numeric"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Badge</span>
                <input
                  value={draft.badge}
                  onChange={(event) => setDraft((current) => ({ ...current, badge: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                  placeholder="Best Seller"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Category</span>
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, category: event.target.value as Exclude<ProductCategory, "All"> }))
                  }
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Shape</span>
                <input
                  value={draft.shape}
                  onChange={(event) => setDraft((current) => ({ ...current, shape: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                  placeholder="Almond"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Finish</span>
                <input
                  value={draft.finish}
                  onChange={(event) => setDraft((current) => ({ ...current, finish: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                  placeholder="Gloss"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Image URL</span>
                <input
                  value={draft.image}
                  onChange={(event) => setDraft((current) => ({ ...current, image: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                  placeholder="https://..."
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">
                Description
              </span>
              <textarea
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                placeholder="Short product copy"
              />
            </label>

            <button
              type="submit"
              className="cta-gradient flex min-h-12 items-center justify-center gap-3 rounded-full px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
            >
              <Plus className="h-4 w-4" />
              Add product
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <section className="surface-panel rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Orders</p>
                <h2 className="editorial-text text-[1.65rem] font-black text-brand-ink">Process requests</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {sortedOrders.length === 0 ? (
                <div className="rounded-[1.5rem] bg-white/72 px-5 py-8 text-center text-sm leading-7 text-secondary">
                  No orders yet. Add a bag item from the shop to see the flow here.
                </div>
              ) : null}

              {sortedOrders.map((order) => {
                const currentIndex = statusFlow.indexOf(order.status);
                const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];

                return (
                  <article key={order.id} className="rounded-[1.5rem] bg-white/72 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-brand/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-brand">
                            {order.channel}
                          </span>
                          <span className="rounded-full bg-surface-low px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">
                            {order.status}
                          </span>
                        </div>
                        <h3 className="editorial-text mt-3 truncate text-[1.2rem] font-bold text-brand-ink">
                          {order.productName}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-secondary">
                          Qty {order.quantity} · Size {order.size}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-secondary">Order</p>
                        <p className="mt-2 text-sm font-bold text-brand-ink">{order.id.slice(-6)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <CalendarDays className="h-4 w-4 text-brand" />
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        {order.status !== "Completed" ? (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            {nextStatus}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-emerald-700">
                            <Truck className="h-4 w-4" />
                            Done
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="surface-panel rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Products</p>
                <h2 className="editorial-text text-[1.65rem] font-black text-brand-ink">Stock controls</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {products.map((product) => (
                <article key={product.id} className="rounded-[1.5rem] bg-white/72 p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-20 rounded-[1rem] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="editorial-text truncate text-[1.15rem] font-bold text-brand-ink">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-secondary">
                            {product.category} · {product.shape}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand transition hover:bg-brand hover:text-white"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => adjustProductStock(product.id, -1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-soft bg-white/85 text-lg font-bold text-brand-ink"
                          aria-label={`Decrease stock for ${product.name}`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(event) => updateProductStock(product.id, Number(event.target.value))}
                          className="h-10 w-20 rounded-full border border-outline-soft bg-white/85 px-3 text-center text-sm font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => adjustProductStock(product.id, 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-soft bg-white/85 text-lg font-bold text-brand-ink"
                          aria-label={`Increase stock for ${product.name}`}
                        >
                          +
                        </button>
                        <span className="ml-auto rounded-full bg-surface-low px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">
                          ${product.price} · {product.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, CalendarCheck, CheckCircle2, Edit, LogOut, Package, Plus, ShoppingBag, Trash2, Truck, XCircle } from "lucide-react";
import { SectionIntro } from "@/components/SectionIntro";
import { type ProductCategory } from "@/data/storefront";
import { useAdminAccess } from "@/state/adminAccess";
import { useStore, type Order, type Booking, type OrderStatus, type BookingStatus } from "@/state/store";
import { supabase } from "@/lib/supabase";

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
  image: "",
  images: [] as string[]
};

export function AdminPage() {
  const { logout } = useAdminAccess();
  const { products, orders, bookings, addProduct, updateProduct, deleteProduct, updateProductStock, adjustProductStock, updateOrderStatus, updateBookingStatus, syncToRemote, isSyncing } =
    useStore();
  const [draft, setDraft] = useState(initialDraft);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<"Active" | "Completed" | "All">("Active");
  const [bookingFilter, setBookingFilter] = useState<"Active" | "Completed" | "All">("Active");

  const sortedOrders = useMemo(
    () => [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (orderFilter === "Active") return sortedOrders.filter((o: Order) => o.status !== "Completed");
    if (orderFilter === "Completed") return sortedOrders.filter((o: Order) => o.status === "Completed");
    return sortedOrders;
  }, [sortedOrders, orderFilter]);

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "Active") return bookings.filter((b: Booking) => b.status === "Confirmed");
    if (bookingFilter === "Completed") return bookings.filter((b: Booking) => b.status === "Completed");
    return bookings;
  }, [bookings, bookingFilter]);

  const stats = useMemo(() => {
    const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 3).length;
    const completed = orders.filter((order) => order.status === "Completed").length;

    return {
      products: products.length,
      lowStock,
      orders: orders.length,
      completed,
      bookings: bookings.length,
      confirmedBookings: bookings.filter((b) => b.status === "Confirmed").length
    };
  }, [orders, products, bookings]);

  function resetDraft() {
    setDraft(initialDraft);
    setEditingProductId(null);
  }

  function startEdit(product: any) {
    setEditingProductId(product.id);
    setDraft({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      badge: product.badge || "",
      category: product.category,
      shape: product.shape,
      finish: product.finish,
      description: product.description,
      image: product.image,
      images: product.images || []
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.name.trim() || (!draft.image.trim() && draft.images.length === 0) || !draft.description.trim() || !draft.shape.trim()) {
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: draft.name.trim(),
        price: Number(draft.price) || 0,
        stock: Number(draft.stock) || 0,
        badge: draft.badge.trim() || undefined,
        category: draft.category,
        shape: draft.shape.trim(),
        finish: draft.finish.trim(),
        description: draft.description.trim(),
        image: draft.images.length > 0 ? draft.images[0] : draft.image.trim(),
        images: draft.images
      });
    } else {
      addProduct({
        name: draft.name.trim(),
        price: Number(draft.price) || 0,
        stock: Number(draft.stock) || 0,
        badge: draft.badge.trim() || undefined,
        category: draft.category,
        shape: draft.shape.trim(),
        finish: draft.finish.trim(),
        description: draft.description.trim(),
        image: draft.images.length > 0 ? draft.images[0] : draft.image.trim(),
        images: draft.images,
        reviewCount: 0
      });
    }

    resetDraft();
  }

  return (
    <main className="page-shell space-y-6 pb-8 pt-6">
      <section className="surface-panel overflow-hidden rounded-[2rem] px-5 py-6 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-4">
            <SectionIntro
              eyebrow="Admin dashboard"
              title="Manage orders, stock, and your product catalog."
              description="This dashboard gives you a local working console for the shop data. Orders can be advanced through processing states, while product stock and catalog entries are editable from the same screen."
            />
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-outline-soft bg-white/72 px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand-ink transition hover:text-brand"
            >
              <LogOut className="h-4 w-4 text-brand" />
              Sign out
            </button>
            <button
              type="button"
              onClick={() => syncToRemote()}
              disabled={isSyncing}
              className="ml-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-brand bg-brand px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-brand/90 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSyncing ? "Saving..." : "Save Changes"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
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
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Bookings</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">{stats.bookings}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Upcoming</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">{stats.confirmedBookings}</p>
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
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">
                {editingProductId ? "Edit product" : "Add product"}
              </p>
              <h2 className="editorial-text text-[1.65rem] font-black text-brand-ink">
                {editingProductId ? "Modify existing set" : "Create a new set"}
              </h2>
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
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Images (up to 3)</span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={async (event) => {
                    const files = Array.from(event.target.files || []).slice(0, 3);
                    const uploadedUrls: string[] = [];
                    for (const file of files) {
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Math.random()}.${fileExt}`;
                      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
                      if (data) {
                        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
                        uploadedUrls.push(publicUrl);
                      } else {
                        console.error("Upload error", error);
                      }
                    }
                    if (uploadedUrls.length > 0) {
                      setDraft((current) => ({ ...current, images: [...current.images, ...uploadedUrls] }));
                    }
                  }}
                  className="w-full rounded-[1.1rem] border border-outline-soft bg-white/85 px-4 py-3 text-sm outline-none"
                />
                {draft.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {draft.images.map(img => <img key={img} src={img} className="w-10 h-10 object-cover rounded-md" />)}
                  </div>
                )}
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

            <div className="flex gap-3">
              <button
                type="submit"
                className="cta-gradient flex h-12 flex-1 items-center justify-center gap-3 rounded-full px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
              >
                {editingProductId ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingProductId ? "Update Product" : "Add product"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="flex h-12 items-center justify-center rounded-full border border-outline-soft bg-white px-6 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <section className="surface-panel rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Orders</p>
                <h2 className="editorial-text text-[1.65rem] font-black text-brand-ink whitespace-nowrap overflow-hidden text-ellipsis">Process requests</h2>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {(["Active", "Completed", "All"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`rounded-full px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] transition ${
                    orderFilter === f ? "bg-brand text-white" : "bg-surface-low text-secondary hover:bg-surface-high"
                  }`}
                >
                  {f === "Completed" ? "Shipped" : f}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="rounded-[1.5rem] bg-white/72 px-5 py-8 text-center text-sm leading-7 text-secondary">
                  {orderFilter === "Active" ? "No active orders." : orderFilter === "Completed" ? "No completed orders yet." : "No orders found."}
                </div>
              ) : null}

              {filteredOrders.map((order: Order) => {
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
                    <img src={product.image} alt={product.name} className="h-24 w-20 rounded-[1rem] object-cover" />
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
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-secondary transition hover:bg-brand hover:text-white"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand transition hover:bg-brand hover:text-white"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
                          ₹{product.price} · {product.stock} in stock
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

      {/* Bookings Management */}
      <section className="surface-panel rounded-[2rem] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Bookings</p>
            <h2 className="editorial-text text-[1.65rem] font-black text-brand-ink">Appointment calendar</h2>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["Active", "Completed", "All"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setBookingFilter(f)}
              className={`rounded-full px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] transition ${
                bookingFilter === f ? "bg-brand text-white" : "bg-surface-low text-secondary hover:bg-surface-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-[1.5rem] bg-white/72 px-5 py-8 text-center text-sm leading-7 text-secondary">
              {bookingFilter === "Active" ? "No upcoming bookings." : bookingFilter === "Completed" ? "No completed bookings yet." : "No bookings found."}
            </div>
          ) : null}

          {filteredBookings.map((booking) => {
            const date = new Date(booking.booking_date);
            const statusColor = booking.status === "Confirmed"
              ? "bg-blue-500/10 text-blue-700"
              : booking.status === "Completed"
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-red-500/10 text-red-700";

            return (
              <article key={booking.id} className="rounded-[1.5rem] bg-white/72 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] ${statusColor}`}>
                        {booking.status}
                      </span>
                      <span className="rounded-full bg-surface-low px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">
                        ₹{booking.total}
                      </span>
                    </div>
                    <h3 className="editorial-text mt-3 text-[1.2rem] font-bold text-brand-ink">
                      {booking.service_id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </h3>
                    {booking.enhancements && booking.enhancements.length > 0 && (
                      <p className="mt-1 text-sm leading-6 text-secondary">
                        + {booking.enhancements.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-secondary">Date</p>
                    <p className="mt-1 text-sm font-bold text-brand-ink">{date.toLocaleDateString()}</p>
                    <p className="mt-1 text-xs text-secondary">{booking.slot}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <CalendarDays className="h-4 w-4 text-brand" />
                    Booked {new Date(booking.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    {booking.status === "Confirmed" && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(booking.id, "Completed")}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Complete
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                          className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === "Completed" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-emerald-700">
                        <Truck className="h-4 w-4" />
                        Done
                      </span>
                    )}
                    {booking.status === "Cancelled" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-red-700">
                        <XCircle className="h-4 w-4" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

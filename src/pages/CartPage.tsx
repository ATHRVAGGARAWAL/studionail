import { ArrowRight, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionIntro } from "@/components/SectionIntro";
import { buildWhatsAppUrl } from "@/lib/contact";
import { useStore } from "@/state/store";

export function CartPage() {
  const { orders, products, removeOrder } = useStore();
  const activeOrders = orders.filter((order) => order.status !== "Completed");
  const cartTotal = activeOrders.reduce((sum, order) => {
    const unitPrice = order.unitPrice || products.find((product) => product.id === order.productId)?.price || 0;

    return sum + unitPrice * order.quantity;
  }, 0);

  const whatsappMessage =
    activeOrders.length > 0
      ? `Hi Studio Nail, I would like help with my cart: ${activeOrders
          .map((order) => `${order.productName} x${order.quantity} (size ${order.size})`)
          .join(", ")}.`
      : "Hi Studio Nail, I would like help choosing a press-on set.";

  const whatsappHref = buildWhatsAppUrl(whatsappMessage);

  return (
    <main className="page-shell space-y-6 pb-8 pt-6">
      <section className="surface-panel overflow-hidden rounded-[2rem] px-5 py-6 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <SectionIntro
            eyebrow="Your cart"
            title="Review the items you have added and continue on WhatsApp."
            description="This page now has a real route, so the shopping bag icon no longer sends you back to the shop. It shows active items, totals, and a quick way to remove anything you do not want."
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Items</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">{activeOrders.length}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Total</p>
              <p className="mt-2 text-3xl font-black text-brand-ink">${cartTotal}</p>
            </div>
          </div>
        </div>
      </section>

      {activeOrders.length === 0 ? (
        <section className="surface-panel rounded-[2rem] px-6 py-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/72 text-brand">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="editorial-text mt-5 text-[2rem] font-black text-brand-ink">Your cart is empty.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-secondary">
            Browse the collection and add a set to bring it here.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="cta-gradient inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
            >
              Shop collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-outline-soft bg-white/72 px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-brand-ink"
            >
              WhatsApp help
            </a>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {activeOrders.map((order) => {
              const product = products.find((item) => item.id === order.productId);
              const unitPrice = order.unitPrice || product?.price || 0;
              const lineTotal = unitPrice * order.quantity;

              return (
                <article key={order.id} className="surface-panel rounded-[1.75rem] p-4 sm:p-5">
                  <div className="flex gap-4">
                    <img
                      src={product?.image}
                      alt={order.productName}
                      className="h-24 w-20 rounded-[1rem] object-cover sm:h-28 sm:w-24"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="editorial-text truncate text-[1.15rem] font-bold text-brand-ink">
                            {order.productName}
                          </h3>
                          <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-secondary">
                            Size {order.size} · {order.status}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOrder(order.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand transition hover:bg-brand hover:text-white"
                          aria-label={`Remove ${order.productName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-full bg-white/80 px-3 py-2 font-bold text-brand-ink">
                          Qty {order.quantity}
                        </span>
                        <span className="rounded-full bg-white/80 px-3 py-2 font-bold text-brand-ink">
                          ${unitPrice} each
                        </span>
                        <span className="rounded-full bg-brand/10 px-3 py-2 font-bold text-brand">${lineTotal}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="surface-panel h-fit rounded-[2rem] p-5 sm:p-6">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Checkout</p>
            <h2 className="editorial-text mt-2 text-[1.75rem] font-black text-brand-ink">Ready to order?</h2>
            <p className="mt-3 text-sm leading-7 text-secondary">
              Send the cart to WhatsApp to confirm sizing, stock, and delivery details.
            </p>

            <div className="mt-6 space-y-3 rounded-[1.5rem] bg-white/72 p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-brand-ink">
                <span>Items</span>
                <span>{activeOrders.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-brand-ink">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-brand-ink">
                <span>Delivery</span>
                <span>Discuss on WhatsApp</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="cta-gradient flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
              >
                Continue on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/shop"
                className="flex min-h-12 items-center justify-center rounded-full border border-outline-soft bg-white/72 px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-brand-ink"
              >
                Add more items
              </Link>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-brand/8 p-4 text-sm leading-7 text-secondary">
              <p className="flex items-center gap-2 font-bold uppercase tracking-[0.22em] text-brand-ink">
                <Minus className="h-4 w-4 text-brand" />
                Cart note
              </p>
              <p className="mt-2">
                Deleting an item here removes it from the local cart immediately, which keeps the mobile checkout flow
                clean.
              </p>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

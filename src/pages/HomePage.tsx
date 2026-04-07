import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionIntro } from "@/components/SectionIntro";
import { shapeCollections } from "@/data/storefront";
import { useStore } from "@/state/store";

const trustImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJEzfB8inaHx8ZrV1qWWd_yEiT9PpismM2zcSF8dm3E_OKHOvmjtS0aRp963ALio6wwy4DpHKK1KLXIj2DdSBIwMYX6Q18KUNXqSjzwCflghzlmHcX3qs_WqWxqchbqRiTKXWUw2L3lLbqvhCI1ysEhb7IfWkATJU4nNp-hIF0rBGziQ34w3lYyhFJs_WBDWu-pSzFJpoUNBPRSfbC-rK_39D5kscBsWmf8dYq3IoEG60Ub-LKWu1DwhRxmwqaFV1fOzOfpAV-SzYJ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8EEm1l044daFlK7QnsAzReSey3OahW4Nu4kMTiHhHhxGOqKLY2BPqiZ_lT8u2gdX9i079pDRQMdPPK6kNe8esmSrbPcNaK69oJQxSCPfisu7mL1OoSXU1hSgyQUByktzS74T0svkWQj5pAqOjv2N_WA7XUTC8GHRgYHNLcBbn45uvm3VtKinHjCK1qidpjX6JALWUQhT5hGhEroJl8rIyjR8wZwLv4ieg5-aVKsr8uIXAmPfz7f3m5ewTLWz5ua_pn9kXZbEpm8Wy",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2VpG8kuI-scun5yPgEZmfgsRWcsIaP1lrt4KxRQ_4Gb6hlIJULCSsh-_hCZpK4W0_zefp33VDNRIA0XqTw96y5XRQpl0cd1Ero8Pgz7CaF0Qrv-6oFX3bROaqxKm-r9-qtmfIBI-rxU_LYlMWeKail7m0emu3C0xQttVmoMzmEq05c2Xu_wnYB1W97an32_uE5JL6E4ETbjEmNJbP-ILfmr60c7aAomBtN_lcEupwanW-KqAzhoch_gigzgV2zJwU0cv62h0_9se",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqGx_c-ktLMoZN7Jxxsp-R17gSaxw7EbPPaAtX6myKw_h5FT66XTMg6v153G9aBIFMVSH4DwX6P1n1JhVVLdPEH1mT3E5tU8P7B1r0lk5Xkze2UxQcqSzaFIRsARBsWLjiEonXIVQZbubxLVcPgV5QHKvD1I9Uxl7skw_3plPIZi7Oqi-k7IbJwMAXlgLLuR0ro0BTM-0HzPS5647wGt4AkK-UEJ6LK_2mvMaUeV-8Y1Nh-8Mz3t3dPk_wQVQfhhrAMPZ5NhYeGWK3"
];

export function HomePage() {
  const { products } = useStore();

  return (
    <>
      <main className="space-y-[4.5rem] pb-8 pt-6">
        <section className="page-shell">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-high px-6 pb-8 pt-8 sm:px-8 sm:pb-10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEK-zkRUno1OT3nXrOEZ5YSjrDfM0IGTQ7o1bg3RlrP_WPUQ-T_aNQVmbLVKvvKm_IR5L_vvfkl1YKI4rfL4D4lxvv_GGSPXrG47jRBuM2EoWi_DDP30A4ECABqP42iS3FkNz5XggYptAMdR51dCfqQaq2S5pQ4Vr0IjYzhY8WxGJ0nt1dgOVX4B5nRmrHz2Cw7x17ShfLC8MoEebKflw9ZPDuayuNwqFROH-wmsMPRHgDFhyR0_LjVLQIiBFYfvueGG20aoe9tsZ0"
              alt="Vibrant editorial press-on nails in coral and pink"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(75,33,49,0.08),rgba(182,13,61,0.78))]" />

            <div className="relative z-10 flex min-h-[34rem] flex-col justify-end">
              <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-white/85">
                Nail Art Studio
              </p>
              <h1 className="editorial-text mt-4 max-w-xl text-[3.4rem] font-black italic leading-[0.88] text-white sm:text-[4.8rem]">
                Premium Press-Ons.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/84 sm:text-base">
                Discover salon-quality, hand-painted press-on nails. Easily find your perfect fit and order directly from your phone.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/shop"
                  className="cta-gradient flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
                >
                  Shop collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/booking"
                  className="flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-white/12 px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white backdrop-blur"
                >
                  Book appointment
                </Link>
              </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="page-shell flex items-end justify-between gap-4">
            <SectionIntro
              eyebrow="Shop by shape"
              title="Find the perfect silhouette for your next look."
              description="Whether you want bold stiletto drama or a soft everyday round, explore our curated collections."
            />
          </div>
          <div className="hide-scrollbar flex gap-4 overflow-x-auto px-[max(0.625rem,calc((100vw-1200px)/2+0.625rem))] pb-2">
            {shapeCollections.map((shape) => (
              <article key={shape.id} className="min-w-[16.75rem]">
                <div className="surface-panel overflow-hidden rounded-[1.75rem] p-2">
                  <img
                    src={shape.image}
                    alt={shape.name}
                    loading="lazy"
                    decoding="async"
                    className="h-[20rem] w-full rounded-[1.25rem] object-cover"
                  />
                </div>
                <h3 className="editorial-text mt-4 text-[1.9rem] font-bold italic text-brand-ink">
                  {shape.name}
                </h3>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">
                  {shape.vibe}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell space-y-6">
          <div className="flex items-center justify-between gap-4">
            <SectionIntro
              eyebrow="Curated sets"
              title="Hand-painted designs ready to ship."
              description="Explore our best-sellers and latest drops, crafted with premium gels for long-lasting wear."
            />
            <Link
              to="/shop"
              className="hidden rounded-full bg-white/70 px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand md:inline-flex"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <Link key={product.id} to="/shop" className="group">
                <div className="surface-panel overflow-hidden rounded-[1.5rem] p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/4] w-full rounded-[1rem] object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-1 pt-3">
                  <h3 className="editorial-text text-[1.05rem] font-bold text-brand-ink">{product.name}</h3>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-secondary">
                    <span>{product.shape}</span>
                    <span className="text-brand">${product.price}</span>
                  </div>
                  <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">
                    {product.stock} in stock
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white/40 py-16">
          <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand">Salon quality</p>
              <h2 className="editorial-text text-[3rem] font-black italic leading-[0.9] text-brand-ink sm:text-[4.2rem]">
                Salon Quality.
                <br />
                Zero Wait.
              </h2>
              <p className="max-w-md text-sm leading-7 text-secondary sm:text-base">
                Hand-painted, multi-layered, and structurally reinforced. Get the durability of an acrylic set without sitting in a salon chair for hours.
              </p>
              <div className="space-y-4 text-sm font-bold uppercase tracking-[0.2em] text-brand-ink">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-brand" />
                  3-week guaranteed wear
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-brand" />
                  Vegan and cruelty-free gel
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {trustImages.map((image, index) => (
                <div
                  key={image}
                  className={`overflow-hidden rounded-[1.75rem] ${index % 2 === 0 ? "mt-8" : ""}`}
                >
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell space-y-6">
          <div className="flex items-end justify-between gap-4">
            <SectionIntro
              eyebrow="Studio Feed"
              title="Watch our latest sets in motion."
              description="See our press-ons in real life. Browse styling ideas, tutorials, and recent client looks straight from our Instagram."
            />
            <Link
              to="/feed"
              className="hidden rounded-full bg-brand px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white md:inline-flex"
            >
              Open feed
            </Link>
          </div>

          <div className="surface-panel overflow-hidden rounded-[1.75rem] py-16 px-6 text-center">
            <h3 className="editorial-text text-[2rem] font-bold text-brand-ink">Follow our journey</h3>
            <p className="mt-2 text-sm leading-6 text-secondary mb-6">See real client sets, styling inspiration, and studio updates.</p>
            <Link
              to="/feed"
              className="cta-gradient inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
            >
              Watch our Reels
            </Link>
          </div>
        </section>

        <section className="page-shell pb-6">
          <div className="overflow-hidden rounded-[2rem] bg-brand px-6 py-10 text-center text-white sm:px-10">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-white/75">Join the collective</p>
            <h2 className="editorial-text mt-4 text-[3rem] font-black italic leading-[0.92] sm:text-[4rem]">
              Early access to limited drops.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/84 sm:text-base">
              Get notified when new press-on collections, seasonal edits, and tutorial-style content arrive.
            </p>
            <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter email address"
                className="min-h-12 flex-1 rounded-full border border-white/20 bg-white/12 px-5 text-sm text-white placeholder:text-white/65"
              />
              <button
                type="button"
                className="flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-brand"
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

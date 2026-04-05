import { useState } from "react";
import { Play } from "lucide-react";
import { EditorialPreviewModal } from "@/components/EditorialPreviewModal";
import { SectionIntro } from "@/components/SectionIntro";
import { editorialPosts } from "@/data/storefront";

export function FeedPage() {
  const [previewPostId, setPreviewPostId] = useState<string | null>(null);
  const previewPost = editorialPosts.find((post) => post.id === previewPostId) ?? null;

  return (
    <>
      <main className="page-shell space-y-8 pb-8 pt-6">
        <SectionIntro
          eyebrow="Instagram style feed"
          title="Vertical content built to feel natural on a phone."
          description="Each card keeps the editorial color story from the design source, but the interaction is simplified to a single tap so previews feel light and immediate."
        />

        <section className="grid gap-4 md:grid-cols-2">
          {editorialPosts.map((post) => (
            <article key={post.id} className="surface-panel overflow-hidden rounded-[1.9rem]">
              <button
                type="button"
                onClick={() => setPreviewPostId(post.id)}
                className="group relative block w-full text-left"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[9/14] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(75,33,49,0.82))]" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white backdrop-blur">
                    <Play className="h-3.5 w-3.5" />
                    Open preview
                  </div>
                  <h3 className="editorial-text mt-3 text-[2rem] font-black text-white">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/82">{post.caption}</p>
                </div>
              </button>
            </article>
          ))}
        </section>
      </main>

      <EditorialPreviewModal post={previewPost} onClose={() => setPreviewPostId(null)} />
    </>
  );
}

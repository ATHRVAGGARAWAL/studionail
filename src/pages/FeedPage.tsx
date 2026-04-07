import { SectionIntro } from "@/components/SectionIntro";
import { reelPosts } from "@/data/storefront";

export function FeedPage() {

  return (
    <>
      <main className="page-shell space-y-8 pb-8 pt-6">
        <SectionIntro
          eyebrow="Instagram style feed"
          title="Vertical content built to feel natural on a phone."
          description="Each card keeps the editorial color story from the design source, but the interaction is simplified to a single tap so previews feel light and immediate."
        />

        <section className="mx-auto max-w-sm space-y-8 pb-10">
          {reelPosts.map((post) => (
            <article key={post.id} className="surface-panel overflow-hidden rounded-[2rem] p-3 shadow-sm bg-white">
              <div className="relative w-full" style={{ paddingBottom: "177.77%" /* 16:9 aspect ratio */ }}>
                <iframe
                  src={post.url}
                  title={post.title}
                  className="absolute inset-0 h-full w-full rounded-[1.5rem] border-0"
                  scrolling="no"
                  allowTransparency
                  allow="encrypted-media"
                />
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

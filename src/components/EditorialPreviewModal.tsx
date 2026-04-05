import { useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { type EditorialPost } from "@/data/storefront";

interface EditorialPreviewModalProps {
  post: EditorialPost | null;
  onClose: () => void;
}

export function EditorialPreviewModal({ post, onClose }: EditorialPreviewModalProps) {
  useEffect(() => {
    if (!post) {
      return undefined;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, post]);

  if (!post) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80]" aria-modal="true" role="dialog">
      <button
        type="button"
        aria-label="Close feed preview"
        onClick={onClose}
        className="absolute inset-0 bg-brand-ink/35 backdrop-blur-sm"
      />

      <div className="absolute inset-x-3 bottom-3 top-auto overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_60px_rgba(75,33,49,0.24)] md:inset-y-8 md:left-1/2 md:w-[24rem] md:-translate-x-1/2">
        <div className="relative">
          <div className="aspect-[4/5] bg-surface-high">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            aria-label="Close feed preview"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 px-5 py-5">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles className="h-4 w-4" />
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em]">{post.accent}</p>
          </div>
          <h3 className="editorial-text text-[2rem] font-black text-brand-ink">{post.title}</h3>
          <p className="text-sm leading-7 text-secondary">{post.caption}</p>
        </div>
      </div>
    </div>
  );
}

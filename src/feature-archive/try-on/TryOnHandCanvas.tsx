import { Move, Sparkles } from "lucide-react";
import { type CSSProperties, type PointerEvent, type RefObject } from "react";
import {
  getFinishBackground,
  getShapeProfile,
  NailArtLayers,
  previewBaseWidths,
  previewLengthHeights
} from "@/feature-archive/try-on/NailPreviewOverlay";
import { type FinishPreviewId, type NailLength, type Product } from "@/data/storefront";
import { hexToRgba } from "@/feature-archive/try-on/productGuidance";

export interface FingerAlignmentPoint {
  label: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface TryOnHandCanvasProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  product: Product;
  photoUrl: string | null;
  selectedFinish: FinishPreviewId;
  selectedLength: NailLength;
  opacity: number;
  setScale: number;
  fingerAlignments: FingerAlignmentPoint[];
  selectedFingerIndex: number;
  dragLabel: string | null;
  profileSummary: string | null;
  onSelectFinger: (index: number) => void;
  onStartDrag: (mode: "all" | "finger", index: number | null, event: PointerEvent<HTMLElement>) => void;
}

export function TryOnHandCanvas({
  canvasRef,
  product,
  photoUrl,
  selectedFinish,
  selectedLength,
  opacity,
  setScale,
  fingerAlignments,
  selectedFingerIndex,
  dragLabel,
  profileSummary,
  onSelectFinger,
  onStartDrag
}: TryOnHandCanvasProps) {
  const shapeProfile = getShapeProfile(product.shape);
  const background = getFinishBackground(product, selectedFinish);

  return (
    <div
      ref={canvasRef}
      className="relative flex h-full min-h-[26rem] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#fff5f6_0%,#f9ecef_42%,#f1e3e7_100%)]"
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Uploaded hand preview"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.65),rgba(241,211,218,0.75))]" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_46%)]" />

      {!photoUrl ? (
        <div className="absolute left-6 top-6 max-w-[16rem] rounded-[1.25rem] bg-white/82 px-4 py-3 text-sm leading-6 text-secondary shadow-[0_16px_30px_rgba(75,33,49,0.08)]">
          Upload a close, well-lit hand photo, then drag the set into place and fine tune each finger.
        </div>
      ) : null}

      <button
        type="button"
        onPointerDown={(event) => onStartDrag("all", null, event)}
        className="absolute right-4 top-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/86 px-4 py-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-brand-ink shadow-[0_12px_22px_rgba(75,33,49,0.08)] touch-none"
      >
        <Move className="h-4 w-4 text-brand" />
        Move set
      </button>

      {fingerAlignments.map((finger, index) => {
        const selected = selectedFingerIndex === index;
        const sizeBoost = 1.18;
        const width = previewBaseWidths[index] * sizeBoost;
        const height = previewLengthHeights[selectedLength][index] * sizeBoost;
        const transform = `translate(-50%, -88%) rotate(${finger.rotation}deg) scale(${(setScale / 100) * finger.scale})`;
        const nailStyle = {
          width,
          height,
          transform,
          opacity: opacity / 100,
          borderRadius: shapeProfile.borderRadius,
          clipPath: shapeProfile.clipPath || undefined,
          background,
          boxShadow:
            selected
              ? `0 0 0 2px ${hexToRgba(product.tryOn!.accentColor, 0.35)}, 0 16px 30px ${hexToRgba(product.tryOn!.accentColor, 0.32)}`
              : selectedFinish === "matte"
                ? `0 12px 24px ${hexToRgba(product.tryOn!.accentColor, 0.18)}`
                : `0 14px 28px ${hexToRgba(product.tryOn!.accentColor, 0.28)}`
        } satisfies CSSProperties;

        return (
          <div
            key={`${product.id}-${finger.label}`}
            className="absolute"
            style={{ left: `${finger.x}%`, top: `${finger.y}%` }}
          >
            <span
              className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                selected ? "border-brand bg-white" : "border-white/90 bg-brand/30"
              }`}
            />
            {selected ? (
              <span className="absolute -top-8 left-0 -translate-x-1/2 rounded-full bg-brand px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_22px_rgba(186,19,64,0.24)]">
                {finger.label}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onSelectFinger(index)}
              onPointerDown={(event) => onStartDrag("finger", index, event)}
              aria-label={`Align ${finger.label.toLowerCase()} nail`}
              className="absolute left-0 top-0 touch-none overflow-hidden"
              style={nailStyle}
            >
              <NailArtLayers product={product} selectedFinish={selectedFinish} index={index} />
            </button>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-4 right-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="rounded-[1.25rem] bg-brand-ink/72 px-4 py-3 text-sm text-white backdrop-blur">
          {profileSummary ? (
            <p>
              Profile locked: <span className="font-semibold">{profileSummary}</span>
            </p>
          ) : (
            <p>Use the fit quiz first if you want more tailored shape and length suggestions.</p>
          )}
        </div>
        <div className="rounded-[1.25rem] bg-white/86 px-4 py-3 text-sm text-brand-ink shadow-[0_16px_24px_rgba(75,33,49,0.08)]">
          <p className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brand">
            <Sparkles className="h-4 w-4" />
            {dragLabel ?? "Drag tips"}
          </p>
          <p className="mt-1 text-sm leading-6 text-secondary">
            Drag any nail to align each fingertip, or drag the move-set pill to reposition all five nails together.
          </p>
        </div>
      </div>
    </div>
  );
}

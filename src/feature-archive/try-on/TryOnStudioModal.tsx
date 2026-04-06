import { type PointerEvent as ReactPointerEvent, useEffect, useId, useRef, useState } from "react";
import { Camera, RotateCcw, SlidersHorizontal, Upload, X } from "lucide-react";
import { NailPreviewOverlay } from "@/feature-archive/try-on/NailPreviewOverlay";
import { type FingerAlignmentPoint, TryOnHandCanvas } from "@/feature-archive/try-on/TryOnHandCanvas";
import { type FinishPreviewId, type NailLength, type Product } from "@/data/storefront";
import { getProfileSummary, type FitQuizProfile, hexToRgba } from "@/feature-archive/try-on/productGuidance";

interface TryOnStudioModalProps {
  product: Product | null;
  profile: FitQuizProfile | null;
  onClose: () => void;
}

interface ControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

type DragTarget =
  | {
      mode: "all";
      lastX: number;
      lastY: number;
    }
  | {
      mode: "finger";
      index: number;
      lastX: number;
      lastY: number;
    };

const defaultFingerAlignments: FingerAlignmentPoint[] = [
  { label: "Thumb", x: 27, y: 67, rotation: -26, scale: 0.94 },
  { label: "Index", x: 41, y: 48, rotation: -10, scale: 1 },
  { label: "Middle", x: 53, y: 40, rotation: 0, scale: 1.02 },
  { label: "Ring", x: 64, y: 47, rotation: 10, scale: 0.98 },
  { label: "Pinky", x: 76, y: 62, rotation: 18, scale: 0.92 }
];

function ControlSlider({ label, value, min, max, step = 1, onChange }: ControlProps) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-secondary">{label}</span>
        <span className="text-sm font-semibold text-brand-ink">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--color-brand)]"
      />
    </label>
  );
}

function clampAlignmentPoint(point: FingerAlignmentPoint) {
  return {
    ...point,
    x: Math.min(90, Math.max(10, point.x)),
    y: Math.min(88, Math.max(16, point.y))
  };
}

function createInitialFingerAlignments(product: Product) {
  const shape = product.shape.toLowerCase();
  const rotationOffset = product.tryOn?.defaultRotation ?? 0;

  return defaultFingerAlignments.map((finger, index) => {
    let y = finger.y;
    let scale = finger.scale;

    if (shape.includes("stiletto")) {
      y -= 1;
      scale += index === 2 ? 0.08 : 0.04;
    }

    if (shape.includes("coffin")) {
      y -= index === 2 ? 2 : 1;
      scale += 0.03;
    }

    if (shape.includes("square")) {
      y += 1;
      scale -= 0.04;
    }

    return clampAlignmentPoint({
      ...finger,
      y,
      scale,
      rotation: finger.rotation + rotationOffset
    });
  });
}

export function TryOnStudioModal({ product, profile, onClose }: TryOnStudioModalProps) {
  const inputId = useId();
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragTarget | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishPreviewId>("gloss");
  const [selectedLength, setSelectedLength] = useState<NailLength>("Medium");
  const [setScale, setSetScale] = useState(100);
  const [opacity, setOpacity] = useState(88);
  const [selectedFingerIndex, setSelectedFingerIndex] = useState(2);
  const [fingerAlignments, setFingerAlignments] = useState<FingerAlignmentPoint[]>([]);
  const [dragLabel, setDragLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      return undefined;
    }

    const defaultFinish = product.guidance?.finishPreviews[0]?.id ?? "gloss";
    const preferredLength =
      profile && product.guidance?.recommendedLengths.includes(profile.desiredLength)
        ? profile.desiredLength
        : product.guidance?.recommendedLengths[0] ?? "Medium";

    setSelectedFinish(defaultFinish);
    setSelectedLength(preferredLength);
    setSetScale(Math.round((product.tryOn?.defaultScale ?? 1) * 100));
    setOpacity(Math.round((product.tryOn?.defaultOpacity ?? 0.88) * 100));
    setSelectedFingerIndex(2);
    setFingerAlignments(createInitialFingerAlignments(product));
    setDragLabel(null);

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
  }, [onClose, product, profile]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const drag = dragRef.current;
      const canvas = canvasRef.current;

      if (!drag || !canvas) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const deltaX = ((event.clientX - drag.lastX) / rect.width) * 100;
      const deltaY = ((event.clientY - drag.lastY) / rect.height) * 100;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;

      setFingerAlignments((current) =>
        current.map((finger, index) => {
          if (drag.mode === "all" || (drag.mode === "finger" && drag.index === index)) {
            return clampAlignmentPoint({
              ...finger,
              x: finger.x + deltaX,
              y: finger.y + deltaY
            });
          }

          return finger;
        })
      );
    }

    function handlePointerUp() {
      dragRef.current = null;
      setDragLabel(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (photoUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  if (!product) {
    return null;
  }

  const currentProduct = product;
  const finishPreviews = currentProduct.guidance?.finishPreviews ?? [];
  const lengthOptions = currentProduct.guidance?.recommendedLengths ?? ["Short", "Medium", "Long"];
  const selectedFinger = fingerAlignments[selectedFingerIndex];
  const profileSummary = profile ? getProfileSummary(profile) : null;

  function handlePhotoChange(file: File | null) {
    if (!file) {
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return nextUrl;
    });
  }

  function updateSelectedFinger(patch: Partial<FingerAlignmentPoint>) {
    setFingerAlignments((current) =>
      current.map((finger, index) =>
        index === selectedFingerIndex ? clampAlignmentPoint({ ...finger, ...patch }) : finger
      )
    );
  }

  function resetSelectedFinger() {
    const baseline = createInitialFingerAlignments(currentProduct)[selectedFingerIndex];

    if (!baseline) {
      return;
    }

    updateSelectedFinger(baseline);
  }

  function resetAllAlignment() {
    setFingerAlignments(createInitialFingerAlignments(currentProduct));
    setSelectedFingerIndex(2);
    setSetScale(Math.round((currentProduct.tryOn?.defaultScale ?? 1) * 100));
    setOpacity(Math.round((currentProduct.tryOn?.defaultOpacity ?? 0.88) * 100));
  }

  function startDrag(mode: "all" | "finger", index: number | null, event: ReactPointerEvent<HTMLElement>) {
    event.preventDefault();

    if (mode === "finger" && typeof index === "number") {
      setSelectedFingerIndex(index);
      setDragLabel(`Aligning ${fingerAlignments[index]?.label ?? "finger"}`);
      dragRef.current = {
        mode,
        index,
        lastX: event.clientX,
        lastY: event.clientY
      };

      return;
    }

    setDragLabel("Moving entire set");
    dragRef.current = {
      mode: "all",
      lastX: event.clientX,
      lastY: event.clientY
    };
  }

  return (
    <div className="fixed inset-0 z-[95]" aria-modal="true" role="dialog">
      <button
        type="button"
        aria-label="Close try on studio"
        onClick={onClose}
        className="absolute inset-0 bg-brand-ink/30 backdrop-blur-sm"
      />

      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,#fff9fb_0%,#fff1f4_100%)] md:inset-6 md:rounded-[2rem]">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between border-b border-outline-soft/35 bg-white/80 px-5 py-4 backdrop-blur">
            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.28em] text-brand">Try-on studio</p>
              <h2 className="editorial-text mt-2 text-[2rem] font-black text-brand-ink">{currentProduct.name}</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-secondary">
                Upload a hand photo, drag the full set into place, then align each finger for a more realistic fit.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close try on studio"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid flex-1 gap-5 overflow-y-auto px-4 py-4 lg:grid-cols-[1.2fr_0.8fr] lg:px-5 lg:py-5">
            <section className="surface-panel relative min-h-[28rem] overflow-hidden rounded-[1.75rem] p-4">
              <TryOnHandCanvas
                canvasRef={canvasRef}
                product={currentProduct}
                photoUrl={photoUrl}
                selectedFinish={selectedFinish}
                selectedLength={selectedLength}
                opacity={opacity}
                setScale={setScale}
                fingerAlignments={fingerAlignments}
                selectedFingerIndex={selectedFingerIndex}
                dragLabel={dragLabel}
                profileSummary={profileSummary}
                onSelectFinger={setSelectedFingerIndex}
                onStartDrag={startDrag}
              />
            </section>

            <section className="space-y-4">
              <div className="surface-panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-secondary">Photo</p>
                    <h3 className="editorial-text text-[1.55rem] font-black text-brand-ink">Upload your hand</h3>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <label
                    htmlFor={inputId}
                    className="cta-gradient inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white"
                  >
                    <Upload className="h-4 w-4" />
                    {photoUrl ? "Replace photo" : "Upload photo"}
                  </label>
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    onChange={(event) => handlePhotoChange(event.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  {photoUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl((current) => {
                          if (current?.startsWith("blob:")) {
                            URL.revokeObjectURL(current);
                          }

                          return null;
                        });
                      }}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-outline-soft bg-white px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand-ink"
                    >
                      <RotateCcw className="h-4 w-4 text-brand" />
                      Clear photo
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="surface-panel rounded-[1.75rem] p-5">
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-secondary">Finish preview</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {finishPreviews.map((finish) => {
                    const selected = selectedFinish === finish.id;

                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSelectedFinish(finish.id)}
                        className={`rounded-[1.35rem] border p-3 text-left transition ${
                          selected ? "border-brand bg-brand-mist" : "border-outline-soft/45 bg-white/82"
                        }`}
                      >
                        <div className="w-full">
                          <NailPreviewOverlay
                            product={currentProduct}
                            selectedFinish={finish.id}
                            selectedLength={selectedLength}
                            compact
                          />
                        </div>
                        <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-brand-ink">
                          {finish.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-secondary">{finish.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="surface-panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-secondary">
                      Alignment controls
                    </p>
                    <h3 className="editorial-text text-[1.55rem] font-black text-brand-ink">Fine tune the fit</h3>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {lengthOptions.map((length) => (
                      <button
                        key={length}
                        type="button"
                        onClick={() => setSelectedLength(length)}
                        className={`rounded-full px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] transition ${
                          selectedLength === length
                            ? "bg-brand text-white"
                            : "bg-white text-brand-ink shadow-[0_8px_20px_rgba(75,33,49,0.05)]"
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-[1.3rem] bg-white/82 p-3">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-secondary">
                      Per-finger alignment
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {fingerAlignments.map((finger, index) => (
                        <button
                          key={finger.label}
                          type="button"
                          onClick={() => setSelectedFingerIndex(index)}
                          className={`rounded-full px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] transition ${
                            selectedFingerIndex === index
                              ? "bg-brand text-white"
                              : "bg-brand-mist text-brand-ink"
                          }`}
                        >
                          {finger.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <ControlSlider label="Set scale" value={setScale} min={65} max={170} onChange={setSetScale} />
                    <ControlSlider label="Opacity" value={opacity} min={35} max={100} onChange={setOpacity} />
                    <ControlSlider
                      label={`${selectedFinger?.label ?? "Finger"} rotate`}
                      value={Math.round(selectedFinger?.rotation ?? 0)}
                      min={-45}
                      max={45}
                      onChange={(value) => updateSelectedFinger({ rotation: value })}
                    />
                    <ControlSlider
                      label={`${selectedFinger?.label ?? "Finger"} scale`}
                      value={Math.round((selectedFinger?.scale ?? 1) * 100)}
                      min={70}
                      max={145}
                      onChange={(value) => updateSelectedFinger({ scale: value / 100 })}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={resetSelectedFinger}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-outline-soft bg-white px-4 py-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-brand-ink"
                    >
                      <RotateCcw className="h-4 w-4 text-brand" />
                      Reset selected
                    </button>
                    <button
                      type="button"
                      onClick={resetAllAlignment}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-outline-soft bg-white px-4 py-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-brand-ink"
                    >
                      <RotateCcw className="h-4 w-4 text-brand" />
                      Reset all
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="rounded-[1.75rem] border border-brand/12 px-5 py-4"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(currentProduct.tryOn!.glowColor, 0.8)}, rgba(255,255,255,0.86))`
                }}
              >
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-brand">Studio note</p>
                <p className="mt-2 text-sm leading-6 text-brand-ink">
                  This studio now supports whole-set dragging plus per-finger landmark alignment for a more realistic
                  preview on your uploaded photo.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

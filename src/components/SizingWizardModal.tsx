import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Ruler } from "lucide-react";

interface SizingWizardModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (size: string) => void;
}

const sizingOptions = [
  { id: "XS", label: "Extra Small", mm: "14mm, 10mm, 11mm, 10mm, 7mm" },
  { id: "S", label: "Small", mm: "15mm, 11mm, 12mm, 11mm, 8mm" },
  { id: "M", label: "Medium", mm: "16mm, 12mm, 13mm, 12mm, 9mm" },
  { id: "L", label: "Large", mm: "18mm, 13mm, 14mm, 13mm, 10mm" },
];

export function SizingWizardModal({ open, onClose, onSave }: SizingWizardModalProps) {
  const [step, setStep] = useState<"intro" | "select">("intro");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [customSize, setCustomSize] = useState("");

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("intro");
        setCustomSize("");
      }, 300);
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" aria-modal="true" role="dialog">
      <button
        type="button"
        aria-label="Close sizing wizard"
        onClick={onClose}
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
      />

      <div className="absolute inset-x-0 bottom-0 top-12 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,#fff8fa_0%,#fff1f4_100%)] md:inset-x-auto md:right-0 md:top-0 md:w-[28rem] md:rounded-none md:rounded-l-[2rem]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-outline-soft/40 bg-white/78 px-5 py-4 backdrop-blur">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.28em] text-brand">Sizing Profile</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-secondary shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            {step === "intro" ? (
              <div className="space-y-6 text-center pt-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Ruler className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="editorial-text text-[2.2rem] font-black leading-none text-brand-ink">Find Your Fit</h2>
                  <p className="mt-3 text-sm leading-6 text-secondary mx-auto max-w-[16rem]">
                    Measure your natural nails from sidewall to sidewall using soft tape or the tissue method to find your mm size.
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-white/60 p-4 text-left">
                  <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-ink mb-2">How to measure</h3>
                  <ol className="list-decimal pl-4 text-sm text-secondary space-y-2">
                    <li>Place clear tape over your nail.</li>
                    <li>Mark the widest sides with a pen.</li>
                    <li>Remove tape and measure between lines in mm.</li>
                    <li>Repeat for all fingers.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h3 className="editorial-text text-[1.8rem] font-black leading-none text-brand-ink mb-1">Select Size</h3>
                <p className="text-sm text-secondary mb-6">Choose a standard size or enter custom measurements.</p>
                
                <div className="grid gap-3">
                  {sizingOptions.map((option) => {
                    const isSelected = selectedSize === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSelectedSize(option.id);
                          setCustomSize("");
                        }}
                        className={`rounded-[1.25rem] border p-4 text-left transition ${
                          isSelected
                            ? "border-brand bg-brand text-white shadow-md"
                            : "border-outline-soft/50 bg-white/92 text-brand-ink"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold uppercase tracking-[0.18em] text-sm">{option.label} ({option.id})</span>
                          <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? "border-white" : "border-outline-soft"}`}>
                            {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                          </span>
                        </div>
                        <p className={`mt-1 text-xs ${isSelected ? "text-white/80" : "text-secondary"}`}>
                          {option.mm}
                        </p>
                      </button>
                    );
                  })}
                  
                  <div className={`mt-2 rounded-[1.25rem] border p-4 transition ${selectedSize === "Custom" ? "border-brand bg-white" : "border-outline-soft/50 bg-white/60"}`}>
                    <label className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedSize("Custom")}>
                      <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${selectedSize === "Custom" ? "border-brand" : "border-outline-soft"}`}>
                        {selectedSize === "Custom" && <span className="h-2 w-2 rounded-full bg-brand" />}
                      </span>
                      <span className="font-bold uppercase tracking-[0.18em] text-sm text-brand-ink">Custom (mm)</span>
                    </label>
                    {selectedSize === "Custom" && (
                      <div className="mt-3 pl-7">
                        <input
                          type="text"
                          placeholder="e.g. 15, 11, 12, 11, 8"
                          value={customSize}
                          onChange={(e) => setCustomSize(e.target.value)}
                          className="w-full rounded-xl border border-outline-soft bg-[#fff8fa] px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand/40"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-outline-soft/35 bg-white/86 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur">
            {step === "intro" ? (
              <button
                type="button"
                onClick={() => setStep("select")}
                className="cta-gradient flex w-full min-h-12 items-center justify-center gap-2 rounded-full text-[0.72rem] font-bold uppercase tracking-[0.24em] text-white"
              >
                I have my measurements
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("intro")}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-soft bg-white text-secondary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const finalSize = selectedSize === "Custom" ? (customSize || "Custom") : selectedSize;
                    onSave(finalSize);
                    onClose();
                  }}
                  className="cta-gradient flex flex-1 items-center justify-center gap-2 rounded-full text-[0.72rem] font-bold uppercase tracking-[0.24em] text-white"
                >
                  Save my size
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

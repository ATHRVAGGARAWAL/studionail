import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { fitQuizSteps, type FitQuizProfile } from "@/feature-archive/try-on/productGuidance";

interface FitQuizModalProps {
  open: boolean;
  profile: FitQuizProfile | null;
  onApply: (profile: FitQuizProfile) => void;
  onClose: () => void;
}

const defaultProfile: FitQuizProfile = {
  nailBed: "Balanced",
  desiredLength: "Medium",
  finishPreference: "gloss",
  styleMood: "Quiet luxury"
};

export function FitQuizModal({ open, profile, onApply, onClose }: FitQuizModalProps) {
  const [draft, setDraft] = useState<FitQuizProfile>(profile ?? defaultProfile);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setDraft(profile ?? defaultProfile);
    setStepIndex(0);

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
  }, [onClose, open, profile]);

  if (!open) {
    return null;
  }

  const step = fitQuizSteps[stepIndex];
  const isLastStep = stepIndex === fitQuizSteps.length - 1;

  function updateDraft(value: string) {
    setDraft((current) => ({
      ...current,
      [step.key]: value
    }) as FitQuizProfile);
  }

  return (
    <div className="fixed inset-0 z-[90]" aria-modal="true" role="dialog">
      <button
        type="button"
        aria-label="Close fit quiz"
        onClick={onClose}
        className="absolute inset-0 bg-brand-ink/25 backdrop-blur-sm"
      />

      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,#fff8fa_0%,#fff1f4_100%)] md:inset-x-auto md:right-0 md:w-[32rem] md:rounded-none md:rounded-l-[2rem]">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between border-b border-outline-soft/40 bg-white/78 px-5 py-4 backdrop-blur">
            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.28em] text-brand">Fit guidance</p>
              <h2 className="editorial-text mt-2 text-[2rem] font-black text-brand-ink">Find your edit.</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-secondary">
                Four quick signals and we&apos;ll rank the best shapes, lengths, and finishes for you.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close fit quiz"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-5 pt-4">
            {fitQuizSteps.map((quizStep, index) => (
              <div
                key={quizStep.key}
                className={`h-1.5 flex-1 rounded-full transition ${
                  index <= stepIndex ? "bg-brand" : "bg-brand/10"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="rounded-[1.5rem] bg-white/78 p-5 shadow-[0_18px_40px_rgba(75,33,49,0.06)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-brand/70">
                    Step {stepIndex + 1} of {fitQuizSteps.length}
                  </p>
                  <h3 className="editorial-text mt-2 text-[1.8rem] font-black leading-[0.94] text-brand-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-secondary">{step.hint}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {step.options.map((option) => {
                  const selected = draft[step.key] === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateDraft(option.value)}
                      className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
                        selected
                          ? "border-brand bg-brand text-white shadow-[0_18px_30px_rgba(186,19,64,0.18)]"
                          : "border-outline-soft/50 bg-white/92 text-brand-ink hover:border-brand/40 hover:bg-brand-mist"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.18em]">{option.label}</p>
                          <p className={`mt-1 text-sm leading-6 ${selected ? "text-white/88" : "text-secondary"}`}>
                            {option.description}
                          </p>
                        </div>
                        <span
                          className={`mt-1 h-5 w-5 rounded-full border ${
                            selected ? "border-white bg-white" : "border-outline-soft bg-white"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-outline-soft/35 bg-white/86 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                disabled={stepIndex === 0}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-outline-soft bg-white px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand-ink disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLastStep) {
                    onApply(draft);
                    onClose();
                    return;
                  }

                  setStepIndex((current) => Math.min(fitQuizSteps.length - 1, current + 1));
                }}
                className="cta-gradient inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white"
              >
                {isLastStep ? "Use my edit" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

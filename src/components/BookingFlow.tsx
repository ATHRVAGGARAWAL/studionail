import { useState } from "react";
import { ArrowRight, Droplets, Palette, Sparkles } from "lucide-react";
import { bookingSlots, enhancements, services } from "@/data/storefront";

type Step = "service" | "time" | "confirm";

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const dayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function BookingFlow() {
  const [step, setStep] = useState<Step>("service");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("minimalist-zen");
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string>(bookingSlots[3]);
  const [confirmed, setConfirmed] = useState(false);

  const bookingDays = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  });

  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? services[1];

  const selectedDate = bookingDays[selectedDateIndex] ?? bookingDays[1];

  const total =
    selectedService.price +
    selectedEnhancements.reduce((runningTotal, enhancementId) => {
      const enhancement = enhancements.find((item) => item.id === enhancementId);
      return runningTotal + (enhancement?.price ?? 0);
    }, 0);

  function toggleEnhancement(enhancementId: string) {
    setSelectedEnhancements((currentEnhancements) =>
      currentEnhancements.includes(enhancementId)
        ? currentEnhancements.filter((item) => item !== enhancementId)
        : [...currentEnhancements, enhancementId]
    );
  }

  function moveForward() {
    if (step === "service") {
      setStep("time");
      return;
    }

    if (step === "time") {
      setStep("confirm");
      return;
    }

    setConfirmed(true);
  }

  const ctaLabel =
    step === "service"
      ? "Next: Pick Date"
      : step === "time"
        ? "Next: Confirm"
        : confirmed
          ? "Booking Saved"
          : "Confirm Appointment";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: "service", label: "Service", index: 1 },
          { id: "time", label: "Time", index: 2 },
          { id: "confirm", label: "Confirm", index: 3 }
        ].map((item) => {
          const isActive = item.id === step;
          const isComplete =
            (step === "time" && item.id === "service") || (step === "confirm" && item.id !== "confirm");

          return (
            <div key={item.id} className="flex flex-col items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                  isActive
                    ? "cta-gradient text-white"
                    : isComplete
                      ? "bg-brand/15 text-brand"
                      : "bg-white/70 text-secondary"
                }`}
              >
                {item.index}
              </div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-secondary">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {step === "service" ? (
        <div className="space-y-5">
          {services.map((service) => {
            const isSelected = service.id === selectedServiceId;

            return (
              <article
                key={service.id}
                className={`overflow-hidden rounded-[1.75rem] p-4 transition ${
                  isSelected ? "bg-brand/5 ring-2 ring-brand" : "surface-panel"
                }`}
              >
                <div className="flex gap-4">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-24 rounded-[1.4rem] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="editorial-text text-[1.55rem] font-black text-brand-ink">
                          {service.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-secondary">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-brand">${service.price}</p>
                        {isSelected ? (
                          <span className="mt-2 inline-flex rounded-full bg-brand px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white/80 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">
                        {service.duration} min
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`min-h-11 rounded-full px-5 text-[0.68rem] font-bold uppercase tracking-[0.24em] transition ${
                          isSelected ? "bg-white/75 text-secondary" : "bg-brand text-white"
                        }`}
                      >
                        {isSelected ? "Chosen" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="editorial-text text-[2rem] font-black text-brand-ink">Enhancements</h3>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Optional</p>
            </div>

            <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
              {enhancements.map((enhancement) => {
                const isActive = selectedEnhancements.includes(enhancement.id);
                const Icon =
                  enhancement.icon === "sparkles"
                    ? Sparkles
                    : enhancement.icon === "droplets"
                      ? Droplets
                      : Palette;

                return (
                  <button
                    key={enhancement.id}
                    type="button"
                    onClick={() => toggleEnhancement(enhancement.id)}
                    className={`min-w-[10rem] rounded-[1.5rem] p-4 text-left transition ${
                      isActive ? "bg-brand text-white shadow-[0_18px_34px_rgba(182,13,61,0.2)]" : "surface-panel"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-brand"}`} />
                    <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em]">{enhancement.name}</p>
                    <p className={`mt-1 text-sm ${isActive ? "text-white/85" : "text-secondary"}`}>
                      {enhancement.description}
                    </p>
                    <p className="mt-4 text-sm font-black">+${enhancement.price}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {step === "time" ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="surface-panel rounded-[1.75rem] p-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Choose a day</p>
            <h3 className="editorial-text mt-2 text-[2rem] font-black text-brand-ink">Date selection</h3>

            <div className="hide-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2">
              {bookingDays.map((date, index) => (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setSelectedDateIndex(index)}
                  className={`min-w-24 rounded-[1.4rem] px-4 py-4 text-left transition ${
                    index === selectedDateIndex ? "cta-gradient text-white" : "bg-white/76 text-brand-ink"
                  }`}
                >
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em]">
                    {weekdayFormatter.format(date)}
                  </p>
                  <p className="mt-2 text-base font-black">{dayFormatter.format(date)}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="surface-panel rounded-[1.75rem] p-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Tap a slot</p>
            <h3 className="editorial-text mt-2 text-[2rem] font-black text-brand-ink">Time selection</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {bookingSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`min-h-12 rounded-full px-4 text-sm font-bold transition ${
                    slot === selectedSlot ? "bg-brand text-white" : "bg-white/76 text-brand-ink"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {step === "confirm" ? (
        <section className="surface-panel rounded-[1.9rem] p-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Your booking</p>
          <h3 className="editorial-text mt-2 text-[2.2rem] font-black text-brand-ink">
            {confirmed ? "Appointment saved." : "Ready to confirm."}
          </h3>
          <div className="mt-6 space-y-3">
            <div className="rounded-[1.4rem] bg-white/76 px-4 py-4">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">Service</p>
              <p className="mt-2 text-lg font-bold text-brand-ink">{selectedService.name}</p>
            </div>
            <div className="rounded-[1.4rem] bg-white/76 px-4 py-4">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">Date & time</p>
              <p className="mt-2 text-lg font-bold text-brand-ink">
                {dayFormatter.format(selectedDate)} · {selectedSlot}
              </p>
            </div>
            <div className="rounded-[1.4rem] bg-white/76 px-4 py-4">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-secondary">Enhancements</p>
              <p className="mt-2 text-lg font-bold text-brand-ink">
                {selectedEnhancements.length
                  ? selectedEnhancements
                      .map((enhancementId) => enhancements.find((item) => item.id === enhancementId)?.name)
                      .filter(Boolean)
                      .join(", ")
                  : "None selected"}
              </p>
            </div>
          </div>
          {confirmed ? (
            <p className="mt-5 rounded-[1.4rem] bg-brand/8 px-4 py-4 text-sm leading-7 text-brand-ink">
              Your appointment is locked in locally for this frontend demo. A real calendar sync can be layered on
              later without changing the UI structure.
            </p>
          ) : null}
        </section>
      ) : null}

      <div className="surface-panel sticky bottom-24 z-20 rounded-[1.75rem] p-4 md:bottom-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-secondary">Total estimated</p>
            <p className="editorial-text mt-1 text-[2rem] font-black text-brand-ink">${total.toFixed(2)}</p>
          </div>
          <button
            type="button"
            onClick={moveForward}
            disabled={confirmed}
            className={`flex min-h-14 flex-1 items-center justify-center gap-3 rounded-full px-6 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-white transition ${
              confirmed ? "bg-secondary/40" : "cta-gradient"
            }`}
          >
            {ctaLabel}
            {!confirmed ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </div>
      </div>
    </div>
  );
}

import { BookingFlow } from "@/components/BookingFlow";
import { SectionIntro } from "@/components/SectionIntro";

export function BookingPage() {
  return (
    <main className="page-shell space-y-8 pb-8 pt-6">
      <SectionIntro
        eyebrow="Book your experience"
        title="Select your service, then tap through time and confirmation."
        description="The booking UI preserves the original stepper, cards, and sticky action bar, while making each choice clearer and more touch-friendly for smaller screens."
      />
      <BookingFlow />
    </main>
  );
}

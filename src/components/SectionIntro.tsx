interface SectionIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionIntroProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-2xl space-y-3 ${alignment}`}>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand/80">
        {eyebrow}
      </p>
      <h2 className="editorial-text text-[2rem] font-black leading-[0.92] text-brand-ink sm:text-[2.75rem]">
        {title}
      </h2>
      <p className="text-sm leading-7 text-secondary sm:text-base">{description}</p>
    </div>
  );
}

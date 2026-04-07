import brandMark from "@/assets/brand-mark.svg";

interface BrandLockupProps {
  size?: "sm" | "md" | "lg";
  tone?: "default" | "light";
  className?: string;
}

const sizeStyles = {
  sm: {
    wrap: "gap-3",
    logo: "h-11 w-11 rounded-[1rem]",
    title: "text-[1.8rem]",
    subtitle: "text-[0.62rem] tracking-[0.22em]"
  },
  md: {
    wrap: "gap-3.5",
    logo: "h-14 w-14 rounded-[1.25rem]",
    title: "text-[2.3rem]",
    subtitle: "text-[0.68rem] tracking-[0.24em]"
  },
  lg: {
    wrap: "gap-4",
    logo: "h-16 w-16 rounded-[1.35rem] sm:h-20 sm:w-20",
    title: "text-[2.65rem] sm:text-[3.1rem]",
    subtitle: "text-[0.72rem] tracking-[0.28em]"
  }
} as const;

const toneStyles = {
  default: {
    title: "text-brand",
    subtitle: "text-secondary"
  },
  light: {
    title: "text-white",
    subtitle: "text-white/78"
  }
} as const;

export function BrandLockup({ size = "sm", tone = "default", className = "" }: BrandLockupProps) {
  const currentSize = sizeStyles[size];
  const currentTone = toneStyles[tone];

  return (
    <div className={`flex items-center ${currentSize.wrap} ${className}`.trim()}>
      <img
        src={brandMark}
        alt="Nail Art by Shalini Mitall logo"
        className={`${currentSize.logo} shrink-0 object-cover shadow-[0_14px_28px_rgba(186,19,64,0.12)]`}
      />
      <div className="min-w-0">
        <p className={`editorial-text font-black italic leading-none ${currentSize.title} ${currentTone.title}`}>
          Nail Art
        </p>
        <p className={`mt-1 font-bold uppercase leading-none ${currentSize.subtitle} ${currentTone.subtitle}`}>
          Studio
        </p>
      </div>
    </div>
  );
}

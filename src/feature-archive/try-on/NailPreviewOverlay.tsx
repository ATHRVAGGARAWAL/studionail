import { type CSSProperties, type ReactNode } from "react";
import { type FinishPreviewId, type NailLength, type Product } from "@/data/storefront";
import { hexToRgba } from "@/feature-archive/try-on/productGuidance";

interface NailPreviewOverlayProps {
  product: Product;
  selectedFinish: FinishPreviewId;
  selectedLength: NailLength;
  compact?: boolean;
}

export const previewBaseWidths = [18, 22, 26, 23, 19];
export const previewLengthHeights: Record<NailLength, number[]> = {
  Short: [52, 62, 72, 64, 54],
  Medium: [66, 82, 96, 84, 68],
  Long: [82, 104, 124, 108, 88]
};

const fanRotations = [-18, -9, 0, 9, 18];

export function getShapeProfile(shape: string) {
  const normalizedShape = shape.trim().toLowerCase();

  if (normalizedShape.includes("stiletto")) {
    return {
      clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 18px 18px"
    };
  }

  if (normalizedShape.includes("coffin")) {
    return {
      clipPath: "polygon(24% 0%, 76% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 16px 16px"
    };
  }

  if (normalizedShape.includes("almond") || normalizedShape.includes("oval")) {
    return {
      clipPath: "polygon(50% 0%, 82% 10%, 100% 52%, 86% 100%, 14% 100%, 0% 52%, 18% 10%)",
      borderRadius: "20px"
    };
  }

  if (normalizedShape.includes("square")) {
    return {
      clipPath: "",
      borderRadius: "12px 12px 16px 16px"
    };
  }

  return {
    clipPath: "",
    borderRadius: "18px"
  };
}

export function getFinishBackground(product: Product, selectedFinish: FinishPreviewId) {
  const tryOn = product.tryOn!;

  if (selectedFinish === "chrome") {
    return `linear-gradient(135deg, ${tryOn.accentColor} 0%, ${tryOn.baseColor} 38%, #fff8fb 58%, ${tryOn.accentColor} 100%)`;
  }

  if (selectedFinish === "sheer") {
    return `linear-gradient(180deg, ${hexToRgba(tryOn.baseColor, 0.5)} 0%, ${hexToRgba(tryOn.accentColor, 0.78)} 100%)`;
  }

  if (selectedFinish === "matte") {
    return `linear-gradient(160deg, ${tryOn.baseColor} 0%, ${tryOn.accentColor} 100%)`;
  }

  return `linear-gradient(160deg, ${tryOn.baseColor} 0%, ${hexToRgba(tryOn.accentColor, 0.95)} 100%)`;
}

function renderProductDesign(product: Product, selectedFinish: FinishPreviewId, index: number): ReactNode {
  const tryOn = product.tryOn!;
  const accentSoft = hexToRgba(tryOn.accentColor, selectedFinish === "sheer" ? 0.34 : 0.58);
  const accentStrong = hexToRgba(tryOn.accentColor, selectedFinish === "matte" ? 0.48 : 0.74);
  const glowSoft = hexToRgba(tryOn.glowColor, selectedFinish === "sheer" ? 0.22 : 0.44);
  const pearl = selectedFinish === "matte" ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.78)";
  const gold = "rgba(230, 188, 112, 0.88)";
  const roseGold = "rgba(222, 155, 145, 0.88)";

  switch (product.id) {
    case "crimson-velvet":
      return (
        <>
          <div
            className="absolute -right-[10%] top-[8%] h-[62%] w-[84%] rotate-[28deg] rounded-full"
            style={{ background: `linear-gradient(180deg, ${accentStrong}, transparent)` }}
          />
          <div
            className="absolute left-[12%] top-[18%] h-[16%] w-[82%] -rotate-[18deg] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${pearl} 44%, transparent 100%)` }}
          />
          {index === 1 || index === 3 ? (
            <div
              className="absolute right-[18%] top-[46%] h-[14%] w-[14%] rounded-full"
              style={{ background: gold, boxShadow: `0 0 12px ${gold}` }}
            />
          ) : null}
        </>
      );
    case "gilded-rose":
      return (
        <>
          {[0, 1, 2].map((dotIndex) => (
            <div
              key={`gilded-${dotIndex}`}
              className="absolute rounded-full"
              style={{
                left: `${18 + dotIndex * 18}%`,
                top: `${24 + ((index + dotIndex) % 3) * 14}%`,
                width: `${8 + dotIndex * 3}%`,
                height: `${8 + dotIndex * 3}%`,
                background: dotIndex === 1 ? gold : roseGold,
                filter: "blur(0.2px)"
              }}
            />
          ))}
          <div
            className="absolute inset-x-[18%] bottom-[18%] h-[18%] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${pearl}, transparent)` }}
          />
        </>
      );
    case "azure-electric":
      return (
        <>
          <div
            className="absolute -left-[16%] top-[20%] h-[24%] w-[136%] -rotate-[26deg] rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${accentStrong} 28%, rgba(255,255,255,0.82) 48%, ${glowSoft} 68%, transparent 100%)`
            }}
          />
          <div
            className="absolute -left-[8%] top-[48%] h-[18%] w-[126%] rotate-[18deg] rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${glowSoft} 24%, ${accentSoft} 48%, rgba(255,255,255,0.76) 58%, transparent 100%)`
            }}
          />
        </>
      );
    case "onyx-geometry":
      return (
        <>
          <div
            className="absolute left-[22%] top-[18%] h-[10%] w-[54%]"
            style={{ background: pearl }}
          />
          <div
            className="absolute left-[52%] top-[36%] h-[34%] w-[10%]"
            style={{ background: accentStrong }}
          />
          <div
            className="absolute left-[22%] bottom-[18%] h-[12%] w-[38%]"
            style={{ background: `linear-gradient(90deg, ${pearl}, transparent)` }}
          />
        </>
      );
    case "lunar-pearl":
      return (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 34% 26%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0) 26%)"
            }}
          />
          <div
            className="absolute left-[18%] top-[18%] h-[38%] w-[38%] rounded-full"
            style={{ boxShadow: `inset -8px 0 0 ${pearl}`, opacity: 0.82 }}
          />
          <div
            className="absolute right-[16%] bottom-[18%] h-[20%] w-[34%] rounded-full blur-[1px]"
            style={{ background: glowSoft }}
          />
        </>
      );
    case "violet-whisper":
      return (
        <>
          <div
            className="absolute left-[10%] top-[18%] h-[34%] w-[58%] rounded-full blur-[1.5px]"
            style={{ background: accentSoft }}
          />
          <div
            className="absolute right-[12%] top-[42%] h-[28%] w-[52%] rounded-full blur-[1.5px]"
            style={{ background: glowSoft }}
          />
          <div
            className="absolute left-[28%] bottom-[16%] h-[12%] w-[42%] rotate-[16deg] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${pearl} 52%, transparent 100%)` }}
          />
        </>
      );
    case "botanical-hunter":
      return (
        <>
          <div
            className="absolute left-[48%] top-[18%] h-[56%] w-[4%] -rotate-[18deg] rounded-full"
            style={{ background: pearl }}
          />
          {[0, 1, 2].map((leafIndex) => (
            <div
              key={`leaf-${leafIndex}`}
              className="absolute rounded-full"
              style={{
                left: `${34 + leafIndex * 10}%`,
                top: `${26 + leafIndex * 12}%`,
                width: "18%",
                height: "9%",
                transform: `rotate(${leafIndex % 2 === 0 ? -30 : 22}deg)`,
                background: leafIndex === 1 ? gold : pearl
              }}
            />
          ))}
        </>
      );
    case "solar-flare":
      return (
        <>
          <div
            className="absolute inset-x-[6%] top-0 h-[44%]"
            style={{
              background:
                "radial-gradient(circle at 50% 6%, rgba(255,245,210,0.9) 0%, rgba(255,245,210,0) 38%)"
            }}
          />
          <div
            className="absolute left-[8%] top-[16%] h-[42%] w-[34%] rotate-[20deg] rounded-full"
            style={{ background: `linear-gradient(180deg, ${gold}, transparent)` }}
          />
          <div
            className="absolute right-[10%] top-[12%] h-[48%] w-[38%] -rotate-[18deg] rounded-full"
            style={{ background: `linear-gradient(180deg, ${accentStrong}, transparent)` }}
          />
        </>
      );
    default:
      if (product.category === "Avant-Garde") {
        return (
          <div
            className="absolute inset-x-[10%] top-[24%] h-[20%] -rotate-[18deg] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${accentStrong}, transparent)` }}
          />
        );
      }

      if (product.category === "Signature") {
        return (
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 34% 24%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 26%)"
            }}
          />
        );
      }

      if (product.category === "Neon") {
        return (
          <div
            className="absolute right-[8%] top-[10%] h-[56%] w-[68%] rotate-[24deg] rounded-full"
            style={{ background: `linear-gradient(180deg, ${accentStrong}, transparent)` }}
          />
        );
      }

      return (
        <div
          className="absolute inset-x-[20%] top-[20%] h-[12%] rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${pearl}, transparent)` }}
        />
      );
  }
}

export function NailArtLayers({
  product,
  selectedFinish,
  index
}: {
  product: Product;
  selectedFinish: FinishPreviewId;
  index: number;
}) {
  return (
    <>
      {renderProductDesign(product, selectedFinish, index)}
      {selectedFinish !== "matte" ? (
        <div
          className="absolute inset-x-[18%] top-[7%] h-[42%] rounded-full blur-[1px]"
          style={{
            background:
              selectedFinish === "sheer"
                ? "linear-gradient(180deg, rgba(255,255,255,0.58), rgba(255,255,255,0.02))"
                : "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.06))"
          }}
        />
      ) : null}
      {selectedFinish === "chrome" ? (
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.08) 8%, rgba(255,255,255,0.7) 34%, rgba(255,255,255,0) 56%, rgba(255,255,255,0.35) 78%, rgba(255,255,255,0.08) 100%)"
          }}
        />
      ) : null}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            selectedFinish === "sheer"
              ? "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.12))"
              : "linear-gradient(180deg, rgba(75,33,49,0), rgba(75,33,49,0.12))"
        }}
      />
    </>
  );
}

export function NailPreviewOverlay({
  product,
  selectedFinish,
  selectedLength,
  compact = false
}: NailPreviewOverlayProps) {
  const shapeProfile = getShapeProfile(product.shape);
  const tryOn = product.tryOn!;
  const scaleFactor = compact ? 0.7 : 1;
  const background = getFinishBackground(product, selectedFinish);
  const containerStyle = {
    filter: `drop-shadow(0 16px 26px ${hexToRgba(tryOn.glowColor, compact ? 0.18 : 0.32)})`
  } satisfies CSSProperties;

  return (
    <div className="relative flex min-h-[8rem] items-end justify-center" style={containerStyle}>
      <div
        className="absolute inset-x-8 bottom-1/3 h-16 rounded-full blur-2xl"
        style={{ background: hexToRgba(tryOn.glowColor, compact ? 0.32 : 0.46) }}
      />
      <div className="relative flex items-end justify-center gap-2">
        {previewLengthHeights[selectedLength].map((height, index) => {
          const width = previewBaseWidths[index] * scaleFactor;
          const nailHeight = height * scaleFactor;
          const transform = `translateY(${index === 2 ? 0 : 4 * scaleFactor}px) rotate(${fanRotations[index]}deg)`;
          const nailStyle = {
            width,
            height: nailHeight,
            transform,
            borderRadius: shapeProfile.borderRadius,
            clipPath: shapeProfile.clipPath || undefined,
            background,
            boxShadow:
              selectedFinish === "matte"
                ? `0 10px 18px ${hexToRgba(tryOn.accentColor, 0.18)}`
                : `0 12px 22px ${hexToRgba(tryOn.accentColor, 0.28)}`
          } satisfies CSSProperties;

          return (
            <div
              key={`${product.id}-${selectedLength}-${selectedFinish}-${index}`}
              className="relative overflow-hidden"
              style={nailStyle}
            >
              <NailArtLayers product={product} selectedFinish={selectedFinish} index={index} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

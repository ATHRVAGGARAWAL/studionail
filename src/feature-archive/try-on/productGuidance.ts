import {
  type FinishPreviewId,
  type NailBedFit,
  type NailLength,
  type Product,
  type ProductFinishPreview,
  type ProductGuidance,
  type ProductTryOn,
  type StyleMood
} from "@/data/storefront";

export interface FitQuizProfile {
  nailBed: NailBedFit;
  desiredLength: NailLength;
  finishPreference: FinishPreviewId;
  styleMood: StyleMood;
}

interface FitQuizOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

interface FitQuizStep<T extends keyof FitQuizProfile> {
  key: T;
  title: string;
  hint: string;
  options: FitQuizOption<FitQuizProfile[T]>[];
}

const finishPresetMap: Record<FinishPreviewId, ProductFinishPreview> = {
  gloss: {
    id: "gloss",
    label: "Gloss",
    description: "Bright reflective shine with a glassy topcoat."
  },
  matte: {
    id: "matte",
    label: "Matte",
    description: "Soft velvet surface with a muted editorial finish."
  },
  chrome: {
    id: "chrome",
    label: "Chrome",
    description: "High-shift metallic glow for a statement flash."
  },
  sheer: {
    id: "sheer",
    label: "Sheer",
    description: "Translucent wash that keeps the look airy and light."
  }
};

const categoryTryOnColors = {
  Minimalist: {
    baseColor: "#d1adb0",
    accentColor: "#7f4b58",
    glowColor: "#f3d6dc"
  },
  "Avant-Garde": {
    baseColor: "#7487d9",
    accentColor: "#273884",
    glowColor: "#d9e0ff"
  },
  Neon: {
    baseColor: "#ff7a8a",
    accentColor: "#ff6b2d",
    glowColor: "#ffd2cf"
  },
  Signature: {
    baseColor: "#f1d3da",
    accentColor: "#a16977",
    glowColor: "#fff0f4"
  }
} as const;

const moodTagMap: Record<StyleMood, string[]> = {
  "Quiet luxury": ["quiet luxury", "minimal", "polished", "classic", "soft"],
  Statement: ["statement", "editorial", "bold", "dramatic", "graphic"],
  Bridal: ["bridal", "romantic", "soft", "pearl", "occasion"],
  Playful: ["playful", "vacation", "summer", "bright", "artful"]
};

export const FIT_PROFILE_STORAGE_KEY = "studionail-fit-profile";

export const fitQuizSteps: FitQuizStep<keyof FitQuizProfile>[] = [
  {
    key: "nailBed",
    title: "What best describes your nail bed?",
    hint: "We use this to recommend lengths and silhouettes that look proportional on hand.",
    options: [
      {
        value: "Petite",
        label: "Petite",
        description: "Narrower beds or shorter sidewalls."
      },
      {
        value: "Balanced",
        label: "Balanced",
        description: "Even proportions that can flex short to long."
      },
      {
        value: "Wide",
        label: "Wide",
        description: "Broader beds that suit softer or tapered balance."
      }
    ]
  },
  {
    key: "desiredLength",
    title: "Which length feels most like you?",
    hint: "This is your comfort zone for daily wear, photos, and typing.",
    options: [
      {
        value: "Short",
        label: "Short",
        description: "Low-maintenance and easy for everyday wear."
      },
      {
        value: "Medium",
        label: "Medium",
        description: "Balanced length with a styled finish."
      },
      {
        value: "Long",
        label: "Long",
        description: "More drama and a stronger editorial line."
      }
    ]
  },
  {
    key: "finishPreference",
    title: "What finish catches your eye first?",
    hint: "This controls how we prioritize finishes in your recommendations and try-on view.",
    options: [
      {
        value: "gloss",
        label: "Gloss",
        description: "Reflective, polished, and salon-fresh."
      },
      {
        value: "matte",
        label: "Matte",
        description: "Velvet texture with a cleaner edge."
      },
      {
        value: "chrome",
        label: "Chrome",
        description: "High-shine metallic or glass-like shift."
      },
      {
        value: "sheer",
        label: "Sheer",
        description: "Light, transparent, and airy."
      }
    ]
  },
  {
    key: "styleMood",
    title: "What mood are you dressing your nails for?",
    hint: "This helps us rank your edit beyond pure fit.",
    options: [
      {
        value: "Quiet luxury",
        label: "Quiet luxury",
        description: "Refined, neutral, and elevated."
      },
      {
        value: "Statement",
        label: "Statement",
        description: "Bold art, color, or shape impact."
      },
      {
        value: "Bridal",
        label: "Bridal",
        description: "Soft, luminous, and occasion-ready."
      },
      {
        value: "Playful",
        label: "Playful",
        description: "Color-pop, fun, and summer-forward."
      }
    ]
  }
];

function uniq<T>(items: T[]) {
  return Array.from(new Set(items));
}

function inferRecommendedLengths(shape: string): NailLength[] {
  const normalizedShape = shape.trim().toLowerCase();

  if (normalizedShape.includes("stiletto") || normalizedShape.includes("coffin")) {
    return ["Medium", "Long"];
  }

  if (normalizedShape.includes("square")) {
    return ["Short", "Medium"];
  }

  if (normalizedShape.includes("round") || normalizedShape.includes("oval")) {
    return ["Short", "Medium"];
  }

  return ["Short", "Medium"];
}

function inferNailBedFit(shape: string): NailBedFit[] {
  const normalizedShape = shape.trim().toLowerCase();

  if (normalizedShape.includes("stiletto")) {
    return ["Petite", "Balanced"];
  }

  if (normalizedShape.includes("almond")) {
    return ["Petite", "Balanced"];
  }

  if (normalizedShape.includes("coffin")) {
    return ["Balanced", "Wide"];
  }

  if (normalizedShape.includes("square")) {
    return ["Wide", "Balanced"];
  }

  return ["Balanced", "Wide"];
}

function detectFinishIds(finish: string): FinishPreviewId[] {
  const normalizedFinish = finish.trim().toLowerCase();
  const detected: FinishPreviewId[] = [];

  if (normalizedFinish.includes("matte")) {
    detected.push("matte");
  }

  if (
    normalizedFinish.includes("chrome") ||
    normalizedFinish.includes("glass") ||
    normalizedFinish.includes("shifting")
  ) {
    detected.push("chrome");
  }

  if (
    normalizedFinish.includes("sheer") ||
    normalizedFinish.includes("transparent") ||
    normalizedFinish.includes("pearl") ||
    normalizedFinish.includes("wash")
  ) {
    detected.push("sheer");
  }

  if (
    normalizedFinish.includes("gloss") ||
    normalizedFinish.includes("glaze") ||
    normalizedFinish.includes("iridescent")
  ) {
    detected.push("gloss");
  }

  if (detected.length === 0) {
    detected.push("gloss");
  }

  return uniq<FinishPreviewId>([...detected, "gloss", "matte", "sheer"]).slice(0, 3);
}

function inferStyleTags(product: Product) {
  const tags = [
    product.category.toLowerCase(),
    product.shape.toLowerCase(),
    product.finish.toLowerCase(),
    product.badge?.toLowerCase() ?? "",
    product.description.toLowerCase()
  ];

  if (product.category === "Minimalist") {
    tags.push("quiet luxury", "polished", "minimal", "classic");
  }

  if (product.category === "Avant-Garde") {
    tags.push("statement", "editorial", "graphic", "bold");
  }

  if (product.category === "Signature") {
    tags.push("bridal", "romantic", "soft", "occasion");
  }

  if (product.category === "Neon") {
    tags.push("playful", "vacation", "summer", "bright");
  }

  return uniq(tags.filter(Boolean));
}

function buildTip(product: Product, guidance: Omit<ProductGuidance, "tip">) {
  const firstLength = guidance.recommendedLengths[0]?.toLowerCase() ?? "balanced";
  const firstFit = guidance.nailBedFit[0]?.toLowerCase() ?? "balanced";

  return `${product.shape} works especially well for ${firstFit} nail beds and ${firstLength} to ${guidance.recommendedLengths.at(-1)?.toLowerCase() ?? "medium"} wear.`;
}

function buildGuidance(product: Product): ProductGuidance {
  const existing = product.guidance;
  const recommendedLengths = uniq(existing?.recommendedLengths?.length ? existing.recommendedLengths : inferRecommendedLengths(product.shape));
  const nailBedFit = uniq(existing?.nailBedFit?.length ? existing.nailBedFit : inferNailBedFit(product.shape));
  const styleTags = uniq(existing?.styleTags?.length ? existing.styleTags : inferStyleTags(product));
  const finishPreviewIds = uniq<FinishPreviewId>([
    ...(existing?.finishPreviews?.map((preview) => preview.id) ?? []),
    ...detectFinishIds(product.finish)
  ]);
  const finishPreviews = finishPreviewIds.map((finishId) => {
    const current = existing?.finishPreviews?.find((preview) => preview.id === finishId);
    return current ?? finishPresetMap[finishId];
  });

  const partialGuidance = {
    recommendedLengths,
    nailBedFit,
    styleTags,
    finishPreviews
  };

  return {
    ...partialGuidance,
    tip: existing?.tip?.trim() || buildTip(product, partialGuidance)
  };
}

function buildTryOn(product: Product): ProductTryOn {
  const existing = product.tryOn;
  const palette = categoryTryOnColors[product.category];

  return {
    baseColor: existing?.baseColor ?? palette.baseColor,
    accentColor: existing?.accentColor ?? palette.accentColor,
    glowColor: existing?.glowColor ?? palette.glowColor,
    defaultScale: existing?.defaultScale ?? 1,
    defaultRotation: existing?.defaultRotation ?? (product.shape.toLowerCase().includes("stiletto") ? -4 : 0),
    defaultOpacity: existing?.defaultOpacity ?? 0.88
  };
}

export function enrichProduct(product: Product): Product {
  return {
    ...product,
    guidance: buildGuidance(product),
    tryOn: buildTryOn(product)
  };
}

export function scoreProductForProfile(product: Product, profile: FitQuizProfile) {
  const guidance = product.guidance ?? buildGuidance(product);
  let score = 0;

  if (guidance.nailBedFit.includes(profile.nailBed)) {
    score += 4;
  }

  if (guidance.recommendedLengths.includes(profile.desiredLength)) {
    score += 3;
  }

  if (guidance.finishPreviews.some((preview) => preview.id === profile.finishPreference)) {
    score += 2;
  }

  const moodTags = moodTagMap[profile.styleMood];

  if (guidance.styleTags.some((tag) => moodTags.some((moodTag) => tag.includes(moodTag)))) {
    score += 2;
  }

  if (product.stock > 0) {
    score += 1;
  }

  return score;
}

export function getRecommendationReasons(product: Product, profile: FitQuizProfile) {
  const guidance = product.guidance ?? buildGuidance(product);
  const reasons: string[] = [];

  if (guidance.nailBedFit.includes(profile.nailBed)) {
    reasons.push(`balanced for ${profile.nailBed.toLowerCase()} nail beds`);
  }

  if (guidance.recommendedLengths.includes(profile.desiredLength)) {
    reasons.push(`${profile.desiredLength.toLowerCase()} length friendly`);
  }

  const finishPreview = guidance.finishPreviews.find((preview) => preview.id === profile.finishPreference);

  if (finishPreview) {
    reasons.push(`${finishPreview.label.toLowerCase()} finish available`);
  }

  const moodTags = moodTagMap[profile.styleMood];

  if (guidance.styleTags.some((tag) => moodTags.some((moodTag) => tag.includes(moodTag)))) {
    reasons.push(`${profile.styleMood.toLowerCase()} mood match`);
  }

  return reasons.slice(0, 3);
}

export function getRecommendedProducts(products: Product[], profile: FitQuizProfile, limit = 3) {
  return [...products]
    .sort((left, right) => scoreProductForProfile(right, profile) - scoreProductForProfile(left, profile))
    .slice(0, limit);
}

export function getProfileSummary(profile: FitQuizProfile) {
  return `${profile.nailBed} nail bed, ${profile.desiredLength.toLowerCase()} length, ${finishPresetMap[profile.finishPreference].label.toLowerCase()} finish.`;
}

export function getFinishPreview(product: Product, finishId: FinishPreviewId) {
  return (product.guidance ?? buildGuidance(product)).finishPreviews.find((preview) => preview.id === finishId) ?? finishPresetMap.gloss;
}

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3
    ? normalized
        .split("")
        .map((value) => `${value}${value}`)
        .join("")
    : normalized;
  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

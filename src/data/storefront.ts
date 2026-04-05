export type ProductCategory = "All" | "Minimalist" | "Avant-Garde" | "Neon" | "Signature";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  badge?: string;
  category: Exclude<ProductCategory, "All">;
  shape: string;
  finish: string;
  description: string;
  image: string;
  reviewCount: number;
}

export interface ShapeCollection {
  id: string;
  name: string;
  vibe: string;
  image: string;
}

export interface EditorialPost {
  id: string;
  title: string;
  caption: string;
  image: string;
  accent: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  image: string;
}

export interface Enhancement {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: "sparkles" | "droplets" | "palette";
}

export const shapeCollections: ShapeCollection[] = [
  {
    id: "stiletto",
    name: "Stiletto",
    vibe: "Bold and sharp",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAygj4NsbWwVi3l4rQIFmatfuSVKVwv7i4jll75tolLqEETKpVxZTFWFwFKw1W95Bn75LP6i1k3VIFiqEFOdk1h0LTe4rXhLdTkZuTSpcrnEmtMalj0t8XYeqeJ-s2Hdx7wgsL1dKYFLs9PF3O7agkBA2x3OZ_W5_dl7tibfKaX4D2x_MSTAjVarCakA2aQLnmeCQ_E7gbyUul2PRCv9LaYw5cELju0OVtFJp7cq7ALwrYevg423Qrq6ZpOP286lCxTwniB4RfbLfH"
  },
  {
    id: "almond",
    name: "Almond",
    vibe: "Classic grace",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9lhUNS4MqtvLnHGFN9lpB18fMYci9jxyUJurnw-PAZioOYTAkAqGwSUe21WO3HQ1SjoFCc76E2DsyjwwOB1jTVcrenr6bmSUXatp7L3eiFdxCM-5hx78SjiY9381daPgUhvluOwK6cdCa0sGgK8BbffkMSHJJjv36sys4avb6_OA31DdPNk_Ojir4OkzSUeSzbDDkRjZyh3Ctlek0kVTqF044FKrY0bDzGLN_dacCqRDuRRdyYrMsGLuUKx5CznXfMkHKxhbWHo2-"
  },
  {
    id: "coffin",
    name: "Coffin",
    vibe: "Modern edge",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ0DGNeON4ioHEvuITaYZl6iBlf_RgrWkEfwHTG6H3UmusrtQ-Q3aEylxhOiBTNLIvnduCl6bkx0_YGu1uRyZMp4S7niL29Q64xfE1QneYTcOFNOWGGbtbvsgAF18-mz6C8dDZ97AdYETpg_AjxItsV4qWAlXkKwpDrVEjrAco78IaDlk6-8zXVaqbBpD9D4mksVuq9VCCglOLyUQVRMuL4CMnnH2WXkNsdJADm562CciTUSB68Bck9kRaKFWrubgFyOY8yf2JWwFP"
  },
  {
    id: "round",
    name: "Round",
    vibe: "Soft everyday",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCp7b0oBMlhWxJ6i5h1FJCkF6RxVbZwq_BZ3-2gxGH4MmUNB9RZZ4TJTYN4ylXINe32N38UPO5YV2GJ1E21mfZq-wgD-70cVxsvu2XMKxmhmtO0fmph8Vn9AmDmRiAsqowl-gyYGpsZOazHZaZBPtOA_eHZXQVc__SR_XGVe84p-c28X1ZpSFDAXIuBd6u2fSNqwFNyOl8Cl0oY2PSrm2QORkCHxwAiJS3-KkEIiYubq8COJ1WqWaRz_fwvmLcMiQIiilnZ8yzyGHc6"
  }
];

export const products: Product[] = [
  {
    id: "crimson-velvet",
    name: "Crimson Velvet Gloss",
    price: 42,
    stock: 7,
    badge: "New",
    category: "Neon",
    shape: "Almond",
    finish: "Multi-dimensional glass",
    description: "High-gloss coral pigment with a mirror finish and an editorial shape.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpduio6wk0YFjuwqhpDeYkppyqBSScwvuGUqKkra1N5gLbzreVfjeLOLygBjg8naPKyhv1AvsAIw9zLwRh6ZBO5IOjKEQYlP4CVNt4PwP27E2uM1yfklzR8O9_RfYS0Pa6ODRx9AcEoJ4zGmeRaPizpgmmN44rwv6xZYKdbChHIVCOG8nyKpSuF8LNdMgX5bSYfZezdtksXdXv1WbjM78jXgD9XHqiYpum-i0-mWJf0Ye9Kq5LhQAiVvyljAYkp5S4KIeomGQdzghy",
    reviewCount: 48
  },
  {
    id: "gilded-rose",
    name: "Gilded Rose Petal",
    price: 38,
    stock: 5,
    category: "Signature",
    shape: "Stiletto",
    finish: "24k gold leaf",
    description: "Soft rose base with hand-laid metallic flakes for a polished bridal glow.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-GRrEVT_gcJGjQAtk5nr9oni7UPMtcOQdZUNtV8lQZ7B-Dcq8oMdi5Vwq8_98jZpvt-cW0_5kuj0bM6nq00bU6zjW98pFmO8C83-O0tc5ouoA-1tmRO5Prqr9fKjjIgjowZ-5j3pBxg3eQvMPvrEAzPio9VH6iuafEgzyePs8DskII8t3TWz1BEYUFzHEP0aLbyNpU9PGHwagqtSSOx-uKiUh5yGiaAFDQYA6EX7wyKjVHezxgSQwjDHvRO4jAFPtpt8nepYnU7Ny",
    reviewCount: 36
  },
  {
    id: "azure-electric",
    name: "Azure Electric Fluid",
    price: 45,
    stock: 4,
    badge: "Best Seller",
    category: "Avant-Garde",
    shape: "Coffin",
    finish: "Shifting cobalt pigment",
    description: "Graphic blue chrome art with fluid highlights for bold camera-ready looks.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnXsiC_sEwxwR6hQtuAkJXf9SkNguZfbumJwoA25rc-6LIOwHdbIRgOlk8xrzlTTeOWDyPTMX_4OMtq-ZuxXGjYhvX2ValJxea13W_t5ehjADJl3TcvnSjEJF6ewYrbpiV_CM_G4MzHaDLAAkMk8Z88ZZ_6P9l1H1GsgEci5FyXvrii25ri-BNuAktHEw6Cy8noDv0Yyb9Q0HnOQ_UwjJCKyTxuTQdqG1FkZQb9LTi-M7BQIaVFYsdPcmnYsoMdFkcGnOog2Xpxyus",
    reviewCount: 71
  },
  {
    id: "onyx-geometry",
    name: "Onyx Geometry",
    price: 35,
    stock: 12,
    category: "Minimalist",
    shape: "Round",
    finish: "Architectural matte",
    description: "Clean nude structure with sculpted geometry for everyday polish.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDi6iZ8HjE8DwLoF3zkkB4BaeidqgFHDObK9Yi7boZMyKwZIBW5BSpeKDX3gke2yUdx_LcF05RjeJ3Xq_C6NPd6Cpx0gh5-w5awRkoiEEkXiNFJCLa4Rmata0nLBZuH6Qs_HLam43RURSzabp0z6LQolSkfRQnF_r8lbAjwLRCTPXPSKU4tDL4fOptswHaKlYSO9HxN4inWvmvn_VAtRLd_h60JRzn7lyp3L4IFjE9dd0mjj0K5GSj4aWM5GIYzaqtEUjaAIJtT5Fpi",
    reviewCount: 29
  },
  {
    id: "lunar-pearl",
    name: "Lunar Pearl Glaze",
    price: 39,
    stock: 6,
    category: "Signature",
    shape: "Almond",
    finish: "Iridescent pearl",
    description: "Moonlit shimmer layered over a soft blush base with an elevated bridal glow.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2b_AIyOW1zuYXS3QYrzPoUXn3EhgV_2UeKi1bigISn7IgU-44_uuV_JT_gOnVkmEtr2GRWrtSIZqjBVn03tQn-N-U7Feptv_aRdHGPaMZwD2DhyPRpLHqSyprnpL8C6NJVbQ0rOFIn-Dw7qW1UgzVtu8DTg7xxnuEo2-dAq0EgDReWmLAKiXFSubE2O1J6gtyJg_HyvVYAbTTi1_0tDDKww2JzIdyXRbwpvVL4iNOOsIekQZGMgwCvIUVk3ETYk3BDZ3qh-of4HpO",
    reviewCount: 33
  },
  {
    id: "violet-whisper",
    name: "Violet Whisper",
    price: 40,
    stock: 3,
    category: "Avant-Garde",
    shape: "Oval",
    finish: "Watercolor wash",
    description: "A soft purple gradient with painterly details for editorial evening wear.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9Eh_Gvr_RSz6XhkG8RYn_ffNSlfWeZLy6Ff4yU0QxGmk3gRbDFjF9cwohAIbrVe5OraNrGeFoWhxw6PEIXs57zfhS3nZgmlvXBR3e091DJjy8qC3OAFTALty_a4ECmbC3HpP0QYpYX9PjX39rmMNefW9fHYGmHiFyHBNEvsnjh2bYUurjWGYJtvTFOItCcAx0eUh5QeDnrPT3d1Vi5KPHQtErEr9x5HN_vXhz1b5zBMcyXL49MgIXhG0zJccVNPCbdD_TsYENXZvY",
    reviewCount: 44
  },
  {
    id: "botanical-hunter",
    name: "Botanical Hunter",
    price: 44,
    stock: 2,
    badge: "Editors",
    category: "Minimalist",
    shape: "Short square",
    finish: "Gloss forest detail",
    description: "Deep green lacquer with hand-painted gold floral accents and soft shine.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBuhjG5usVEdORQV2qbnb5inLhLKA9NnqP4mFIcLUc8wIckFTgPz7axAUSyhlDnR4fRbA-NJPn_zokDeAa8_8DtEzknVL9mWDEYXLmimyCa7qysgTIrh6WzaGkEbjqx_nySloqbKmRNypsm_aaD1-JjU7Brk4xQ5W6a8Xg4ZQLZ4EghvMb_aJeADaccGcqltSkpssDqler_njS2PyEBoGNTj4sa6g-1r8u1PI48I8_jS1BFvw1ooDDc4ElUnaWCxWfSAzkndF1XKryO",
    reviewCount: 19
  },
  {
    id: "solar-flare",
    name: "Solar Flare Glass",
    price: 42,
    stock: 8,
    category: "Neon",
    shape: "Round",
    finish: "Transparent coral",
    description: "A vibrant orange-gold wash that feels bright, glossy, and summer ready.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNj_FJ_NKf-2koTXsr_aCkRZHHM7Hs9f4Pq2ynXUv4Iji__1Ob_tLJEXeGlq2UfBwn7U1Zd6aNxH7UoMbBA3MpzkNi8oFfljA3JUEwFxIJgF7RC6AOwi7XJLxILDrSmjSc90DKTXa0Be4VfNDNkFN-jjdxF1ljgmZST1NPoilVkWrG9ysvdvDbywGNfA_FtkYGwdC_j7olI2SyRd4XV85Xhx6rBj_URMvheL55_1gemSIjpPvR3b0V_VbmVSeNnyZdXSviYCrO3dfv",
    reviewCount: 26
  }
];

export const editorialPosts: EditorialPost[] = [
  {
    id: "editorial-01",
    title: "Backstage color story",
    caption: "High-shine coral polish styled like a cover shoot, now translated into wearable press-on sets.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5exJje8FHzHQSq-0cRny6K8LYwUSRttTiTfKLeXOq_hseO1usQHDYmHXJ_AM4ndfUy6Yu_YpvE7p9I5n8TmLIe5so0bybPmk_GkJVtVtn_jfyBfm4PIMufRI1csIbXKvibnJ_uKyQPePTKw48ZxwJLZT2iEV2_M8dQauGsroiADmcvX2w5zDEB0VP4fYnC27zprwee_f0l6RaCZPZOsD22VgUdfx53flFzcJ-jQ_1xNTbXgkq_tMYiMwne5uiBOuRiR8UArz1s7mx",
    accent: "Cover moment"
  },
  {
    id: "editorial-02",
    title: "Iridescent close-up",
    caption: "Oil-slick shimmer and soft lighting that inspired this season's chrome finishes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDm3-dwr6qswUwLvgTdY6BM6qBE53_nPY0TJOqUib0xxfjxgYv23W4qJ-iY0CYwyzkU-OiomtDT8S4mbDfWos_MwSnrAiAA_Af2vxkpIPzHJ01pmxsiKhWlLMaoeUmW2fJUOFs2V5sZ6uB28G2cya9k9emwRagzhj1xM8l-bsZWIlFL7Tzd7N7l4GEq1YLSFQqwZZ7D5ELsePBZjt0LYcr4lXVXNzeTtiJ8i_ZZRAyWf25PkRxPWEHG5hBcXAlR_Xr3hD1vSxeF_tU4",
    accent: "Reel preview"
  },
  {
    id: "editorial-03",
    title: "Tropical flash",
    caption: "Electric pink and citrus yellow details translated into a bright drop for summer weekends.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8jZOsNbJ-4GZiVo90lpdBPYFD_nJkbw5gcTLKjoJzWnTH1K14QWoEj8LLtPZ_aK7rewe0Ayn4FxgIl6tGFHCz18FrY35uq5Dg1fLyJRJ7-yEPHb06gIpelq3rXGue0ty_64v04LgWQlRNq2tT4vE6lTsHgZWfuuSwb1pk0Jw5lW2OQB-z4xCI3XkmuFJY2nE4Ls6HgAh3TkSrH7Zk4_ll5UpdvGFpygNmyTbu-1CNYzmC3ISjxR58ROvDTrlDV2I-Q0GSUhWzDMil",
    accent: "Summer drop"
  },
  {
    id: "editorial-04",
    title: "Set layout",
    caption: "A scroll-friendly grid of press-on sets, styling tools, and tonal shadows for the feed.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeQzlxQB8YriPEug8RMtFquV5tFQUODzUdAT_tbDq02si3boQy4jYeHgRIUr1nUmtg9j54KzFr7kfv2ABfZEbQu2zDrnTlUgkGD87S6pMpvEiZS_u-u-I59z87QX7hI66g-ZAGl3jBUU-sA0ERzUBnJInUz6LmO7vzplP2HbaVAmSxEF2LQx5ewJpOjC2yAM_ibptR28HuH7KvMrQ2fDqnBXr625XmF5sIdnqmokmLnKEGAI0gYEdDUtAiLjm7tYMwF2yUFU-apQ9l",
    accent: "Studio flatlay"
  }
];

export const services: Service[] = [
  {
    id: "electric-couture",
    name: "Electric Couture",
    price: 85,
    duration: 60,
    description: "Full sculpting set with high-gloss finish and custom pigment mixing.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3dhfx0zSI5fHxNdJp9BsyBWRv88mReib2IvjHvDu9uHiBVj7Q8RjRwIq505RmzyRyUnPZEPt_Wi0wdmswuEn8PWJVJtmY4km-PYgRjUfQt_7GAFd2SyQ9ZAqLWEFHArYl8beDUi3FYBNCKK4ntXxqcw8hCgjY1jwg9TpylZeG7WhWLcpsbc9iB4yiKgdGaL7S4wlC8tmyhCMlpN4NgW2c41HStZKOyzdrbzBHB9btP3PKD-sexkuEbAZ93eKSBGaVSdkelfgszzUK"
  },
  {
    id: "minimalist-zen",
    name: "Minimalist Zen",
    price: 65,
    duration: 45,
    description: "Organic nail shaping with breathable polish and botanical cuticle care.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyOcWCNUe-S7xDX_QZxP30ciSmGn76DeTCbGlJF9oQC54R5B0tc8s97ho3vGNktsQly-LveM_rvgS85l3drTF8a7CTrgA-JdccAyFkbBmMvDsMgSH4vJUQNECfKhWE5KIeC4IXhSJn24oOOecqflWKv3UAxtW1FwwD0H4tpcSxDU4O2PAjKHY_BxvGcp-76fPbeAQdNyWk46LcIRi9FBR8Y582LbJSGBz89y0fbX0IiVHQv8a3nhkuq0OC1uoJpwa_ufGPQbmYKe9b"
  },
  {
    id: "avant-garde-set",
    name: "Avant-Garde Set",
    price: 120,
    duration: 90,
    description: "Structural 3D art and metallic overlays for a bold editorial look.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRzuTIzNEVjeh_FlNkn10CRDsfixsletxtCDcm2Qq3FBfvRSXweiek8UQQUlJzbPXK5pNhU9MVtX9B8eKQKi385DTxty8on6QNfjaBdV_pekBNp6mOt1Pn6lk4x8XAt5rx64lwAJE0T3fOdOgsHF_mg0cfxbQhpdbNOAsh0UP4HtkYAWvBaEx5zs0P69ZsqwtCV2LUKRSwnY9Gl3NyGhe8M2jF6cjpMC1cPXPNn5uwhgarTj9EK-Gxi1qhp2yqJT_0I4fWPGY3JBOi"
  }
];

export const enhancements: Enhancement[] = [
  {
    id: "silk-wrap",
    name: "Silk Wrap",
    description: "Strengthening",
    price: 15,
    icon: "sparkles"
  },
  {
    id: "paraffin-dip",
    name: "Paraffin Dip",
    description: "Deep hydration",
    price: 20,
    icon: "droplets"
  },
  {
    id: "nail-art",
    name: "Nail Art",
    description: "2 finger focus",
    price: 25,
    icon: "palette"
  }
];

export const bookingSlots = ["10:00", "11:30", "1:00", "2:30", "4:00", "6:00"];

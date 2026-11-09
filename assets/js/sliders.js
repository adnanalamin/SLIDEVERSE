/* SLIDEVERSE catalogue. To add a slider: append one object — the site renders it automatically.
   kind -> transition style (.k-* in style.css). slides -> [title, subtitle, css background]. */
window.SLIDERS = [
  {
    id: "001",
    title: "Minimal Clean Slider",
    category: "Minimal",
    kind: "minimal",
    technologies: ["HTML / CSS / JavaScript"],
    tags: ["Responsive", "Animated", "Touch"],
    description: "Quiet, typographic slides with a soft sideways glide.",
    slides: [
      [
        "Less, but better",
        "Whitespace does the talking",
        "linear-gradient(135deg,#eef0f6,#cfd5e6)",
      ],
      [
        "Calm motion",
        "One gentle easing curve",
        "linear-gradient(135deg,#e8f4f2,#bfe3de)",
      ],
      [
        "Built to last",
        "Plain HTML, CSS and JS",
        "linear-gradient(135deg,#f1ecfb,#d8cbf6)",
      ],
    ],
  },
  {
    id: "002",
    title: "Creative Motion Slider",
    category: "Creative",
    kind: "motion",
    technologies: ["HTML / CSS / JavaScript"],
    tags: ["Animated", "Touch", "Responsive"],
    description: "Slides sweep in with a diagonal wipe and scale.",
    slides: [
      [
        "Move it",
        "Diagonal wipe transition",
        "linear-gradient(120deg,#ff6a88,#8b6cff)",
      ],
      [
        "Flow",
        "Scale and slide together",
        "linear-gradient(120deg,#65e3d9,#3a5bff)",
      ],
      [
        "Spin up",
        "Energy without noise",
        "linear-gradient(120deg,#ffb86c,#ff4d8d)",
      ],
    ],
  },
  {
    id: "003",
    title: "Glassmorphism Slider",
    category: "Glassmorphism",
    kind: "glass",
    technologies: ["HTML / CSS / JavaScript", "Tailwind CSS"],
    tags: ["Responsive", "Touch"],
    description: "Frosted panels floating over a vivid backdrop.",
    slides: [
      [
        "Frosted",
        "Blur, borders and light",
        "radial-gradient(circle at 20% 20%,#8b6cff,transparent 55%),radial-gradient(circle at 80% 70%,#65e3d9,transparent 55%),#14182b",
      ],
      [
        "Layered",
        "Depth through transparency",
        "radial-gradient(circle at 70% 20%,#ff6a88,transparent 55%),radial-gradient(circle at 20% 80%,#8b6cff,transparent 55%),#14182b",
      ],
      [
        "Clear",
        "Readable over any colour",
        "radial-gradient(circle at 50% 50%,#3a8bff,transparent 60%),#14182b",
      ],
    ],
  },
  {
    id: "004",
    title: "3D Perspective Slider",
    category: "3D",
    kind: "threed",
    technologies: ["HTML / CSS / JavaScript"],
    tags: ["Animated", "Touch", "3D"],
    description: "Slides rotate in space using CSS perspective.",
    slides: [
      [
        "Depth",
        "rotateY with perspective",
        "linear-gradient(135deg,#2b1f6b,#8b6cff)",
      ],
      [
        "Angle",
        "Real 3D transforms",
        "linear-gradient(135deg,#0f4c5c,#65e3d9)",
      ],
      [
        "Space",
        "GPU-friendly motion",
        "linear-gradient(135deg,#5c1f4a,#ff6a88)",
      ],
    ],
  },
  {
    id: "005",
    title: "Image Gallery Slider",
    category: "Image Gallery",
    kind: "gallery",
    technologies: ["HTML / CSS / JavaScript", "Bootstrap"],
    tags: ["Responsive", "Touch", "Gallery"],
    description: "Crossfading gallery frames with a gentle zoom.",
    slides: [
      [
        "Dusk",
        "Gradient scenes, no image weight",
        "linear-gradient(180deg,#ff9966,#5b3b8c 70%,#1a1035)",
      ],
      [
        "Lagoon",
        "Crossfade with slow zoom",
        "linear-gradient(180deg,#7fe7d9,#2a6fa8 70%,#0b2540)",
      ],
      [
        "Meadow",
        "Swap in your own photos",
        "linear-gradient(180deg,#d9f27f,#3b8c5b 70%,#0e2b1b)",
      ],
    ],
  },
  {
    id: "006",
    title: "Product Showcase Slider",
    category: "Product",
    kind: "product",
    technologies: ["HTML / CSS / JavaScript", "React"],
    tags: ["Responsive", "Card", "Touch"],
    description: "Product cards with a lifted focus item.",
    slides: [
      [
        "Aero Lamp",
        "Warm light, cool design",
        "linear-gradient(135deg,#232846,#3a3f6e)",
      ],
      [
        "Pulse Watch",
        "Track what matters",
        "linear-gradient(135deg,#1d3b3a,#2f6f6a)",
      ],
      [
        "Nimbus Chair",
        "Sit differently",
        "linear-gradient(135deg,#3b2540,#6a3f73)",
      ],
    ],
  },
  {
    id: "007",
    title: "Typography Slider",
    category: "Typography",
    kind: "type",
    technologies: ["HTML / CSS / JavaScript"],
    tags: ["Animated", "Responsive"],
    description: "Oversized words that rise into place.",
    slides: [
      [
        "Bold.",
        "Words as the visual",
        "linear-gradient(135deg,#111522,#1b2036)",
      ],
      [
        "Loud.",
        "Scale creates hierarchy",
        "linear-gradient(135deg,#171b29,#241c46)",
      ],
      ["Clear.", "Contrast first", "linear-gradient(135deg,#0d1020,#10303a)"],
    ],
  },
  {
    id: "008",
    title: "Parallax Hero Slider",
    category: "Hero",
    kind: "parallax",
    technologies: ["HTML / CSS / JavaScript", "Tailwind CSS"],
    tags: ["Parallax", "Responsive", "Touch"],
    description: "Full-bleed hero with layered depth on pointer move.",
    slides: [
      [
        "Beyond the fold",
        "Layers drift at different speeds",
        "linear-gradient(160deg,#0b1030,#3b2a8c 60%,#8b6cff)",
      ],
      [
        "Horizon",
        "Move your pointer",
        "linear-gradient(160deg,#071a22,#0f5c66 60%,#65e3d9)",
      ],
      [
        "Aurora",
        "Subtle, never dizzy",
        "linear-gradient(160deg,#1a0b30,#7a2a8c 60%,#ff6a88)",
      ],
    ],
  },
];
window.CATEGORIES = [
  "Minimal",
  "Modern",
  "Animated",
  "3D",
  "Glassmorphism",
  "Neumorphism",
  "Image Gallery",
  "Product",
  "Card",
  "Hero",
  "Vertical",
  "Horizontal",
  "Parallax",
  "Typography",
  "Creative",
  "Experimental",
];
window.TECHS = [
  "HTML / CSS / JavaScript",
  "React",
  "Tailwind CSS",
  "Bootstrap",
];

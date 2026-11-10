/* SLIDEVERSE catalogue — currently one component.
   To add a slider later: create /your-slider/ with index.html (+ css/, js/, assets/) and append one object below.
   demo   -> relative folder of the standalone component (Live Demo, GitHub folder and the preview all use it)
   files  -> [label, path relative to demo] — the View Code tabs fetch these real files
   slots  -> one entry per image slot of the image manager: [name shown in the manager] (image N -> slot N) */
window.SLIDERS = [
 {id:"001",title:"Product Showcase Slider",category:"Product",technologies:["HTML / CSS / JavaScript"],
  tags:["Responsive","Card","Touch","Keyboard","Infinite Loop"],
  description:"E-commerce product carousel with infinite looping, drag and swipe, keyboard control, wishlist, cart and quick view.",
  demo:"product-showcase-slider/",
  files:[["HTML","index.html"],["CSS","css/style.css"],["JavaScript","js/script.js"]],
  slots:["Aurora Pro Wireless Headphones","Pulse Series 7 Smart Watch","Stride Runner Sneakers","Atlas Everyday Backpack","Vista X100 Mirrorless Camera","Meridian Polarized Sunglasses","Nova 12 Smartphone","Echo Cube Portable Speaker"],
  thumb:"assets/images/screenshot-desktop.png"}
];

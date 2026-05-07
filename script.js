// Simple Icons CDN (jsDelivr) slugs + brand hex color shown on white badge
// Brands without a Simple Icons entry get an inline SVG wordmark instead
const brandConfig = {
  "Samsung":   { si: "samsung",   color: "1428A0" },
  "LG":        { si: "lg",        color: "A50034" },
  "Whirlpool": { si: "whirlpool", color: "003DA5" },
  "Bosch":     { si: "bosch",     color: "EA0016" },
  "IFB":       { si: null,        color: "004B87" },
  "Haier":     { si: "haier",     color: "0A3D91" },
  "Panasonic": { si: "panasonic", color: "003087" },
  "Godrej":    { si: null,        color: "1D7B3E" },
  "Voltas":    { si: null,        color: "E30613" },
  "Daikin":    { si: "daikin",    color: "0097D5" },
  "Sony":      { si: "sony",      color: "000000" },
  "Hitachi":   { si: "hitachi",   color: "CF0A2C" }
};

const brands = Object.keys(brandConfig);

const serviceNames = [
  "Washing Machine", "Refrigerator", "Air Conditioner",
  "Microwave", "Oven", "Dishwasher"
];

function makeSvgDataUri(name, hex) {
  const len = name.length;
  const fs  = len <= 3 ? 22 : len <= 5 ? 17 : len <= 7 ? 13 : 10;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">` +
    `<text x="40" y="40" font-family="Arial Black,sans-serif" font-weight="900" ` +
    `font-size="${fs}" fill="#${hex}" text-anchor="middle" dominant-baseline="middle">` +
    `${name.toUpperCase()}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function buildBrandLogo(brand) {
  const cfg      = brandConfig[brand] || { si: null, color: "1E3A8A" };
  const svgUri   = makeSvgDataUri(brand, cfg.color);
  const primary  = cfg.si
    ? `https://cdn.simpleicons.org/${cfg.si}/${cfg.color}`
    : svgUri;

  return `<div class="fx-brand-logo">
    <div class="fx-logo-badge">
      <img src="${primary}" alt="${brand}" loading="lazy"
           onerror="this.onerror=null;this.src='${svgUri}'" />
    </div>
    <span>${brand}</span>
  </div>`;
}

function initBrands() {
  const topTrack = document.querySelector(".fx-marquee-right .fx-marquee-track");
  const botTrack = document.querySelector(".fx-marquee-left .fx-marquee-track");
  const doubled = [...brands, ...brands];
  const reversedDoubled = [...brands].reverse().concat([...brands].reverse());
  topTrack.innerHTML = doubled.map(buildBrandLogo).join("");
  botTrack.innerHTML = reversedDoubled.map(buildBrandLogo).join("");
}

function initAppliances() {
  const select = document.getElementById("appliance");
  [...serviceNames, "Other"].forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

function initScrollReveal() {
  const els = document.querySelectorAll(".fx-reveal");
  const io = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.12 }
  );
  els.forEach(el => io.observe(el));
}

let currentSlide = 0;

function initSlider() {
  const track = document.querySelector(".fx-track");
  const dots = document.querySelectorAll(".fx-dot");
  const total = dots.length;

  function goTo(i) {
    currentSlide = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }

  dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));
  setInterval(() => goTo((currentSlide + 1) % total), 5000);
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function initScrollButtons() {
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => scrollToSection(btn.dataset.scroll));
  });
}

function initForm() {
  const form = document.getElementById("bookingForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    btn.textContent = "Sending…";
    btn.disabled = true;

    const payload = {
      name:      document.getElementById("name").value.trim(),
      email:     document.getElementById("email").value.trim(),
      phone:     document.getElementById("phone").value.trim(),
      appliance: document.getElementById("appliance").value,
      issue:     document.getElementById("issue").value.trim(),
    };

    try {
      const res  = await fetch("/api/booking", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        btn.textContent = "✓ Request received!";
        form.reset();
        setTimeout(() => {
          btn.textContent = "Request Service";
          btn.disabled = false;
        }, 4000);
      } else {
        btn.textContent = data.message || "Something went wrong. Try again.";
        setTimeout(() => {
          btn.textContent = "Request Service";
          btn.disabled = false;
        }, 3000);
      }
    } catch {
      btn.textContent = "Network error. Try again.";
      setTimeout(() => {
        btn.textContent = "Request Service";
        btn.disabled = false;
      }, 3000);
    }
  });
}

function initCopyright() {
  const el = document.getElementById("copyright");
  if (el) el.textContent = `© ${new Date().getFullYear()} Fixora. All rights reserved.`;
}

document.addEventListener("DOMContentLoaded", () => {
  initBrands();
  initAppliances();
  initScrollReveal();
  initSlider();
  initScrollButtons();
  initForm();
  initCopyright();
});

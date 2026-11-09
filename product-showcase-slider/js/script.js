/* ==========================================================================
   SLIDEVERSE 02 — Product Showcase Slider
   Vanilla JavaScript (ES2020). No dependencies.

   1. Configuration       5. Store (cart + wishlist)   9. Slider
   2. Product data        6. Toasts                   10. Actions (event delegation)
   3. Utilities           7. Dialogs                  11. Init
   4. Markup / rendering  8. Cart + quick view UI
   ========================================================================== */
(() => {
  'use strict';

  /* 1. Configuration ------------------------------------------------------- */
  const CONFIG = Object.freeze({
    loop: true,               // infinite looping (needs more than 4 products)
    autoplay: false,          // off by default
    autoplayDelay: 4500,      // ms between slides when autoplay is on
    slideBy: 'page',          // 'page' = visible cards per click, or a number
    dragThreshold: 6,         // px before a pointer move counts as a drag
    swipeThreshold: 48,       // px needed to change slide on a slow swipe
    maxQty: 10,               // max units of one product in the cart
    toastDuration: 2800,      // ms
    maxToasts: 3,
    currency: 'USD',
    locale: 'en-US',
    storageKey: 'slideverse-02-showcase',
  });

  /* 2. Product data -------------------------------------------------------- */
  // `photo` is an Unsplash photo id; `fallback` is a local illustration shown
  // automatically if the remote image cannot be loaded.
  const PRODUCTS = [
    {
      id: 'aurora-pro', category: 'Headphones', name: 'Aurora Pro Wireless Headphones',
      photo: 'photo-1505740420928-5e560c06d30e', fallback: 'assets/images/headphones.svg',
      alt: 'Aurora Pro over-ear wireless headphones',
      rating: 4.8, reviews: 1284, price: 249, originalPrice: 329,
      description: 'Adaptive noise cancelling, 40-hour battery life and plush memory-foam cushions for all-day listening.',
    },
    {
      id: 'pulse-7', category: 'Smart Watches', name: 'Pulse Series 7 Smart Watch',
      photo: 'photo-1523275335684-37898b6baf30', fallback: 'assets/images/smartwatch.svg',
      alt: 'Pulse Series 7 smart watch',
      rating: 4.6, reviews: 892, price: 199, originalPrice: 249,
      description: 'Always-on display, built-in GPS, sleep tracking and a week of battery in a lightweight aluminium case.',
    },
    {
      id: 'stride-runner', category: 'Sneakers', name: 'Stride Runner Sneakers',
      photo: 'photo-1542291026-7eec264c27ff', fallback: 'assets/images/sneakers.svg',
      alt: 'Stride Runner performance sneakers',
      rating: 4.7, reviews: 2310, price: 129, originalPrice: null,
      description: 'A breathable knit upper and responsive foam midsole that keeps every run light and comfortable.',
    },
    {
      id: 'atlas-pack', category: 'Backpacks', name: 'Atlas Everyday Backpack',
      photo: 'photo-1553062407-98eeb64c6a62', fallback: 'assets/images/backpack.svg',
      alt: 'Atlas everyday backpack',
      rating: 4.5, reviews: 647, price: 89, originalPrice: 119,
      description: 'Water-resistant 24 L pack with a padded 16-inch laptop sleeve and a quick-access organiser pocket.',
    },
    {
      id: 'vista-x100', category: 'Cameras', name: 'Vista X100 Mirrorless Camera',
      photo: 'photo-1516035069371-29a1b244cc32', fallback: 'assets/images/camera.svg',
      alt: 'Vista X100 mirrorless camera',
      rating: 4.9, reviews: 418, price: 899, originalPrice: 999,
      description: '26 MP sensor, 4K video and fast hybrid autofocus in a compact, travel-ready magnesium body.',
    },
    {
      id: 'meridian-shades', category: 'Sunglasses', name: 'Meridian Polarized Sunglasses',
      photo: 'photo-1572635196237-14b3f281503f', fallback: 'assets/images/sunglasses.svg',
      alt: 'Meridian polarized sunglasses',
      rating: 4.4, reviews: 356, price: 79, originalPrice: null,
      description: 'Polarized UV400 lenses in a lightweight acetate frame with a classic, timeless silhouette.',
    },
    {
      id: 'nova-12', category: 'Smartphones', name: 'Nova 12 Smartphone',
      photo: 'photo-1511707171634-5f897ff02aa9', fallback: 'assets/images/smartphone.svg',
      alt: 'Nova 12 smartphone',
      rating: 4.7, reviews: 3092, price: 699, originalPrice: 799,
      description: 'A bright 6.5-inch OLED display, a pro-grade dual camera and all-day battery with fast charging.',
    },
    {
      id: 'echo-cube', category: 'Wireless Speakers', name: 'Echo Cube Portable Speaker',
      photo: 'photo-1608043152269-423dbba4e7e1', fallback: 'assets/images/speaker.svg',
      alt: 'Echo Cube portable wireless speaker',
      rating: 4.6, reviews: 1570, price: 119, originalPrice: 149,
      description: 'Room-filling 360-degree sound, IP67 water resistance and 20 hours of playtime on one charge.',
    },
  ];
  const PRODUCTS_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

  /* 3. Utilities ----------------------------------------------------------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const mod = (n, m) => ((n % m) + m) % m;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const money = new Intl.NumberFormat(CONFIG.locale, { style: 'currency', currency: CONFIG.currency, minimumFractionDigits: 0 });
  const integer = new Intl.NumberFormat(CONFIG.locale);

  const discountOf = (p) => (p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0);
  const imageUrl = (p, width) => `https://images.unsplash.com/${p.photo}?auto=format&fit=crop&w=${width}&q=80`;
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  const ICONS = {
    heart: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    bag: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="20 6 9 17 4 12"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    plus: '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    minus: '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    pause: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="9" y1="5" x2="9" y2="19"/><line x1="15" y1="5" x2="15" y2="19"/></svg>',
    play: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="7 4 20 12 7 20 7 4"/></svg>',
  };

  /* Image fallback: `error` doesn't bubble, so listen in the capture phase. */
  document.addEventListener('error', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
    if (img.dataset.failed === '1') {            // the local fallback failed too
      img.classList.add('is-broken');
      return;
    }
    img.dataset.failed = '1';
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.src = img.dataset.fallback;
  }, true);

  /* 4. Markup / rendering -------------------------------------------------- */
  const ratingMarkup = (p) => `
    <div class="rating">
      <span class="stars" style="--fill:${((p.rating / 5) * 100).toFixed(1)}%" role="img" aria-label="Rated ${p.rating} out of 5"></span>
      <span class="rating__value" aria-hidden="true">${p.rating.toFixed(1)}</span>
      <span aria-hidden="true">(${integer.format(p.reviews)})</span>
      <span class="sr-only">${integer.format(p.reviews)} reviews</span>
    </div>`;

  const priceMarkup = (p) => `
    <p class="price">
      <span class="sr-only">Current price </span><span class="price__now">${money.format(p.price)}</span>
      ${p.originalPrice > p.price
        ? `<s class="price__was"><span class="sr-only">Original price </span>${money.format(p.originalPrice)}</s>`
        : ''}
    </p>`;

  /** Renders one product card, wrapped in a slide <li>. */
  const renderProductCard = (p, i) => {
    const discount = discountOf(p);
    return `
    <li class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${PRODUCTS.length}" data-index="${i}">
      <article class="card" data-product-id="${p.id}">
        <div class="card__media">
          <img class="card__img"
               src="${imageUrl(p, 800)}"
               srcset="${imageUrl(p, 480)} 480w, ${imageUrl(p, 800)} 800w"
               sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
               alt="${escapeHTML(p.alt)}" width="800" height="800" decoding="async" draggable="false"
               data-fallback="${p.fallback}">
          ${discount ? `<span class="badge"><span class="sr-only">Save </span>-${discount}%</span>` : ''}
          <button type="button" class="wish" data-action="wishlist" aria-pressed="false"
                  aria-label="Save ${escapeHTML(p.name)} to wishlist">${ICONS.heart}</button>
          <button type="button" class="quick-add" data-action="add-to-cart"
                  aria-label="Add ${escapeHTML(p.name)} to cart">${ICONS.bag}<span>Quick add</span></button>
        </div>
        <div class="card__body">
          <p class="card__category">${escapeHTML(p.category)}</p>
          <h3 class="card__title">
            <button type="button" class="card__link" data-action="quick-view">${escapeHTML(p.name)}</button>
          </h3>
          ${ratingMarkup(p)}
          ${priceMarkup(p)}
        </div>
      </article>
    </li>`;
  };

  const renderProducts = (track) => {
    track.innerHTML = PRODUCTS.map(renderProductCard).join('');
  };

  /* 5. Store (cart + wishlist) -------------------------------------------- */
  const createStore = () => {
    const listeners = new Set();
    const cart = new Map();      // productId -> quantity
    const wishlist = new Set();  // productId

    const load = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey) || 'null');
        if (!saved || typeof saved !== 'object') return;
        Object.entries(saved.cart || {}).forEach(([id, qty]) => {
          if (PRODUCTS_BY_ID.has(id) && Number.isInteger(qty) && qty > 0) cart.set(id, Math.min(qty, CONFIG.maxQty));
        });
        (Array.isArray(saved.wishlist) ? saved.wishlist : []).forEach((id) => {
          if (PRODUCTS_BY_ID.has(id)) wishlist.add(id);
        });
      } catch { /* storage unavailable or corrupted: start empty */ }
    };

    const commit = () => {
      try {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify({ cart: Object.fromEntries(cart), wishlist: [...wishlist] }));
      } catch { /* private mode / quota: keep working in memory */ }
      listeners.forEach((fn) => fn());
    };

    load();

    return {
      subscribe: (fn) => listeners.add(fn),
      isWished: (id) => wishlist.has(id),
      toggleWish(id) {
        const added = !wishlist.has(id);
        if (added) wishlist.add(id); else wishlist.delete(id);
        commit();
        return added;
      },
      qty: (id) => cart.get(id) || 0,
      add(id) {
        const next = (cart.get(id) || 0) + 1;
        if (next > CONFIG.maxQty) return false;
        cart.set(id, next);
        commit();
        return true;
      },
      setQty(id, qty) {
        if (qty <= 0) cart.delete(id); else cart.set(id, Math.min(qty, CONFIG.maxQty));
        commit();
      },
      remove(id) { cart.delete(id); commit(); },
      clear() { cart.clear(); commit(); },
      items: () => [...cart].map(([id, qty]) => ({ product: PRODUCTS_BY_ID.get(id), qty })),
      count: () => [...cart.values()].reduce((sum, q) => sum + q, 0),
      subtotal: () => [...cart].reduce((sum, [id, q]) => sum + PRODUCTS_BY_ID.get(id).price * q, 0),
    };
  };

  /* 6. Toasts -------------------------------------------------------------- */
  const createToaster = (region) => {
    const dismiss = (toast, immediately = false) => {
      clearTimeout(toast._timer);
      toast.classList.remove('is-visible');
      if (immediately) { toast.remove(); return; }
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      setTimeout(() => toast.remove(), 500); // safety net (e.g. reduced motion)
    };

    const show = ({ message, actionLabel, onAction }) => {
      // Dialogs live in the top layer; host the region inside the open one so toasts stay visible.
      const host = [...document.querySelectorAll('dialog[open]')].pop() || document.body;
      if (region.parentElement !== host) host.append(region);

      while (region.children.length >= CONFIG.maxToasts) dismiss(region.firstElementChild, true);

      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span class="toast__icon">${ICONS.check}</span><p class="toast__msg">${escapeHTML(message)}</p>`;

      if (actionLabel) {
        const action = document.createElement('button');
        action.type = 'button';
        action.className = 'toast__action';
        action.textContent = actionLabel;
        action.addEventListener('click', () => { dismiss(toast, true); onAction?.(); });
        toast.append(action);
      }

      const schedule = () => { clearTimeout(toast._timer); toast._timer = setTimeout(() => dismiss(toast), CONFIG.toastDuration); };
      const hold = () => clearTimeout(toast._timer);
      toast.addEventListener('pointerenter', hold);
      toast.addEventListener('pointerleave', schedule);
      toast.addEventListener('focusin', hold);
      toast.addEventListener('focusout', schedule);

      region.append(toast);
      void toast.offsetWidth;           // commit initial styles so the entrance transition runs
      toast.classList.add('is-visible');
      schedule();
    };

    return { show };
  };

  /* 7. Dialogs ------------------------------------------------------------- */
  const createDialogs = (toastRegion) => {
    const openers = new WeakMap();
    const syncScrollLock = () =>
      document.documentElement.classList.toggle('has-dialog', Boolean(document.querySelector('dialog[open]')));

    const bind = (dialog) => {
      dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }); // backdrop click
      dialog.addEventListener('close', () => {
        if (dialog.contains(toastRegion)) document.body.append(toastRegion);
        syncScrollLock();
        const opener = openers.get(dialog);
        if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      });
    };

    return {
      bind,
      open(dialog, trigger) {
        if (dialog.open) return;
        openers.set(dialog, trigger || document.activeElement);
        dialog.showModal();
        syncScrollLock();
      },
      closeAll: () => document.querySelectorAll('dialog[open]').forEach((d) => d.close()),
    };
  };

  /* 9. Slider -------------------------------------------------------------- */
  const createSlider = ({ root, viewport, track, prevBtn, nextBtn, statusEl, autoplayBtn }) => {
    const originals = Array.from(track.children);
    const total = originals.length;
    const loop = CONFIG.loop && total > 4;     // 4 is the largest "cards per view"
    let cloneCount = 0;
    let slides = originals;

    if (loop) {
      // One full set of clones on each side keeps the track filled at every position.
      const cloneSlide = (slide) => {
        const clone = slide.cloneNode(true);
        clone.classList.add('is-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('aria-label');
        clone.querySelectorAll('button').forEach((b) => { b.tabIndex = -1; });
        return clone;
      };
      track.prepend(...originals.map(cloneSlide));
      track.append(...originals.map(cloneSlide));
      cloneCount = total;
      slides = Array.from(track.children);
    }

    let perView = 1;
    let gap = 0;
    let step = 0;            // width of one card + gap, in px
    let index = 0;           // logical index of the first visible card
    let currentX = 0;        // last x applied to the track
    let mode = 'slider';     // 'slider' | 'grid'
    let settleTimer = 0;
    let autoTimer = 0;
    let suppressClick = false;
    let drag = null;
    const pauses = new Set();

    /* --- geometry ---------------------------------------------------------- */
    const page = () => (CONFIG.slideBy === 'page' ? Math.max(1, Math.floor(perView)) : Number(CONFIG.slideBy) || 1);
    const maxIndex = () => Math.max(0, Math.ceil(total - perView));
    const lowest = () => (loop ? -total : 0);
    const highest = () => (loop ? 2 * total - Math.ceil(perView) : maxIndex());
    const positionX = (i) => -(cloneCount + i) * step;
    const trackX = () => {
      const t = getComputedStyle(track).transform;
      return t && t !== 'none' ? new DOMMatrixReadOnly(t).m41 : 0;
    };

    /* --- navigation state -------------------------------------------------- */
    const setDisabled = (button, disabled) => {
      button.setAttribute('aria-disabled', String(disabled));
    };

    const updateNav = () => {
      const inGrid = mode === 'grid';
      setDisabled(prevBtn, inGrid || (!loop && index <= 0));
      setDisabled(nextBtn, inGrid || (!loop && index >= maxIndex()));
    };

    const announce = () => {
      const visible = Math.min(Math.max(1, Math.floor(perView)), total);
      const numbers = Array.from({ length: visible }, (_, k) => mod(index + k, total) + 1);
      const contiguous = numbers.every((n, k) => k === 0 || n === numbers[k - 1] + 1);
      const label = numbers.length === 1 ? `product ${numbers[0]}`
        : contiguous ? `products ${numbers[0]} to ${numbers[numbers.length - 1]}`
        : `products ${numbers.join(', ')}`;
      statusEl.textContent = `Showing ${label} of ${total}`;
    };

    /* --- moving the track -------------------------------------------------- */
    /** After a move into the clone area, jump (invisibly) to the equivalent real card. */
    const settle = () => {
      clearTimeout(settleTimer);
      if (!loop || (index >= 0 && index < total)) return;
      index = mod(index, total);
      currentX = positionX(index);
      track.classList.add('no-anim');
      track.style.transform = `translate3d(${currentX}px,0,0)`;
      void track.offsetWidth;
    };

    const render = (animate) => {
      const x = positionX(index);
      const duration = parseFloat(getComputedStyle(track).transitionDuration) * 1000 || 0;
      const willAnimate = animate && !reduceMotion.matches && duration > 0 && Math.abs(x - currentX) > 0.5;

      track.classList.toggle('no-anim', !willAnimate);
      track.style.transform = `translate3d(${x}px,0,0)`;
      currentX = x;
      clearTimeout(settleTimer);

      if (willAnimate) settleTimer = setTimeout(settle, duration + 150); // fallback if transitionend is missed
      else { void track.offsetWidth; settle(); }
      updateNav();
    };

    const goTo = (target, { animate = true, say = false } = {}) => {
      if (mode !== 'slider') return;
      index = clamp(Math.round(target), lowest(), highest());
      render(animate);
      if (say) announce();
    };

    const next = (say = true) => goTo(index + page(), { say });
    const prev = (say = true) => goTo(index - page(), { say });

    track.addEventListener('transitionend', (event) => {
      if (event.target === track && event.propertyName === 'transform') settle();
    });

    /* --- responsive measurement ------------------------------------------- */
    const measure = () => {
      const styles = getComputedStyle(root);
      perView = parseFloat(styles.getPropertyValue('--per-view')) || 1;
      gap = parseFloat(styles.getPropertyValue('--gap')) || 0;
      if (mode !== 'slider') return;
      step = slides[cloneCount].getBoundingClientRect().width + gap;
      index = clamp(index, lowest(), highest());
      render(false);
    };

    let resizeFrame = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    }).observe(viewport);

    /* --- pointer drag / touch swipe --------------------------------------- */
    const onPointerDown = (event) => {
      if (mode !== 'slider' || (event.pointerType === 'mouse' && event.button !== 0)) return;
      drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastT: performance.now(), v: 0, active: false };
      pause('drag');
    };

    const onPointerMove = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (!drag.active) {
        if (Math.abs(dx) < CONFIG.dragThreshold) return;
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; resume('drag'); return; } // vertical scroll intent
        drag.active = true;
        drag.originX = trackX();                                  // freeze the track where it is now
        drag.startIndex = Math.round(-drag.originX / step) - cloneCount;
        currentX = drag.originX;
        clearTimeout(settleTimer);
        track.classList.add('no-anim');
        track.style.transform = `translate3d(${currentX}px,0,0)`;
        viewport.classList.add('is-dragging');
        viewport.setPointerCapture(event.pointerId);
      }

      const now = performance.now();
      const dt = now - drag.lastT;
      if (dt > 0) drag.v = 0.7 * drag.v + 0.3 * ((event.clientX - drag.lastX) / dt);
      drag.lastX = event.clientX;
      drag.lastT = now;

      let x = drag.originX + dx;
      if (loop) {
        x = clamp(x, positionX(highest()), positionX(lowest()));
      } else {                                                    // rubber-band past the ends
        const minX = positionX(maxIndex());
        const maxX = positionX(0);
        if (x > maxX) x = maxX + (x - maxX) * 0.35;
        else if (x < minX) x = minX + (x - minX) * 0.35;
      }
      currentX = x;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    const finishDrag = (cancelled) => {
      const d = drag;
      drag = null;
      if (!d || !d.active) { resume('drag'); return; }

      viewport.classList.remove('is-dragging');
      suppressClick = true;                                       // the click that follows a drag is not a real click
      setTimeout(() => { suppressClick = false; }, 0);

      const dx = currentX - d.originX;
      const rawIndex = -currentX / step - cloneCount;
      const projected = rawIndex - (d.v * 160) / step;            // continue the flick for ~160 ms
      let target = clamp(Math.round(projected), d.startIndex - page(), d.startIndex + page());
      if (target === d.startIndex && Math.abs(dx) >= CONFIG.swipeThreshold) target += dx < 0 ? 1 : -1;
      if (cancelled) target = d.startIndex;

      goTo(target, { say: target !== d.startIndex });
      resume('drag');
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', () => finishDrag(false));
    viewport.addEventListener('pointercancel', () => finishDrag(true));
    viewport.addEventListener('dragstart', (event) => event.preventDefault());
    viewport.addEventListener('click', (event) => {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
    }, true);

    /* --- keyboard & focus -------------------------------------------------- */
    root.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target.closest('input, textarea, select')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
      else if (event.key === 'Home') { event.preventDefault(); goTo(0, { say: true }); }
      else if (event.key === 'End') { event.preventDefault(); goTo(total - Math.max(1, Math.floor(perView)), { say: true }); }
    });

    // Tabbing to a card that is off-screen brings it into view.
    viewport.addEventListener('focusin', (event) => {
      viewport.scrollLeft = 0;
      if (mode !== 'slider') return;
      const slide = event.target.closest('.slide');
      if (!slide || slide.classList.contains('is-clone')) return;
      const i = originals.indexOf(slide);
      const relative = loop ? mod(i - index, total) : i - index;
      if (relative < 0 || relative >= Math.max(1, Math.floor(perView))) goTo(i);
    });

    /* --- autoplay (optional, off by default) ------------------------------ */
    const stopAuto = () => clearTimeout(autoTimer);
    const startAuto = () => {
      stopAuto();
      if (!CONFIG.autoplay || reduceMotion.matches || pauses.size || mode !== 'slider') return;
      autoTimer = setTimeout(() => {
        if (!loop && index >= maxIndex()) goTo(0); else next(false);
        startAuto();
      }, CONFIG.autoplayDelay);
    };
    function pause(reason) { pauses.add(reason); stopAuto(); }
    function resume(reason) { pauses.delete(reason); startAuto(); }

    const toggleAutoplay = () => {
      const paused = pauses.has('user');
      if (paused) resume('user'); else pause('user');
      autoplayBtn.innerHTML = paused ? ICONS.pause : ICONS.play;
      autoplayBtn.setAttribute('aria-label', paused ? 'Pause autoplay' : 'Start autoplay');
    };

    if (CONFIG.autoplay) {
      autoplayBtn.hidden = false;
      root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') pause('hover'); });
      root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') resume('hover'); });
      root.addEventListener('focusin', () => pause('focus'));
      root.addEventListener('focusout', () => resume('focus'));
      document.addEventListener('visibilitychange', () => (document.hidden ? pause('hidden') : resume('hidden')));
    }

    /* --- slider / grid mode ------------------------------------------------ */
    const setMode = (nextMode) => {
      mode = nextMode;
      root.classList.toggle('is-grid', mode === 'grid');
      if (mode === 'grid') {
        stopAuto();
        track.classList.add('no-anim');
        track.style.transform = '';
        updateNav();
        statusEl.textContent = `Showing all ${total} products`;
      } else {
        measure();
        startAuto();
        statusEl.textContent = 'Showing the product slider';
      }
    };

    measure();
    startAuto();

    return { next, prev, goTo, setMode, toggleAutoplay, getMode: () => mode };
  };

  /* 11 (part). Bootstrapping happens in init(); sections 8 and 10 follow. ---- */
  const init = () => {
    const el = {
      root: $('#showcase'),
      viewport: $('#slider-viewport'),
      track: $('#slider-track'),
      prevBtn: $('#prev-btn'),
      nextBtn: $('#next-btn'),
      statusEl: $('#slider-status'),
      autoplayBtn: $('#autoplay-btn'),
      viewAll: $('#view-all'),
      viewAllLabel: $('#view-all-label'),
      cartBtn: $('#cart-btn'),
      cartCount: $('#cart-count'),
      cartDialog: $('#cart-dialog'),
      cartBody: $('#cart-body'),
      cartFoot: $('#cart-foot'),
      quickView: $('#quick-view'),
      quickViewPanel: $('#qv-panel'),
      toastRegion: $('#toast-region'),
    };

    renderProducts(el.track);

    const store = createStore();
    const toaster = createToaster(el.toastRegion);
    const dialogs = createDialogs(el.toastRegion);
    dialogs.bind(el.cartDialog);
    dialogs.bind(el.quickView);

    const slider = createSlider(el);
    const productFor = (node) => PRODUCTS_BY_ID.get(node.closest('[data-product-id]')?.dataset.productId);

    /* 8. Cart + quick view UI --------------------------------------------- */
    const renderCart = () => {
      const items = store.items();
      if (!items.length) {
        el.cartBody.innerHTML = '<p class="cart-empty">Your cart is empty. Add a product from the collection and it will show up here.</p>';
        el.cartFoot.innerHTML = `
          <div class="cart-actions">
            <button type="button" class="btn btn--primary" data-action="close-dialog">Browse products</button>
          </div>`;
        return;
      }

      el.cartBody.innerHTML = `<ul>${items.map(({ product: p, qty }) => `
        <li class="cart-item" data-product-id="${p.id}">
          <img class="cart-item__img" src="${imageUrl(p, 160)}" alt="" width="64" height="64" data-fallback="${p.fallback}">
          <div>
            <p class="cart-item__name">${escapeHTML(p.name)}</p>
            <p class="cart-item__price">${money.format(p.price)} each</p>
            <div class="qty" role="group" aria-label="Quantity of ${escapeHTML(p.name)}">
              <button type="button" data-action="cart-dec" aria-label="Decrease quantity of ${escapeHTML(p.name)}">${ICONS.minus}</button>
              <span class="qty__value" aria-live="polite">${qty}</span>
              <button type="button" data-action="cart-inc" aria-label="Increase quantity of ${escapeHTML(p.name)}"
                      aria-disabled="${qty >= CONFIG.maxQty}">${ICONS.plus}</button>
            </div>
          </div>
          <button type="button" class="icon-btn" data-action="cart-remove" aria-label="Remove ${escapeHTML(p.name)} from cart">${ICONS.trash}</button>
        </li>`).join('')}</ul>`;

      el.cartFoot.innerHTML = `
        <p class="cart-total"><span>Subtotal (${plural(store.count(), 'item')})</span><strong>${money.format(store.subtotal())}</strong></p>
        <div class="cart-actions">
          <button type="button" class="btn btn--ghost" data-action="cart-clear">Clear cart</button>
          <button type="button" class="btn btn--primary" data-action="close-dialog">Continue shopping</button>
        </div>`;
    };

    const openCart = (trigger = el.cartBtn) => {
      dialogs.closeAll();
      renderCart();
      dialogs.open(el.cartDialog, trigger);
    };

    const openQuickView = (p, trigger) => {
      if (!p) return;
      el.quickViewPanel.innerHTML = `
        <div class="qv" data-product-id="${p.id}">
          <button type="button" class="icon-btn qv__close" data-action="close-dialog" aria-label="Close product details">${ICONS.close}</button>
          <div class="qv__media">
            <img src="${imageUrl(p, 900)}" alt="${escapeHTML(p.alt)}" width="900" height="900" draggable="false" data-fallback="${p.fallback}">
          </div>
          <div class="qv__info">
            <p class="card__category">${escapeHTML(p.category)}</p>
            <h2 class="qv__title" id="qv-title">${escapeHTML(p.name)}</h2>
            ${ratingMarkup(p)}
            ${priceMarkup(p)}
            <p class="qv__desc">${escapeHTML(p.description)}</p>
            <div class="qv__actions">
              <button type="button" class="btn btn--primary" data-action="add-to-cart">${ICONS.bag}<span>Add to cart</span></button>
              <button type="button" class="btn btn--ghost" data-action="wishlist" aria-pressed="false"
                      aria-label="Save ${escapeHTML(p.name)} to wishlist">${ICONS.heart}<span class="wish-label">Save</span></button>
            </div>
          </div>
        </div>`;
      syncWishlist();
      dialogs.open(el.quickView, trigger);
    };

    /* Keep every wishlist button (including clones and the quick view) in sync. */
    const syncWishlist = () => {
      document.querySelectorAll('[data-action="wishlist"]').forEach((button) => {
        const product = productFor(button);
        if (!product) return;
        const wished = store.isWished(product.id);
        button.setAttribute('aria-pressed', String(wished));
        const label = $('.wish-label', button);
        if (label) label.textContent = wished ? 'Saved' : 'Save';
      });
    };

    const syncCart = () => {
      const count = store.count();
      el.cartCount.hidden = count === 0;
      el.cartCount.textContent = count;
      el.cartBtn.setAttribute('aria-label', `Open cart, ${plural(count, 'item')}`);
      if (el.cartDialog.open) renderCart();
    };

    const bumpCartBadge = () => {
      el.cartCount.classList.remove('is-bump');
      void el.cartCount.offsetWidth;
      el.cartCount.classList.add('is-bump');
    };
    el.cartCount.addEventListener('animationend', () => el.cartCount.classList.remove('is-bump'));

    store.subscribe(syncWishlist);
    store.subscribe(syncCart);
    syncWishlist();
    syncCart();

    /* 10. Actions (event delegation) -------------------------------------- */
    const flashAdded = (button) => {
      const label = $('span', button);
      if (!label) return;
      button.dataset.label = button.dataset.label || label.textContent;
      label.textContent = 'Added';
      button.classList.add('is-added');
      clearTimeout(button._addedTimer);
      button._addedTimer = setTimeout(() => {
        label.textContent = button.dataset.label;
        button.classList.remove('is-added');
      }, 1400);
    };

    const addToCart = (product, button) => {
      if (!store.add(product.id)) {
        toaster.show({ message: `You can add up to ${CONFIG.maxQty} of each product.` });
        return;
      }
      flashAdded(button);
      bumpCartBadge();
      toaster.show({ message: `${product.name} added to cart`, actionLabel: 'View cart', onAction: () => openCart() });
    };

    const toggleWishlist = (product, button) => {
      const added = store.toggleWish(product.id);
      button.classList.remove('is-pop');
      void button.offsetWidth;
      button.classList.add('is-pop');
      toaster.show({ message: `${product.name} ${added ? 'saved to' : 'removed from'} your wishlist` });
    };
    el.root.addEventListener('animationend', (event) => event.target.closest('.wish')?.classList.remove('is-pop'));

    const toggleViewAll = () => {
      const expand = slider.getMode() === 'slider';
      slider.setMode(expand ? 'grid' : 'slider');
      el.viewAll.setAttribute('aria-expanded', String(expand));
      el.viewAllLabel.textContent = expand ? 'Show slider' : 'View all';
    };

    const actions = {
      prev: () => slider.prev(),
      next: () => slider.next(),
      'toggle-view-all': toggleViewAll,
      'toggle-autoplay': () => slider.toggleAutoplay(),
      'open-cart': (button) => openCart(button),
      'close-dialog': (button) => button.closest('dialog')?.close(),
      wishlist: (button, product) => product && toggleWishlist(product, button),
      'add-to-cart': (button, product) => product && addToCart(product, button),
      'quick-view': (button, product) => openQuickView(product, button),
      'cart-inc': (button, product) => product && store.setQty(product.id, store.qty(product.id) + 1),
      'cart-dec': (button, product) => product && store.setQty(product.id, store.qty(product.id) - 1),
      'cart-remove': (button, product) => product && store.remove(product.id),
      'cart-clear': () => store.clear(),
    };

    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (button) {
        if (button.getAttribute('aria-disabled') === 'true') return;
        actions[button.dataset.action]?.(button, productFor(button));
        return;
      }
      // Clicking anywhere else on a card opens the quick view (keyboard users use the title button).
      const card = event.target.closest('.card');
      if (card && el.track.contains(card)) openQuickView(productFor(card), $('.card__link', card));
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// @ts-nocheck
let activeCleanups = [];
export function initializeInteractions() {
activeCleanups.forEach(cleanup => cleanup());
activeCleanups = [];
const on = (target, type, handler, options) => {
  target.addEventListener(type, handler, options);
  activeCleanups.push(() => target.removeEventListener(type, handler, options));
};
function initWordmark() {
  /* ── split each wordmark into per-letter spans so the entrance can
        stagger. Done in JS so the HTML stays plain readable text. ── */
  document.querySelectorAll('[data-split]').forEach(el => {
    const word = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('aria-label', word);
    [...word].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'gl';
      s.style.setProperty('--i', i);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch;
      el.appendChild(s);
    });
  });
}

function initSpotlight(selector, rm, resetOnBlur = false) {
  /* ── spotlight on the glass ──
     The pointer only writes two CSS variables. There is no element chasing
     the cursor, so there is nothing that can visibly trail behind it. */
  const slab = document.querySelector(selector);

  if (slab && !rm && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let queued = null;

    const light = () => {
      const { x, y } = queued;
      queued = null;
      const r = slab.getBoundingClientRect();
      slab.style.setProperty('--mx', (x - r.left).toFixed(0) + 'px');
      slab.style.setProperty('--my', (y - r.top).toFixed(0) + 'px');
    };

    // listen on the window so the light keeps tracking just outside the panel
    on(window, 'pointermove', e => {
      const r = slab.getBoundingClientRect();
      const near = e.clientX > r.left - 160 && e.clientX < r.right + 160 &&
                   e.clientY > r.top - 160 && e.clientY < r.bottom + 160;
      slab.style.setProperty('--lit', near ? '1' : '0');
      if (!near) return;
      const first = queued === null;
      queued = { x: e.clientX, y: e.clientY };
      if (first) requestAnimationFrame(light);
    }, { passive: true });

    if (resetOnBlur) on(window, 'blur', () => slab.style.setProperty('--lit', '0'));
  }
}

function initDeck(rm) {
  /* ── deck: bloom parallax + per-slot 3D tilt ──
     The tilt is written as CSS variables on the .face, never as an inline
     transform. CSS keeps full ownership of the transform, so the hover
     lift and the tilt can't overwrite each other — which is what used to
     make the cards jump. Reads are batched into one rAF frame. */
  const deck  = document.getElementById('deck');
  const bloom = document.getElementById('bloom');
  const slots = deck ? [...deck.querySelectorAll('.slot')] : [];

  if (deck && !rm && matchMedia('(pointer:fine)').matches) {
    let pending = null;

    const paint = () => {
      if (!pending) return;
      const { x, y } = pending;
      pending = null;

      const r = deck.getBoundingClientRect();
      const nx = (x - r.left) / r.width - 0.5;
      const ny = (y - r.top) / r.height - 0.5;
      bloom.style.transform =
        `translate(calc(-50% + ${(nx * 60).toFixed(1)}px), calc(-50% + ${(ny * 30).toFixed(1)}px))`;

      for (const slot of slots) {
        const face = slot.querySelector('.face');
        const b = slot.getBoundingClientRect();
        const inside = x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
        if (!inside) {
          face.style.setProperty('--rx', '0deg');
          face.style.setProperty('--ry', '0deg');
          continue;
        }
        // position within this slot, -0.5 … 0.5
        const sx = (x - b.left) / b.width - 0.5;
        const sy = (y - b.top) / b.height - 0.5;
        face.style.setProperty('--ry', (sx * 13).toFixed(2) + 'deg');
        face.style.setProperty('--rx', (-sy * 11).toFixed(2) + 'deg');
      }
    };

    on(deck, 'pointermove', e => {
      const first = pending === null;
      pending = { x: e.clientX, y: e.clientY };
      if (first) requestAnimationFrame(paint);
    }, { passive: true });

    // leaving the deck resets every face in one go
    on(deck, 'pointerleave', () => {
      pending = null;
      for (const slot of slots) {
        const face = slot.querySelector('.face');
        face.style.setProperty('--rx', '0deg');
        face.style.setProperty('--ry', '0deg');
      }
      bloom.style.transform = 'translate(-50%,-50%)';
    });
  }
}

function initSwipeDots(rm) {
  const deck = document.getElementById('deck');
  const slots = deck ? [...deck.querySelectorAll('.slot')] : [];
  /* ── swipe dots ──
     Which card is "current" is read from the scroll container itself, so the
     dots stay right whether you swiped, tapped a dot, or tabbed to a card. */
  const scroller = document.querySelector('.deck-scroll');
  const dots = [...document.querySelectorAll('#dots button')];

  if (deck && scroller && dots.length) {
    const mark = i => dots.forEach((d, n) => d.classList.toggle('on', n === i));

    let raf = null;
    on(scroller, 'scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const step = scroller.scrollWidth / slots.length;
        // +half a card so the dot flips when the card is mostly in view
        mark(Math.min(slots.length - 1, Math.round(scroller.scrollLeft / step)));
      });
    }, { passive: true });

    dots.forEach((d, i) => on(d, 'click', () => {
      slots[i].scrollIntoView({
        behavior: rm ? 'auto' : 'smooth',
        inline: 'start',
        block: 'nearest'
      });
      mark(i);
    }));
  }
}

function initReveal(rm) {
  /* ── reveal chapter content as it scrolls in ──
     Each element is unobserved once it has appeared, so nothing keeps
     running after the reveal is done. */
  const rvs = document.querySelectorAll('.rv');
  if (rm) {
    rvs.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e, n) => {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = (n * 0.07).toFixed(2) + 's';
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(el => io.observe(el));
    activeCleanups.push(() => io.disconnect());
  }
}


function initDrawers() {
  /* ── drawers ──
     Everything starts open in the CSS and is folded shut here, so if this
     script never runs the visitor still sees every project. A shut drawer
     is also made inert, so its links and buttons cannot be reached by
     keyboard while they are invisible. */
  const drawers = [...document.querySelectorAll('.drawer')];

  drawers.forEach(d => {
    const head = d.querySelector('.drawer-head');
    const body = d.querySelector('.drawer-body');

    d.classList.add('shut');
    body.inert = true;
    head.setAttribute('aria-expanded', 'false');

    on(head, 'click', () => {
      const opening = d.classList.contains('shut');
      d.classList.toggle('shut', !opening);
      d.classList.toggle('open', opening);
      body.inert = !opening;
      head.setAttribute('aria-expanded', String(opening));
    });
  });
}

function initLightbox() {
  /* ── screenshot lightbox ──
     A native <dialog>: showModal() traps focus, Esc closes it, and focus
     returns to the thumbnail that opened it. */
  const lb = document.getElementById('lb');
  if (lb) {
    const img = lb.querySelector('img');
    const cap = lb.querySelector('.lb-cap');
    let set = [], at = 0, opener = null;

    const show = i => {
      at = (i + set.length) % set.length;
      const b = set[at];
      img.src = b.dataset.full;
      img.alt = b.dataset.alt;
      cap.textContent = b.dataset.project + ' · ' + (at + 1) + ' / ' + set.length;
    };

    document.querySelectorAll('.shot button').forEach(b => on(b, 'click', () => {
      set = [...b.closest('.shots').querySelectorAll('button')];
      opener = b;
      lb.classList.toggle('solo', set.length < 2);
      show(set.indexOf(b));
      lb.showModal();
    }));

    on(lb.querySelector('.lb-x'), 'click', () => lb.close());
    on(lb.querySelector('.lb-prev'), 'click', () => show(at - 1));
    on(lb.querySelector('.lb-next'), 'click', () => show(at + 1));
    // the dialog fills the viewport, so a click on its own surface is a click outside the picture
    on(lb, 'click', e => { if (e.target === lb) lb.close(); });
    on(lb, 'keydown', e => {
      if (set.length < 2) return;
      if (e.key === 'ArrowLeft') show(at - 1);
      if (e.key === 'ArrowRight') show(at + 1);
    });
    on(lb, 'close', () => { img.removeAttribute('src'); if (opener) opener.focus(); });
  }
}

function initTicker() {
  /* ── ticker: duplicate the row once so the loop is seamless ── */
  const track = document.getElementById('track');
  if (track && track.dataset.duplicated !== 'true') { track.innerHTML += track.innerHTML; track.dataset.duplicated = 'true'; }
}

function initKeyboard() {
  const cards = [...document.querySelectorAll('#deck .card')];
  /* ── keyboard: 1-4 opens a card (home only — other pages have no deck) ── */
  on(window, 'keydown', e => {
    if (document.querySelector('.mobile-menu-dialog[data-visible="true"]')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;   // leave Ctrl/Cmd+1-4 to the browser (tab switching)
    const i = ['1', '2', '3', '4'].indexOf(e.key);
    if (i > -1 && cards[i]) cards[i].click();
  });
}

const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
initWordmark();
if (!document.getElementById('pre')) document.body.classList.add('ready');
initSpotlight('.slab', rm, true);
initDeck(rm);
initSwipeDots(rm);
initReveal(rm);
initSpotlight('.bio', rm);
initDrawers();
initLightbox();
initTicker();
initKeyboard();

}

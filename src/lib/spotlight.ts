// A soft highlight that follows the pointer across any `.spot` element (see global.css). One
// delegated listener, fine pointers only, writes two CSS variables and nothing else.
export function initSpotlight() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener(
    'pointermove',
    (event) => {
      const el = (event.target as Element | null)?.closest?.<HTMLElement>('.spot');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
}

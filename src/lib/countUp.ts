// Counts every `[data-count-to]` inside `root` up from zero. The server-rendered text is already the
// final value, so with JS off (or reduced motion) nothing changes; this only adds the animation.
// Direct DOM writes on purpose: no framework state, one rAF per element, cancelled on re-run.
const frames = new WeakMap<HTMLElement, number>();

export function countUp(root: ParentNode) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  root.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo);
    if (Number.isNaN(target)) return;
    const decimals = Number(el.dataset.decimals ?? 0);
    const delay = Number(el.dataset.countDelay ?? 0);
    const duration = 1200;
    const format = new Intl.NumberFormat(
      el.dataset.locale,
      el.dataset.currency
        ? {
            style: 'currency',
            currency: el.dataset.currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }
        : { minimumFractionDigits: decimals, maximumFractionDigits: decimals },
    );

    const previous = frames.get(el);
    if (previous) cancelAnimationFrame(previous);

    const start = performance.now() + delay;
    el.textContent = format.format(0);

    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = format.format(target * eased);
      if (progress < 1) frames.set(el, requestAnimationFrame(tick));
    };
    frames.set(el, requestAnimationFrame(tick));
  });
}

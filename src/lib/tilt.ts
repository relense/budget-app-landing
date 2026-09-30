// Pointer parallax for a stage: sets --rx/--ry (degrees, for the phone) and --px/--py (-0.5..0.5, for
// floating cards to drift the opposite way). Fine pointers only, and not under reduced motion.
export function attachTilt(card: HTMLElement) {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return;
  }
  let frame = 0;
  const set = (rx: number, ry: number, px: number, py: number) => {
    card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    card.style.setProperty('--px', px.toFixed(3));
    card.style.setProperty('--py', py.toFixed(3));
  };
  card.addEventListener('pointermove', (event) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      set(-y * 9, x * 12, x, y);
    });
  });
  card.addEventListener('pointerleave', () => set(0, 0, 0, 0));
}

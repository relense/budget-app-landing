// Tweens any `#result-*` number on the calculator pages when the page's own script rewrites it, so
// results glide to their new value instead of jumping. The calculators write final text via
// `textContent`; this only watches, parses the number out of that text, and replays a short tween in
// the same number format. The final frame is always the calculator's exact string.
type State = { value: number | null; frame: number; expect: string };
const states = new WeakMap<HTMLElement, State>();

const NUMBER = /^([^\d-]*)(-?\d[\d.,\s  ]*\d|-?\d)([^\d]*)$/;

interface Parsed {
  value: number;
  decimals: number;
  decimalChar: string;
  groupChar: string;
  prefix: string;
  suffix: string;
}

function parse(text: string): Parsed | null {
  const m = NUMBER.exec(text.trim());
  if (!m) return null;
  const [, prefix, raw, suffix] = m;
  const compact = raw.replace(/[\s  ]/g, '');
  const lastDot = compact.lastIndexOf('.');
  const lastComma = compact.lastIndexOf(',');
  let decimalChar = '';
  let groupChar = '';
  if (lastDot >= 0 && lastComma >= 0) {
    decimalChar = lastDot > lastComma ? '.' : ',';
    groupChar = decimalChar === '.' ? ',' : '.';
  } else {
    const sep = lastDot >= 0 ? '.' : lastComma >= 0 ? ',' : '';
    if (sep) {
      const count = compact.split(sep).length - 1;
      const after = compact.length - compact.lastIndexOf(sep) - 1;
      if (count > 1 || after === 3) groupChar = sep;
      else decimalChar = sep;
    }
  }
  const integerPart = groupChar ? compact.split(decimalChar || '\u0000')[0].split(groupChar).join('') : compact.split(decimalChar || '\u0000')[0];
  const fraction = decimalChar ? compact.split(decimalChar)[1] ?? '' : '';
  const value = Number(`${integerPart}${fraction ? '.' + fraction : ''}`);
  if (Number.isNaN(value)) return null;
  return { value, decimals: fraction.length, decimalChar: decimalChar || '.', groupChar, prefix, suffix };
}

function format(value: number, p: Parsed): string {
  const [int, frac] = Math.abs(value).toFixed(p.decimals).split('.');
  const grouped = p.groupChar ? int.replace(/\B(?=(\d{3})+(?!\d))/g, p.groupChar) : int;
  return `${p.prefix}${value < 0 ? '-' : ''}${grouped}${frac ? p.decimalChar + frac : ''}${p.suffix}`;
}

function tween(el: HTMLElement, from: number, to: Parsed, finalText: string) {
  const state = states.get(el)!;
  cancelAnimationFrame(state.frame);
  // Put the old value back before the browser paints, so the final number never flashes first.
  state.expect = format(from, to);
  el.textContent = state.expect;
  const start = performance.now();
  const duration = 650;
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const text = progress < 1 ? format(from + (to.value - from) * eased, to) : finalText;
    state.expect = text;
    el.textContent = text;
    if (progress < 1) state.frame = requestAnimationFrame(tick);
  };
  state.frame = requestAnimationFrame(tick);
}

export function initLiveNumbers() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[id^="result-"]')).filter(
    (el) => el.children.length === 0,
  );
  if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const card = document.getElementById('results');

  for (const el of targets) {
    states.set(el, { value: parse(el.textContent ?? '')?.value ?? null, frame: 0, expect: el.textContent ?? '' });
    new MutationObserver(() => {
      const state = states.get(el)!;
      const text = el.textContent ?? '';
      if (text === state.expect) return; // our own write
      const parsed = parse(text);
      const previous = state.value;
      state.value = parsed ? parsed.value : null;
      state.expect = text;
      if (!parsed || previous === null || previous === parsed.value) return;
      tween(el, previous, parsed, text);
      document.dispatchEvent(new CustomEvent('tool:result'));
      if (card) {
        card.classList.remove('is-sheen');
        void card.offsetWidth; // restart the sheen
        card.classList.add('is-sheen');
      }
    }).observe(el, { childList: true, characterData: true, subtree: true });
  }
}

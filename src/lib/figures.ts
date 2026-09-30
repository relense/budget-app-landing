// Shared flat, faceless figure rig used by the illustrated sets (PersonaScene, CtaScene). Each person is
// built as separate groups (torso, head, each arm) so CSS can move every part; the loops live in
// PersonaScene.astro's global styles.
export const K = {
  ink: '#1A1A1A',
  skinA: '#F1C7A3',
  skinB: '#C98E62',
  skinC: '#8E5B3C',
  hairDark: '#2B2320',
  hairBrown: '#5A3A26',
  hairAuburn: '#9A4E2E',
  hairBlack: '#151515',
  teal: '#327E71',
  blue: '#3E6FA6',
  purple: '#7A5AA8',
  pink: '#A24F63',
  peach: '#B97A4C',
  green: '#234D2E',
  paper: '#F2F2F2',
  char: '#3A3A3A',
  screen: '#1E1E1E',
  yellow: '#F5E27A',
  mint: '#CFF3DA',
};
export const dark = (a: number) => `rgba(26,26,26,${a})`;
export const light = (a: number) => `rgba(255,255,255,${a})`;

export interface PersonOpts {
  x: number;
  y: number; // shoulder line
  skin: string;
  hair: string;
  style?: 'short' | 'long' | 'bun' | 'curly' | 'cap';
  top: string;
  bottom?: string;
  arms?: 'phone' | 'mug' | 'laptop' | 'cover' | 'hold' | 'coin' | 'wave';
  scale?: number;
  stand?: boolean;
  legs?: boolean;
  flip?: boolean;
  /** Extra behaviour on top of the pose: raise the phone, turn to the side, look around, nod. */
  act?: 'raise' | 'turn-l' | 'turn-r' | 'around' | 'nod' | 'none';
  /** Seconds to offset the loop so people sharing a scene are not in lockstep. */
  phase?: number;
}

// A front-facing, faceless person, built as separate groups (torso, head, each arm) so every part
// can move. (x, y) is the middle of the shoulder line.
export function person(o: PersonOpts): string {
  const { x, y, skin, hair, style = 'short', top, bottom = K.char, arms = 'phone', scale = 1, stand = false, legs = true, flip = false, act = 'none', phase = 0 } = o;
  const shade = 'rgba(26,26,26,0.16)';
  const hairShapes: Record<string, string> = {
    short: `<path d="M-28 -56 Q-30 -88 0 -88 Q30 -88 28 -56 Q22 -70 0 -70 Q-22 -70 -28 -56Z" fill="${hair}"/>`,
    long: `<path d="M-29 -56 Q-32 -90 0 -90 Q32 -90 29 -56 L31 -6 Q31 2 22 2 L18 2 L20 -52 Q0 -66 -20 -52 L-18 2 L-22 2 Q-31 2 -31 -6Z" fill="${hair}"/>`,
    bun: `<circle cx="0" cy="-94" r="12" fill="${hair}"/><path d="M-28 -56 Q-30 -88 0 -88 Q30 -88 28 -56 Q22 -70 0 -70 Q-22 -70 -28 -56Z" fill="${hair}"/>`,
    curly: `<g fill="${hair}"><circle cx="-20" cy="-70" r="14"/><circle cx="0" cy="-80" r="15"/><circle cx="20" cy="-70" r="14"/><circle cx="-27" cy="-54" r="10"/><circle cx="27" cy="-54" r="10"/></g>`,
    cap: `<path d="M-30 -58 Q-30 -90 0 -90 Q30 -90 30 -58 Z" fill="${hair}"/><path d="M-4 -64 L34 -60 Q38 -56 30 -54 L-4 -56Z" fill="${hair}"/>`,
  };
  const legsSvg = !legs
    ? ''
    : stand
      ? `<rect x="-36" y="96" width="32" height="170" rx="15" fill="${bottom}"/><rect x="4" y="96" width="32" height="170" rx="15" fill="${bottom}"/><ellipse cx="-22" cy="270" rx="22" ry="9" fill="${K.ink}"/><ellipse cx="22" cy="270" rx="22" ry="9" fill="${K.ink}"/>`
      : `<rect x="-44" y="92" width="88" height="58" rx="26" fill="${bottom}"/><rect x="-40" y="130" width="32" height="96" rx="15" fill="${bottom}"/><rect x="8" y="130" width="32" height="96" rx="15" fill="${bottom}"/><ellipse cx="-24" cy="232" rx="22" ry="9" fill="${K.ink}"/><ellipse cx="24" cy="232" rx="22" ry="9" fill="${K.ink}"/>`;
  const arm = (d: string) => `<path d="${d}" fill="none" stroke="${top}" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>`;
  const hand = (cx: number, cy: number, cls = '') => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="9" fill="${skin}"/>`;
  const pa = (side: 'l' | 'r', inner: string) => `<g class="pa pa-${side}" style="transform-origin:${side === 'l' ? -40 : 40}px 6px">${inner}</g>`;
  const phoneAt = (rot: number, w = 26, h = 42, ox = -13, oy = 34) =>
    `<rect x="${ox}" y="${oy}" width="${w}" height="${h}" rx="6" fill="${K.screen}" transform="rotate(${rot} 0 55)"/><rect x="${ox + 3}" y="${oy + 4}" width="${w - 6}" height="${h - 10}" rx="3" class="glow" fill="rgba(207,243,218,0.55)" transform="rotate(${rot} 0 55)"/>`;
  const armSets: Record<string, string> = {
    phone: `<g class="p-arms">${arm('M-40 6 Q-58 52 -34 76 L-10 60')}${arm('M40 6 Q58 52 34 76 L10 60')}${phoneAt(-6)}${hand(-10, 60, 'thumb-l')}${hand(10, 60, 'thumb-r')}</g>`,
    mug: `${pa('l', `${arm('M-40 6 Q-58 52 -34 76 L-12 62')}${phoneAt(-6, 24, 38, -13, 38)}${hand(-12, 62, 'thumb-l')}`)}${pa('r', `${arm('M40 6 Q60 30 44 50 L34 44')}<g class="mug"><rect x="24" y="22" width="28" height="30" rx="7" fill="${K.paper}"/><path d="M52 30 q12 2 0 16" fill="none" stroke="${K.paper}" stroke-width="5"/></g>${hand(36, 46)}`)}`,
    laptop: `${pa('l', `${arm('M-40 6 Q-52 50 -30 84')}${hand(-28, 88, 'hand-l')}`)}${pa('r', `${arm('M40 6 Q52 50 30 84')}${hand(28, 88, 'hand-r')}`)}`,
    cover: `${pa('l', `${arm('M-40 6 Q-56 54 -22 72')}<rect x="-14" y="46" width="26" height="40" rx="6" fill="${K.screen}" transform="rotate(-8 0 66)"/>${hand(-16, 76)}`)}${pa('r', `${arm('M40 6 Q60 40 26 52 L4 40')}<path class="cover-hand" d="M-6 30 Q18 26 26 46 Q22 62 0 58 Q-14 52 -6 30Z" fill="${skin}"/>`)}`,
    hold: `${arm('M-40 6 Q-56 56 -22 86')}${arm('M40 6 Q56 56 22 86')}${hand(-14, 90)}${hand(14, 90)}`,
    coin: `${arm('M-40 6 Q-56 56 -22 86')}${hand(-14, 90)}${pa('r', `${arm('M40 6 Q66 20 60 -22')}${hand(60, -30)}`)}`,
    wave: `${arm('M-40 6 Q-58 56 -30 88')}${hand(-26, 92)}${pa('r', `${arm('M40 6 Q70 10 66 -34')}${hand(66, -42)}`)}`,
  };
  const flipT = flip ? ' scale(-1 1)' : '';
  return `<g transform="translate(${x} ${y}) scale(${scale})${flipT}"><g class="pp pose-${arms} act-${act}" style="--ph:${phase}s">
    ${legsSvg}
    <path class="p-torso" d="M-46 12 Q-46 -6 -28 -8 L28 -8 Q46 -6 46 12 L44 100 Q44 110 34 110 L-34 110 Q-44 110 -44 100Z" fill="${top}"/>
    <rect x="-8" y="-30" width="16" height="26" rx="6" fill="${skin}"/><rect x="-8" y="-30" width="16" height="10" rx="4" fill="${shade}"/>
    <g class="p-head" style="transform-origin:0px -26px"><circle cx="0" cy="-52" r="27" fill="${skin}"/>${hairShapes[style]}</g>
    ${armSets[arms]}
  </g></g>`;
}

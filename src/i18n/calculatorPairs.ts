// Single source of truth for which /ferramentas/* (PT) calculator page pairs with which /tools/*
// (EN) one. These are flat, differently-named URLs (not a mirrored /pt-pt/... path), so
// getAlternatePath's normal path-rewriting can't derive one from the other -- this table is the
// only place that mapping lives, so BaseLayout's hreflang tags on all 36 calculator pages can't
// drift out of sync with each other the way 36 independently hand-typed URLs could.
//
// Keyed by the PT slug (the part after /ferramentas/), valued by the EN slug (the part after
// /tools/). Verified against every EN page's own "English counterpart of /ferramentas/X.astro"
// header comment, 2026-09-18.
export const CALCULATOR_PT_TO_EN: Record<string, string> = {
  'juros-compostos': 'compound-interest',
  'calculadora-fire': 'fire-calculator',
  'simulador-reforma': 'portugal-state-pension-calculator',
  'fundo-de-emergencia': 'emergency-fund-calculator',
  'regra-50-30-20': '50-30-20-rule-calculator',
  'custo-real-carro': 'true-cost-of-a-car-calculator',
  'calculadora-inflacao': 'portugal-inflation-calculator',
  'amortizacao-antecipada-credito-habitacao': 'portugal-mortgage-prepayment-calculator',
  'imt-imposto-selo': 'portugal-property-transfer-tax-calculator',
  'dividir-despesas-casal': 'split-expenses-couple-calculator',
  'salario-liquido': 'portugal-net-salary-calculator',
  'recibos-verdes': 'portugal-freelancer-tax-calculator',
  'simulador-irs': 'portugal-income-tax-calculator',
  'subsidio-ferias-natal-duodecimos': 'portugal-holiday-christmas-subsidy-calculator',
  'simulador-subsidio-desemprego': 'portugal-unemployment-benefit-calculator',
  'calculadora-horas-extra': 'portugal-overtime-pay-calculator',
  'simulador-baixa-medica': 'portugal-sick-leave-pay-calculator',
  'calculadora-iva': 'portugal-vat-calculator',
};

const CALCULATOR_EN_TO_PT: Record<string, string> = Object.fromEntries(
  Object.entries(CALCULATOR_PT_TO_EN).map(([pt, en]) => [en, pt]),
);

/** Given a /ferramentas/<slug> or /tools/<slug> pathname, returns the counterpart's full path
 * (trailing-slashed, matching every other page's own canonical URL under this site's default
 * Astro trailing-slash behavior), or `null` if that slug has no known pair (e.g. a page not in
 * this table). */
export function getCalculatorAlternatePath(pathname: string): string | null {
  const trimmed = pathname.replace(/\/+$/, '');
  // The two hub pages are each other's counterpart too, same as every individual tool below.
  if (trimmed === '/ferramentas') return '/tools/';
  if (trimmed === '/tools') return '/ferramentas/';
  const ptMatch = trimmed.match(/^\/ferramentas\/([^/]+)$/);
  if (ptMatch) {
    const en = CALCULATOR_PT_TO_EN[ptMatch[1]];
    return en ? `/tools/${en}/` : null;
  }
  const enMatch = trimmed.match(/^\/tools\/([^/]+)$/);
  if (enMatch) {
    const pt = CALCULATOR_EN_TO_PT[enMatch[1]];
    return pt ? `/ferramentas/${pt}/` : null;
  }
  return null;
}

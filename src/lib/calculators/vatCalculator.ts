// Original to this repo. Powers /ferramentas/calculadora-iva.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Rates sourced 2026-09-17 (unchanged from 2025, confirmed via OCC's own published table):
// Continente 23% / 13% / 6% (normal/intermédia/reduzida); Açores 16% / 9% / 4%; Madeira 22% / 12% / 4%.

export type VatRegion = 'continente' | 'acores' | 'madeira';
export type VatRateTier = 'normal' | 'intermedia' | 'reduzida';
export type VatDirection = 'add' | 'extract';

export const VAT_RATES: Record<VatRegion, Record<VatRateTier, number>> = {
  continente: { normal: 0.23, intermedia: 0.13, reduzida: 0.06 },
  acores: { normal: 0.16, intermedia: 0.09, reduzida: 0.04 },
  madeira: { normal: 0.22, intermedia: 0.12, reduzida: 0.04 },
};

export interface VatCalculatorInput {
  amount: number;
  direction: VatDirection;
  region: VatRegion;
  rateTier: VatRateTier;
}

export interface VatCalculatorResult {
  net: number;
  vat: number;
  gross: number;
  ratePercent: number;
}

export function calculateVat(input: VatCalculatorInput): VatCalculatorResult {
  const { amount, direction, region, rateTier } = input;
  const rate = VAT_RATES[region][rateTier];

  if (direction === 'add') {
    const net = Math.max(0, amount);
    const gross = net * (1 + rate);
    return { net, vat: gross - net, gross, ratePercent: rate * 100 };
  }

  const gross = Math.max(0, amount);
  const net = gross / (1 + rate);
  return { net, vat: gross - net, gross, ratePercent: rate * 100 };
}

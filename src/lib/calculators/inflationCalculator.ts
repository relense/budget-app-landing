// Original to this repo. Powers /ferramentas/calculadora-inflacao.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Annual CPI change series (IPC, "taxa de inflação média anual"), Portugal, 2000-2025, sourced
// 2026-09-17. Primary anchor: a union statistics PDF (ugt.pt/Estatisticas/1_5.pdf) that cites INE
// directly and covers 2001-2023, cross-checked figure-by-figure against Pordata's own inflation
// page (pordata.pt, source "INE, PORDATA") for 2000 and 2024-2025, and against direct INE-sourced
// news coverage of the 2024/2025 definitive annual figures. A third secondary aggregator
// (dadosmundiais.com) was also checked and found to DIVERGE from all of the above for 2019-2025
// (e.g. it claims 9.8% for 2022 against the INE-confirmed 7.8%, the actual highest figure in the
// whole series) -- not used, flagged here as a caught bad source, same discipline as
// salaryCalculator.ts's own precedent for catching wrong secondary sources.
//
// 2026 itself is deliberately NOT in this table: the year is still in progress and INE hasn't
// published a definitive annual figure yet, so this calculator's latest usable year is 2025.
const CPI_ANNUAL_CHANGE_PERCENT: Record<number, number> = {
  2000: 2.9,
  2001: 4.4,
  2002: 3.6,
  2003: 3.3,
  2004: 2.4,
  2005: 2.3,
  2006: 3.1,
  2007: 2.5,
  2008: 2.6,
  2009: -0.8,
  2010: 1.4,
  2011: 3.7,
  2012: 2.8,
  2013: 0.3,
  2014: -0.3,
  2015: 0.5,
  2016: 0.6,
  2017: 1.4,
  2018: 1.0,
  2019: 0.3,
  2020: 0.0,
  2021: 1.3,
  2022: 7.8,
  2023: 4.3,
  2024: 2.4,
  2025: 2.3,
};

export const EARLIEST_YEAR = 2000;
export const LATEST_YEAR = 2025;

function cumulativeIndex(year: number): number {
  const clamped = Math.min(LATEST_YEAR, Math.max(EARLIEST_YEAR, year));
  let index = 100;
  for (let y = EARLIEST_YEAR + 1; y <= clamped; y++) {
    index *= 1 + CPI_ANNUAL_CHANGE_PERCENT[y] / 100;
  }
  return index;
}

export interface InflationInput {
  amount: number;
  startYear: number;
  endYear: number;
}

export interface InflationResult {
  adjustedAmount: number;
  cumulativePercent: number;
  averageAnnualPercent: number;
}

export function calculateInflation(input: InflationInput): InflationResult {
  const { amount, startYear, endYear } = input;

  const startIndex = cumulativeIndex(startYear);
  const endIndex = cumulativeIndex(endYear);
  const ratio = endIndex / startIndex;

  const years = endYear - startYear;
  const averageAnnualPercent = years === 0 ? 0 : (Math.pow(ratio, 1 / Math.abs(years)) - 1) * 100 * Math.sign(years);

  return {
    adjustedAmount: amount * ratio,
    cumulativePercent: (ratio - 1) * 100,
    averageAnnualPercent,
  };
}

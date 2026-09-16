// PORTED VERBATIM from budget-app-web (src/pages/Tools/salaryCalculator.ts @ 8c8b8aa). Powers the
// public /ferramentas/salario-liquido page -- same logic, same numbers, as the in-app tool, by
// design. If the source file changes in budget-app-web (a withholding-table update, a new tax
// year), re-sync this copy by hand; there is no shared package between the two repos.
//
// Calculates estimated net/gross pay for a dependent employee (trabalhador por conta de outrem,
// Categoria A) in Portugal for 2026: the official IRS withholding ("retenção na fonte") tables,
// employee/employer Social Security, meal-allowance exemption ceilings, and the duodécimos
// (holiday/Christmas subsidy) mechanism. Complements taxCalculator.ts, which covers independent
// workers (Categoria B) -- a structurally different regime (progressive final-tax brackets vs.
// this file's per-family-situation withholding tables), so kept as its own module rather than
// generalized into a shared one.
//
// **Data sourced directly from the official Diário da República / Jornal Oficial texts, not a
// secondary summary** -- read page-by-page as rendered images (a blog/aggregator summary of the
// Continente tables left two "variable formula" cells unresolved, and naive PDF text extraction of
// the Madeira despacho rendered table captions out of order relative to their data; both were
// cross-checked against the primary documents directly before any number here was trusted):
// - Continente: Despacho n.º 233-A/2026 (Diário da República, 2.ª série, Suplemento, N.º 3,
//   06-01-2026) -- https://files.diariodarepublica.pt/2s/2026/01/003000001/0000200010.pdf
// - Açores: Despacho n.º 1179/2026 (Diário da República, 2.ª série, N.º 23, 03-02-2026) --
//   https://files.diariodarepublica.pt/2s/2026/02/023000000/0005100057.pdf . Açores' own regional
//   reduction is a flat **30%** off every Continente marginal rate (verified directly by computing
//   the rate ratio across every bracket, 0.6998-0.7000 throughout) -- not the 20% figure a
//   web-search aggregate answer claimed; treat any "20% for Açores" claim elsewhere as wrong.
// - Madeira: Despacho n.º 19/2026 (Jornal Oficial da Região Autónoma da Madeira, II Série, N.º 13,
//   4.º Suplemento, 20-01-2026) -- https://joram.madeira.gov.pt/joram/2serie/Ano%20de%202026/IISerie-013-2026-01-20Supl4.pdf .
//   Madeira's reduction is NOT a flat percentage of Continente's rates the way Açores' is (its own
//   despacho text: the regional differential was "alargado até ao 9.º escalão" for 2026, extending
//   an already-uneven-by-bracket adjustment) -- its tables are transcribed as directly published,
//   not derived from a formula.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as
// taxCalculator.ts's own file comment: a purely client-side scratchpad with no API/persistence
// boundary, EUR only regardless of the signed-in account's own currency.
//
// **Scope cuts, flagged rather than silently omitted** (all confirmed reasonable given how niche
// they are relative to the effort of modeling them):
// - The extra per-disabled-*dependent* deduction (Despacho n.º 5, alíneas a/b, n.º 6/7 -- up to
//   €84,82/€42,41 per disabled dependent, multipliable up to 3x/6x, plus a separate €135,71 add-on
//   for a sole-earner spouse who is themself disabled with a non-earning partner) is a different,
//   deeper concept than the "pessoa com deficiência" tables (IV-VII) already modeled here, which
//   cover the *taxpayer's own* disability. Not implemented -- a taxpayer with one or more disabled
//   dependents will see a slightly higher IRS withholding estimate here than the real, further-
//   reduced figure.
// - Pension tables (VIII-XI) are out of scope -- this tool is for employment income, not pensions.
// - Subsidy amount is assumed equal to the base monthly salary (the Código do Trabalho's legal
//   default/minimum) -- a contract paying a different holiday/Christmas subsidy amount isn't
//   modeled as a separate input.
// - Net-to-gross solves for the base salary only; the meal-allowance input (if any) is treated as
//   fixed/known in both directions, not itself something to solve for.

export type Region = 'continente' | 'acores' | 'madeira';
export type FilingStatus = 'single' | 'marriedTwoEarners' | 'marriedOneEarner';
export type CalculationDirection = 'grossToNet' | 'netToGross';
export type MealAllowanceType = 'card' | 'cash';
export type SubsidyPaymentMode = 'lumpSum' | 'duodecimos';

export const EMPLOYEE_SOCIAL_SECURITY_RATE = 0.11;
export const EMPLOYER_SOCIAL_SECURITY_RATE = 0.2375;

// Daily tax/SS-exemption ceiling for subsídio de alimentação, 2026 -- card is legally 70% higher
// than cash (Código do IRS, Art. 2.º n.º 3 b)).
export const MEAL_ALLOWANCE_EXEMPT_DAILY: Record<MealAllowanceType, number> = {
  cash: 6.15,
  card: 10.455,
};
export const DEFAULT_MEAL_ALLOWANCE_WORKING_DAYS = 22;

interface VariableDeduction {
  multiplier: number;
  threshold: number;
}

interface SalaryBracket {
  /** Upper bound of this bracket (inclusive), or `null` for the last, unbounded row. */
  upTo: number | null;
  /** Taxa marginal máxima, as a decimal (e.g. 0.125 for 12,5%). */
  rate: number;
  /** Parcela a abater -- a flat euro amount, or (for the 2 lowest non-exempt rows in the
   * "sem deficiência" tables) a formula of the form `rate * multiplier * (threshold - R)`. */
  deduction: number | VariableDeduction;
}

interface SalaryTable {
  brackets: SalaryBracket[];
  /** Parcela adicional a abater por dependente -- constant across every row of a given table
   * (confirmed against every official table read); 0 for the disabled/no-dependents tables. */
  perDependentDeduction: number;
}

type TableId = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';

type BracketRow = readonly [
  upTo: number | null,
  rate: number,
  deduction: number | readonly [number, number],
];

function buildTable(rows: readonly BracketRow[], perDependentDeduction: number): SalaryTable {
  return {
    perDependentDeduction,
    brackets: rows.map(([upTo, rate, deduction]) => ({
      upTo,
      rate,
      deduction: Array.isArray(deduction)
        ? { multiplier: deduction[0], threshold: deduction[1] }
        : (deduction as number),
    })),
  };
}

// --- Continente (Despacho n.º 233-A/2026) ---

const CONTINENTE_I_ROWS: readonly BracketRow[] = [
  [920.0, 0, 0],
  [1042.0, 0.125, [2.6, 1273.85]],
  [1108.0, 0.157, [1.35, 1554.83]],
  [1154.0, 0.157, 94.71],
  [1212.0, 0.212, 158.18],
  [1819.0, 0.241, 193.33],
  [2119.0, 0.311, 320.66],
  [2499.0, 0.349, 401.19],
  [3305.0, 0.3836, 487.66],
  [5547.0, 0.3969, 531.62],
  [20221.0, 0.4495, 823.4],
  [null, 0.4717, 1272.31],
];

const CONTINENTE_III_ROWS: readonly BracketRow[] = [
  [991.0, 0, 0],
  [1042.0, 0.125, [2.6, 1372.15]],
  [1108.0, 0.125, [1.35, 1677.85]],
  [1119.0, 0.125, 96.17],
  [1432.0, 0.1272, 98.64],
  [1962.0, 0.157, 141.32],
  [2240.0, 0.1938, 213.53],
  [2773.0, 0.2277, 289.47],
  [3389.0, 0.257, 370.72],
  [5965.0, 0.2881, 476.12],
  [20265.0, 0.3843, 1049.96],
  [null, 0.4717, 2821.13],
];

const CONTINENTE_IV_ROWS: readonly BracketRow[] = [
  [1694.0, 0, 0],
  [2063.0, 0.212, 359.13],
  [2492.0, 0.311, 563.37],
  [4487.0, 0.349, 658.07],
  [4753.0, 0.3836, 813.33],
  [6687.0, 0.3969, 876.55],
  [20468.0, 0.4495, 1228.29],
  [null, 0.4717, 1682.68],
];

const CONTINENTE_V_ROWS: readonly BracketRow[] = [
  [1938.0, 0, 0],
  [2063.0, 0.2132, 413.19],
  [2854.0, 0.311, 614.96],
  [4504.0, 0.349, 723.42],
  [6826.0, 0.3836, 879.26],
  [7048.0, 0.3969, 970.05],
  [20468.0, 0.4495, 1340.78],
  [null, 0.4717, 1795.17],
];

const CONTINENTE_VI_ROWS: readonly BracketRow[] = [
  [1668.0, 0, 0],
  [2068.0, 0.2049, 341.78],
  [2497.0, 0.241, 416.44],
  [3107.0, 0.311, 591.23],
  [4504.0, 0.349, 709.3],
  [6826.0, 0.3836, 865.14],
  [7048.0, 0.3969, 955.93],
  [20468.0, 0.4495, 1326.66],
  [null, 0.4717, 1781.05],
];

const CONTINENTE_VII_ROWS: readonly BracketRow[] = [
  [2325.0, 0, 0],
  [3494.0, 0.2277, 529.41],
  [3761.0, 0.257, 631.79],
  [6687.0, 0.2881, 748.76],
  [20468.0, 0.4244, 1660.2],
  [null, 0.4717, 2628.34],
];

// --- Açores (Despacho n.º 1179/2026) -- 30% off Continente's marginal rates throughout, its own
// re-derived parcela-a-abater/threshold figures. ---

const ACORES_I_ROWS: readonly BracketRow[] = [
  [966.0, 0, 0],
  [1042.0, 0.0875, [2.6, 1337.85]],
  [1108.0, 0.1099, [1.35, 1652.49]],
  [1154.0, 0.1099, 80.79],
  [1212.0, 0.1484, 125.22],
  [1819.0, 0.1687, 149.83],
  [2119.0, 0.2177, 238.97],
  [2499.0, 0.2443, 295.34],
  [3305.0, 0.2685, 355.82],
  [5547.0, 0.2779, 386.89],
  [20221.0, 0.3146, 590.47],
  [null, 0.3302, 905.92],
];

const ACORES_III_ROWS: readonly BracketRow[] = [
  [1226.0, 0, 0],
  [1267.0, 0.0728, 89.26],
  [1602.0, 0.0964, 119.17],
  [1962.0, 0.1099, 140.8],
  [2240.0, 0.1357, 191.42],
  [2900.0, 0.1594, 244.51],
  [3389.0, 0.1799, 303.96],
  [5965.0, 0.2017, 377.85],
  [20265.0, 0.271, 791.23],
  [null, 0.3302, 1990.92],
];

const ACORES_IV_ROWS: readonly BracketRow[] = [
  [2119.0, 0, 0],
  [2492.0, 0.2177, 464.51],
  [2748.0, 0.2443, 530.8],
  [3012.0, 0.2685, 597.31],
  [4883.0, 0.2779, 625.63],
  [20468.0, 0.3102, 783.36],
  [null, 0.3255, 1096.53],
];

const ACORES_V_ROWS: readonly BracketRow[] = [
  [2339.0, 0, 0],
  [2488.0, 0.2177, 511.64],
  [3479.0, 0.2443, 577.83],
  [3728.0, 0.2685, 662.03],
  [6687.0, 0.2779, 697.08],
  [20468.0, 0.3102, 913.08],
  [null, 0.3255, 1226.25],
];

const ACORES_VI_ROWS: readonly BracketRow[] = [
  [2143.0, 0, 0],
  [2790.0, 0.1687, 363.67],
  [3215.0, 0.2177, 500.38],
  [3479.0, 0.2443, 585.9],
  [5915.0, 0.2685, 670.1],
  [6687.0, 0.2779, 725.71],
  [20468.0, 0.3102, 941.71],
  [null, 0.3255, 1254.88],
];

const ACORES_VII_ROWS: readonly BracketRow[] = [
  [2897.0, 0, 0],
  [4503.0, 0.1594, 461.79],
  [6818.0, 0.1799, 554.11],
  [6916.0, 0.2017, 702.75],
  [20468.0, 0.2926, 1331.42],
  [null, 0.3255, 2004.82],
];

// --- Madeira (Despacho n.º 19/2026) -- verified 2026-09-08 against the primary Jornal Oficial PDF
// directly, page by page, after an initial raw-text extraction rendered table captions out of
// order; every row below matches the source document's own printed tables exactly. ---

const MADEIRA_I_ROWS: readonly BracketRow[] = [
  [980.0, 0, 0],
  [1028.0, 0.0872, [2.6, 1356.92]],
  [1099.0, 0.1204, [1.35, 1696.78]],
  [1201.0, 0.1204, 97.17],
  [1623.0, 0.1763, 164.31],
  [2332.0, 0.223, 240.11],
  [3203.0, 0.2242, 242.91],
  [3614.0, 0.237, 283.91],
  [6585.0, 0.3028, 521.72],
  [6954.0, 0.2802, 372.9],
  [21411.0, 0.2924, 457.74],
  [null, 0.3278, 1215.69],
];

const MADEIRA_III_ROWS: readonly BracketRow[] = [
  [997.0, 0, 0],
  [1099.0, 0.0872, [1.35, 1819.64]],
  [1141.0, 0.0872, 84.84],
  [1857.0, 0.1033, 103.22],
  [2485.0, 0.1091, 114.0],
  [3331.0, 0.1236, 150.04],
  [3895.0, 0.1404, 206.01],
  [6673.0, 0.1595, 280.41],
  [6878.0, 0.2213, 692.81],
  [21411.0, 0.2493, 885.4],
  [null, 0.3278, 2566.17],
];

const MADEIRA_IV_ROWS: readonly BracketRow[] = [
  [2053.0, 0, 0],
  [2591.0, 0.149, 305.9],
  [3622.0, 0.1863, 402.55],
  [4668.0, 0.2289, 556.85],
  [7066.0, 0.2616, 709.5],
  [7168.0, 0.2752, 805.6],
  [21625.0, 0.3058, 1024.95],
  [null, 0.3278, 1500.7],
];

const MADEIRA_V_ROWS: readonly BracketRow[] = [
  [2345.0, 0, 0],
  [2591.0, 0.1382, 324.08],
  [3622.0, 0.1863, 448.71],
  [4668.0, 0.2289, 603.01],
  [7066.0, 0.2616, 755.66],
  [7168.0, 0.2752, 851.76],
  [21625.0, 0.3058, 1071.11],
  [null, 0.3278, 1546.86],
];

const MADEIRA_VI_ROWS: readonly BracketRow[] = [
  [2019.0, 0, 0],
  [2528.0, 0.1566, 316.18],
  [3049.0, 0.1768, 367.25],
  [4272.0, 0.1781, 371.22],
  [5734.0, 0.228, 584.4],
  [7066.0, 0.2595, 765.03],
  [7550.0, 0.2752, 875.97],
  [21625.0, 0.3058, 1107.0],
  [null, 0.3278, 1582.75],
];

const MADEIRA_VII_ROWS: readonly BracketRow[] = [
  [3061.0, 0, 0],
  [4668.0, 0.0883, 270.29],
  [7066.0, 0.1334, 480.82],
  [7168.0, 0.2503, 1306.84],
  [21625.0, 0.281, 1526.9],
  [null, 0.3278, 2538.95],
];

const TABLES: Record<Region, Record<TableId, SalaryTable>> = {
  continente: {
    I: buildTable(CONTINENTE_I_ROWS, 21.43),
    II: buildTable(CONTINENTE_I_ROWS, 34.29),
    III: buildTable(CONTINENTE_III_ROWS, 42.86),
    IV: buildTable(CONTINENTE_IV_ROWS, 0),
    V: buildTable(CONTINENTE_V_ROWS, 42.86),
    VI: buildTable(CONTINENTE_VI_ROWS, 21.43),
    VII: buildTable(CONTINENTE_VII_ROWS, 42.86),
  },
  acores: {
    I: buildTable(ACORES_I_ROWS, 21.43),
    II: buildTable(ACORES_I_ROWS, 34.29),
    III: buildTable(ACORES_III_ROWS, 42.86),
    IV: buildTable(ACORES_IV_ROWS, 0),
    V: buildTable(ACORES_V_ROWS, 42.86),
    VI: buildTable(ACORES_VI_ROWS, 21.43),
    VII: buildTable(ACORES_VII_ROWS, 42.86),
  },
  madeira: {
    I: buildTable(MADEIRA_I_ROWS, 21.43),
    II: buildTable(MADEIRA_I_ROWS, 34.29),
    III: buildTable(MADEIRA_III_ROWS, 42.86),
    IV: buildTable(MADEIRA_IV_ROWS, 0),
    V: buildTable(MADEIRA_V_ROWS, 42.86),
    VI: buildTable(MADEIRA_VI_ROWS, 21.43),
    VII: buildTable(MADEIRA_VII_ROWS, 42.86),
  },
};

// Despacho n.º 1 (all three regions, verbatim-identical text): Table I covers "não casado sem
// dependentes ou casado dois titulares" (i.e. married-two-earners uses Table I *regardless* of
// dependent count, via its own non-zero per-dependent column) -- only a *single* filer with 1+
// dependents moves to Table II's own higher per-dependent constant. Table III (married sole
// earner) likewise covers 0-or-more dependents on its own. The disabled tables mirror this: IV has
// no per-dependent column at all (by construction, 0 dependents only), V/VI are the single/
// married-two-earners-with-dependents disabled variants, VII covers married-sole-earner-disabled
// at any dependent count.
function selectTableId(filingStatus: FilingStatus, dependents: number, disabled: boolean): TableId {
  if (disabled) {
    if (filingStatus === 'marriedOneEarner') return 'VII';
    if (dependents > 0) return filingStatus === 'single' ? 'V' : 'VI';
    return 'IV';
  }
  if (filingStatus === 'marriedOneEarner') return 'III';
  if (filingStatus === 'single' && dependents > 0) return 'II';
  return 'I';
}

function deductionAmount(bracket: SalaryBracket, monthlyRemuneration: number): number {
  if (typeof bracket.deduction === 'number') return bracket.deduction;
  return (
    bracket.rate *
    bracket.deduction.multiplier *
    (bracket.deduction.threshold - monthlyRemuneration)
  );
}

function findBracket(brackets: SalaryBracket[], monthlyRemuneration: number): SalaryBracket {
  for (const bracket of brackets) {
    if (bracket.upTo === null || monthlyRemuneration <= bracket.upTo) return bracket;
  }
  return brackets[brackets.length - 1];
}

/** IRS withheld for one month's remuneration `R`, per Despacho n.º 3 alíneas a)/b). The "3 or more
 * dependents" 1-percentage-point marginal-rate reduction (n.º 5 alínea h) applies to the *outer*
 * `R x taxa` term only -- the despacho's own text says the parcela a abater and per-dependent
 * deduction stay unchanged, which (for the 2 "variable formula" rows) also means the deduction
 * formula itself keeps using the *original*, unreduced rate, since it's computed from
 * `bracket.rate`, not the locally-reduced value. */
export function calculateMonthlyIrs(
  monthlyRemuneration: number,
  region: Region,
  filingStatus: FilingStatus,
  dependents: number,
  disabled: boolean,
): number {
  if (monthlyRemuneration <= 0) return 0;
  const table = TABLES[region][selectTableId(filingStatus, dependents, disabled)];
  const bracket = findBracket(table.brackets, monthlyRemuneration);
  const publishedDeduction = deductionAmount(bracket, monthlyRemuneration);
  const effectiveRate = dependents >= 3 ? Math.max(0, bracket.rate - 0.01) : bracket.rate;
  const tax =
    monthlyRemuneration * effectiveRate -
    publishedDeduction -
    table.perDependentDeduction * dependents;
  return Math.max(0, tax);
}

export interface MealAllowanceInput {
  dailyAmount: number;
  type: MealAllowanceType;
  /** Default `DEFAULT_MEAL_ALLOWANCE_WORKING_DAYS` (22) when omitted/non-positive. */
  workingDaysPerMonth?: number;
}

interface MealAllowanceAmounts {
  total: number;
  exempt: number;
  excess: number;
}

function computeMealAllowance(input: MealAllowanceInput | null | undefined): MealAllowanceAmounts {
  if (!input || input.dailyAmount <= 0) return { total: 0, exempt: 0, excess: 0 };
  const days =
    input.workingDaysPerMonth && input.workingDaysPerMonth > 0
      ? input.workingDaysPerMonth
      : DEFAULT_MEAL_ALLOWANCE_WORKING_DAYS;
  const ceiling = MEAL_ALLOWANCE_EXEMPT_DAILY[input.type];
  const exemptDaily = Math.min(input.dailyAmount, ceiling);
  const excessDaily = Math.max(0, input.dailyAmount - ceiling);
  return {
    total: input.dailyAmount * days,
    exempt: exemptDaily * days,
    excess: excessDaily * days,
  };
}

interface FamilySituation {
  region: Region;
  filingStatus: FilingStatus;
  dependents: number;
  disabled: boolean;
}

export interface MonthlyBreakdown {
  /** Base salary (vencimento base) for this "slot" -- excludes meal allowance. */
  gross: number;
  /** What was actually subject to IRS/SS lookup (gross + any meal-allowance excess over the
   * exemption ceiling). Equal to `gross` whenever there's no meal allowance or it's under ceiling. */
  taxableBase: number;
  employeeSocialSecurity: number;
  irs: number;
  /** Take-home cash for this slot, including the full meal allowance (exempt + excess) where
   * applicable -- the excess portion is still received, just already taxed via `taxableBase`. */
  net: number;
  employerSocialSecurity: number;
  /** What the employer actually pays out for this slot: gross + meal allowance (in full, since the
   * employer pays it regardless of its own tax treatment) + the employer's own SS contribution. */
  totalEmployerCost: number;
}

function computeMonthFromBase(
  baseSalary: number,
  situation: FamilySituation,
  mealAllowance: MealAllowanceInput | null | undefined,
): MonthlyBreakdown {
  const meal = computeMealAllowance(mealAllowance);
  const taxableBase = baseSalary + meal.excess;
  const irs = calculateMonthlyIrs(
    taxableBase,
    situation.region,
    situation.filingStatus,
    situation.dependents,
    situation.disabled,
  );
  const employeeSocialSecurity = taxableBase * EMPLOYEE_SOCIAL_SECURITY_RATE;
  const employerSocialSecurity = taxableBase * EMPLOYER_SOCIAL_SECURITY_RATE;
  return {
    gross: baseSalary,
    taxableBase,
    employeeSocialSecurity,
    irs,
    net: baseSalary + meal.total - irs - employeeSocialSecurity,
    employerSocialSecurity,
    totalEmployerCost: baseSalary + meal.total + employerSocialSecurity,
  };
}

// Subsídios de férias/Natal are always withheld autonomously (Art. 99.º-C CIRS, n.º 5) at the
// effective rate that would apply to the FULL subsidy amount paid in one go -- which is exactly
// what calling the standard formula with the full subsidy as `R` computes. No meal allowance
// applies to a subsidy payment.
function computeSubsidyMonth(baseSalary: number, situation: FamilySituation): MonthlyBreakdown {
  return computeMonthFromBase(baseSalary, situation, null);
}

const BISECTION_ITERATIONS = 60;
const BISECTION_UPPER_BOUND = 1_000_000;

// Net is a monotonically non-decreasing, piecewise-linear function of the base salary (the
// withholding tables are explicitly designed to avoid regressivity -- both despachos' own preamble
// text says as much), so a plain bisection search over gross is simpler and less error-prone than
// deriving a closed-form inverse per bracket type (there are 2 distinct deduction-formula shapes
// across 7 tables x 3 regions) -- and it automatically handles the meal-allowance interaction too,
// since it just re-runs the same forward calculation.
function solveGrossForNet(
  targetNet: number,
  situation: FamilySituation,
  mealAllowance: MealAllowanceInput | null | undefined,
): number {
  if (targetNet <= 0) return 0;
  // `pr-reviewer` finding: with a meal allowance present, `computeMonthFromBase(0, ...).net` can
  // already exceed a very low `targetNet` (the meal allowance's own exempt portion is take-home
  // cash regardless of base salary) -- gross can't go negative, so that target is infeasible.
  // Without this guard, bisection still "converges" (every `net(mid)` is above target, so `high`
  // walks down to a floating-point-noise value near but not exactly 0), returning a base salary
  // like `4.3e-13` paired with a `net` far above what was actually requested, with no signal that
  // the request couldn't be met. Short-circuiting to a clean 0 doesn't resolve the target/net
  // mismatch (there is no non-negative gross that would), but it is the true closest achievable
  // answer and avoids returning noisy near-zero floats.
  if (targetNet <= computeMonthFromBase(0, situation, mealAllowance).net) return 0;
  let low = 0;
  let high = BISECTION_UPPER_BOUND;
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const mid = (low + high) / 2;
    const net = computeMonthFromBase(mid, situation, mealAllowance).net;
    if (net < targetNet) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

export interface SalaryCalculatorInput {
  direction: CalculationDirection;
  /** Monthly amount, denominated per `direction` (gross base salary, or desired net take-home
   * including any meal allowance below). */
  amount: number;
  region: Region;
  filingStatus: FilingStatus;
  dependents: number;
  disabled: boolean;
  mealAllowance?: MealAllowanceInput | null;
}

export interface SalaryCalculatorResult {
  baseSalary: number;
  mealAllowanceMonthly: number;
  regularMonth: MonthlyBreakdown;
  /** One full holiday/Christmas subsidy payment (lump-sum mode). */
  subsidyMonth: MonthlyBreakdown;
  /** A regular month's own pay plus 1/12 of each of the 2 subsidies (duodécimos mode) -- 2/12 of
   * one subsidy's worth combined, i.e. `subsidyMonth / 6`. Same annual total either way. */
  monthlyWithDuodecimos: MonthlyBreakdown;
  /** Full 14-payment year (12 regular months + 2 full subsidies) -- independent of whichever
   * `SubsidyPaymentMode` the UI is displaying, since duodécimos only changes cash-flow timing. */
  annual: MonthlyBreakdown;
}

function sumBreakdowns(
  regular: MonthlyBreakdown,
  subsidy: MonthlyBreakdown,
  subsidyCount: number,
): MonthlyBreakdown {
  return {
    gross: regular.gross * 12 + subsidy.gross * subsidyCount,
    taxableBase: regular.taxableBase * 12 + subsidy.taxableBase * subsidyCount,
    employeeSocialSecurity:
      regular.employeeSocialSecurity * 12 + subsidy.employeeSocialSecurity * subsidyCount,
    irs: regular.irs * 12 + subsidy.irs * subsidyCount,
    net: regular.net * 12 + subsidy.net * subsidyCount,
    employerSocialSecurity:
      regular.employerSocialSecurity * 12 + subsidy.employerSocialSecurity * subsidyCount,
    totalEmployerCost: regular.totalEmployerCost * 12 + subsidy.totalEmployerCost * subsidyCount,
  };
}

function scaleBreakdown(breakdown: MonthlyBreakdown, factor: number): MonthlyBreakdown {
  return {
    gross: breakdown.gross * factor,
    taxableBase: breakdown.taxableBase * factor,
    employeeSocialSecurity: breakdown.employeeSocialSecurity * factor,
    irs: breakdown.irs * factor,
    net: breakdown.net * factor,
    employerSocialSecurity: breakdown.employerSocialSecurity * factor,
    totalEmployerCost: breakdown.totalEmployerCost * factor,
  };
}

function addBreakdowns(a: MonthlyBreakdown, b: MonthlyBreakdown): MonthlyBreakdown {
  return {
    gross: a.gross + b.gross,
    taxableBase: a.taxableBase + b.taxableBase,
    employeeSocialSecurity: a.employeeSocialSecurity + b.employeeSocialSecurity,
    irs: a.irs + b.irs,
    net: a.net + b.net,
    employerSocialSecurity: a.employerSocialSecurity + b.employerSocialSecurity,
    totalEmployerCost: a.totalEmployerCost + b.totalEmployerCost,
  };
}

const ZERO_BREAKDOWN: MonthlyBreakdown = {
  gross: 0,
  taxableBase: 0,
  employeeSocialSecurity: 0,
  irs: 0,
  net: 0,
  employerSocialSecurity: 0,
  totalEmployerCost: 0,
};

export function calculateSalary(input: SalaryCalculatorInput): SalaryCalculatorResult {
  if (input.amount <= 0) {
    return {
      baseSalary: 0,
      mealAllowanceMonthly: 0,
      regularMonth: ZERO_BREAKDOWN,
      subsidyMonth: ZERO_BREAKDOWN,
      monthlyWithDuodecimos: ZERO_BREAKDOWN,
      annual: ZERO_BREAKDOWN,
    };
  }

  const situation: FamilySituation = {
    region: input.region,
    filingStatus: input.filingStatus,
    dependents: Math.max(0, Math.floor(input.dependents)),
    disabled: input.disabled,
  };

  const baseSalary =
    input.direction === 'grossToNet'
      ? input.amount
      : solveGrossForNet(input.amount, situation, input.mealAllowance);

  const regularMonth = computeMonthFromBase(baseSalary, situation, input.mealAllowance);
  const subsidyMonth = computeSubsidyMonth(baseSalary, situation);
  const monthlyWithDuodecimos = addBreakdowns(regularMonth, scaleBreakdown(subsidyMonth, 1 / 6));
  const annual = sumBreakdowns(regularMonth, subsidyMonth, 2);

  return {
    baseSalary,
    // `pr-reviewer` finding: reading this straight off `computeMealAllowance` instead of
    // reverse-deriving it by subtracting other already-computed fields off `regularMonth.net` --
    // the two were only equal by an un-enforced algebraic identity with `computeMonthFromBase`'s
    // own `net` formula, which a future edit to that formula could silently break with no
    // compiler error and no test catching the drift.
    mealAllowanceMonthly: computeMealAllowance(input.mealAllowance).total,
    regularMonth,
    subsidyMonth,
    monthlyWithDuodecimos,
    annual,
  };
}

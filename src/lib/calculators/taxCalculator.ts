// PORTED VERBATIM from budget-app-web (src/pages/Tools/taxCalculator.ts @ 4d056e3). Powers the
// public /ferramentas/recibos-verdes page -- same logic, same numbers, as the in-app tool, by
// design. If the source file changes in budget-app-web (a tax bracket update, a new tax year),
// re-sync this copy by hand; there is no shared package between the two repos.
//
// Calculates estimated net income/tax for an independent worker (recibos verdes) in Portugal:
// progressive IRS brackets, IAS values, IRS Jovem tables, and the Social Security /
// regime-simplificado / RNH formulas below implement Portugal's own published tax rules for
// categoria B income. Kept dependency-free so it's a plain, unit-testable pure function like
// every other feature-local `lib` helper here.
//
// The core calculation engine here was originally adapted from the MIT-licensed
// github.com/franciscobmacedo/remotefreelancept -- see /THIRD_PARTY_NOTICES.md for the full
// license text and attribution.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- unlike every other money
// value in this app (CLAUDE.md's "money is always integer cents" rule). That rule exists to guard
// float-precision bugs across API calls and cached client state; this tool has neither (confirmed
// via direct product decision: a purely client-side scratchpad, EUR only regardless of the signed-
// in account's own currency setting, since Portuguese tax figures are only ever expressed in EUR).

export type TaxYear = 2023 | 2024 | 2025 | 2026;
export const SUPPORTED_TAX_YEARS: readonly TaxYear[] = [2026, 2025, 2024, 2023];
export const DEFAULT_TAX_YEAR: TaxYear = 2026;

export const YEAR_BUSINESS_DAYS = 248;
const SOCIAL_SECURITY_RATE = 0.214;
const SOCIAL_SECURITY_MONTHLY_FLOOR = 20;
const MAX_EXPENSES_RATE = 0.15;
const MIN_SPECIFIC_DEDUCTION = 4104;
const RNH_FLAT_RATE = 0.2;

export const SIMPLIFIED_REGIME_COEFFICIENTS = {
  standard: 0.75,
  firstYear: 0.375,
  secondYear: 0.5625,
} as const;
export type SimplifiedRegimeYear = keyof typeof SIMPLIFIED_REGIME_COEFFICIENTS;

// Marital status + the per-dependent tax credit, added 2026-09-08 (direct user request, after
// noticing the original reference tool this file was once ported from -- see this file's own
// "second follow-up" history note in CLAUDE.md -- never modeled either). Two distinct mechanisms
// under Código do IRS, verified directly against Portal das Finanças's own reproduction of each
// article's text:
//
// **Quociente conjugal (Art. 69º CIRS)** -- a married/união-de-facto couple opting for joint
// taxation ("tributação conjunta") has their COMBINED taxable income divided by exactly 2 before
// the bracket lookup, and the resulting tax multiplied by 2 -- confirmed the divisor is a flat 2
// regardless of dependent count (dependents only affect the separate Art. 78º-A credit below, not
// this divisor). **Scope decision, confirmed via direct question**: modeling the real joint-vs-
// separate choice accurately needs the spouse's own income too (the benefit depends entirely on
// how unequal the two incomes are) -- rather than add a second required income field, this models
// only the two cases the request actually asked about: `spouseWorking: false` assumes €0 spouse
// income (so combined income = this filer's own taxable income, halved and doubled -- the full
// quotient-splitting benefit), and `spouseWorking: true` is treated as equivalent to separate
// taxation (the same result as `'single'`) -- a defensible simplification, not a real modeling of
// two comparable incomes' own joint-vs-separate tradeoff, which a couple with similar earnings
// would typically choose separate taxation for anyway (little-to-no quotient benefit when incomes
// are close). **RNH bypasses the quotient split entirely** in this implementation (a flat rate on
// this filer's own taxable income regardless of marital status) -- RNH's 20% flat rate is already a
// replacement for the whole progressive-bracket system, and no source found while building this
// discusses combining it with quociente conjugal, so it's treated as a per-individual override.
//
// **Per-dependent tax credit (Art. 78º-A CIRS)** -- a deduction from the final tax due (a "dedução
// à coleta", i.e. subtracted from `yearIrs` directly, not from `taxableIncome`), not affected by
// marital status: €600/dependent aged over 3; €726 (600+126) for a dependent under 3; €900
// (600+300) for the 2nd-or-later dependent aged 6 or under, "independentemente da idade do primeiro
// dependente" (regardless of the first dependent's own age) -- verbatim from the article's own n.º
// 3. n.º 4's own "não são cumulativas" (the n.º 2 under-3 bonus and n.º 3 2nd-dependent bonus don't
// stack for the same dependent) is resolved by assigning the higher-value 900 slots to as many
// ≤6-year-old dependents as the "2nd onward" rule allows, since which specific dependent is
// legally "first" isn't something this aggregate calculator has any way to know or ask for -- see
// `calculateDependentsDeduction`'s own comment for the exact assignment. **Scope cut, flagged**:
// ascendant deductions (a dependent parent/grandparent in the household) aren't modeled -- the
// user's own request only asked about a spouse and dependents.
export type MaritalStatus = 'single' | 'married';

const DEPENDENT_BASE_DEDUCTION = 600;
const DEPENDENT_UNDER_THREE_BONUS = 126;
const DEPENDENT_SECOND_ONWARD_BONUS = 300;

/** Art. 78º-A CIRS's per-dependent deduction to the tax due. `dependents` is the total count,
 * `dependentsAgeSixOrUnder` and `dependentsUnderThree` are subsets of it (each clamped to its own
 * upper bound, so an inconsistent combination like more "under three" than "six or under" can't
 * produce a nonsensical result). Only one of the two age-based bonuses ever applies per dependent
 * (n.º 4's "não cumulativas") -- since the 900 total (2nd-onward, ≤6) beats the 726 total (under
 * 3, if it happens to be the sole/first ≤6 dependent), the highest-value assignment gives every
 * ≤6-year-old dependent the 900 bonus except exactly one (the one this calculator has no way to
 * identify as legally "first"), which gets 726 only if every ≤6 dependent is also under 3 (i.e.
 * there's no older-than-3-but-≤6 dependent available to "spend" the non-bonus slot on instead). */
export function calculateDependentsDeduction(
  dependents: number,
  dependentsAgeSixOrUnder: number,
  dependentsUnderThree: number,
): number {
  const total = Math.max(0, Math.floor(dependents));
  if (total <= 0) return 0;
  const sixOrUnder = Math.min(total, Math.max(0, Math.floor(dependentsAgeSixOrUnder)));
  const underThree = Math.min(sixOrUnder, Math.max(0, Math.floor(dependentsUnderThree)));

  const olderThanSix = total - sixOrUnder;
  let deduction = olderThanSix * DEPENDENT_BASE_DEDUCTION;

  if (sixOrUnder > 0) {
    // The "first" (non-bonus) slot only has to be under-3 if every ≤6 dependent is -- otherwise
    // give it to a non-under-3 one so the under-3 dependent(s) get the bigger 2nd-onward bonus.
    const firstSlotIsUnderThree = sixOrUnder === underThree;
    const firstSlotValue =
      DEPENDENT_BASE_DEDUCTION + (firstSlotIsUnderThree ? DEPENDENT_UNDER_THREE_BONUS : 0);
    const secondOnwardValue = DEPENDENT_BASE_DEDUCTION + DEPENDENT_SECOND_ONWARD_BONUS;
    deduction += firstSlotValue + (sixOrUnder - 1) * secondOnwardValue;
  }

  return deduction;
}

// Segurança Social's own allowed adjustment range to the 70%-of-income contribution base, in 5%
// steps.
export const SS_DISCOUNT_CHOICES = [
  -0.25, -0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2, 0.25,
] as const;

export interface TaxBracket {
  id: number;
  min: number;
  max: number | null;
  normalRate: number;
  averageRate: number | null;
}

// Portuguese IRS progressive brackets (categoria B / geral), 2023-2026. `averageRate` is the
// published cumulative effective rate up to that bracket's own `max` -- used by
// `calculateFreelancerTaxes` below via the *previous* bracket, per Portugal's own official
// "taxa média + taxa marginal" simplified calculation method.
export const TAX_BRACKETS_BY_YEAR: Record<TaxYear, TaxBracket[]> = {
  2023: [
    { id: 1, min: 0, max: 7479, normalRate: 0.145, averageRate: 0.145 },
    { id: 2, min: 7479, max: 11284, normalRate: 0.21, averageRate: 0.1669 },
    { id: 3, min: 11284, max: 15992, normalRate: 0.265, averageRate: 0.1958 },
    { id: 4, min: 15992, max: 20700, normalRate: 0.285, averageRate: 0.2161 },
    { id: 5, min: 20700, max: 26355, normalRate: 0.35, averageRate: 0.2448 },
    { id: 6, min: 26355, max: 38632, normalRate: 0.37, averageRate: 0.2846 },
    { id: 7, min: 38632, max: 50483, normalRate: 0.435, averageRate: 0.3199 },
    { id: 8, min: 50483, max: 78834, normalRate: 0.45, averageRate: 0.3667 },
    { id: 9, min: 78834, max: null, normalRate: 0.48, averageRate: null },
  ],
  2024: [
    { id: 1, min: 0, max: 7703, normalRate: 0.13, averageRate: 0.13 },
    { id: 2, min: 7703, max: 11623, normalRate: 0.165, averageRate: 0.1418 },
    { id: 3, min: 11623, max: 16472, normalRate: 0.22, averageRate: 0.16482 },
    { id: 4, min: 16472, max: 21321, normalRate: 0.25, averageRate: 0.18419 },
    { id: 5, min: 21321, max: 27146, normalRate: 0.32, averageRate: 0.21334 },
    { id: 6, min: 27146, max: 39791, normalRate: 0.35, averageRate: 0.25835 },
    { id: 7, min: 39791, max: 43000, normalRate: 0.435, averageRate: 0.27154 },
    { id: 8, min: 43000, max: 80000, normalRate: 0.45, averageRate: 0.35408 },
    { id: 9, min: 80000, max: null, normalRate: 0.48, averageRate: null },
  ],
  2025: [
    { id: 1, min: 0, max: 8059, normalRate: 0.13, averageRate: 0.13 },
    { id: 2, min: 8059, max: 12160, normalRate: 0.165, averageRate: 0.1418 },
    { id: 3, min: 12160, max: 17233, normalRate: 0.22, averageRate: 0.16482 },
    { id: 4, min: 17233, max: 22306, normalRate: 0.25, averageRate: 0.18419 },
    { id: 5, min: 22306, max: 28400, normalRate: 0.32, averageRate: 0.21334 },
    { id: 6, min: 28400, max: 41629, normalRate: 0.355, averageRate: 0.25835 },
    { id: 7, min: 41629, max: 44987, normalRate: 0.435, averageRate: 0.27154 },
    { id: 8, min: 44987, max: 83696, normalRate: 0.45, averageRate: 0.35408 },
    { id: 9, min: 83696, max: null, normalRate: 0.48, averageRate: null },
  ],
  2026: [
    { id: 1, min: 0, max: 8342, normalRate: 0.125, averageRate: 0.125 },
    { id: 2, min: 8342, max: 12587, normalRate: 0.157, averageRate: 0.13579 },
    { id: 3, min: 12587, max: 17838, normalRate: 0.212, averageRate: 0.15823 },
    { id: 4, min: 17838, max: 23089, normalRate: 0.241, averageRate: 0.17705 },
    { id: 5, min: 23089, max: 29397, normalRate: 0.311, averageRate: 0.20579 },
    { id: 6, min: 29397, max: 43090, normalRate: 0.349, averageRate: 0.2513 },
    { id: 7, min: 43090, max: 46566, normalRate: 0.431, averageRate: 0.26472 },
    { id: 8, min: 46566, max: 86634, normalRate: 0.446, averageRate: 0.34856 },
    { id: 9, min: 86634, max: null, normalRate: 0.48, averageRate: null },
  ],
};

// Indexante dos Apoios Sociais -- caps the Social Security contribution base (12x IAS/year).
export const IAS_BY_YEAR: Record<TaxYear, number> = {
  2023: 480.43,
  2024: 509.26,
  2025: 522.5,
  2026: 537.13,
};

export interface YouthIrsBracket {
  maxDiscountPercentage: number;
  maxDiscountIasMultiplier: number;
}

// IRS Jovem -- keyed by "which year of the benefit" (1-indexed), one table per tax year since the
// regime's own shape changed across years (5 benefit years pre-2025, 10 from 2025 on).
export const YOUTH_IRS_BY_YEAR: Record<TaxYear, Record<number, YouthIrsBracket>> = {
  2023: {
    1: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 12.5 },
    2: { maxDiscountPercentage: 0.4, maxDiscountIasMultiplier: 10 },
    3: { maxDiscountPercentage: 0.3, maxDiscountIasMultiplier: 7.5 },
    4: { maxDiscountPercentage: 0.3, maxDiscountIasMultiplier: 7.5 },
    5: { maxDiscountPercentage: 0.2, maxDiscountIasMultiplier: 5 },
  },
  2024: {
    1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 40 },
    2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 30 },
    3: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 20 },
    4: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 20 },
    5: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 10 },
  },
  2025: {
    1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 55 },
    2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
    3: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
    4: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
    5: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 55 },
    6: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 55 },
    7: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 55 },
    8: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
    9: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
    10: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
  },
  2026: {
    1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 55 },
    2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
    3: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
    4: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
    5: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 55 },
    6: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 55 },
    7: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 55 },
    8: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
    9: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
    10: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
  },
};

export function youthIrsMaxBenefitYear(taxYear: TaxYear): number {
  return Object.keys(YOUTH_IRS_BY_YEAR[taxYear]).length;
}

export type IncomeFrequency = 'year' | 'month' | 'day';

export interface AmountBreakdown {
  year: number;
  month: number;
  day: number;
}

export interface TaxCalculatorInput {
  /** The amount entered, denominated per `incomeFrequency` (not necessarily annual). */
  income: number;
  incomeFrequency: IncomeFrequency;
  taxYear: TaxYear;
  /** How many "months" annual figures are spread across for the monthly average. Default 12. */
  monthsPerYear?: number;
  /** Non-business days subtracted from the 248-day year for the daily rate. Default 0. */
  daysOff?: number;
  /** One of `SS_DISCOUNT_CHOICES`. Default 0. */
  socialSecurityDiscount?: number;
  /** New freelancers' first-12-months Social Security exemption. Default false. */
  socialSecurityFirstYearExempt?: boolean;
  /** Regime simplificado's reduced-coefficient years. Default 'standard' (75%). */
  simplifiedRegimeYear?: SimplifiedRegimeYear;
  /** Real documented annual expenses. `null`/`undefined` = auto (assumes exactly enough to hit
   * the 15% ceiling, i.e. `expensesNeeded`, avoiding any deduction shortfall penalty). */
  expenses?: number | null;
  /** Non-habitual resident flat 20% IRS rate, replacing the progressive brackets entirely. */
  nonHabitualResident?: boolean;
  youthIrs?: { enabled: boolean; benefitYear: number } | null;
  /** Default 'single'. See this file's own "Marital status" comment above for exactly what
   * `spouseWorking` does and doesn't model. */
  maritalStatus?: MaritalStatus;
  /** Only consulted when `maritalStatus === 'married'`. Default false (spouse not working). */
  spouseWorking?: boolean;
  /** Only consulted when `maritalStatus === 'married' && spouseWorking`. The spouse's own annual
   * taxable income ("rendimento coletável") -- not their gross salary, since deriving that would
   * need modeling their own tax category from scratch (a much bigger scope than this tool's own
   * Categoria B focus). `undefined`/`0` falls back to the previous "same as single" approximation
   * with no behavior change. When a positive value is given, both separate and joint (quociente
   * conjugal) taxation are computed and whichever gives less total tax is used -- matching what an
   * optimal taxpayer actually does (a progressive schedule is convex, so joint is mathematically
   * never worse than separate, per Jensen's inequality; the comparison is still computed
   * explicitly rather than assumed, since this app's own bracket data is the source of truth, not
   * a general mathematical property asserted in a comment). The combined tax is attributed back to
   * this filer proportionally to their own share of the combined taxable income (confirmed via
   * direct question -- a real joint return has one combined bill, not a literal per-person split). */
  spouseTaxableIncome?: number;
  /** Total dependent count. Default 0. */
  dependents?: number;
  /** Subset of `dependents` aged 6 or under. Default 0, clamped to `dependents`. */
  dependentsAgeSixOrUnder?: number;
  /** Subset of `dependentsAgeSixOrUnder` aged under 3. Default 0, clamped to it. */
  dependentsUnderThree?: number;
}

export interface TaxCalculatorResult {
  grossIncome: AmountBreakdown;
  socialSecurity: AmountBreakdown;
  irs: AmountBreakdown;
  netIncome: AmountBreakdown;
  taxableIncome: number;
  maxExpenses: number;
  specificDeductions: number;
  expensesNeeded: number;
  expensesApplied: number;
  /** Art. 78º-A CIRS's per-dependent deduction to the tax due, already subtracted from `irs`
   * above (and floored so `irs` never goes negative) -- exposed separately for transparency, same
   * as `specificDeductions`/`maxExpenses` already are. */
  dependentsDeduction: number;
  /** True when a real `spouseTaxableIncome` was given and joint taxation actually produced a
   * lower (or equal, in which case this stays `false`) combined tax than separate taxation --
   * i.e. whether the quociente conjugal comparison actually changed anything for this filer.
   * Always `false` when `spouseTaxableIncome` isn't provided or is 0. */
  jointTaxationApplied: boolean;
  /** `null` only when `grossIncome.year <= 0` -- a degenerate input the UI never actually submits
   * (it only calls this once a positive gross income has been entered). */
  bracket: TaxBracket | null;
}

const ZERO_BREAKDOWN: AmountBreakdown = { year: 0, month: 0, day: 0 };

function computeGrossIncome(
  income: number,
  frequency: IncomeFrequency,
  monthsPerYear: number,
  activeDays: number,
): AmountBreakdown {
  switch (frequency) {
    case 'year':
      return { year: income, month: income / monthsPerYear, day: income / activeDays };
    case 'month': {
      const year = income * monthsPerYear;
      return { year, month: income, day: year / activeDays };
    }
    case 'day': {
      const year = income * activeDays;
      return { year, month: year / monthsPerYear, day: income };
    }
  }
}

function findBracket(brackets: TaxBracket[], taxableIncome: number): TaxBracket {
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const isLast = i === brackets.length - 1;
    const aboveMin = taxableIncome >= bracket.min;
    const belowMax = bracket.max === null || taxableIncome <= bracket.max;
    if (aboveMin && (isLast || belowMax)) {
      return bracket;
    }
  }
  return brackets[0];
}

// Portugal's own official simplified method: the previous bracket's published average
// (cumulative) rate applies up to that bracket's own ceiling, and only the excess above it is
// taxed at the current bracket's marginal rate. Extracted so `calculateFreelancerTaxes` can apply
// it twice under quociente conjugal (once to the halved income, doubling the result) without
// duplicating the bracket-lookup logic. Exported so irsCalculator.ts (the annual IRS simulator)
// reuses the exact same bracket-application method rather than a second, possibly-diverging one.
export function computeProgressiveIrs(taxableIncome: number, brackets: TaxBracket[]): number {
  const bracket = findBracket(brackets, taxableIncome);
  if (bracket.id <= 1) return taxableIncome * bracket.normalRate;
  const bracketAvg = brackets.find((b) => b.id === bracket.id - 1)!;
  const taxIncomeAvg = bracketAvg.max!;
  const taxIncomeNormal = taxableIncome - taxIncomeAvg;
  return taxIncomeAvg * (bracketAvg.averageRate ?? 0) + taxIncomeNormal * bracket.normalRate;
}

function computeYouthIrsDiscount(
  input: TaxCalculatorInput,
  grossYearIncome: number,
  ias: number,
): number {
  if (!input.youthIrs?.enabled) return 0;
  const rank = YOUTH_IRS_BY_YEAR[input.taxYear][input.youthIrs.benefitYear];
  if (!rank) return 0;
  const maxDiscount = rank.maxDiscountPercentage * grossYearIncome;
  const maxDiscountIas = rank.maxDiscountIasMultiplier * ias;
  return Math.min(maxDiscount, maxDiscountIas);
}

export function calculateFreelancerTaxes(input: TaxCalculatorInput): TaxCalculatorResult {
  const monthsPerYear = input.monthsPerYear && input.monthsPerYear > 0 ? input.monthsPerYear : 12;
  const daysOff = input.daysOff ?? 0;
  const activeDays = Math.max(1, YEAR_BUSINESS_DAYS - daysOff);

  const grossIncome =
    input.income > 0
      ? computeGrossIncome(input.income, input.incomeFrequency, monthsPerYear, activeDays)
      : ZERO_BREAKDOWN;

  // Returning an all-zero result here (rather than, say, letting the €20/month Social Security
  // floor apply to zero income) keeps this function safe to call directly, including from a test,
  // regardless of whether the caller has already gated on a positive income.
  if (grossIncome.year <= 0) {
    return {
      grossIncome: ZERO_BREAKDOWN,
      socialSecurity: ZERO_BREAKDOWN,
      irs: ZERO_BREAKDOWN,
      netIncome: ZERO_BREAKDOWN,
      taxableIncome: 0,
      maxExpenses: 0,
      specificDeductions: 0,
      expensesNeeded: 0,
      expensesApplied: 0,
      dependentsDeduction: 0,
      jointTaxationApplied: false,
      bracket: null,
    };
  }

  const ias = IAS_BY_YEAR[input.taxYear];
  const maxSsIncome = 12 * ias;

  let socialSecurity: AmountBreakdown;
  if (input.socialSecurityFirstYearExempt) {
    socialSecurity = ZERO_BREAKDOWN;
  } else {
    const discount = input.socialSecurityDiscount ?? 0;
    // 70% of gross income (adjusted by the chosen discount) is the SS contribution base, capped
    // at 12x IAS/year. Note the annual floor is computed from the *unfloored* monthly figure,
    // while the returned monthly figure is floored separately -- an intentional asymmetry, not a
    // bug: the €20/month floor only ever matters for a genuinely tiny income, where 12x that
    // floor and the real annual total are close enough that either reads as "effectively zero."
    const rawMonthSS =
      SOCIAL_SECURITY_RATE * Math.min(maxSsIncome, grossIncome.month * 0.7 * (1 + discount));
    const yearSS = Math.max(12 * rawMonthSS, SOCIAL_SECURITY_MONTHLY_FLOOR * 12);
    socialSecurity = {
      year: yearSS,
      month: Math.max(rawMonthSS, SOCIAL_SECURITY_MONTHLY_FLOOR),
      day: yearSS / activeDays,
    };
  }

  const specificDeductions = Math.max(
    MIN_SPECIFIC_DEDUCTION,
    Math.min(socialSecurity.year, 0.1 * grossIncome.year),
  );
  const maxExpenses = MAX_EXPENSES_RATE * grossIncome.year;
  const expensesNeeded = Math.max(0, maxExpenses - specificDeductions);
  const expensesApplied = input.expenses ?? expensesNeeded;
  const expensesMissing = Math.max(0, expensesNeeded - expensesApplied);

  const youthIrsDiscount = computeYouthIrsDiscount(input, grossIncome.year, ias);
  const coefficient = SIMPLIFIED_REGIME_COEFFICIENTS[input.simplifiedRegimeYear ?? 'standard'];
  const taxableIncome = Math.max(
    0,
    (grossIncome.year - youthIrsDiscount) * coefficient + expensesMissing,
  );

  const brackets = TAX_BRACKETS_BY_YEAR[input.taxYear];
  // Quociente conjugal (both the €0-spouse-income and real-spouse-income cases below) only applies
  // to the standard progressive path -- see this file's own "Marital status" comment above for why
  // RNH is treated as a per-individual override instead, regardless of marital status.
  const spouseTaxableIncome = input.spouseTaxableIncome ?? 0;
  const dependentsDeduction = calculateDependentsDeduction(
    input.dependents ?? 0,
    input.dependentsAgeSixOrUnder ?? 0,
    input.dependentsUnderThree ?? 0,
  );

  let bracket: TaxBracket;
  let yearIrs: number;
  let jointTaxationApplied = false;

  if (input.nonHabitualResident) {
    bracket = findBracket(brackets, taxableIncome);
    yearIrs = taxableIncome * RNH_FLAT_RATE - dependentsDeduction;
  } else if (input.maritalStatus === 'married' && !input.spouseWorking) {
    // Spouse not working -- assumed €0 income, so combined income = this filer's own, halved and
    // doubled for the full quotient-splitting benefit (see this file's own "Marital status"
    // comment for why this doesn't need a real spouse-income input the way the branch below does).
    const rateLookupIncome = taxableIncome / 2;
    bracket = findBracket(brackets, rateLookupIncome);
    yearIrs = 2 * computeProgressiveIrs(rateLookupIncome, brackets) - dependentsDeduction;
  } else if (input.maritalStatus === 'married' && input.spouseWorking && spouseTaxableIncome > 0) {
    // Real spouse income given -- compute both separate and joint totals and use whichever is
    // lower (see this field's own comment on `spouseTaxableIncome` for why joint is mathematically
    // never worse, per Jensen's inequality on a convex/progressive schedule, and why this filer's
    // own share is attributed proportionally rather than shown as one household total). The
    // dependents credit is a shared household benefit against the ONE combined bill -- subtracted
    // from `combinedTax` *before* the proportional split, not from this filer's own share
    // afterward, so the full credit is actually used even when this filer's own share alone
    // wouldn't have been enough to absorb it (caught during review: subtracting it post-split
    // under-valued the credit and effectively stranded the unused remainder against nothing).
    const combinedTaxableIncome = taxableIncome + spouseTaxableIncome;
    const jointRateLookupIncome = combinedTaxableIncome / 2;
    const separateTotal =
      computeProgressiveIrs(taxableIncome, brackets) +
      computeProgressiveIrs(spouseTaxableIncome, brackets);
    const jointTotal = 2 * computeProgressiveIrs(jointRateLookupIncome, brackets);
    jointTaxationApplied = jointTotal < separateTotal;
    bracket = findBracket(brackets, jointTaxationApplied ? jointRateLookupIncome : taxableIncome);
    const combinedTax = Math.max(0, Math.min(separateTotal, jointTotal) - dependentsDeduction);
    yearIrs = combinedTax * (taxableIncome / combinedTaxableIncome);
  } else {
    bracket = findBracket(brackets, taxableIncome);
    yearIrs = computeProgressiveIrs(taxableIncome, brackets) - dependentsDeduction;
  }
  yearIrs = Math.max(yearIrs, 0);

  const irs: AmountBreakdown = {
    year: yearIrs,
    month: yearIrs / monthsPerYear,
    day: yearIrs / activeDays,
  };

  const netYear = grossIncome.year - irs.year - socialSecurity.year;
  const netIncome: AmountBreakdown = {
    year: netYear,
    month: grossIncome.month - irs.month - socialSecurity.month,
    day: netYear / activeDays,
  };

  return {
    grossIncome,
    socialSecurity,
    irs,
    netIncome,
    taxableIncome,
    maxExpenses,
    specificDeductions,
    dependentsDeduction,
    jointTaxationApplied,
    expensesNeeded,
    expensesApplied,
    bracket,
  };
}

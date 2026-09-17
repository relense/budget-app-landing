// Original to this repo (NOT ported from budget-app-web -- there is no in-app equivalent of this
// tool). Powers the public /ferramentas/simulador-reforma and
// /tools/portugal-state-pension-calculator pages.
//
// Replacement-rate table: European Commission, DG ECFIN/Ageing Working Group, "2024 Ageing
// Report -- Country Fiche for Portugal" (April 2024), Table 18, row "Total replacement rate
// (earnings-related benefits)", page 40. The sharp 2040->2050 drop is a structural artifact of
// the CGA (Caixa Geral de Aposentações) civil-servants scheme phasing out, per the report's own
// narrative -- NOT a projected benefit cut for people retiring in 2050. See this calculator's own
// explainer copy for the plain-language version; never present this table's numbers as a
// certainty in UI copy (always hedge with "estimated"/"estimada").
//
// Statutory retirement age table: Portaria n.º 358/2024/1 (Diário da República) for the 2026
// figure; the underlying formula (2/3 of INE's own measured increase in life expectancy at 65,
// indexed annually) is set by Decreto-Lei n.º 187/2007, art. 20.º. Only used to source this
// calculator's *default* input value -- retirement age itself stays a user-editable input, this
// file does not attempt to project the statutory age beyond the last confirmed year (2027).
//
// Deliberately uses plain `number` (euros), not integer cents -- same reasoning as this
// directory's other calculators (taxCalculator.ts, compoundInterest.ts, salaryCalculator.ts):
// CLAUDE.md's "money is always integer cents" rule guards float-precision bugs across API calls
// and cached client state, and this is a purely client-side, unpersisted scratchpad. EUR only
// (Portugal-specific, like taxCalculator.ts).

export type AgeingReportEdition = '2024';
export const AGEING_REPORT_EDITIONS: readonly AgeingReportEdition[] = ['2024'];
export const DEFAULT_AGEING_REPORT_EDITION: AgeingReportEdition = '2024';

export interface ReplacementRateTablePoint {
  year: number;
  ratePercent: number;
}

// Sorted ascending by year -- getReplacementRatePercent's interpolation relies on this order.
export const REPLACEMENT_RATE_TABLE_BY_EDITION: Record<AgeingReportEdition, ReplacementRateTablePoint[]> = {
  '2024': [
    { year: 2022, ratePercent: 67.3 },
    { year: 2030, ratePercent: 77.4 },
    { year: 2040, ratePercent: 86.5 },
    { year: 2050, ratePercent: 37.0 },
    { year: 2060, ratePercent: 38.0 },
    { year: 2070, ratePercent: 37.0 },
  ],
};

/** Linear interpolation between the table's own decade columns; clamps to the 2022 and 2070
 * edge values outside that range (there's no published data before/after, so this is the most
 * defensible flat extrapolation, not a guess at a trend). */
export function getReplacementRatePercent(
  year: number,
  edition: AgeingReportEdition = DEFAULT_AGEING_REPORT_EDITION,
): number {
  const table = REPLACEMENT_RATE_TABLE_BY_EDITION[edition];
  if (year <= table[0].year) return table[0].ratePercent;
  const last = table[table.length - 1];
  if (year >= last.year) return last.ratePercent;
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (year >= a.year && year <= b.year) {
      const fraction = (year - a.year) / (b.year - a.year);
      return a.ratePercent + fraction * (b.ratePercent - a.ratePercent);
    }
  }
  return last.ratePercent; // unreachable given the two guards above
}

export type StatutoryRetirementAgeYear = 2023 | 2024 | 2025 | 2026 | 2027;
export const SUPPORTED_STATUTORY_RETIREMENT_AGE_YEARS: readonly StatutoryRetirementAgeYear[] = [
  2027, 2026, 2025, 2024, 2023,
];
export const DEFAULT_STATUTORY_RETIREMENT_AGE_YEAR: StatutoryRetirementAgeYear = 2026;

// Value in decimal years (e.g. 66y9m = 66 + 9/12). Not expected to reach 67 until ~2056 on the
// current trajectory per DL 187/2007's formula -- see this calculator's own FAQ copy.
export const STATUTORY_RETIREMENT_AGE_BY_YEAR: Record<StatutoryRetirementAgeYear, number> = {
  2023: 66 + 4 / 12,
  2024: 66 + 4 / 12,
  2025: 66 + 7 / 12,
  2026: 66 + 9 / 12,
  2027: 66 + 11 / 12,
};

export const DEFAULT_RETIREMENT_AGE =
  STATUTORY_RETIREMENT_AGE_BY_YEAR[DEFAULT_STATUTORY_RETIREMENT_AGE_YEAR]; // 66.75

export interface AnnuityPresentValueInput {
  paymentPerPeriod: number;
  ratePerPeriod: number;
  numberOfPeriods: number;
}

/** PV = PMT x [1 - (1+r)^-n] / r -- present value of an ordinary annuity. Falls back to a flat
 * paymentPerPeriod * n when ratePerPeriod is 0 (the limit of the formula as r -> 0). */
export function presentValueOfAnnuity({
  paymentPerPeriod,
  ratePerPeriod,
  numberOfPeriods,
}: AnnuityPresentValueInput): number {
  const n = Math.max(0, numberOfPeriods);
  if (n === 0) return 0;
  if (ratePerPeriod === 0) return paymentPerPeriod * n;
  return (paymentPerPeriod * (1 - Math.pow(1 + ratePerPeriod, -n))) / ratePerPeriod;
}

export interface PaymentForFutureValueInput {
  futureValue: number;
  ratePerPeriod: number;
  numberOfPeriods: number;
}

/** PMT = FV x r / ((1+r)^n - 1) -- the recurring payment (sinking fund) that grows to futureValue
 * over numberOfPeriods. Falls back to futureValue / n when ratePerPeriod is 0. Returns 0 for 0
 * periods (there's no time left to save into, the caller should surface that as its own state
 * rather than treat this as a real answer). */
export function paymentForFutureValue({
  futureValue,
  ratePerPeriod,
  numberOfPeriods,
}: PaymentForFutureValueInput): number {
  const n = Math.max(0, numberOfPeriods);
  if (n === 0) return 0;
  if (ratePerPeriod === 0) return futureValue / n;
  return (futureValue * ratePerPeriod) / (Math.pow(1 + ratePerPeriod, n) - 1);
}

export interface FutureValueOfLumpSumInput {
  presentValue: number;
  ratePerPeriod: number;
  numberOfPeriods: number;
}

/** FV = PV x (1+r)^n -- how much an already-saved lump sum grows to by retirement. */
export function futureValueOfLumpSum({
  presentValue,
  ratePerPeriod,
  numberOfPeriods,
}: FutureValueOfLumpSumInput): number {
  return presentValue * Math.pow(1 + ratePerPeriod, Math.max(0, numberOfPeriods));
}

export interface PensionGapInput {
  birthYear: number;
  /** Caller-supplied (e.g. new Date().getFullYear()) -- kept out of this pure function. */
  currentYear: number;
  netMonthlySalary: number;
  /** Decimal years. Default DEFAULT_RETIREMENT_AGE (66.75, the 2026 statutory figure). */
  retirementAge?: number;
  /** Default 0. */
  alreadySaved?: number;
  /** Annual, real (inflation-adjusted). Default 3. */
  realReturnPercent?: number;
  /** Fixed planning horizon in years for the retirement-income gap. Default 20 -- NOT exposed as
   * an editable input per the product spec, only the noGrowthInRetirement toggle and
   * realReturnPercent are. */
  planningHorizonYears?: number;
  /** True = capital needed is gap x 12 x planningHorizonYears, no discounting (simpler, more
   * conservative). False (default) = present-value-of-annuity discounting during retirement too. */
  noGrowthInRetirement?: boolean;
  ageingReportEdition?: AgeingReportEdition;
}

export interface PensionGapResult {
  retirementYear: number;
  replacementRatePercent: number;
  estimatedMonthlyPension: number;
  monthlyGap: number;
  yearsToRetirement: number;
  monthsToRetirement: number;
  capitalNeededAtRetirement: number;
  monthlySavingNeeded: number;
}

export function calculatePensionGap(input: PensionGapInput): PensionGapResult {
  const retirementAge = input.retirementAge ?? DEFAULT_RETIREMENT_AGE;
  const realReturnPercent = input.realReturnPercent ?? 3;
  const planningHorizonYears = input.planningHorizonYears ?? 20;
  const alreadySaved = input.alreadySaved ?? 0;
  const edition = input.ageingReportEdition ?? DEFAULT_AGEING_REPORT_EDITION;

  const retirementYear = input.birthYear + retirementAge;
  const replacementRatePercent = getReplacementRatePercent(retirementYear, edition);
  const estimatedMonthlyPension = input.netMonthlySalary * (replacementRatePercent / 100);
  const monthlyGap = Math.max(0, input.netMonthlySalary - estimatedMonthlyPension);

  const yearsToRetirement = Math.max(0, retirementYear - input.currentYear);
  const monthsToRetirement = Math.round(yearsToRetirement * 12);
  const monthlyRate = realReturnPercent / 100 / 12;
  const horizonMonths = planningHorizonYears * 12;

  const capitalNeededAtRetirement = input.noGrowthInRetirement
    ? monthlyGap * horizonMonths
    : presentValueOfAnnuity({
        paymentPerPeriod: monthlyGap,
        ratePerPeriod: monthlyRate,
        numberOfPeriods: horizonMonths,
      });

  const alreadySavedFutureValue = futureValueOfLumpSum({
    presentValue: alreadySaved,
    ratePerPeriod: monthlyRate,
    numberOfPeriods: monthsToRetirement,
  });
  const remainingFutureValueNeeded = Math.max(0, capitalNeededAtRetirement - alreadySavedFutureValue);
  const monthlySavingNeeded = paymentForFutureValue({
    futureValue: remainingFutureValueNeeded,
    ratePerPeriod: monthlyRate,
    numberOfPeriods: monthsToRetirement,
  });

  return {
    retirementYear,
    replacementRatePercent,
    estimatedMonthlyPension,
    monthlyGap,
    yearsToRetirement,
    monthsToRetirement,
    capitalNeededAtRetirement,
    monthlySavingNeeded,
  };
}

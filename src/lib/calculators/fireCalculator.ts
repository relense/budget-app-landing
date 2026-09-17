// Original to this repo (NOT ported from budget-app-web -- there is no in-app equivalent).
// Powers /ferramentas/calculadora-fire and /tools/fire-calculator.
//
// Standard FIRE (Financial Independence, Retire Early) math: a "FIRE number" is the desired
// annual income divided by a safe withdrawal rate (the inverse of the classic "4% rule", from
// the 1998 Trinity Study / Bengen's 1994 research -- both US-market-only studies). "Years to
// FIRE" solves the standard future-value equation (lump sum + growing annuity) for the number of
// periods. "Coast FIRE" is the FIRE number discounted back to today at the real return over that
// same horizon: the lump sum that, left alone with no further contributions, would still compound
// up to the FIRE number by that date.
//
// Deliberately uses plain `number` (euros), not integer cents -- same reasoning as this
// directory's other calculators: a purely client-side, unpersisted scratchpad. Currency-agnostic
// like compoundInterest.ts (this math has no Portugal-specific rule baked in), so the euro symbol
// only appears in the page's own display formatting, not in this module.

export interface RealReturnInput {
  nominalReturnPercent: number;
  inflationPercent: number;
}

/** (1 + nominal) / (1 + inflation) - 1, as a percentage. All FIRE math below works in this real
 * (inflation-adjusted) rate, so every euro figure the calculator shows is already in today's
 * purchasing power -- the user never has to separately account for inflation. */
export function realReturnPercent({ nominalReturnPercent, inflationPercent }: RealReturnInput): number {
  return ((1 + nominalReturnPercent / 100) / (1 + inflationPercent / 100) - 1) * 100;
}

export interface FutureValueOfAnnuityInput {
  paymentPerPeriod: number;
  ratePerPeriod: number;
  numberOfPeriods: number;
}

/** FV = PMT x [((1+r)^n - 1) / r] -- future value of an ordinary (end-of-period) annuity. Falls
 * back to a flat multiply at a zero rate (the limit of the formula as r -> 0). */
export function futureValueOfAnnuity({
  paymentPerPeriod,
  ratePerPeriod,
  numberOfPeriods,
}: FutureValueOfAnnuityInput): number {
  const n = Math.max(0, numberOfPeriods);
  if (n === 0) return 0;
  if (ratePerPeriod === 0) return paymentPerPeriod * n;
  return paymentPerPeriod * ((Math.pow(1 + ratePerPeriod, n) - 1) / ratePerPeriod);
}

export interface FutureValueOfLumpSumInput {
  presentValue: number;
  ratePerPeriod: number;
  numberOfPeriods: number;
}

/** FV = PV x (1+r)^n. */
export function futureValueOfLumpSum({
  presentValue,
  ratePerPeriod,
  numberOfPeriods,
}: FutureValueOfLumpSumInput): number {
  return presentValue * Math.pow(1 + ratePerPeriod, Math.max(0, numberOfPeriods));
}

export interface MonthsToTargetInput {
  currentAmount: number;
  monthlyContribution: number;
  monthlyRate: number;
  targetAmount: number;
}

/** Solves currentAmount*(1+r)^n + monthlyContribution*((1+r)^n - 1)/r = targetAmount for n
 * (in months). Returns 0 if already at/above target, and `null` if the target is mathematically
 * unreachable (no rate of growth and no contribution can ever close the gap -- e.g. zero already
 * saved, zero monthly contribution, and a positive target). */
export function monthsToTarget({
  currentAmount,
  monthlyContribution,
  monthlyRate,
  targetAmount,
}: MonthsToTargetInput): number | null {
  if (currentAmount >= targetAmount) return 0;

  if (monthlyRate === 0) {
    if (monthlyContribution <= 0) return null;
    return (targetAmount - currentAmount) / monthlyContribution;
  }

  const r = monthlyRate;
  const c = monthlyContribution;
  const denom = currentAmount + c / r;
  const numer = targetAmount + c / r;
  if (denom <= 0) return null;
  const x = numer / denom;
  if (x <= 0) return null;

  const months = Math.log(x) / Math.log(1 + r);
  if (!isFinite(months) || months < 0) return null;
  return months;
}

// Reference age Coast FIRE discounts back to, when the user gives their current age. NOT the
// same "FIRE year at current pace" used for the headline years-to-FIRE result -- discounting
// against that number instead is mathematically almost always false whenever there's an active
// contribution: monthsToTarget already finds the SMALLEST n where (current + contributions)
// reach the FIRE number, which means current alone strictly falls short at that same n whenever
// the contribution did any real work getting there. Coast FIRE tools standardly discount back
// from a fixed reference retirement age instead, decoupling the question from the contribution
// pace: "if I stopped contributing today, would my current balance alone still compound to the
// FIRE number by ordinary retirement age?" 65 is the common assumption; stated as a simplification
// in this page's own explainer copy.
export const COAST_FIRE_REFERENCE_AGE = 65;

export interface FireInput {
  /** Today's euros. */
  desiredMonthlyIncome: number;
  currentAmount: number;
  monthlyContribution: number;
  /** Annual, nominal. Default 7. */
  nominalReturnPercent?: number;
  /** Annual. Default 2. */
  inflationPercent?: number;
  /** Annual. Default 4 (the classic "4% rule"). */
  withdrawalRatePercent?: number;
  /** Optional -- shows ageAtFire, AND is required for a real Coast FIRE check (discounted from
   * COAST_FIRE_REFERENCE_AGE). Without it, coastFireNumber/coastFireAchieved fall back to the
   * current-pace horizon, which is a much weaker check for the reason above -- surface that in
   * the UI by only showing the Coast FIRE line when age is provided. */
  currentAge?: number | null;
}

export interface FireScenarioResult {
  nominalReturnPercent: number;
  realReturnPercent: number;
  monthsToFire: number | null;
  yearsToFire: number | null;
  ageAtFire: number | null;
  coastFireNumber: number | null;
  coastFireAchieved: boolean;
}

export interface FireResult {
  fireNumber: number;
  /** The user's own entered return. */
  primary: FireScenarioResult;
  /** The same inputs at nominalReturnPercent - 2, for a side-by-side "what if returns are
   * lower" comparison -- never a promise, always shown next to the primary scenario. */
  lowerReturn: FireScenarioResult;
}

function calculateScenario(
  nominalReturnPercent: number,
  inflationPercent: number,
  currentAmount: number,
  monthlyContribution: number,
  currentAge: number | null,
  fireNumber: number,
): FireScenarioResult {
  const realReturn = realReturnPercent({ nominalReturnPercent, inflationPercent });
  const monthlyRate = realReturn / 100 / 12;

  const monthsToFire = monthsToTarget({
    currentAmount,
    monthlyContribution,
    monthlyRate,
    targetAmount: fireNumber,
  });
  const yearsToFire = monthsToFire === null ? null : monthsToFire / 12;
  const ageAtFire = currentAge != null && yearsToFire !== null ? currentAge + yearsToFire : null;

  // Prefer discounting from the fixed reference retirement age (see COAST_FIRE_REFERENCE_AGE's
  // own comment for why); only fall back to the current-pace horizon when no age was given.
  const coastFireMonths =
    currentAge != null
      ? Math.max(0, COAST_FIRE_REFERENCE_AGE - currentAge) * 12
      : monthsToFire;
  const coastFireNumber =
    coastFireMonths === null ? null : fireNumber / Math.pow(1 + monthlyRate, coastFireMonths);
  const coastFireAchieved = coastFireNumber !== null && currentAmount >= coastFireNumber;

  return {
    nominalReturnPercent,
    realReturnPercent: realReturn,
    monthsToFire,
    yearsToFire,
    ageAtFire,
    coastFireNumber,
    coastFireAchieved,
  };
}

export function calculateFire(input: FireInput): FireResult {
  const nominalReturnPercent = input.nominalReturnPercent ?? 7;
  const inflationPercent = input.inflationPercent ?? 2;
  const withdrawalRatePercent = input.withdrawalRatePercent ?? 4;
  const currentAge = input.currentAge ?? null;

  const fireNumber = (input.desiredMonthlyIncome * 12) / (withdrawalRatePercent / 100);

  const primary = calculateScenario(
    nominalReturnPercent,
    inflationPercent,
    input.currentAmount,
    input.monthlyContribution,
    currentAge,
    fireNumber,
  );
  const lowerReturn = calculateScenario(
    nominalReturnPercent - 2,
    inflationPercent,
    input.currentAmount,
    input.monthlyContribution,
    currentAge,
    fireNumber,
  );

  return { fireNumber, primary, lowerReturn };
}

export interface PortfolioSeriesInput {
  currentAmount: number;
  monthlyContribution: number;
  monthlyRate: number;
  years: number;
}

/** Year-by-year portfolio value from year 0 (today) to `years`, inclusive -- used to draw the
 * chart. Each point uses the closed-form lump-sum + annuity future value, not a running loop, so
 * it's exact and independent of step size. */
export function projectPortfolioByYear({
  currentAmount,
  monthlyContribution,
  monthlyRate,
  years,
}: PortfolioSeriesInput): number[] {
  const wholeYears = Math.max(0, Math.round(years));
  const series: number[] = [];
  for (let year = 0; year <= wholeYears; year++) {
    const months = year * 12;
    const value =
      futureValueOfLumpSum({ presentValue: currentAmount, ratePerPeriod: monthlyRate, numberOfPeriods: months }) +
      futureValueOfAnnuity({ paymentPerPeriod: monthlyContribution, ratePerPeriod: monthlyRate, numberOfPeriods: months });
    series.push(value);
  }
  return series;
}

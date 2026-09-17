import { describe, expect, it } from 'vitest';
import {
  calculatePensionGap,
  getReplacementRatePercent,
  paymentForFutureValue,
  presentValueOfAnnuity,
} from './pensionCalculator';

describe('getReplacementRatePercent', () => {
  it('returns the exact table value at a table year, no interpolation', () => {
    expect(getReplacementRatePercent(2030)).toBeCloseTo(77.4, 10);
  });

  it('interpolates linearly between two table years', () => {
    // Midpoint of 2030 (77.4) and 2040 (86.5): (77.4 + 86.5) / 2 = 81.95
    expect(getReplacementRatePercent(2035)).toBeCloseTo(81.95, 10);
  });

  it('clamps below the earliest table year (2022)', () => {
    expect(getReplacementRatePercent(2010)).toBeCloseTo(67.3, 10);
  });

  it('clamps above the latest table year (2070)', () => {
    expect(getReplacementRatePercent(2100)).toBeCloseTo(37.0, 10);
  });

  it('returns the exact boundary values, not an off-by-one clamp', () => {
    expect(getReplacementRatePercent(2022)).toBeCloseTo(67.3, 10);
    expect(getReplacementRatePercent(2070)).toBeCloseTo(37.0, 10);
  });
});

describe('presentValueOfAnnuity / paymentForFutureValue', () => {
  // PMT=€100/period, r=1%/period, n=12 periods. (1.01)^12 = 1.126825030131969.
  // FV of that ordinary annuity = 100 * (1.126825030131969 - 1) / 0.01 = 1268.2503...
  // PV = FV / (1.01)^12 = 1268.2503 / 1.126825030131969 = 1125.5077...

  it('computes present value of an ordinary annuity against a hand-derived example', () => {
    const pv = presentValueOfAnnuity({ paymentPerPeriod: 100, ratePerPeriod: 0.01, numberOfPeriods: 12 });
    expect(pv).toBeCloseTo(1125.51, 2);
  });

  it('computes the payment that grows to a given future value against the same example', () => {
    const pmt = paymentForFutureValue({ futureValue: 1268.2503, ratePerPeriod: 0.01, numberOfPeriods: 12 });
    expect(pmt).toBeCloseTo(100, 2);
  });

  it('falls back to a flat multiply/divide at a zero rate', () => {
    expect(presentValueOfAnnuity({ paymentPerPeriod: 50, ratePerPeriod: 0, numberOfPeriods: 24 })).toBe(1200);
    expect(paymentForFutureValue({ futureValue: 1200, ratePerPeriod: 0, numberOfPeriods: 24 })).toBe(50);
  });

  it('returns 0 for zero periods', () => {
    expect(paymentForFutureValue({ futureValue: 1000, ratePerPeriod: 0.01, numberOfPeriods: 0 })).toBe(0);
    expect(presentValueOfAnnuity({ paymentPerPeriod: 100, ratePerPeriod: 0.01, numberOfPeriods: 0 })).toBe(0);
  });
});

describe('calculatePensionGap', () => {
  const base = {
    birthYear: 1990,
    currentYear: 2026,
    netMonthlySalary: 2000,
    retirementAge: 66,
    noGrowthInRetirement: true,
  } as const;

  it('computes the retirement year and clamped/interpolated replacement rate', () => {
    const result = calculatePensionGap(base);
    expect(result.retirementYear).toBe(2056);
    // Interpolating 2050 (37.0) -> 2060 (38.0), 2056 is 60% of the way: 37.0 + 0.6 * 1.0 = 37.6
    expect(result.replacementRatePercent).toBeCloseTo(37.6, 10);
  });

  it('computes the estimated pension and monthly gap', () => {
    const result = calculatePensionGap(base);
    expect(result.estimatedMonthlyPension).toBeCloseTo(752, 6);
    expect(result.monthlyGap).toBeCloseTo(1248, 6);
  });

  it('computes capital needed with no discounting when noGrowthInRetirement is true', () => {
    const result = calculatePensionGap(base);
    expect(result.capitalNeededAtRetirement).toBeCloseTo(299520, 6); // 1248 * 240
  });

  it('discounts the capital needed when noGrowthInRetirement is false', () => {
    const noGrowth = calculatePensionGap(base);
    const discounted = calculatePensionGap({ ...base, noGrowthInRetirement: false, realReturnPercent: 3 });
    expect(discounted.capitalNeededAtRetirement).toBeLessThan(noGrowth.capitalNeededAtRetirement);
  });

  it('clamps monthly saving needed to 0 when already-saved covers the full capital needed', () => {
    const result = calculatePensionGap({ ...base, alreadySaved: 10_000_000, realReturnPercent: 3, noGrowthInRetirement: false });
    expect(result.monthlySavingNeeded).toBe(0);
  });

  it('treats an omitted alreadySaved the same as an explicit 0', () => {
    const omitted = calculatePensionGap(base);
    const explicit = calculatePensionGap({ ...base, alreadySaved: 0 });
    expect(omitted.monthlySavingNeeded).toBeCloseTo(explicit.monthlySavingNeeded, 8);
  });

  it('clamps the replacement rate to the 2022 floor when retirement lands before the table range', () => {
    const result = calculatePensionGap({ ...base, birthYear: 1950, retirementAge: 60 });
    expect(result.retirementYear).toBe(2010);
    expect(result.replacementRatePercent).toBeCloseTo(67.3, 10);
  });

  it('clamps the replacement rate to the 2070 ceiling when retirement lands after the table range', () => {
    const result = calculatePensionGap({ ...base, birthYear: 2000, retirementAge: 75 });
    expect(result.retirementYear).toBe(2075);
    expect(result.replacementRatePercent).toBeCloseTo(37.0, 10);
  });
});

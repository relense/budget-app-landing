import { describe, expect, it } from 'vitest';
import { calculateTrueCarCost, type TrueCarCostInput } from './trueCarCost';

const base: TrueCarCostInput = {
  purchasePrice: 20000,
  yearsKept: 5,
  resaleValuePercent: 40,
  annualInsurance: 400,
  annualIuc: 50,
  kmPerYear: 15000,
  consumptionPer100Km: 6,
  fuelPricePerUnit: 1.7,
  annualMaintenance: 300,
  loanAmount: 0,
  loanAnnualRatePercent: 0,
  loanTermMonths: 0,
};

describe('calculateTrueCarCost', () => {
  it('matches a hand-computed example with no loan', () => {
    // resale = 20000*0.4 = 8000, depreciation = (20000-8000)/5 = 2400
    // fuel = 15000/100 * 6 * 1.7 = 1530
    // total = 2400 + 400 + 50 + 1530 + 300 = 4680, monthly = 390
    const result = calculateTrueCarCost(base);
    expect(result.resaleValue).toBe(8000);
    expect(result.annualDepreciation).toBe(2400);
    expect(result.annualFuel).toBeCloseTo(1530, 6);
    expect(result.annualLoanInterest).toBe(0);
    expect(result.annualTotal).toBeCloseTo(4680, 6);
    expect(result.monthlyTotal).toBeCloseTo(390, 6);
  });

  it('matches a hand-computed example including loan interest', () => {
    // 15000 at 5%/year over 60 months: monthly payment 283.068505, total interest 1984.110280,
    // averaged annual interest 396.822056 (independently computed via the same French formula).
    const result = calculateTrueCarCost({
      ...base,
      loanAmount: 15000,
      loanAnnualRatePercent: 5,
      loanTermMonths: 60,
    });
    expect(result.annualLoanInterest).toBeCloseTo(396.822056, 3);
    expect(result.annualTotal).toBeCloseTo(4680 + 396.822056, 3);
  });

  it('treats a zero-rate loan as principal spread evenly with no interest', () => {
    const result = calculateTrueCarCost({ ...base, loanAmount: 12000, loanAnnualRatePercent: 0, loanTermMonths: 48 });
    expect(result.annualLoanInterest).toBeCloseTo(0, 6);
  });

  it('ignores loan fields when loanAmount is 0', () => {
    const result = calculateTrueCarCost({ ...base, loanAnnualRatePercent: 5, loanTermMonths: 60, loanAmount: 0 });
    expect(result.annualLoanInterest).toBe(0);
  });

  it('never lets depreciation go negative when resale value exceeds purchase price', () => {
    const result = calculateTrueCarCost({ ...base, resaleValuePercent: 120 });
    expect(result.annualDepreciation).toBe(0);
  });

  it('returns zero depreciation when yearsKept is 0, without dividing by zero', () => {
    const result = calculateTrueCarCost({ ...base, yearsKept: 0 });
    expect(result.annualDepreciation).toBe(0);
    expect(Number.isFinite(result.annualTotal)).toBe(true);
  });
});

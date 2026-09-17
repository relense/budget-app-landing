import { describe, expect, it } from 'vitest';
import { calculateMortgagePrepayment, type MortgagePrepaymentInput } from './mortgagePrepayment';

// Worked example from the brief: 150,000 at 3.5% TAN over 300 months, one-off 10,000.
// Expected figures independently computed from the standard French-system formulas
// (M = P*r / (1-(1+r)^-n), months-to-payoff = -ln(1 - r*P/M) / ln(1+r)):
//   baseline monthly payment    750.935355
//   baseline total interest     75280.606617
// reduceTerm: new months 269.449356, new total interest 62339.047585, interest saved 12941.559032
// reduceInstallment: new payment 700.872998, new total interest 70261.899509, saved 5018.707108
const base: MortgagePrepaymentInput = {
  outstandingBalance: 150000,
  remainingMonths: 300,
  annualRatePercent: 3.5,
  extraAmount: 10000,
  mode: 'oneOff',
  strategy: 'reduceTerm',
  feeRatePercent: 0.5,
};

describe('calculateMortgagePrepayment', () => {
  it('matches the worked example baseline (no extra payment) figures', () => {
    const result = calculateMortgagePrepayment({ ...base, extraAmount: 0 });
    expect(result.baselineMonthlyPayment).toBeCloseTo(750.935355, 4);
    expect(result.baselineTotalInterest).toBeCloseTo(75280.606617, 3);
    expect(result.interestSaved).toBe(0);
    expect(result.monthsSaved).toBe(0);
    expect(result.fee).toBe(0);
  });

  it('matches the worked example one-off/reduceTerm figures', () => {
    const result = calculateMortgagePrepayment(base);
    expect(result.newRemainingMonths).toBeCloseTo(269.449356, 3);
    expect(result.newTotalInterest).toBeCloseTo(62339.047585, 2);
    expect(result.interestSaved).toBeCloseTo(12941.559032, 2);
    expect(result.monthsSaved).toBeCloseTo(30.550644, 3);
    expect(result.newMonthlyPayment).toBeCloseTo(750.935355, 4); // unchanged under reduceTerm
  });

  it('matches the worked example one-off/reduceInstallment figures', () => {
    const result = calculateMortgagePrepayment({ ...base, strategy: 'reduceInstallment' });
    expect(result.newMonthlyPayment).toBeCloseTo(700.872998, 4);
    expect(result.newTotalInterest).toBeCloseTo(70261.899509, 2);
    expect(result.interestSaved).toBeCloseTo(5018.707108, 2);
    expect(result.newRemainingMonths).toBe(300); // term unchanged under reduceInstallment
  });

  it('charges the fee as a flat rate on the capital repaid, for a one-off payment', () => {
    const result = calculateMortgagePrepayment({ ...base, feeRatePercent: 0.5 });
    expect(result.fee).toBeCloseTo(10000 * 0.005, 6);

    const fixedRateResult = calculateMortgagePrepayment({ ...base, feeRatePercent: 2 });
    expect(fixedRateResult.fee).toBeCloseTo(10000 * 0.02, 6);
  });

  it('reduceTerm saves strictly more interest than reduceInstallment for the same extra payment', () => {
    const reduceTerm = calculateMortgagePrepayment(base);
    const reduceInstallment = calculateMortgagePrepayment({ ...base, strategy: 'reduceInstallment' });
    expect(reduceTerm.interestSaved).toBeGreaterThan(reduceInstallment.interestSaved);
  });

  it('shortens the term under monthly top-up mode and saves interest', () => {
    const result = calculateMortgagePrepayment({ ...base, mode: 'monthly', extraAmount: 100 });
    expect(result.newRemainingMonths).toBeLessThan(300);
    expect(result.newMonthlyPayment).toBeCloseTo(result.baselineMonthlyPayment + 100, 6);
    expect(result.interestSaved).toBeGreaterThan(0);
  });

  it('handles a zero interest rate without dividing by zero', () => {
    const result = calculateMortgagePrepayment({ ...base, annualRatePercent: 0, extraAmount: 0 });
    expect(result.baselineMonthlyPayment).toBeCloseTo(150000 / 300, 6);
    expect(result.baselineTotalInterest).toBeCloseTo(0, 6);
  });

  it('never lets the new balance go negative when the extra payment exceeds the outstanding balance', () => {
    const result = calculateMortgagePrepayment({ ...base, extraAmount: 200000 });
    expect(result.newRemainingMonths).toBe(0);
    expect(result.newTotalInterest).toBeLessThanOrEqual(0.01);
  });
});

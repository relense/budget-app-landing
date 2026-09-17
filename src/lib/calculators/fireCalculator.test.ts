import { describe, expect, it } from 'vitest';
import { calculateFire, monthsToTarget, realReturnPercent } from './fireCalculator';

describe('realReturnPercent', () => {
  it('computes the Fisher-equation real rate from nominal return and inflation', () => {
    // (1.07 / 1.02 - 1) * 100 = 4.90196...
    expect(realReturnPercent({ nominalReturnPercent: 7, inflationPercent: 2 })).toBeCloseTo(4.902, 2);
  });
});

describe('monthsToTarget', () => {
  it('returns 0 when already at or above the target', () => {
    expect(
      monthsToTarget({ currentAmount: 500_000, monthlyContribution: 0, monthlyRate: 0.003, targetAmount: 400_000 }),
    ).toBe(0);
  });

  it('returns null ("never") when there is no current amount, no contribution, and no rate', () => {
    expect(
      monthsToTarget({ currentAmount: 0, monthlyContribution: 0, monthlyRate: 0, targetAmount: 500_000 }),
    ).toBeNull();
  });

  it('returns null ("never") when there is no contribution and a non-positive rate', () => {
    expect(
      monthsToTarget({ currentAmount: 1000, monthlyContribution: 0, monthlyRate: 0, targetAmount: 500_000 }),
    ).toBeNull();
  });

  it('falls back to a flat linear divide at a zero rate with a positive contribution', () => {
    expect(monthsToTarget({ currentAmount: 0, monthlyContribution: 100, monthlyRate: 0, targetAmount: 1200 })).toBe(
      12,
    );
  });

  // Cross-validate the closed form against a plain monthly simulation loop for one representative
  // scenario, per the spec's own "test them against each other" instruction.
  it('matches a monthly simulation loop', () => {
    const currentAmount = 10_000;
    const monthlyContribution = 500;
    const monthlyRate = 0.004; // ~4.9%/year real, matches the realReturnPercent test above
    const targetAmount = 300_000;

    const closedForm = monthsToTarget({ currentAmount, monthlyContribution, monthlyRate, targetAmount });
    expect(closedForm).not.toBeNull();

    let balance = currentAmount;
    let months = 0;
    while (balance < targetAmount && months < 100 * 12) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      months++;
    }

    expect(closedForm!).toBeGreaterThan(months - 1);
    expect(closedForm!).toBeLessThanOrEqual(months);
  });
});

describe('calculateFire', () => {
  it('computes the FIRE number from desired income and the withdrawal rate', () => {
    // 2000/month * 12 / 0.04 = 600,000
    const result = calculateFire({ desiredMonthlyIncome: 2000, currentAmount: 0, monthlyContribution: 0 });
    expect(result.fireNumber).toBeCloseTo(600_000, 6);
  });

  it('reports "never" (null years) for zero current amount and zero contribution', () => {
    const result = calculateFire({ desiredMonthlyIncome: 2000, currentAmount: 0, monthlyContribution: 0 });
    expect(result.primary.monthsToFire).toBeNull();
    expect(result.primary.yearsToFire).toBeNull();
    expect(result.primary.ageAtFire).toBeNull();
  });

  it('reports 0 years when already above the FIRE number', () => {
    const result = calculateFire({ desiredMonthlyIncome: 1000, currentAmount: 1_000_000, monthlyContribution: 0 });
    expect(result.primary.monthsToFire).toBe(0);
    expect(result.primary.yearsToFire).toBe(0);
  });

  it('computes ageAtFire when currentAge is given', () => {
    const result = calculateFire({
      desiredMonthlyIncome: 2000,
      currentAmount: 50_000,
      monthlyContribution: 1000,
      currentAge: 30,
    });
    expect(result.primary.ageAtFire).toBeCloseTo(30 + result.primary.yearsToFire!, 6);
  });

  it('detects a Coast FIRE crossing: not achieved with little saved, achieved with enough', () => {
    // fireNumber = 600,000. Real return ~4.9%/year. Discounting back 35 years (age 30 -> the
    // COAST_FIRE_REFERENCE_AGE of 65) puts the coast threshold at roughly 108k -- pick amounts
    // clearly below and clearly above that.
    const input = { desiredMonthlyIncome: 2000, monthlyContribution: 500, currentAge: 30 };
    const low = calculateFire({ ...input, currentAmount: 5_000 });
    const high = calculateFire({ ...input, currentAmount: 150_000 });

    expect(low.primary.coastFireAchieved).toBe(false);
    expect(high.primary.coastFireAchieved).toBe(true);
  });

  it('always shows the lower-return scenario taking at least as long as the primary one', () => {
    const result = calculateFire({
      desiredMonthlyIncome: 2000,
      currentAmount: 20_000,
      monthlyContribution: 800,
      nominalReturnPercent: 7,
    });

    expect(result.primary.monthsToFire).not.toBeNull();
    expect(result.lowerReturn.monthsToFire).not.toBeNull();
    expect(result.lowerReturn.monthsToFire!).toBeGreaterThanOrEqual(result.primary.monthsToFire!);
  });

  it('recomputes correctly when the monthly contribution changes (what-if slider)', () => {
    const base = { desiredMonthlyIncome: 2000, currentAmount: 20_000, nominalReturnPercent: 7 };
    const low = calculateFire({ ...base, monthlyContribution: 300 });
    const high = calculateFire({ ...base, monthlyContribution: 1500 });

    expect(high.primary.yearsToFire!).toBeLessThan(low.primary.yearsToFire!);
  });
});

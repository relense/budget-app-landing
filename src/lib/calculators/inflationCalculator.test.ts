import { describe, expect, it } from 'vitest';
import { calculateInflation } from './inflationCalculator';

describe('calculateInflation', () => {
  it('matches a hand-computed example: 1000 euros from 2000 to 2025', () => {
    // Independently computed by compounding the sourced annual CPI series: adjusted = 1686.1494,
    // cumulative = 68.6149%, average annual = 2.1118%.
    const result = calculateInflation({ amount: 1000, startYear: 2000, endYear: 2025 });
    expect(result.adjustedAmount).toBeCloseTo(1686.1494, 3);
    expect(result.cumulativePercent).toBeCloseTo(68.6149, 3);
    expect(result.averageAnnualPercent).toBeCloseTo(2.1118, 3);
  });

  it('matches a hand-computed example: 1000 euros from 2010 to 2020', () => {
    const result = calculateInflation({ amount: 1000, startYear: 2010, endYear: 2020 });
    expect(result.adjustedAmount).toBeCloseTo(1107.1138, 3);
  });

  it('returns the same amount when start and end year are equal', () => {
    const result = calculateInflation({ amount: 500, startYear: 2015, endYear: 2015 });
    expect(result.adjustedAmount).toBeCloseTo(500, 6);
    expect(result.cumulativePercent).toBeCloseTo(0, 6);
    expect(result.averageAnnualPercent).toBe(0);
  });

  it('converts backward in time (a future amount to an earlier year) as the inverse ratio', () => {
    const forward = calculateInflation({ amount: 1000, startYear: 2000, endYear: 2025 });
    const backward = calculateInflation({ amount: forward.adjustedAmount, startYear: 2025, endYear: 2000 });
    expect(backward.adjustedAmount).toBeCloseTo(1000, 3);
  });

  it('clamps years outside the sourced 2000-2025 range instead of throwing or returning NaN', () => {
    const result = calculateInflation({ amount: 1000, startYear: 1990, endYear: 2030 });
    expect(Number.isFinite(result.adjustedAmount)).toBe(true);
  });
});

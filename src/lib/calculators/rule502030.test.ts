import { describe, expect, it } from 'vitest';
import { calculateRule502030 } from './rule502030';

describe('calculateRule502030', () => {
  it('matches the worked example: 1500 net income at the default 50/30/20 split', () => {
    const result = calculateRule502030({ netMonthlyIncome: 1500 });

    expect(result.needs).toBe(750);
    expect(result.wants).toBe(450);
    expect(result.savings).toBe(300);
  });

  it('computes the annualised savings figure', () => {
    const result = calculateRule502030({ netMonthlyIncome: 1500 });
    expect(result.annualSavings).toBe(3600);
  });

  it('accepts a custom percentage split instead of the 50/30/20 default', () => {
    const result = calculateRule502030({
      netMonthlyIncome: 2000,
      needsPercent: 60,
      wantsPercent: 25,
      savingsPercent: 15,
    });

    expect(result.needs).toBe(1200);
    expect(result.wants).toBe(500);
    expect(result.savings).toBe(300);
  });

  it('returns zero for every bucket on zero income', () => {
    const result = calculateRule502030({ netMonthlyIncome: 0 });
    expect(result).toMatchObject({ needs: 0, wants: 0, savings: 0, annualSavings: 0 });
  });
});

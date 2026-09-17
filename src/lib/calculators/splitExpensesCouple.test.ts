import { describe, expect, it } from 'vitest';
import { calculateSplitExpenses } from './splitExpensesCouple';

describe('calculateSplitExpenses', () => {
  it('matches the worked example: A 2000, B 1000, total 1500', () => {
    const result = calculateSplitExpenses({ incomeA: 2000, incomeB: 1000, totalExpenses: 1500 });

    expect(result.fiftyFifty).toEqual({ a: 750, b: 750 });
    expect(result.proportional).toEqual({ a: 1000, b: 500 });
    expect(result.equalLeftover).toEqual({ a: 1250, b: 250 });
  });

  it('splits proportionally to income share, not headcount', () => {
    const result = calculateSplitExpenses({ incomeA: 3000, incomeB: 1000, totalExpenses: 2000 });
    // A earns 75% of the combined income -> pays 75% of the total.
    expect(result.proportional).toEqual({ a: 1500, b: 500 });
  });

  it('leaves both partners with the same amount left over after their share', () => {
    const result = calculateSplitExpenses({ incomeA: 2500, incomeB: 1500, totalExpenses: 1000 });
    const leftoverA = 2500 - result.equalLeftover.a;
    const leftoverB = 1500 - result.equalLeftover.b;
    expect(leftoverA).toBeCloseTo(leftoverB, 6);
  });

  it('floors an equal-leftover contribution at zero when one income cannot cover its share', () => {
    // A earns much less than B relative to a small shared total -- the equal-leftover formula
    // (income - (A+B-total)/2) would ask A for a negative contribution; it must floor at 0, with
    // B picking up the rest so the two still sum to the total.
    const result = calculateSplitExpenses({ incomeA: 100, incomeB: 1000, totalExpenses: 200 });
    expect(result.equalLeftover.a).toBe(0);
    expect(result.equalLeftover.b).toBe(200);
  });

  it('falls back to a plain 50/50 proportional split when one income is zero', () => {
    const result = calculateSplitExpenses({ incomeA: 0, incomeB: 1000, totalExpenses: 500 });
    expect(result.proportional).toEqual({ a: 0, b: 500 });
  });

  it('handles both incomes at zero without dividing by zero', () => {
    const result = calculateSplitExpenses({ incomeA: 0, incomeB: 0, totalExpenses: 500 });
    expect(result.proportional).toEqual({ a: 250, b: 250 });
  });
});

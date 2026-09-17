import { describe, expect, it } from 'vitest';
import { calculateSalary, type SalaryCalculatorResult } from './salaryCalculator';
import { buildPaySchedule } from './paySchedule';

const base = calculateSalary({
  direction: 'grossToNet',
  amount: 1500,
  region: 'continente',
  filingStatus: 'single',
  dependents: 0,
  disabled: false,
});

describe('buildPaySchedule', () => {
  it('returns 12 months', () => {
    expect(buildPaySchedule(base, 'lumpSum')).toHaveLength(12);
  });

  it('lump-sum mode: every regular month is regularMonth.net, June and November get the subsidy added', () => {
    const schedule = buildPaySchedule(base, 'lumpSum');

    for (const entry of schedule) {
      if (entry.month === 6 || entry.month === 11) {
        expect(entry.net).toBeCloseTo(base.regularMonth.net + base.subsidyMonth.net, 6);
        expect(entry.isSubsidy).toBe(true);
      } else {
        expect(entry.net).toBeCloseTo(base.regularMonth.net, 6);
        expect(entry.isSubsidy).toBe(false);
      }
    }
  });

  it('duodécimos mode: every month is the same, flattened amount, none flagged as a subsidy month', () => {
    const schedule = buildPaySchedule(base, 'duodecimos');

    for (const entry of schedule) {
      expect(entry.net).toBeCloseTo(base.monthlyWithDuodecimos.net, 6);
      expect(entry.isSubsidy).toBe(false);
    }
  });

  it('sums to the same annual total in both modes', () => {
    const lumpSumTotal = buildPaySchedule(base, 'lumpSum').reduce((sum, m) => sum + m.net, 0);
    const duodecimosTotal = buildPaySchedule(base, 'duodecimos').reduce((sum, m) => sum + m.net, 0);

    expect(lumpSumTotal).toBeCloseTo(base.annual.net, 4);
    expect(duodecimosTotal).toBeCloseTo(base.annual.net, 4);
  });

  it('returns 12 zeroed months for a zero-salary result', () => {
    const zero: SalaryCalculatorResult = calculateSalary({
      direction: 'grossToNet',
      amount: 0,
      region: 'continente',
      filingStatus: 'single',
      dependents: 0,
      disabled: false,
    });

    const schedule = buildPaySchedule(zero, 'lumpSum');
    expect(schedule.every((m) => m.net === 0)).toBe(true);
  });
});

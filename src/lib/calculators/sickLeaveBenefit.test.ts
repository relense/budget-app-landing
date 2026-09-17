import { describe, expect, it } from 'vitest';
import { calculateSickLeaveBenefit, type SickLeaveBenefitInput } from './sickLeaveBenefit';

const base: SickLeaveBenefitInput = {
  averageMonthlySalary: 1500,
  totalLeaveDays: 40,
  isHospitalization: false,
};

describe('calculateSickLeaveBenefit', () => {
  it('matches a hand-computed example spanning the 1-30 and 31-90 day bands', () => {
    // dailyRef = 1500/30 = 50. 3-day waiting period -> days 4-30 (27 days) @ 55%, days 31-40 (10
    // days) @ 60%. 27*50*0.55 + 10*50*0.6 = 742.5 + 300 = 1042.5
    const result = calculateSickLeaveBenefit(base);
    expect(result.dailyReferenceRemuneration).toBe(50);
    expect(result.waitingDays).toBe(3);
    expect(result.payableDays).toBe(37);
    expect(result.totalBenefit).toBeCloseTo(1042.5, 6);
  });

  it('pays from day 1 with no waiting period for hospitalisation', () => {
    // 30 days @ 55% + 10 days @ 60% = 30*50*0.55 + 10*50*0.6 = 825 + 300 = 1125
    const result = calculateSickLeaveBenefit({ ...base, isHospitalization: true });
    expect(result.waitingDays).toBe(0);
    expect(result.payableDays).toBe(40);
    expect(result.totalBenefit).toBeCloseTo(1125, 6);
  });

  it('pays nothing for a leave shorter than the waiting period', () => {
    const result = calculateSickLeaveBenefit({ ...base, totalLeaveDays: 2 });
    expect(result.payableDays).toBe(0);
    expect(result.totalBenefit).toBe(0);
  });

  it('applies only the 55% rate for a short leave entirely within the first 30 days', () => {
    // days 4-10 (7 days) @ 55%: 7*50*0.55 = 192.5
    const result = calculateSickLeaveBenefit({ ...base, totalLeaveDays: 10 });
    expect(result.totalBenefit).toBeCloseTo(192.5, 6);
  });

  it('spans all four bands for a leave longer than a year', () => {
    // days 4-30 (27d)@55%, 31-90(60d)@60%, 91-365(275d)@70%, 366-400(35d)@75%
    const result = calculateSickLeaveBenefit({ ...base, totalLeaveDays: 400 });
    const expected = 27 * 50 * 0.55 + 60 * 50 * 0.6 + 275 * 50 * 0.7 + 35 * 50 * 0.75;
    expect(result.totalBenefit).toBeCloseTo(expected, 6);
  });

  it('computes the average daily benefit as total divided by payable days', () => {
    const result = calculateSickLeaveBenefit(base);
    expect(result.averageDailyBenefit).toBeCloseTo(result.totalBenefit / result.payableDays, 6);
  });
});

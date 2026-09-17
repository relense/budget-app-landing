import { describe, expect, it } from 'vitest';
import { calculateUnemploymentBenefit, type UnemploymentBenefitInput } from './unemploymentBenefit';

const base: UnemploymentBenefitInput = {
  averageMonthlySalary: 1500,
  ageBand: '30to39',
  contributionMonths: 30,
  contributionBand: 'atLeast24',
  yearsRegisteredLast20: 0,
};

describe('calculateUnemploymentBenefit', () => {
  it('matches a hand-computed example: 1500 salary, 30-39, >=24 months contributed', () => {
    // monthly = 1500 * 0.65 = 975 (within [617.70, 1342.83]); daily = 975/30 = 32.5
    // duration base for 30-39 / atLeast24 = 420 days, no bonus -> total = 32.5 * 420 = 13650
    const result = calculateUnemploymentBenefit(base);
    expect(result.eligible).toBe(true);
    expect(result.monthlyBenefit).toBeCloseTo(975, 6);
    expect(result.dailyBenefit).toBeCloseTo(32.5, 6);
    expect(result.durationDays).toBe(420);
    expect(result.totalOverDuration).toBeCloseTo(13650, 6);
  });

  it('applies the standard 1-IAS floor (537.13) below the minimum wage', () => {
    const result = calculateUnemploymentBenefit({ ...base, averageMonthlySalary: 600 });
    // 600*0.65 = 390, below the 537.13 floor for salaries under the 920 minimum wage.
    expect(result.monthlyBenefit).toBeCloseTo(537.13, 6);
  });

  it('applies the higher 1.15-IAS floor (617.70) at or above the minimum wage', () => {
    const result = calculateUnemploymentBenefit({ ...base, averageMonthlySalary: 950 });
    // 950*0.65 = 617.5, below the 1.15 x IAS(537.13) = 617.6995 floor that applies once salary
    // >= 920 (publicly quoted, rounded to 2dp, as "617.70").
    expect(result.monthlyBenefit).toBeCloseTo(617.7, 2);
  });

  it('applies the 2.5-IAS ceiling (1342.83) for high earners', () => {
    const result = calculateUnemploymentBenefit({ ...base, averageMonthlySalary: 3000 });
    // 2.5 x IAS(537.13) = 1342.825, publicly quoted rounded to 2dp as "1342.83".
    expect(result.monthlyBenefit).toBeCloseTo(1342.83, 2);
  });

  it('reports ineligibility and zero benefit below the 12-month guarantee period', () => {
    const result = calculateUnemploymentBenefit({ ...base, contributionMonths: 6 });
    expect(result.eligible).toBe(false);
    expect(result.monthlyBenefit).toBe(0);
    expect(result.durationDays).toBe(0);
  });

  it('looks up every duration table cell correctly', () => {
    expect(calculateUnemploymentBenefit({ ...base, ageBand: 'under30', contributionBand: 'under15' }).durationDays).toBe(150);
    expect(calculateUnemploymentBenefit({ ...base, ageBand: 'under30', contributionBand: 'atLeast24' }).durationDays).toBe(330);
    expect(calculateUnemploymentBenefit({ ...base, ageBand: '40to49', contributionBand: '15to24' }).durationDays).toBe(360);
    expect(calculateUnemploymentBenefit({ ...base, ageBand: '50plus', contributionBand: 'atLeast24' }).durationDays).toBe(540);
  });

  it('adds the correct bonus days per 5 years registered in the last 20', () => {
    // 50+ band: 60 bonus days per 5 years. 10 years -> 2 x 60 = 120 bonus days on top of the 540 base.
    const result = calculateUnemploymentBenefit({
      ...base,
      ageBand: '50plus',
      contributionBand: 'atLeast24',
      yearsRegisteredLast20: 10,
    });
    expect(result.durationDays).toBe(540 + 120);
  });

  it('floors partial 5-year bonus periods down, not up', () => {
    const result = calculateUnemploymentBenefit({ ...base, yearsRegisteredLast20: 9 });
    // 30-39 band: 30 bonus days per 5 years. floor(9/5) = 1 -> only one 30-day bonus, not 1.8x.
    expect(result.durationDays).toBe(420 + 30);
  });
});

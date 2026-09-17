import { describe, expect, it } from 'vitest';
import { calculateIrs, type IrsInput } from './irsCalculator';

const base: IrsInput = {
  taxYear: 2026,
  grossAnnualIncome: 0,
  maritalStatus: 'single',
  jointTaxation: false,
  dependents: 0,
  dependentsAgeSixOrUnder: 0,
  dependentsUnderThree: 0,
  irsRetainedDuringYear: 0,
  healthExpenses: 0,
  educationExpenses: 0,
  housingRent: 0,
  housingLoanInterest: 0,
  generalFamilyExpenses: 0,
};

describe('calculateIrs', () => {
  it('matches a hand-computed bracket-1 example with no deductions', () => {
    // Specific deduction floor is 8.54 x IAS(2026) = 8.54 x 537.13 = 4587.0902.
    // gross 12929.0902 -> taxable income exactly 8342, the 2026 bracket-1 ceiling.
    // Bracket 1 has no "previous bracket" step: tax = taxable income x 12.5% = 1042.75.
    const result = calculateIrs({ ...base, grossAnnualIncome: 12929.0902 });

    expect(result.taxableIncome).toBeCloseTo(8342, 6);
    expect(result.taxBeforeCredits).toBeCloseTo(1042.75, 6);
    expect(result.taxDue).toBeCloseTo(1042.75, 6);
  });

  it('reports a positive balance (refund) when retained tax exceeds tax due', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 12929.0902, irsRetainedDuringYear: 2000 });
    expect(result.balance).toBeCloseTo(2000 - 1042.75, 6);
  });

  it('reports a negative balance (owed) when retained tax is less than tax due', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 12929.0902, irsRetainedDuringYear: 500 });
    expect(result.balance).toBeCloseTo(500 - 1042.75, 6);
  });

  it('uses actual Social Security contributions for the specific deduction when they exceed the flat floor', () => {
    // 90000 x 11% = 9900, well above the 4587.09 flat floor.
    const result = calculateIrs({ ...base, grossAnnualIncome: 90000 });
    expect(result.specificDeduction).toBeCloseTo(9900, 6);
    expect(result.taxableIncome).toBeCloseTo(80100, 6);
  });

  it('caps the health deduction at 1,000 euros (15%), below the global cap threshold', () => {
    // taxable income well under 7,479 -> no global cap interference.
    const result = calculateIrs({ ...base, grossAnnualIncome: 6000, healthExpenses: 10000 });
    expect(result.deductionsACollectaRaw).toBeCloseTo(1000, 6);
    expect(result.deductionsACollectaApplied).toBeCloseTo(1000, 6);
  });

  it('caps the education deduction at 800 euros (30%)', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 6000, educationExpenses: 5000 });
    expect(result.deductionsACollectaRaw).toBeCloseTo(800, 6);
  });

  it('caps the housing rent deduction at 900 euros (15%)', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 6000, housingRent: 10000 });
    expect(result.deductionsACollectaRaw).toBeCloseTo(900, 6);
  });

  it('caps the mortgage interest deduction at 296 euros (15%)', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 6000, housingLoanInterest: 5000 });
    expect(result.deductionsACollectaRaw).toBeCloseTo(296, 6);
  });

  it('caps general family expenses at 250 euros for a single filer, 500 for joint (35%)', () => {
    const single = calculateIrs({ ...base, grossAnnualIncome: 6000, generalFamilyExpenses: 5000 });
    expect(single.deductionsACollectaRaw).toBeCloseTo(250, 6);

    const joint = calculateIrs({
      ...base,
      grossAnnualIncome: 6000,
      maritalStatus: 'married',
      jointTaxation: true,
      generalFamilyExpenses: 5000,
    });
    expect(joint.deductionsACollectaRaw).toBeCloseTo(500, 6);
  });

  it('applies the Art. 78º n.7 global cap formula at the exact midpoint of the two thresholds', () => {
    // taxable income 43156.5 is exactly halfway between 7479 and 78834 -> cap = 1000 + 1500*0.5 = 1750.
    // At this level the 11% Social Security branch dominates the specific-deduction floor, so
    // taxable income = gross x 0.89 -> gross = 43156.5 / 0.89.
    const gross = 43156.5 / 0.89;
    const result = calculateIrs({ ...base, grossAnnualIncome: gross, healthExpenses: 20000, educationExpenses: 20000 });

    expect(result.deductionsACollectaCap).toBeCloseTo(1750, 1);
    expect(result.deductionsACollectaRaw).toBeCloseTo(1800, 6); // 1000 (health cap) + 800 (education cap)
    expect(result.deductionsACollectaApplied).toBeCloseTo(1750, 1);
  });

  it('applies the flat 1,000 euro global cap above the 78,834 euro threshold', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 90000, healthExpenses: 20000 });
    expect(result.deductionsACollectaCap).toBe(1000);
    expect(result.deductionsACollectaApplied).toBe(1000);
  });

  it('applies no global cap at or below the 7,479 euro threshold', () => {
    const result = calculateIrs({
      ...base,
      grossAnnualIncome: 6000,
      healthExpenses: 20000,
      educationExpenses: 20000,
      housingRent: 20000,
      generalFamilyExpenses: 20000,
    });
    // Sum of every individual cap: 1000 + 800 + 900 + 250 = 2950, none of it further capped.
    expect(result.deductionsACollectaApplied).toBeCloseTo(2950, 6);
  });

  it('reuses calculateDependentsDeduction for the per-dependent credit, uncapped by the global limit', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 12929.0902, dependents: 1 });
    // A single dependent older than 6 gets the flat 600 euro base credit (Art. 78º-A).
    expect(result.dependentsDeduction).toBeCloseTo(600, 6);
    expect(result.taxDue).toBeCloseTo(1042.75 - 600, 6);
  });

  it('never lets tax due go negative when credits exceed the tax before credits', () => {
    const result = calculateIrs({ ...base, grossAnnualIncome: 12929.0902, dependents: 5 });
    expect(result.taxDue).toBe(0);
  });

  it('produces less tax under joint taxation than the same income taxed separately', () => {
    const jointInput: IrsInput = { ...base, grossAnnualIncome: 40000, maritalStatus: 'married', jointTaxation: true };
    const separateInput: IrsInput = { ...jointInput, jointTaxation: false };

    const joint = calculateIrs(jointInput);
    const separate = calculateIrs(separateInput);

    expect(joint.taxBeforeCredits).toBeLessThan(separate.taxBeforeCredits);
  });
});

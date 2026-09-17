import { describe, expect, it } from 'vitest';
import { calculateImtStampDuty } from './imtStampDuty';

describe('calculateImtStampDuty', () => {
  it('computes IMT for a permanent home in the 3rd bracket (150,000)', () => {
    // 150000 * 5% - 6491.02 = 1008.98
    const result = calculateImtStampDuty({ price: 150000, propertyType: 'permanentHome', youthExemptionEligible: false });
    expect(result.imt).toBeCloseTo(1008.98, 6);
    expect(result.stampDuty).toBeCloseTo(150000 * 0.008, 6);
    expect(result.youthExemptionApplied).toBe('none');
  });

  it('computes IMT for a secondary home in the 3rd bracket (150,000), higher than the permanent-home rate', () => {
    // 150000 * 5% - 5427.56 = 2072.44
    const result = calculateImtStampDuty({ price: 150000, propertyType: 'secondaryOrOther', youthExemptionEligible: false });
    expect(result.imt).toBeCloseTo(2072.44, 6);
  });

  it('charges 0 IMT but still the full stamp duty under the first bracket (below 106,346)', () => {
    const result = calculateImtStampDuty({ price: 90000, propertyType: 'permanentHome', youthExemptionEligible: false });
    expect(result.imt).toBe(0);
    expect(result.stampDuty).toBeCloseTo(90000 * 0.008, 6);
  });

  it('applies the flat rate to the full price in the highest bracket (above 1,150,853)', () => {
    const result = calculateImtStampDuty({ price: 1200000, propertyType: 'permanentHome', youthExemptionEligible: false });
    expect(result.imt).toBeCloseTo(1200000 * 0.075, 6);
  });

  it('grants full IMT + stamp duty exemption for an eligible young buyer at or below 330,539', () => {
    const result = calculateImtStampDuty({ price: 300000, propertyType: 'permanentHome', youthExemptionEligible: true });
    expect(result.imt).toBe(0);
    expect(result.stampDuty).toBe(0);
    expect(result.total).toBe(0);
    expect(result.youthExemptionApplied).toBe('full');
  });

  it('grants partial exemption for an eligible young buyer between 330,539 and 660,982', () => {
    // taxable excess = 500000 - 330539 = 169461, IMT = 169461 * 8%, stamp duty = 169461 * 0.8%
    const result = calculateImtStampDuty({ price: 500000, propertyType: 'permanentHome', youthExemptionEligible: true });
    const excess = 500000 - 330539;
    expect(result.imt).toBeCloseTo(excess * 0.08, 6);
    expect(result.stampDuty).toBeCloseTo(excess * 0.008, 6);
    expect(result.youthExemptionApplied).toBe('partial');
  });

  it('grants no youth benefit above 660,982 even when eligible, falling back to the standard calculation', () => {
    const eligible = calculateImtStampDuty({ price: 700000, propertyType: 'permanentHome', youthExemptionEligible: true });
    const notEligible = calculateImtStampDuty({ price: 700000, propertyType: 'permanentHome', youthExemptionEligible: false });
    expect(eligible.imt).toBeCloseTo(notEligible.imt, 6);
    expect(eligible.youthExemptionApplied).toBe('none');
  });

  it('never applies the youth benefit to a secondary home, even when the checkbox is set', () => {
    const result = calculateImtStampDuty({ price: 200000, propertyType: 'secondaryOrOther', youthExemptionEligible: true });
    expect(result.youthExemptionApplied).toBe('none');
    expect(result.imt).toBeGreaterThan(0);
  });

  it('sums imt and stampDuty into total', () => {
    const result = calculateImtStampDuty({ price: 250000, propertyType: 'permanentHome', youthExemptionEligible: false });
    expect(result.total).toBeCloseTo(result.imt + result.stampDuty, 6);
  });
});

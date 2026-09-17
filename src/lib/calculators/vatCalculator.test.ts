import { describe, expect, it } from 'vitest';
import { calculateVat } from './vatCalculator';

describe('calculateVat', () => {
  it('adds VAT at the mainland normal rate (23%)', () => {
    const result = calculateVat({ amount: 100, direction: 'add', region: 'continente', rateTier: 'normal' });
    expect(result.net).toBe(100);
    expect(result.vat).toBeCloseTo(23, 6);
    expect(result.gross).toBeCloseTo(123, 6);
    expect(result.ratePercent).toBe(23);
  });

  it('extracts VAT from a gross amount at the mainland normal rate', () => {
    const result = calculateVat({ amount: 123, direction: 'extract', region: 'continente', rateTier: 'normal' });
    expect(result.gross).toBe(123);
    expect(result.net).toBeCloseTo(100, 6);
    expect(result.vat).toBeCloseTo(23, 6);
  });

  it('round-trips: extracting the VAT that adding just produced returns the original net', () => {
    const added = calculateVat({ amount: 87.5, direction: 'add', region: 'continente', rateTier: 'intermedia' });
    const extracted = calculateVat({ amount: added.gross, direction: 'extract', region: 'continente', rateTier: 'intermedia' });
    expect(extracted.net).toBeCloseTo(87.5, 6);
  });

  it('applies the correct rate per region and tier', () => {
    expect(calculateVat({ amount: 100, direction: 'add', region: 'acores', rateTier: 'normal' }).ratePercent).toBe(16);
    expect(calculateVat({ amount: 100, direction: 'add', region: 'acores', rateTier: 'reduzida' }).ratePercent).toBe(4);
    expect(calculateVat({ amount: 100, direction: 'add', region: 'madeira', rateTier: 'normal' }).ratePercent).toBe(22);
    expect(calculateVat({ amount: 100, direction: 'add', region: 'madeira', rateTier: 'intermedia' }).ratePercent).toBe(12);
    expect(calculateVat({ amount: 100, direction: 'add', region: 'continente', rateTier: 'reduzida' }).ratePercent).toBe(6);
  });

  it('never returns a negative net or gross for a negative input', () => {
    const result = calculateVat({ amount: -50, direction: 'add', region: 'continente', rateTier: 'normal' });
    expect(result.net).toBe(0);
    expect(result.gross).toBe(0);
  });
});

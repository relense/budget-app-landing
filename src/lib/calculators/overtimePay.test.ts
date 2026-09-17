import { describe, expect, it } from 'vitest';
import { calculateOvertimePay, type OvertimePayInput } from './overtimePay';

const base: OvertimePayInput = {
  grossMonthlySalary: 1500,
  weeklyHours: 40,
  weekdayOvertimeHours: 0,
  restDayOrHolidayHours: 0,
  nightHours: 0,
  aboveAnnualLimit: false,
};

describe('calculateOvertimePay', () => {
  it('computes the legal hourly rate: (monthly x 12) / (52 x weekly hours)', () => {
    const result = calculateOvertimePay(base);
    expect(result.hourlyRate).toBeCloseTo(8.653846, 5);
  });

  it('matches a hand-computed example: 3 weekday overtime hours, within the 100h/year limit', () => {
    // first hour @ 1.25x + 2 subsequent hours @ 1.375x = 34.615385
    const result = calculateOvertimePay({ ...base, weekdayOvertimeHours: 3 });
    expect(result.weekdayOvertimePay).toBeCloseTo(34.615385, 5);
  });

  it('matches a hand-computed example: 3 weekday overtime hours, above the 100h/year limit', () => {
    // first hour @ 1.5x + 2 subsequent hours @ 1.75x = 43.269231
    const result = calculateOvertimePay({ ...base, weekdayOvertimeHours: 3, aboveAnnualLimit: true });
    expect(result.weekdayOvertimePay).toBeCloseTo(43.269231, 5);
  });

  it('matches a hand-computed example: 2 rest-day/holiday hours, within the 100h/year limit', () => {
    // 2 hours @ 1.5x = 25.961538
    const result = calculateOvertimePay({ ...base, restDayOrHolidayHours: 2 });
    expect(result.restDayOrHolidayPay).toBeCloseTo(25.961538, 5);
  });

  it('doubles the rest-day/holiday multiplier above the 100h/year limit', () => {
    // 2 hours @ 2.0x = 34.615385
    const result = calculateOvertimePay({ ...base, restDayOrHolidayHours: 2, aboveAnnualLimit: true });
    expect(result.restDayOrHolidayPay).toBeCloseTo(34.615385, 5);
  });

  it('matches a hand-computed example: 4 night hours at the flat +25% supplement', () => {
    // 4 hours @ 1.25x = 43.269231
    const result = calculateOvertimePay({ ...base, nightHours: 4 });
    expect(result.nightPay).toBeCloseTo(43.269231, 5);
  });

  it('applies the first-hour rate to less than a full hour of weekday overtime', () => {
    const result = calculateOvertimePay({ ...base, weekdayOvertimeHours: 0.5 });
    expect(result.weekdayOvertimePay).toBeCloseTo(8.653846 * 1.25 * 0.5, 5);
  });

  it('sums all three categories into the total', () => {
    const result = calculateOvertimePay({ ...base, weekdayOvertimeHours: 2, restDayOrHolidayHours: 1, nightHours: 1 });
    expect(result.total).toBeCloseTo(result.weekdayOvertimePay + result.restDayOrHolidayPay + result.nightPay, 6);
  });

  it('returns a zero hourly rate rather than dividing by zero when weeklyHours is 0', () => {
    const result = calculateOvertimePay({ ...base, weeklyHours: 0 });
    expect(result.hourlyRate).toBe(0);
    expect(Number.isFinite(result.total)).toBe(true);
  });
});

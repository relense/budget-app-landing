import { describe, expect, it } from 'vitest';
import { calculateEmergencyFund } from './emergencyFund';

describe('calculateEmergencyFund', () => {
  it('matches the worked example: 1200 essentials, 6 months, 2000 saved, 300/month', () => {
    const result = calculateEmergencyFund({
      monthlyEssentials: 1200,
      cushionMonths: 6,
      alreadySaved: 2000,
      monthlyContribution: 300,
    });

    expect(result.target).toBe(7200);
    expect(result.remaining).toBe(5200);
    expect(result.monthsToReach).toBe(18);
  });

  it('rounds the target up, never down, on fractional essentials', () => {
    const result = calculateEmergencyFund({
      monthlyEssentials: 833.33,
      cushionMonths: 3,
      alreadySaved: 0,
      monthlyContribution: 100,
    });

    // 833.33 * 3 = 2499.99, rounds up to the next whole euro.
    expect(result.target).toBe(2500);
  });

  it('rounds months-to-reach up so the user is never short', () => {
    const result = calculateEmergencyFund({
      monthlyEssentials: 1000,
      cushionMonths: 3,
      alreadySaved: 0,
      monthlyContribution: 400,
    });

    // remaining 3000 / 400 = 7.5, must round up to 8, not truncate to 7.
    expect(result.monthsToReach).toBe(8);
  });

  it('treats an already-funded target as zero remaining and zero months', () => {
    const result = calculateEmergencyFund({
      monthlyEssentials: 1000,
      cushionMonths: 6,
      alreadySaved: 10_000,
      monthlyContribution: 200,
    });

    expect(result.remaining).toBe(0);
    expect(result.monthsToReach).toBe(0);
    expect(result.targetDate).not.toBeNull();
  });

  it('has no target date when there is still a gap but no monthly contribution', () => {
    const result = calculateEmergencyFund({
      monthlyEssentials: 1000,
      cushionMonths: 6,
      alreadySaved: 0,
      monthlyContribution: 0,
    });

    expect(result.remaining).toBe(6000);
    expect(result.monthsToReach).toBeNull();
    expect(result.targetDate).toBeNull();
  });

  it('projects the target date from a given reference date', () => {
    const today = new Date(2026, 0, 15); // 15 Jan 2026
    const result = calculateEmergencyFund(
      { monthlyEssentials: 1200, cushionMonths: 6, alreadySaved: 2000, monthlyContribution: 300 },
      today,
    );

    // 18 months from Jan 2026 -> Jul 2027.
    expect(result.targetDate?.getFullYear()).toBe(2027);
    expect(result.targetDate?.getMonth()).toBe(6); // 0-indexed: July
  });

  it('treats negative already-saved as zero rather than inflating the remaining amount', () => {
    const result = calculateEmergencyFund({
      monthlyEssentials: 1000,
      cushionMonths: 3,
      alreadySaved: -500,
      monthlyContribution: 100,
    });

    expect(result.remaining).toBe(3000);
  });
});

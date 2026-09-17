// Original to this repo. Powers /ferramentas/calculadora-horas-extra.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Sources, both retrieved 2026-09-17, Código do Trabalho (as amended by Lei n.º 13/2023):
// - Hourly rate (Art. 268º n.º 2): (monthly base retribution x 12) / (52 x weekly hours) -- the
//   legal default formula, not this-employer's-actual-hourly-rate if it differs.
// - Overtime supplements (Art. 268º n.º 1), within the first 100 annual overtime hours: +25% for
//   the first hour (or fraction) on a working day, +37.5% for each subsequent hour that same day;
//   +50% per hour on a mandatory rest day or public holiday. Above 100 annual hours: +50% / +75% on
//   a working day, +100% on a rest day or holiday.
// - Night work supplement (Art. 266º n.º 1): flat +25% on the equivalent daytime hourly rate for
//   night hours, independent of the overtime tier above (can stack with it if the extra hours also
//   fall at night, but this calculator treats "weekday overtime", "rest-day/holiday", and "night"
//   as three separate, non-overlapping hour counts the user enters -- not a single hour double-
//   counted two ways).
// - Both supplements can be replaced by a collective agreement (CCT) with an equivalent
//   arrangement (time off in lieu, a fixed pay increase) -- flagged, not modeled: this calculator
//   always assumes the Código do Trabalho's own default percentages.

export interface OvertimePayInput {
  grossMonthlySalary: number;
  weeklyHours: number;
  weekdayOvertimeHours: number;
  restDayOrHolidayHours: number;
  nightHours: number;
  /** Whether this employee has already worked more than 100 hours of overtime this calendar
   * year -- pushes the weekday/rest-day supplements to their higher tier. */
  aboveAnnualLimit: boolean;
}

export interface OvertimePayResult {
  hourlyRate: number;
  weekdayOvertimePay: number;
  restDayOrHolidayPay: number;
  nightPay: number;
  total: number;
}

const NIGHT_SUPPLEMENT_RATE = 1.25;

function weekdayOvertimePay(hourlyRate: number, hours: number, aboveAnnualLimit: boolean): number {
  if (hours <= 0) return 0;
  const firstHourMultiplier = aboveAnnualLimit ? 1.5 : 1.25;
  const subsequentHoursMultiplier = aboveAnnualLimit ? 1.75 : 1.375;
  const firstHour = Math.min(1, hours);
  const subsequentHours = Math.max(0, hours - 1);
  return hourlyRate * firstHourMultiplier * firstHour + hourlyRate * subsequentHoursMultiplier * subsequentHours;
}

function restDayOrHolidayPay(hourlyRate: number, hours: number, aboveAnnualLimit: boolean): number {
  const multiplier = aboveAnnualLimit ? 2.0 : 1.5;
  return hourlyRate * multiplier * Math.max(0, hours);
}

export function calculateOvertimePay(input: OvertimePayInput): OvertimePayResult {
  const { grossMonthlySalary, weeklyHours, weekdayOvertimeHours, restDayOrHolidayHours, nightHours, aboveAnnualLimit } =
    input;

  const hourlyRate = weeklyHours > 0 ? (grossMonthlySalary * 12) / (52 * weeklyHours) : 0;

  const weekdayPay = weekdayOvertimePay(hourlyRate, weekdayOvertimeHours, aboveAnnualLimit);
  const restPay = restDayOrHolidayPay(hourlyRate, restDayOrHolidayHours, aboveAnnualLimit);
  const nightPay = hourlyRate * NIGHT_SUPPLEMENT_RATE * Math.max(0, nightHours);

  return {
    hourlyRate,
    weekdayOvertimePay: weekdayPay,
    restDayOrHolidayPay: restPay,
    nightPay,
    total: weekdayPay + restPay + nightPay,
  };
}

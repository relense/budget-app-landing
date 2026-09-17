// Original to this repo. Powers /ferramentas/simulador-baixa-medica.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Sources, both retrieved 2026-09-17 (Segurança Social's own published rules for employees, TCO --
// self-employed workers have a different 10-day waiting period, not modeled here):
// - Daily reference remuneration: RR = R / 180, where R is total gross pay (excluding holiday/
//   Christmas subsidies) over the 6 civil months starting 2 months before the leave began.
//   Approximated here from a single "average monthly salary" input as (salary x 6) / 180, i.e.
//   salary / 30 -- the same simplification this repo's other reference-remuneration calculators
//   (unemploymentBenefit.ts) make, since asking for 6 months of individual payslips isn't
//   realistic for a quick estimate.
// - Waiting period ("período de espera"): the first 3 calendar days of leave are unpaid, UNLESS
//   the leave is for hospitalisation (or an outpatient surgery), in which case payment starts on
//   day 1.
// - Percentage bands, by calendar day of the leave (not day of payment): days 1-30 at 55%, 31-90
//   at 60%, 91-365 at 70%, beyond 365 at 75%. The waiting period's unpaid days still fall inside
//   the 1-30 band for band-boundary purposes -- they're just excluded from payment, not from the
//   band count.

interface SickLeaveBand {
  maxDay: number;
  rate: number;
}

const BANDS: SickLeaveBand[] = [
  { maxDay: 30, rate: 0.55 },
  { maxDay: 90, rate: 0.6 },
  { maxDay: 365, rate: 0.7 },
  { maxDay: Infinity, rate: 0.75 },
];

const STANDARD_WAITING_DAYS = 3;

export interface SickLeaveBenefitInput {
  averageMonthlySalary: number;
  totalLeaveDays: number;
  isHospitalization: boolean;
}

export interface SickLeaveBenefitResult {
  dailyReferenceRemuneration: number;
  waitingDays: number;
  payableDays: number;
  totalBenefit: number;
  averageDailyBenefit: number;
}

export function calculateSickLeaveBenefit(input: SickLeaveBenefitInput): SickLeaveBenefitResult {
  const { averageMonthlySalary, totalLeaveDays, isHospitalization } = input;

  const dailyReferenceRemuneration = averageMonthlySalary / 30;
  const waitingDays = isHospitalization ? 0 : Math.min(STANDARD_WAITING_DAYS, totalLeaveDays);

  let total = 0;
  let prevMax = 0;
  for (const band of BANDS) {
    const bandStart = prevMax + 1;
    const bandEnd = Math.min(band.maxDay, totalLeaveDays);
    if (bandEnd >= bandStart) {
      const payableStart = Math.max(bandStart, waitingDays + 1);
      const payableDaysInBand = Math.max(0, bandEnd - payableStart + 1);
      total += payableDaysInBand * dailyReferenceRemuneration * band.rate;
    }
    prevMax = band.maxDay;
    if (totalLeaveDays <= band.maxDay) break;
  }

  const payableDays = Math.max(0, totalLeaveDays - waitingDays);

  return {
    dailyReferenceRemuneration,
    waitingDays,
    payableDays,
    totalBenefit: total,
    averageDailyBenefit: payableDays > 0 ? total / payableDays : 0,
  };
}

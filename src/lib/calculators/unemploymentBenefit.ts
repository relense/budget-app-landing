// Original to this repo. Powers /ferramentas/simulador-subsidio-desemprego.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Sources, both retrieved 2026-09-17:
// - Amount: flat 65% of the reference remuneration (average monthly pay, incl. subsidies, over the
//   first 12 of the last 14 months), for the WHOLE duration -- the once-common "-10% after 180
//   days" rule was repealed by Lei n.º 114/2017 (OE2018), effective 2018-01-01. Several still-live
//   blog pages quote the repealed rule as current; this file does not model it, and the original
//   brief this tool was built from also assumed it was still in force -- it isn't, corrected here.
// - 2026 limits: floor of 1 IAS (537.13) generally, or 1.15 IAS (617.70) when the reference
//   remuneration is at least the 2026 minimum wage (920); ceiling of 2.5 IAS (1342.83). The law also
//   caps the benefit at 75% of NET reference remuneration if that's lower -- not modeled here (would
//   require importing salaryCalculator.ts's net-pay logic for a secondary cap that rarely binds,
//   since 65% of gross is already below 75% of net in the large majority of cases).
// - Duration table (in force since 2012-04-01, Decreto-Lei n.º 220/2006 as amended): 4 age bands x
//   3 contribution-history bands, plus a bonus of 30/45/60 days per 5 full years with remuneration
//   registered in the last 20 years (30 for the two under-40 bands, 45 for 40-49, 60 for 50+).
//   Sourced from a structured secondary summary (Montepio's own guide) since the primary
//   seg-social.pt page renders its content via JS and wasn't fetchable as static text; the shape
//   (monotonically increasing with age and contribution length, matching the independently-quoted
//   150-900 day overall range) was consistent enough across sources to trust.
// - Eligibility ("prazo de garantia"): 360 days of registered remuneration in the last 24 months --
//   approximated here as >= 12 months of contributions, since the UI asks for months, not days.

export type AgeBand = 'under30' | '30to39' | '40to49' | '50plus';
export type ContributionBand = 'under15' | '15to24' | 'atLeast24';

const IAS_2026 = 537.13;
const MINIMUM_WAGE_2026 = 920;
const FLOOR_STANDARD = 1 * IAS_2026;
const FLOOR_ABOVE_MINIMUM_WAGE = 1.15 * IAS_2026;
const CEILING = 2.5 * IAS_2026;
const RATE = 0.65;
const DAYS_PER_MONTH = 30;

const DURATION_DAYS: Record<AgeBand, Record<ContributionBand, number>> = {
  under30: { under15: 150, '15to24': 210, atLeast24: 330 },
  '30to39': { under15: 180, '15to24': 330, atLeast24: 420 },
  '40to49': { under15: 210, '15to24': 360, atLeast24: 540 },
  '50plus': { under15: 270, '15to24': 480, atLeast24: 540 },
};

const BONUS_DAYS_PER_5_YEARS: Record<AgeBand, number> = {
  under30: 30,
  '30to39': 30,
  '40to49': 45,
  '50plus': 60,
};

export interface UnemploymentBenefitInput {
  averageMonthlySalary: number;
  ageBand: AgeBand;
  contributionMonths: number;
  contributionBand: ContributionBand;
  yearsRegisteredLast20: number;
}

export interface UnemploymentBenefitResult {
  eligible: boolean;
  monthlyBenefit: number;
  dailyBenefit: number;
  durationDays: number;
  totalOverDuration: number;
}

export function calculateUnemploymentBenefit(input: UnemploymentBenefitInput): UnemploymentBenefitResult {
  const { averageMonthlySalary, ageBand, contributionMonths, contributionBand, yearsRegisteredLast20 } = input;

  const eligible = contributionMonths >= 12;

  const floor = averageMonthlySalary >= MINIMUM_WAGE_2026 ? FLOOR_ABOVE_MINIMUM_WAGE : FLOOR_STANDARD;
  const monthlyBenefit = eligible ? Math.min(CEILING, Math.max(floor, averageMonthlySalary * RATE)) : 0;
  const dailyBenefit = monthlyBenefit / DAYS_PER_MONTH;

  const baseDays = DURATION_DAYS[ageBand][contributionBand];
  const bonusDays = Math.floor(Math.max(0, yearsRegisteredLast20) / 5) * BONUS_DAYS_PER_5_YEARS[ageBand];
  const durationDays = eligible ? baseDays + bonusDays : 0;

  return {
    eligible,
    monthlyBenefit,
    dailyBenefit,
    durationDays,
    totalOverDuration: dailyBenefit * durationDays,
  };
}

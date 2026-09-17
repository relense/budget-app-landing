// Original to this repo (not ported from budget-app-web -- there is no in-app equivalent; this is
// the marketing site's own front door to the app's Emergency Fund goal type). Powers
// /ferramentas/fundo-de-emergencia.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: CLAUDE.md's "money is always integer cents" rule guards
// float-precision bugs across API calls and cached client state, and this tool has neither (a
// purely client-side scratchpad, no persistence of any kind).
//
// Every rounding here goes in the user's favour of *not* running short: the target rounds up to
// the next whole euro, and months-to-reach always rounds up (a 7.1-month gap is 8 months of saving,
// not 7).

export interface EmergencyFundInput {
  monthlyEssentials: number;
  cushionMonths: number;
  alreadySaved: number;
  monthlyContribution: number;
}

export interface EmergencyFundResult {
  target: number;
  remaining: number;
  /** null when there's still a gap but no monthly contribution to close it with. */
  monthsToReach: number | null;
  /** null under the same condition as `monthsToReach`. */
  targetDate: Date | null;
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

export function calculateEmergencyFund(input: EmergencyFundInput, today: Date = new Date()): EmergencyFundResult {
  const { monthlyEssentials, cushionMonths, alreadySaved, monthlyContribution } = input;

  const target = Math.ceil(monthlyEssentials * cushionMonths);
  const saved = Math.max(0, alreadySaved);
  const remaining = Math.max(0, target - saved);

  if (remaining === 0) {
    return { target, remaining, monthsToReach: 0, targetDate: today };
  }

  if (monthlyContribution <= 0) {
    return { target, remaining, monthsToReach: null, targetDate: null };
  }

  const monthsToReach = Math.ceil(remaining / monthlyContribution);
  return { target, remaining, monthsToReach, targetDate: addMonths(today, monthsToReach) };
}

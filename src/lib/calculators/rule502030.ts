// Original to this repo (not ported from budget-app-web -- there is no in-app equivalent).
// Powers /ferramentas/regra-50-30-20.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// The 50/30/20 rule (needs / wants / savings) with an adjustable split, since the default often
// doesn't fit -- rent alone frequently exceeds 50% of net income in Lisbon or Porto.

export interface Rule502030Input {
  netMonthlyIncome: number;
  needsPercent?: number;
  wantsPercent?: number;
  savingsPercent?: number;
}

export interface Rule502030Result {
  needs: number;
  wants: number;
  savings: number;
  annualSavings: number;
}

export function calculateRule502030(input: Rule502030Input): Rule502030Result {
  const { netMonthlyIncome, needsPercent = 50, wantsPercent = 30, savingsPercent = 20 } = input;

  const needs = netMonthlyIncome * (needsPercent / 100);
  const wants = netMonthlyIncome * (wantsPercent / 100);
  const savings = netMonthlyIncome * (savingsPercent / 100);

  return { needs, wants, savings, annualSavings: savings * 12 };
}

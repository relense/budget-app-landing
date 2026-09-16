// PORTED VERBATIM from budget-app-web (src/pages/Tools/compoundInterest.ts @ 4543ab4). Powers the
// public /ferramentas/juros-compostos and /tools/compound-interest pages -- same logic, same
// numbers, as the in-app tool, by design (see docs/PLAN.md-adjacent session notes: keeping these
// as one copy-tracked file avoids the in-app tool and this page silently drifting apart). If the
// source file changes in budget-app-web, re-sync this copy by hand; there is no shared package.
//
// Standard compound-interest projection: a starting principal, compounded monthly at a given
// annual rate, with an optional recurring monthly contribution added either before ("start of
// period", i.e. the contribution itself also earns that month's interest) or after ("end of
// period", the more common convention and this calculator's own default) each month's interest
// accrues. Kept dependency-free and pure -- a plain, unit-testable helper like taxCalculator.ts's
// own, in the same directory.
//
// **Deliberately uses plain `number` (major currency units), not integer cents** -- same reasoning
// as taxCalculator.ts's own file comment: CLAUDE.md's "money is always integer cents" rule exists
// to guard float-precision bugs across API calls and cached client state, and this tool has
// neither (a purely client-side scratchpad, no persistence of any kind). Unlike the tax
// calculator, this one is *not* EUR-only -- it respects the signed-in account's own currency
// (CompoundInterestPage.tsx), since compound interest is a universal concept with no
// Portugal-specific meaning tying it to EUR.

export type ContributionTiming = 'start' | 'end';

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
  contributionTiming: ContributionTiming;
}

export interface CompoundInterestYearPoint {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  /** One point per whole year elapsed -- a fractional final year (e.g. 2.5 years, 30 months) gets
   * no row of its own for that trailing partial year; `futureValue` above still reflects it. */
  yearlyBreakdown: CompoundInterestYearPoint[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, monthlyContribution, annualRatePercent, years, contributionTiming } = input;
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRatePercent / 100 / 12;

  let balance = principal;
  let contributed = principal;
  const yearlyBreakdown: CompoundInterestYearPoint[] = [];

  for (let month = 1; month <= months; month += 1) {
    if (contributionTiming === 'start') {
      balance += monthlyContribution;
      contributed += monthlyContribution;
      balance *= 1 + monthlyRate;
    } else {
      balance *= 1 + monthlyRate;
      balance += monthlyContribution;
      contributed += monthlyContribution;
    }

    if (month % 12 === 0) {
      yearlyBreakdown.push({
        year: month / 12,
        balance,
        totalContributions: contributed,
        totalInterest: balance - contributed,
      });
    }
  }

  return {
    futureValue: balance,
    totalContributions: contributed,
    totalInterest: balance - contributed,
    yearlyBreakdown,
  };
}

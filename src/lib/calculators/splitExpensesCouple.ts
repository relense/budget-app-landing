// Original to this repo (not ported from budget-app-web -- there is no in-app equivalent).
// Powers /ferramentas/dividir-despesas-casal.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Three ways to split the same shared total between two incomes, presented side by side rather
// than picking one as "the" answer -- deliberately not labelling any of them "fair" (that's a
// personal call, not this calculator's to make):
// - 50/50: each pays half, regardless of income.
// - Proportional: each pays their share of the combined income (an equal *percentage* of what
//   they earn goes to shared costs).
// - Equal leftover: each contributes so that what's left in their own pocket afterwards is the
//   same euro amount -- the higher earner pays more so both keep the same take-home.

export interface SplitExpensesInput {
  incomeA: number;
  incomeB: number;
  totalExpenses: number;
}

export interface SplitShare {
  a: number;
  b: number;
}

export interface SplitExpensesResult {
  fiftyFifty: SplitShare;
  proportional: SplitShare;
  equalLeftover: SplitShare;
}

export function calculateSplitExpenses(input: SplitExpensesInput): SplitExpensesResult {
  const { incomeA, incomeB, totalExpenses } = input;
  const combinedIncome = incomeA + incomeB;

  const fiftyFifty: SplitShare = { a: totalExpenses / 2, b: totalExpenses / 2 };

  const proportional: SplitShare =
    combinedIncome <= 0
      ? { a: totalExpenses / 2, b: totalExpenses / 2 }
      : { a: totalExpenses * (incomeA / combinedIncome), b: totalExpenses * (incomeB / combinedIncome) };

  const leftover = (combinedIncome - totalExpenses) / 2;
  let equalLeftoverA = incomeA - leftover;
  let equalLeftoverB = incomeB - leftover;
  if (equalLeftoverA < 0) {
    equalLeftoverA = 0;
    equalLeftoverB = totalExpenses;
  } else if (equalLeftoverB < 0) {
    equalLeftoverB = 0;
    equalLeftoverA = totalExpenses;
  }

  return { fiftyFifty, proportional, equalLeftover: { a: equalLeftoverA, b: equalLeftoverB } };
}

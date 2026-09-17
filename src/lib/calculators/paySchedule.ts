// Original to this repo. Powers /ferramentas/subsidio-ferias-natal-duodecimos.
//
// A thin presentation layer over salaryCalculator.ts's own already-modeled subsidy mechanics
// (`regularMonth`, `subsidyMonth`, `monthlyWithDuodecimos`, all withheld per Art. 99.º-C CIRS n.º 5
// -- see that file's own comment) -- no new tax logic here, just turning those three numbers into a
// 12-month calendar. June and November are the two subsídio months modeled (the Código do
// Trabalho's own legal default; a contract paying subsidies in different months isn't modeled, same
// scope cut as salaryCalculator.ts's own "subsidy amount = base salary" assumption).
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as every other
// calculator in this directory.

import type { SalaryCalculatorResult } from './salaryCalculator';
import type { SubsidyPaymentMode } from './salaryCalculator';

export interface PayScheduleMonth {
  month: number;
  net: number;
  isSubsidy: boolean;
}

const HOLIDAY_SUBSIDY_MONTH = 6;
const CHRISTMAS_SUBSIDY_MONTH = 11;

export function buildPaySchedule(salary: SalaryCalculatorResult, mode: SubsidyPaymentMode): PayScheduleMonth[] {
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;

    if (mode === 'duodecimos') {
      return { month, net: salary.monthlyWithDuodecimos.net, isSubsidy: false };
    }

    const isSubsidy = month === HOLIDAY_SUBSIDY_MONTH || month === CHRISTMAS_SUBSIDY_MONTH;
    const net = isSubsidy ? salary.regularMonth.net + salary.subsidyMonth.net : salary.regularMonth.net;
    return { month, net, isSubsidy };
  });
}

// Original to this repo. Powers /ferramentas/amortizacao-antecipada-credito-habitacao.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Standard French-system (prestação constante) amortisation: a fixed monthly payment covering
// principal + interest at a constant nominal monthly rate (TAN / 12), for the exact remaining
// term. Early-repayment fee caps sourced 2026-09-17: variable-rate contracts lost their temporary
// fee exemption on 2025-12-31 (rejected for extension in the OE2026 debate), so 2026 defaults are
// back to the standing caps under DL 74-A/2017 -- 0.5% of the capital repaid for variable-rate
// contracts, 2% for fixed-rate -- per Banco de Portugal's own consumer page
// (bportugal.pt/page/credito-habitacao-posso-pagar-antecipadamente-parte-ou-totalidade-do-meu-credito).
// Both are editable in the UI (a specific contract may have a lower/zero negotiated fee).

export type PrepaymentMode = 'oneOff' | 'monthly';
export type PrepaymentStrategy = 'reduceTerm' | 'reduceInstallment';

function monthlyPayment(balance: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return balance / months;
  return (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function monthsToPayOff(balance: number, monthlyRate: number, payment: number): number {
  if (balance <= 0) return 0;
  if (monthlyRate === 0) return balance / payment;
  const inside = 1 - (monthlyRate * balance) / payment;
  // Payment too small to ever cover the interest -- the balance never reaches zero.
  if (inside <= 0) return Infinity;
  return -Math.log(inside) / Math.log(1 + monthlyRate);
}

export interface MortgagePrepaymentInput {
  outstandingBalance: number;
  remainingMonths: number;
  annualRatePercent: number;
  extraAmount: number;
  mode: PrepaymentMode;
  /** Ignored (treated as 'reduceTerm') when `mode` is 'monthly' -- lowering the instalment while
   * also paying extra every month isn't a coherent choice. */
  strategy: PrepaymentStrategy;
  feeRatePercent: number;
}

export interface MortgagePrepaymentResult {
  baselineMonthlyPayment: number;
  baselineTotalInterest: number;
  newMonthlyPayment: number;
  newTotalInterest: number;
  newRemainingMonths: number;
  interestSaved: number;
  monthsSaved: number;
  fee: number;
}

export function calculateMortgagePrepayment(input: MortgagePrepaymentInput): MortgagePrepaymentResult {
  const { outstandingBalance, remainingMonths, annualRatePercent, extraAmount, mode, feeRatePercent } = input;
  const monthlyRate = annualRatePercent / 100 / 12;
  const feeRate = feeRatePercent / 100;

  const baselineMonthlyPayment = monthlyPayment(outstandingBalance, monthlyRate, remainingMonths);
  const baselineTotalInterest = baselineMonthlyPayment * remainingMonths - outstandingBalance;

  if (extraAmount <= 0) {
    return {
      baselineMonthlyPayment,
      baselineTotalInterest,
      newMonthlyPayment: baselineMonthlyPayment,
      newTotalInterest: baselineTotalInterest,
      newRemainingMonths: remainingMonths,
      interestSaved: 0,
      monthsSaved: 0,
      fee: 0,
    };
  }

  if (mode === 'monthly') {
    const payment = baselineMonthlyPayment + extraAmount;
    const newRemainingMonths = monthsToPayOff(outstandingBalance, monthlyRate, payment);
    const newTotalInterest = payment * newRemainingMonths - outstandingBalance;
    // The fee applies to capital repaid on each top-up; approximated as the fee rate applied to
    // the total extra principal paid in over the shortened life of the loan (extraAmount x number
    // of monthly top-ups actually made), not a single one-off transaction.
    const fee = extraAmount * newRemainingMonths * feeRate;

    return {
      baselineMonthlyPayment,
      baselineTotalInterest,
      newMonthlyPayment: payment,
      newTotalInterest,
      newRemainingMonths,
      interestSaved: baselineTotalInterest - newTotalInterest,
      monthsSaved: remainingMonths - newRemainingMonths,
      fee,
    };
  }

  const newBalance = Math.max(0, outstandingBalance - extraAmount);
  const fee = extraAmount * feeRate;

  const strategy = input.strategy;
  if (strategy === 'reduceInstallment') {
    const newMonthlyPayment = monthlyPayment(newBalance, monthlyRate, remainingMonths);
    const newTotalInterest = newMonthlyPayment * remainingMonths - newBalance;
    return {
      baselineMonthlyPayment,
      baselineTotalInterest,
      newMonthlyPayment,
      newTotalInterest,
      newRemainingMonths: remainingMonths,
      interestSaved: baselineTotalInterest - newTotalInterest,
      monthsSaved: 0,
      fee,
    };
  }

  const newRemainingMonths = monthsToPayOff(newBalance, monthlyRate, baselineMonthlyPayment);
  const newTotalInterest = baselineMonthlyPayment * newRemainingMonths - newBalance;
  return {
    baselineMonthlyPayment,
    baselineTotalInterest,
    newMonthlyPayment: baselineMonthlyPayment,
    newTotalInterest,
    newRemainingMonths,
    interestSaved: baselineTotalInterest - newTotalInterest,
    monthsSaved: remainingMonths - newRemainingMonths,
    fee,
  };
}

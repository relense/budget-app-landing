// Original to this repo. Powers /ferramentas/custo-real-carro.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Mostly arithmetic, not tax law -- low sourcing risk relative to this repo's other calculators.
// IUC (circulation tax) is taken as a direct annual input rather than derived from its own
// registration-year/engine/CO2 bracket tables: those tables are genuinely complex (pre-1981,
// 1981-1995, and post-1995 categories, the latter also factoring CO2 emissions for post-2007
// registrations) and modeling them accurately would be a whole separate sourcing effort for a
// single line item in a calculator whose real point is depreciation -- a user who knows their
// IUC (it's on last year's payment notice) can just type it in.
//
// Loan interest, if a loan is entered, uses the same standard French-system (prestação constante)
// formula as mortgagePrepayment.ts, reimplemented locally rather than imported -- it's a generic,
// non-tax-specific 3-line formula, not worth a cross-module dependency for. The loan's total
// interest over its own term is averaged into an annual figure and added on top of depreciation
// (which already reflects the asset's value loss regardless of how it was financed) -- a
// simplification, not a real amortization-schedule integration with the depreciation timeline.

function loanMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export interface TrueCarCostInput {
  purchasePrice: number;
  yearsKept: number;
  /** Expected resale value, as a percentage of the purchase price. */
  resaleValuePercent: number;
  annualInsurance: number;
  annualIuc: number;
  kmPerYear: number;
  /** Litres (or kWh) per 100 km. */
  consumptionPer100Km: number;
  /** Price per litre (or per kWh). */
  fuelPricePerUnit: number;
  annualMaintenance: number;
  loanAmount: number;
  loanAnnualRatePercent: number;
  loanTermMonths: number;
}

export interface TrueCarCostResult {
  resaleValue: number;
  annualDepreciation: number;
  annualFuel: number;
  annualLoanInterest: number;
  annualTotal: number;
  monthlyTotal: number;
}

export function calculateTrueCarCost(input: TrueCarCostInput): TrueCarCostResult {
  const {
    purchasePrice,
    yearsKept,
    resaleValuePercent,
    annualInsurance,
    annualIuc,
    kmPerYear,
    consumptionPer100Km,
    fuelPricePerUnit,
    annualMaintenance,
    loanAmount,
    loanAnnualRatePercent,
    loanTermMonths,
  } = input;

  const resaleValue = purchasePrice * (resaleValuePercent / 100);
  const annualDepreciation = yearsKept > 0 ? Math.max(0, purchasePrice - resaleValue) / yearsKept : 0;
  const annualFuel = (kmPerYear / 100) * consumptionPer100Km * fuelPricePerUnit;

  let annualLoanInterest = 0;
  if (loanAmount > 0 && loanTermMonths > 0) {
    const monthlyRate = loanAnnualRatePercent / 100 / 12;
    const payment = loanMonthlyPayment(loanAmount, monthlyRate, loanTermMonths);
    const totalInterest = payment * loanTermMonths - loanAmount;
    annualLoanInterest = totalInterest / (loanTermMonths / 12);
  }

  const annualTotal = annualDepreciation + annualInsurance + annualIuc + annualFuel + annualMaintenance + annualLoanInterest;

  return {
    resaleValue,
    annualDepreciation,
    annualFuel,
    annualLoanInterest,
    annualTotal,
    monthlyTotal: annualTotal / 12,
  };
}

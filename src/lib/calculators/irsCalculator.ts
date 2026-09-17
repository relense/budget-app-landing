// Original to this repo (not ported from budget-app-web). Powers /ferramentas/simulador-irs.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Reuses taxCalculator.ts's already-sourced 2026 IRS brackets (`TAX_BRACKETS_BY_YEAR`), its exact
// bracket-application method (`computeProgressiveIrs`, exported from there specifically so this
// file doesn't reimplement a second, possibly-diverging version), and its Art. 78º-A per-dependent
// tax credit (`calculateDependentsDeduction`) -- see that file's own extensive comment for the
// quociente conjugal / dependents-deduction sourcing and scope decisions this file inherits
// unchanged, including the same "spouseWorking: true is treated as separate taxation" scope cut.
//
// New in this file, all figures are 2026 tax-year values (the return filed in 2027 for income
// earned in 2026), sourced 2026-09-17:
// - Specific deduction (Cat. A, employment income), CIRS Art. 25º: max(8.54 x IAS(2026), mandatory
//   Social Security contributions actually withheld) = max(4587.09, gross x 11%). 8.54 x 537.13 =
//   4587.09 -- reuses IAS_BY_YEAR and salaryCalculator.ts's EMPLOYEE_SOCIAL_SECURITY_RATE (11%) as
//   the contribution-rate proxy; professional-order dues aren't modeled (niche, and this calculator
//   has no field for them).
// - Deduções à coleta (CIRS Art. 78º and its sub-articles), 2026 caps: health 15% up to EUR 1,000;
//   education/training 30% up to EUR 800 (the EUR 1,100 displaced-student ceiling isn't modeled --
//   no field for it); permanent-home rent 15% up to EUR 900; mortgage-interest 15% up to EUR 296
//   (pre-2012 contracts only -- post-2012 contracts get zero, per Parliament's 2025-11-20 rejection
//   of extending this to newer contracts); general family expenses 35% up to EUR 250/taxpayer (EUR
//   500 for joint taxation) -- the 45%/EUR 335 single-parent rate isn't modeled.
// - Global cap on the above five deductions together (CIRS Art. 78º n.7): no cap when taxable
//   income <= EUR 7,479; a flat EUR 1,000 above EUR 78,834; between those two thresholds,
//   1000 + 1500 x (78834 - taxableIncome) / 71355 -- note these three constants are the FIXED
//   values written into the law by Lei n.º 12/2022, not this year's own bracket boundaries, even
//   though the brackets themselves get updated yearly. The per-dependent tax credit
//   (`calculateDependentsDeduction`) is NOT subject to this cap, matching taxCalculator.ts's own
//   existing, unchanged treatment of it as a separate deduction.
//
// Sources: info.portaldasfinancas.gov.pt's own CIRS Art. 78º reproduction (global-cap paragraph
// structure); cross-checked bracket-cap figures and the specific-deduction formula against
// multiple 2026-dated tax-advisory summaries (Doutor Finanças, ComparaJá, Coverflex) since the
// exact formula in Art. 78º n.7-b is published as an image on the AT's own page, not machine-
// readable text.

import {
  calculateDependentsDeduction,
  computeProgressiveIrs,
  IAS_BY_YEAR,
  TAX_BRACKETS_BY_YEAR,
  type TaxYear,
} from './taxCalculator';
import { EMPLOYEE_SOCIAL_SECURITY_RATE } from './salaryCalculator';

const SPECIFIC_DEDUCTION_IAS_MULTIPLIER = 8.54;
const HEALTH_RATE = 0.15;
const HEALTH_CAP = 1000;
const EDUCATION_RATE = 0.3;
const EDUCATION_CAP = 800;
const HOUSING_RENT_RATE = 0.15;
const HOUSING_RENT_CAP = 900;
const HOUSING_INTEREST_RATE = 0.15;
const HOUSING_INTEREST_CAP = 296;
const GENERAL_EXPENSES_RATE = 0.35;
const GENERAL_EXPENSES_CAP_SINGLE = 250;
const GENERAL_EXPENSES_CAP_JOINT = 500;

// Art. 78º n.7's own fixed reference constants (Lei n.º 12/2022) -- not this year's bracket values.
const GLOBAL_CAP_LOWER_THRESHOLD = 7479;
const GLOBAL_CAP_UPPER_THRESHOLD = 78834;
const GLOBAL_CAP_MIN = 1000;
const GLOBAL_CAP_MAX = 2500;

function globalDeductionCap(taxableIncome: number): number {
  if (taxableIncome <= GLOBAL_CAP_LOWER_THRESHOLD) return Infinity;
  if (taxableIncome > GLOBAL_CAP_UPPER_THRESHOLD) return GLOBAL_CAP_MIN;
  const span = GLOBAL_CAP_UPPER_THRESHOLD - GLOBAL_CAP_LOWER_THRESHOLD;
  const cap = GLOBAL_CAP_MIN + (GLOBAL_CAP_MAX - GLOBAL_CAP_MIN) * ((GLOBAL_CAP_UPPER_THRESHOLD - taxableIncome) / span);
  return Math.min(GLOBAL_CAP_MAX, Math.max(GLOBAL_CAP_MIN, cap));
}

export interface IrsInput {
  taxYear: TaxYear;
  grossAnnualIncome: number;
  maritalStatus: 'single' | 'married';
  jointTaxation: boolean;
  dependents: number;
  dependentsAgeSixOrUnder: number;
  dependentsUnderThree: number;
  irsRetainedDuringYear: number;
  healthExpenses: number;
  educationExpenses: number;
  housingRent: number;
  housingLoanInterest: number;
  generalFamilyExpenses: number;
}

export interface IrsResult {
  specificDeduction: number;
  taxableIncome: number;
  taxBeforeCredits: number;
  dependentsDeduction: number;
  deductionsACollectaRaw: number;
  deductionsACollectaCap: number;
  deductionsACollectaApplied: number;
  taxDue: number;
  /** Positive when you get money back, 0 when nothing changes hands, negative when you owe more. */
  balance: number;
}

export function calculateIrs(input: IrsInput): IrsResult {
  const ias = IAS_BY_YEAR[input.taxYear];
  const specificDeduction = Math.max(
    SPECIFIC_DEDUCTION_IAS_MULTIPLIER * ias,
    input.grossAnnualIncome * EMPLOYEE_SOCIAL_SECURITY_RATE,
  );
  const taxableIncome = Math.max(0, input.grossAnnualIncome - specificDeduction);

  const brackets = TAX_BRACKETS_BY_YEAR[input.taxYear];
  const taxBeforeCredits =
    input.maritalStatus === 'married' && input.jointTaxation
      ? computeProgressiveIrs(taxableIncome / 2, brackets) * 2
      : computeProgressiveIrs(taxableIncome, brackets);

  const dependentsDeduction = calculateDependentsDeduction(
    input.dependents,
    input.dependentsAgeSixOrUnder,
    input.dependentsUnderThree,
  );

  const health = Math.min(input.healthExpenses * HEALTH_RATE, HEALTH_CAP);
  const education = Math.min(input.educationExpenses * EDUCATION_RATE, EDUCATION_CAP);
  const housingRent = Math.min(input.housingRent * HOUSING_RENT_RATE, HOUSING_RENT_CAP);
  const housingInterest = Math.min(input.housingLoanInterest * HOUSING_INTEREST_RATE, HOUSING_INTEREST_CAP);
  const generalExpensesCap =
    input.maritalStatus === 'married' && input.jointTaxation ? GENERAL_EXPENSES_CAP_JOINT : GENERAL_EXPENSES_CAP_SINGLE;
  const generalExpenses = Math.min(input.generalFamilyExpenses * GENERAL_EXPENSES_RATE, generalExpensesCap);

  const deductionsACollectaRaw = health + education + housingRent + housingInterest + generalExpenses;
  const deductionsACollectaCap = globalDeductionCap(taxableIncome);
  const deductionsACollectaApplied = Math.min(deductionsACollectaRaw, deductionsACollectaCap);

  const taxDue = Math.max(0, taxBeforeCredits - deductionsACollectaApplied - dependentsDeduction);
  const balance = input.irsRetainedDuringYear - taxDue;

  return {
    specificDeduction,
    taxableIncome,
    taxBeforeCredits,
    dependentsDeduction,
    deductionsACollectaRaw,
    deductionsACollectaCap,
    deductionsACollectaApplied,
    taxDue,
    balance,
  };
}

// Original to this repo. Powers /ferramentas/imt-imposto-selo.
//
// **Deliberately uses plain `number` (euros), not integer cents** -- same reasoning as this
// directory's other calculators: a purely client-side scratchpad, no persistence of any kind.
//
// Mainland Portugal (Continente) only -- Açores and Madeira have their own, separately-set IMT
// tables, not modeled here (scope cut, same discipline as salaryCalculator.ts's own regional
// tables, just not replicated for this tax since it's a different, separately-legislated table).
//
// Sources, both retrieved 2026-09-17:
// - IMT bracket tables (Art. 17º CIMT, 2026 values, +2% per OE2026 vs. 2025): APCMC's own
//   "IMT -- Tabelas práticas em vigor 2026" page (apcmc.pt/legislacao/imt-tabelas-praticas-em-vigor-2026),
//   cross-checked against a second independent summary for the two highest brackets' exact
//   thresholds (660,982 / 1,150,853) since those didn't appear verbatim on the first source's own
//   page text. The two highest bands per table are flat (deduction 0, rate applied to the FULL
//   price, not marginally) -- a deliberate anti-avoidance kink in the real law, not a bug here.
// - Imposto do Selo (verba 1.1, Tabela Geral do Imposto do Selo): flat 0.8% of the same taxable
//   base as IMT, unchanged for 2026 (Lei n.º 73-A/2025 didn't touch it) -- applies even when IMT
//   itself is 0% (e.g. a HPP purchase under the first bracket), EXCEPT under IMT Jovem, where Selo
//   is exempted on the same portion IMT is.
// - IMT Jovem (isenção para jovens até 35 anos, primeira habitação própria e permanente): full
//   IMT + Selo exemption up to EUR 330,539 (2026, +2%), partial exemption between EUR 330,539 and
//   EUR 660,982 (IMT and Selo apply only to the portion above EUR 330,539, at the flat 8% IMT
//   bracket rate), no benefit above EUR 660,982. Eligibility conditions (age <=35 at the deed, not
//   a dependent, no home ownership in the last 3 years) are asked as a single checkbox here, not
//   individually modeled.

export type PropertyType = 'permanentHome' | 'secondaryOrOther';

interface ImtBracket {
  max: number | null;
  rate: number;
  deduction: number;
}

// `deduction: 0` on the last two rows of each table is what makes them "flat" (tax = price x rate,
// not marginal) -- see this file's own header comment.
const IMT_BRACKETS: Record<PropertyType, ImtBracket[]> = {
  permanentHome: [
    { max: 106346, rate: 0, deduction: 0 },
    { max: 145470, rate: 0.02, deduction: 2126.92 },
    { max: 198347, rate: 0.05, deduction: 6491.02 },
    { max: 330539, rate: 0.07, deduction: 10457.96 },
    { max: 660982, rate: 0.08, deduction: 13763.35 },
    { max: 1150853, rate: 0.06, deduction: 0 },
    { max: null, rate: 0.075, deduction: 0 },
  ],
  secondaryOrOther: [
    { max: 106346, rate: 0.01, deduction: 0 },
    { max: 145470, rate: 0.02, deduction: 1063.46 },
    { max: 198347, rate: 0.05, deduction: 5427.56 },
    { max: 330539, rate: 0.07, deduction: 9394.5 },
    { max: 633931, rate: 0.08, deduction: 12699.89 },
    { max: 1150853, rate: 0.06, deduction: 0 },
    { max: null, rate: 0.075, deduction: 0 },
  ],
};

const STAMP_DUTY_RATE = 0.008;
const YOUTH_FULL_EXEMPTION_MAX = 330539;
const YOUTH_PARTIAL_EXEMPTION_MAX = 660982;
const YOUTH_PARTIAL_RATE = 0.08;

function findBracket(brackets: ImtBracket[], price: number): ImtBracket {
  for (const bracket of brackets) {
    if (bracket.max === null || price <= bracket.max) return bracket;
  }
  return brackets[brackets.length - 1];
}

function standardImt(price: number, propertyType: PropertyType): number {
  const bracket = findBracket(IMT_BRACKETS[propertyType], price);
  return Math.max(0, price * bracket.rate - bracket.deduction);
}

export interface ImtStampDutyInput {
  price: number;
  propertyType: PropertyType;
  youthExemptionEligible: boolean;
}

export interface ImtStampDutyResult {
  imt: number;
  stampDuty: number;
  total: number;
  youthExemptionApplied: 'none' | 'full' | 'partial';
}

export function calculateImtStampDuty(input: ImtStampDutyInput): ImtStampDutyResult {
  const { price, propertyType, youthExemptionEligible } = input;

  const eligibleForYouthBenefit = youthExemptionEligible && propertyType === 'permanentHome';

  if (eligibleForYouthBenefit && price <= YOUTH_FULL_EXEMPTION_MAX) {
    return { imt: 0, stampDuty: 0, total: 0, youthExemptionApplied: 'full' };
  }

  if (eligibleForYouthBenefit && price <= YOUTH_PARTIAL_EXEMPTION_MAX) {
    const taxableExcess = price - YOUTH_FULL_EXEMPTION_MAX;
    const imt = taxableExcess * YOUTH_PARTIAL_RATE;
    const stampDuty = taxableExcess * STAMP_DUTY_RATE;
    return { imt, stampDuty, total: imt + stampDuty, youthExemptionApplied: 'partial' };
  }

  const imt = standardImt(price, propertyType);
  const stampDuty = price * STAMP_DUTY_RATE;
  return { imt, stampDuty, total: imt + stampDuty, youthExemptionApplied: 'none' };
}

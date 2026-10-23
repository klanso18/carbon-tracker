// CO2 equivalent: the unit used by ADEME emission factors
export const EMISSION_UNIT = 'kg CO2e';

// French formatting ("1 234,5"): rounds the floating point noise of summed emissions
const emissionFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 1,
});

export default function formatEmission(value: number): string {
  return emissionFormatter.format(value);
}

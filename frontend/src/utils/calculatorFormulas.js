/**
 * Scientific Calculator Formulas for LAB Notebook
 */

// 1. Molarity Calculator
// Molarity (M) = Mass (g) / (Molecular Weight (g/mol) * Volume (L))
export const calculateMolarity = (mass, molecularWeight, volumeMl) => {
  const m = parseFloat(mass);
  const mw = parseFloat(molecularWeight);
  const volL = parseFloat(volumeMl) / 1000;

  if (isNaN(m) || isNaN(mw) || isNaN(volL) || mw === 0 || volL === 0) {
    return null;
  }

  const molarity = m / (mw * volL);
  return molarity.toFixed(5); // Returns in Mol/L (M)
};

// 2. DNA Copy Number Calculator
// Copies = (Amount (ng) * 6.022 x 10^23) / (Length (bp) * 1 x 10^9 * 660 g/mol per bp)
export const calculateDnaCopyNumber = (amountNg, lengthBp) => {
  const ng = parseFloat(amountNg);
  const bp = parseFloat(lengthBp);

  if (isNaN(ng) || isNaN(bp) || bp === 0) {
    return null;
  }

  const avogadro = 6.02214076e23;
  const bpWeight = 660; // Average weight of double stranded DNA base pair
  const conversion = 1e9; // ng to g conversion

  const copies = (ng * avogadro) / (bp * conversion * bpWeight);
  return copies.toExponential(4);
};

// 3. PCR Master Mix Scaler
// Given number of reactions + overage percentage (e.g. 10%)
export const calculatePcrMix = (reactions, overagePercent = 10) => {
  const rxns = parseFloat(reactions);
  if (isNaN(rxns) || rxns <= 0) return null;

  const totalMultiplier = rxns * (1 + parseFloat(overagePercent) / 100);

  // Standard PCR 50uL reaction proportions
  const recipe = [
    { reagent: 'Nuclease-Free Water', perRxn: 28.9, unit: 'µL' },
    { reagent: '10X Taq Buffer', perRxn: 5.0, unit: 'µL' },
    { reagent: 'dNTP Mix (10 mM)', perRxn: 1.0, unit: 'µL' },
    { reagent: 'Forward Primer (10 µM)', perRxn: 2.5, unit: 'µL' },
    { reagent: 'Reverse Primer (10 µM)', perRxn: 2.5, unit: 'µL' },
    { reagent: 'Taq DNA Polymerase (5 U/µL)', perRxn: 0.1, unit: 'µL' },
    { reagent: 'DNA Template (<1,000 ng)', perRxn: 10.0, unit: 'µL' }
  ];

  return {
    multiplier: totalMultiplier.toFixed(2),
    components: recipe.map(item => ({
      name: item.reagent,
      perRxn: item.perRxn,
      total: (item.perRxn * totalMultiplier).toFixed(2),
      unit: item.unit
    })),
    totalVolume: (50.0 * totalMultiplier).toFixed(2)
  };
};

// 4. Radioactive Decay / Half-Life Calculator
// N(t) = N0 * (1/2) ^ (t / t_half)
export const calculateHalfLifeDecay = (initialAmount, halfLife, timeElapsed) => {
  const n0 = parseFloat(initialAmount);
  const thalf = parseFloat(halfLife);
  const t = parseFloat(timeElapsed);

  if (isNaN(n0) || isNaN(thalf) || isNaN(t) || thalf === 0) {
    return null;
  }

  const remaining = n0 * Math.pow(0.5, t / thalf);
  const decayed = n0 - remaining;
  const percentage = (remaining / n0) * 100;

  return {
    remaining: remaining.toFixed(4),
    decayed: decayed.toFixed(4),
    percentage: percentage.toFixed(2)
  };
};

// 5. Standard Deviation & Statistics Calculator
// Expects comma separated values: "1.2, 1.5, 1.4, 1.9, 2.1"
export const calculateStats = (numbersString) => {
  if (!numbersString || typeof numbersString !== 'string') return null;

  const numbers = numbersString
    .split(',')
    .map(x => parseFloat(x.trim()))
    .filter(x => !isNaN(x));

  if (numbers.length === 0) return null;

  const count = numbers.length;
  const mean = numbers.reduce((sum, val) => sum + val, 0) / count;

  if (count === 1) {
    return {
      count,
      mean: mean.toFixed(4),
      variance: '0.0000',
      stdDev: '0.0000',
      min: numbers[0].toFixed(4),
      max: numbers[0].toFixed(4)
    };
  }

  const variance = numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (count - 1);
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return {
    count,
    mean: mean.toFixed(4),
    variance: variance.toFixed(4),
    stdDev: stdDev.toFixed(4),
    min: min.toFixed(4),
    max: max.toFixed(4)
  };
};

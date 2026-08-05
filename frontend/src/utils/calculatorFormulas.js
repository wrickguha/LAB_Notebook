/**
 * Laboratory & Molecular Biology Calculator Formulas
 * SRS Module: LabSphere ELN
 */

// Common helper: round to 2 decimals
export const round2 = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.00';
  return Number(val).toFixed(2);
};

// Backwards compatibility helpers
export const calculateMolarity = (mass, molecularWeight, volumeMl) => {
  const m = parseFloat(mass);
  const mw = parseFloat(molecularWeight);
  const volL = parseFloat(volumeMl) / 1000;

  if (isNaN(m) || isNaN(mw) || isNaN(volL) || mw === 0 || volL === 0) {
    return null;
  }

  const molarity = m / (mw * volL);
  return molarity.toFixed(5);
};

export const calculateHalfLifeDecay = (initialAmount, halfLife, timeElapsed) => {
  const n0 = parseFloat(initialAmount);
  const thalf = parseFloat(halfLife);
  const t = parseFloat(timeElapsed);

  if (isNaN(n0) || isNaN(thalf) || isNaN(t) || thalf === 0) {
    return { error: 'Initial amount, half-life, and time elapsed must be valid positive numbers.' };
  }

  const remaining = n0 * Math.pow(0.5, t / thalf);
  const decayed = n0 - remaining;
  const percentage = (remaining / n0) * 100;

  return {
    remaining: remaining.toFixed(4),
    decayed: decayed.toFixed(4),
    percentage: percentage.toFixed(2),
    summary: `${remaining.toFixed(4)} g remaining (${percentage.toFixed(2)}%)`
  };
};

export const calculateStats = (numbersString) => {
  if (!numbersString || typeof numbersString !== 'string') return { error: 'Please enter comma-separated numbers.' };

  const numbers = numbersString
    .split(',')
    .map(x => parseFloat(x.trim()))
    .filter(x => !isNaN(x));

  if (numbers.length === 0) return { error: 'No valid numbers found in dataset.' };

  const count = numbers.length;
  const mean = numbers.reduce((sum, val) => sum + val, 0) / count;

  if (count === 1) {
    return {
      count,
      mean: mean.toFixed(4),
      variance: '0.0000',
      stdDev: '0.0000',
      min: numbers[0].toFixed(4),
      max: numbers[0].toFixed(4),
      summary: `Mean = ${mean.toFixed(4)} | Std Dev = 0.0000`
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
    max: max.toFixed(4),
    summary: `Mean = ${mean.toFixed(4)} | Std Dev = ${stdDev.toFixed(4)} | Variance = ${variance.toFixed(4)}`
  };
};

// 1. PCR Master Mix Calculator
export const calculatePcrMix = (reactions, overagePercent = 10, totalRxnVolume = 50, customReagents = null) => {
  const rxns = parseFloat(reactions);
  const overage = parseFloat(overagePercent);
  const totalVol = parseFloat(totalRxnVolume);

  if (isNaN(rxns) || rxns <= 0 || isNaN(overage) || overage < 0 || isNaN(totalVol) || totalVol <= 0) {
    return { error: 'Please enter valid positive numbers for reactions and volume.' };
  }

  const multiplier = rxns * (1 + overage / 100);

  const defaultRecipe = customReagents || [
    { reagent: '10X Reaction Buffer', perRxn: totalVol * 0.1, unit: 'µL' },
    { reagent: 'dNTP Mix (10 mM)', perRxn: 1.0, unit: 'µL' },
    { reagent: 'Forward Primer (10 µM)', perRxn: 2.5, unit: 'µL' },
    { reagent: 'Reverse Primer (10 µM)', perRxn: 2.5, unit: 'µL' },
    { reagent: 'Taq Polymerase (5 U/µL)', perRxn: 0.5, unit: 'µL' },
    { reagent: 'DNA Template', perRxn: 5.0, unit: 'µL' }
  ];

  const sumOtherReagentsPerRxn = defaultRecipe.reduce((sum, item) => sum + item.perRxn, 0);
  const waterPerRxn = totalVol - sumOtherReagentsPerRxn;

  if (waterPerRxn < 0) {
    return { error: 'Sum of reagent volumes exceeds total reaction volume!' };
  }

  const fullRecipe = [
    { reagent: 'Nuclease-Free Water (NFW)', perRxn: waterPerRxn, unit: 'µL' },
    ...defaultRecipe
  ];

  const components = fullRecipe.map(item => ({
    name: item.reagent,
    perRxn: round2(item.perRxn),
    total: round2(item.perRxn * multiplier),
    unit: item.unit
  }));

  return {
    totalReactions: round2(multiplier),
    rxnVolume: round2(totalVol),
    totalMixVolume: round2(totalVol * multiplier),
    components
  };
};

// 2. qPCR Master Mix Calculator
export const calculateQpcrMix = (numRxns, extraPercent = 10, rxnVol = 20, mm2x = 10, fwdPrimer = 0.4, revPrimer = 0.4, template = 2) => {
  const n = parseFloat(numRxns);
  const extra = parseFloat(extraPercent);
  const totalV = parseFloat(rxnVol);
  const mm = parseFloat(mm2x);
  const fwd = parseFloat(fwdPrimer);
  const rev = parseFloat(revPrimer);
  const temp = parseFloat(template);

  if (isNaN(n) || n <= 0 || isNaN(totalV) || totalV <= 0) {
    return { error: 'Reactions and reaction volume must be > 0.' };
  }

  const sumReagents = mm + fwd + rev + temp;
  if (sumReagents > totalV) {
    return { error: 'Reagent volumes exceed total reaction volume.' };
  }

  const waterPerRxn = totalV - sumReagents;
  const multiplier = n * (1 + extra / 100);

  const items = [
    { name: 'Nuclease-Free Water', perRxn: waterPerRxn },
    { name: '2X qPCR Master Mix', perRxn: mm },
    { name: 'Forward Primer (10 µM)', perRxn: fwd },
    { name: 'Reverse Primer (10 µM)', perRxn: rev },
    { name: 'DNA / cDNA Template', perRxn: temp }
  ];

  return {
    totalReactions: round2(multiplier),
    totalVolume: round2(totalV * multiplier),
    components: items.map(i => ({
      name: i.name,
      perRxn: round2(i.perRxn),
      total: round2(i.perRxn * multiplier),
      unit: 'µL'
    }))
  };
};

// 3. LAMP Master Mix Calculator
export const calculateLampMix = (numRxns, extraPercent = 10, rxnVol = 25, masterMix2x = 12.5, fipBip = 2.5, f3b3 = 0.5, loop = 1.0, template = 2.0) => {
  const n = parseFloat(numRxns);
  const extra = parseFloat(extraPercent);
  const totalV = parseFloat(rxnVol);

  if (isNaN(n) || n <= 0 || isNaN(totalV) || totalV <= 0) {
    return { error: 'Reactions count and volume must be > 0.' };
  }

  const mm = parseFloat(masterMix2x) || 0;
  const fb = parseFloat(fipBip) || 0;
  const f3 = parseFloat(f3b3) || 0;
  const lp = parseFloat(loop) || 0;
  const tm = parseFloat(template) || 0;

  const sumReagents = mm + fb + f3 + lp + tm;
  if (sumReagents > totalV) {
    return { error: 'Reagent volumes exceed total reaction volume.' };
  }

  const waterPerRxn = totalV - sumReagents;
  const multiplier = n * (1 + extra / 100);

  const items = [
    { name: 'Nuclease-Free Water', perRxn: waterPerRxn },
    { name: '2X Isothermal Master Mix', perRxn: mm },
    { name: 'FIP / BIP Primer Mix (10X)', perRxn: fb },
    { name: 'F3 / B3 Primer Mix (10X)', perRxn: f3 },
    { name: 'Loop Primer Mix (10X)', perRxn: lp },
    { name: 'Target DNA / RNA Template', perRxn: tm }
  ];

  return {
    totalReactions: round2(multiplier),
    totalVolume: round2(totalV * multiplier),
    components: items.map(i => ({
      name: i.name,
      perRxn: round2(i.perRxn),
      total: round2(i.perRxn * multiplier),
      unit: 'µL'
    }))
  };
};

// 4. Primer Reconstitution Calculator
export const calculatePrimerReconstitution = (amountNmol, desiredConcUm) => {
  const nmol = parseFloat(amountNmol);
  const conc = parseFloat(desiredConcUm);

  if (isNaN(nmol) || isNaN(conc) || nmol <= 0 || conc <= 0) {
    return { error: 'Amount (nmol) and concentration (µM) must be positive values.' };
  }

  // Volume (µL) = (nmol * 1000) / conc (µM)
  const volUl = (nmol * 1000) / conc;
  const volMl = volUl / 1000;

  return {
    volumeUl: round2(volUl),
    volumeMl: round2(volMl),
    summary: `Add ${round2(volUl)} µL (${round2(volMl)} mL) of TE buffer or NFW to obtain ${round2(conc)} µM stock.`
  };
};

// 5. Primer Dilution / Solution Dilution (C1V1 = C2V2)
export const calculateDilution = (c1, c2, v2) => {
  const conc1 = parseFloat(c1);
  const conc2 = parseFloat(c2);
  const vol2 = parseFloat(v2);

  if (isNaN(conc1) || isNaN(conc2) || isNaN(vol2) || conc1 <= 0 || conc2 <= 0 || vol2 <= 0) {
    return { error: 'All inputs must be greater than 0.' };
  }

  if (conc2 > conc1) {
    return { error: 'Target concentration (C2) cannot be greater than Stock concentration (C1).' };
  }

  const v1 = (conc2 * vol2) / conc1;
  const diluent = vol2 - v1;

  return {
    v1: round2(v1),
    diluent: round2(diluent),
    summary: `Take ${round2(v1)} µL of stock (C1) and add ${round2(diluent)} µL of diluent to reach ${round2(vol2)} µL final volume (C2).`
  };
};

// 6. Primer Tm and Ta Calculator
export const calculatePrimerTmTa = (sequence) => {
  if (!sequence || typeof sequence !== 'string') {
    return { error: 'Primer sequence cannot be empty.' };
  }

  const cleanSeq = sequence.toUpperCase().replace(/[^ATGC]/g, '');

  if (cleanSeq.length === 0) {
    return { error: 'Invalid DNA sequence. Only A, T, G, C bases allowed.' };
  }

  let a = 0, t = 0, g = 0, c = 0;
  for (let char of cleanSeq) {
    if (char === 'A') a++;
    else if (char === 'T') t++;
    else if (char === 'G') g++;
    else if (char === 'C') c++;
  }

  const len = cleanSeq.length;
  const gcCount = g + c;
  const gcPercent = (gcCount / len) * 100;

  // Tm logic:
  // Wallace rule (< 14 bp): Tm = 2*(A+T) + 4*(G+C)
  // Marmur / Nearest-Neighbor (>= 14 bp): Tm = 64.9 + 41 * (G+C - 16.4) / len
  let tm = 0;
  if (len < 14) {
    tm = 2 * (a + t) + 4 * (g + c);
  } else {
    tm = 64.9 + 41 * (gcCount - 16.4) / len;
  }

  const taMin = tm - 5;
  const taMax = tm - 3;

  return {
    sequence: cleanSeq,
    length: len,
    gcPercent: round2(gcPercent),
    tm: round2(tm),
    taMin: round2(taMin),
    taMax: round2(taMax),
    summary: `Tm = ${round2(tm)} °C | Recommended Ta Range = ${round2(taMin)} °C to ${round2(taMax)} °C`
  };
};

// 7. Primer GC Content Calculator
export const calculatePrimerGcContent = (sequence) => {
  if (!sequence || typeof sequence !== 'string') {
    return { error: 'Sequence cannot be empty.' };
  }

  const cleanSeq = sequence.toUpperCase().replace(/[^ATGC]/g, '');

  if (cleanSeq.length === 0) {
    return { error: 'Invalid sequence. Please enter valid DNA bases (A, T, G, C).' };
  }

  let a = 0, t = 0, g = 0, c = 0;
  for (let char of cleanSeq) {
    if (char === 'A') a++;
    else if (char === 'T') t++;
    else if (char === 'G') g++;
    else if (char === 'C') c++;
  }

  const len = cleanSeq.length;
  const gcCount = g + c;
  const atCount = a + t;
  const gcPercent = (gcCount / len) * 100;
  const atPercent = (atCount / len) * 100;

  // Molecular weight approximation for single-stranded DNA oligo:
  const mw = (a * 313.21) + (t * 304.2) + (g * 329.21) + (c * 289.18) - 61.96;

  return {
    sequence: cleanSeq,
    length: len,
    aCount: a,
    tCount: t,
    gCount: g,
    cCount: c,
    gcCount,
    gcPercent: round2(gcPercent),
    atPercent: round2(atPercent),
    mwGmol: round2(mw)
  };
};

// 8. DNA Concentration Calculator (A260 Absorbance)
export const calculateDnaConcentration = (a260, dilutionFactor = 1, pathLengthCm = 1, a280 = null) => {
  const abs = parseFloat(a260);
  const dil = parseFloat(dilutionFactor) || 1;
  const path = parseFloat(pathLengthCm) || 1;
  const abs280 = a280 ? parseFloat(a280) : null;

  if (isNaN(abs) || abs < 0) {
    return { error: 'A260 absorbance must be a non-negative number.' };
  }

  // 1 A260 unit of dsDNA = 50 µg/mL = 50 ng/µL
  const concNgUl = (abs * 50 * dil) / path;
  const concUgMl = concNgUl;

  let ratioStr = 'N/A';
  let purityAssessment = 'Enter A280 for purity ratio';

  if (abs280 && abs280 > 0) {
    const ratio = abs / abs280;
    ratioStr = round2(ratio);
    if (ratio >= 1.7 && ratio <= 1.9) {
      purityAssessment = 'Optimal dsDNA purity (1.8)';
    } else if (ratio < 1.7) {
      purityAssessment = 'Potential protein / phenol contamination (< 1.8)';
    } else {
      purityAssessment = 'Potential RNA contamination (> 1.8)';
    }
  }

  return {
    concNgUl: round2(concNgUl),
    concUgMl: round2(concUgMl),
    ratio260280: ratioStr,
    purityAssessment
  };
};

// 9. RNA Concentration Calculator (A260 Absorbance)
export const calculateRnaConcentration = (a260, dilutionFactor = 1, pathLengthCm = 1, a280 = null) => {
  const abs = parseFloat(a260);
  const dil = parseFloat(dilutionFactor) || 1;
  const path = parseFloat(pathLengthCm) || 1;
  const abs280 = a280 ? parseFloat(a280) : null;

  if (isNaN(abs) || abs < 0) {
    return { error: 'A260 absorbance must be a non-negative number.' };
  }

  // 1 A260 unit of RNA = 40 µg/mL = 40 ng/µL
  const concNgUl = (abs * 40 * dil) / path;
  const concUgMl = concNgUl;

  let ratioStr = 'N/A';
  let purityAssessment = 'Enter A280 for purity ratio';

  if (abs280 && abs280 > 0) {
    const ratio = abs / abs280;
    ratioStr = round2(ratio);
    if (ratio >= 1.9 && ratio <= 2.1) {
      purityAssessment = 'Optimal pure RNA (2.0)';
    } else if (ratio < 1.9) {
      purityAssessment = 'Potential protein or genomic DNA contamination (< 2.0)';
    } else {
      purityAssessment = 'High ratio';
    }
  }

  return {
    concNgUl: round2(concNgUl),
    concUgMl: round2(concUgMl),
    ratio260280: ratioStr,
    purityAssessment
  };
};

// 10. DNA Copy Number Estimator
export const calculateDnaCopyNumber = (amountNg, lengthBp) => {
  const ng = parseFloat(amountNg);
  const bp = parseFloat(lengthBp);

  if (isNaN(ng) || isNaN(bp) || ng <= 0 || bp <= 0) {
    return { error: 'DNA mass and length in bp must be positive values.' };
  }

  const avogadro = 6.02214076e23;
  const bpWeight = 660; // g/mol per bp for dsDNA
  const conversion = 1e9; // ng to g

  const copies = (ng * avogadro) / (bp * conversion * bpWeight);

  return {
    copiesExp: copies.toExponential(2),
    copiesFormatted: Math.round(copies).toLocaleString(),
    summary: `${copies.toExponential(2)} copies per ${ng} ng`
  };
};

// 11. DNA Normalization Calculator
export const calculateDnaNormalization = (c1NgUl, c2NgUl, v2Ul) => {
  const c1 = parseFloat(c1NgUl);
  const c2 = parseFloat(c2NgUl);
  const v2 = parseFloat(v2Ul);

  if (isNaN(c1) || isNaN(c2) || isNaN(v2) || c1 <= 0 || c2 <= 0 || v2 <= 0) {
    return { error: 'Initial conc, target conc, and target volume must be positive.' };
  }

  if (c2 > c1) {
    return { error: 'Target concentration (C2) cannot exceed current concentration (C1).' };
  }

  const vDna = (c2 * v2) / c1;
  const vDiluent = v2 - vDna;
  const massUsedNg = c2 * v2;

  return {
    vDna: round2(vDna),
    vDiluent: round2(vDiluent),
    massUsedNg: round2(massUsedNg),
    summary: `Pipette ${round2(vDna)} µL of stock DNA into ${round2(vDiluent)} µL of TE/Water for ${round2(v2)} µL at ${round2(c2)} ng/µL.`
  };
};

// 12. Restriction Digest Calculator
export const calculateRestrictionDigest = (totalVolumeUl = 50, dnaMassUg = 1, dnaConcNgUl = 100, enz1Vol = 1.0, enz2Vol = 0.0, bufferConcentrationX = 10) => {
  const totalV = parseFloat(totalVolumeUl);
  const massUg = parseFloat(dnaMassUg);
  const concNg = parseFloat(dnaConcNgUl);
  const e1 = parseFloat(enz1Vol) || 0;
  const e2 = parseFloat(enz2Vol) || 0;
  const bufX = parseFloat(bufferConcentrationX) || 10;

  if (isNaN(totalV) || totalV <= 0 || isNaN(massUg) || massUg <= 0 || isNaN(concNg) || concNg <= 0) {
    return { error: 'Total volume, DNA mass, and DNA conc must be > 0.' };
  }

  const dnaMassNg = massUg * 1000;
  const vDna = dnaMassNg / concNg;
  const vBuffer = totalV / bufX;

  const sumComponents = vDna + vBuffer + e1 + e2;
  if (sumComponents > totalV) {
    return { error: 'Reagent volumes exceed specified total reaction volume!' };
  }

  const vWater = totalV - sumComponents;

  const components = [
    { name: 'Nuclease-Free Water', volume: round2(vWater), unit: 'µL' },
    { name: `${bufX}X Restriction Reaction Buffer`, volume: round2(vBuffer), unit: 'µL' },
    { name: `Substrate DNA (${massUg} µg)`, volume: round2(vDna), unit: 'µL' },
    { name: 'Restriction Enzyme 1', volume: round2(e1), unit: 'µL' }
  ];

  if (e2 > 0) {
    components.push({ name: 'Restriction Enzyme 2', volume: round2(e2), unit: 'µL' });
  }

  return {
    totalVolume: round2(totalV),
    components,
    waterVolume: round2(vWater)
  };
};

// 13. DNA Ligation Calculator
export const calculateDnaLigation = (vectorBp, vectorMassNg, insertBp, molarRatio = 3) => {
  const vBp = parseFloat(vectorBp);
  const vNg = parseFloat(vectorMassNg);
  const iBp = parseFloat(insertBp);
  const ratio = parseFloat(molarRatio);

  if (isNaN(vBp) || isNaN(vNg) || isNaN(iBp) || isNaN(ratio) || vBp <= 0 || vNg <= 0 || iBp <= 0 || ratio <= 0) {
    return { error: 'Vector size, vector mass, insert size, and ratio must be > 0.' };
  }

  // Insert DNA (ng) = (Insert Size / Vector Size) * Vector Mass * Molar Ratio
  const insertMassNg = (iBp / vBp) * vNg * ratio;

  return {
    insertMassNg: round2(insertMassNg),
    vectorMassNg: round2(vNg),
    molarRatio: `${round2(ratio)}:1`,
    summary: `Use ${round2(insertMassNg)} ng of Insert DNA for ${round2(vNg)} ng Vector DNA at a ${round2(ratio)}:1 molar ratio.`
  };
};

// 14. Agarose Gel Preparation Calculator
export const calculateAgaroseGel = (gelPercent, finalVolumeMl) => {
  const pct = parseFloat(gelPercent);
  const vol = parseFloat(finalVolumeMl);

  if (isNaN(pct) || isNaN(vol) || pct <= 0 || vol <= 0) {
    return { error: 'Gel percentage and volume must be > 0.' };
  }

  // Agarose mass (g) = (Gel% * Volume (mL)) / 100
  const agaroseGrams = (pct * vol) / 100;

  return {
    agaroseGrams: round2(agaroseGrams),
    bufferVolumeMl: round2(vol),
    summary: `Weigh ${round2(agaroseGrams)} g of agarose powder into ${round2(vol)} mL of 1X TAE/TBE buffer.`
  };
};

// 15. Reverse Complement Calculator
export const calculateReverseComplement = (sequence) => {
  if (!sequence || typeof sequence !== 'string') {
    return { error: 'Sequence cannot be empty.' };
  }

  const cleanSeq = sequence.toUpperCase().replace(/[^ATGCU]/g, '');
  if (cleanSeq.length === 0) {
    return { error: 'Please enter valid nucleotide bases (A, T, G, C, U).' };
  }

  const complementMap = {
    'A': 'T', 'T': 'A', 'U': 'A', 'G': 'C', 'C': 'G'
  };

  const compArr = [];
  for (let char of cleanSeq) {
    compArr.push(complementMap[char] || char);
  }
  const complement = compArr.join('');
  const reverse = cleanSeq.split('').reverse().join('');
  const reverseComplement = compArr.reverse().join('');

  let gc = 0;
  for (let c of cleanSeq) {
    if (c === 'G' || c === 'C') gc++;
  }
  const gcPercent = (gc / cleanSeq.length) * 100;

  return {
    original: cleanSeq,
    complement,
    reverse,
    reverseComplement,
    length: cleanSeq.length,
    gcPercent: round2(gcPercent)
  };
};

// 16. Serial Dilution Calculator
export const calculateSerialDilution = (c0, dilutionFactor = 2, numTubes = 5, finalVolPerTubeMl = 1.0) => {
  const conc0 = parseFloat(c0);
  const factor = parseFloat(dilutionFactor);
  const tubes = parseInt(numTubes, 10);
  const vol = parseFloat(finalVolPerTubeMl);

  if (isNaN(conc0) || isNaN(factor) || isNaN(tubes) || isNaN(vol) || conc0 <= 0 || factor <= 1 || tubes <= 0 || vol <= 0) {
    return { error: 'Dilution factor must be > 1, all other inputs positive.' };
  }

  const transferVol = vol / factor;
  const diluentVol = vol - transferVol;

  const tubeSteps = [];
  let currentConc = conc0;

  for (let i = 1; i <= tubes; i++) {
    currentConc = currentConc / factor;
    tubeSteps.push({
      tube: i,
      conc: round2(currentConc),
      transferVol: round2(transferVol),
      diluentVol: round2(diluentVol)
    });
  }

  return {
    initialConc: round2(conc0),
    dilutionFactor: round2(factor),
    transferVol: round2(transferVol),
    diluentVol: round2(diluentVol),
    steps: tubeSteps
  };
};

// 17. Molarity and Normality Calculator
export const calculateMolarityNormality = (massG, mwGmol, volumeMl, nFactor = 1) => {
  const mass = parseFloat(massG);
  const mw = parseFloat(mwGmol);
  const volMl = parseFloat(volumeMl);
  const n = parseFloat(nFactor) || 1;

  if (isNaN(mass) || isNaN(mw) || isNaN(volMl) || mass <= 0 || mw <= 0 || volMl <= 0) {
    return { error: 'Mass, Molecular Weight, and Volume must be positive numbers.' };
  }

  const volL = volMl / 1000;
  const molarity = mass / (mw * volL);
  const normality = molarity * n;

  return {
    molarity: round2(molarity),
    normality: round2(normality),
    volL: round2(volL),
    summary: `Molarity = ${round2(molarity)} M | Normality = ${round2(normality)} N (for n=${round2(n)})`
  };
};

// 18. Unit Converter
export const calculateUnitConversion = (value, category, fromUnit, toUnit) => {
  const val = parseFloat(value);
  if (isNaN(val)) return { error: 'Please enter a valid numeric value.' };

  if (fromUnit === toUnit) {
    return { result: round2(val), summary: `${val} ${fromUnit} = ${round2(val)} ${toUnit}` };
  }

  // Mass ratios to grams (g)
  const massToG = { 'g': 1, 'mg': 1e-3, 'µg': 1e-6, 'ng': 1e-9, 'pg': 1e-12 };
  // Volume ratios to L
  const volToL = { 'L': 1, 'mL': 1e-3, 'µL': 1e-6, 'nL': 1e-9 };
  // Conc ratios to M
  const concToM = { 'M': 1, 'mM': 1e-3, 'µM': 1e-6, 'nM': 1e-9, 'pM': 1e-12 };

  let result = 0;

  if (category === 'mass' && massToG[fromUnit] && massToG[toUnit]) {
    const grams = val * massToG[fromUnit];
    result = grams / massToG[toUnit];
  } else if (category === 'volume' && volToL[fromUnit] && volToL[toUnit]) {
    const liters = val * volToL[fromUnit];
    result = liters / volToL[toUnit];
  } else if (category === 'conc' && concToM[fromUnit] && concToM[toUnit]) {
    const molar = val * concToM[fromUnit];
    result = molar / concToM[toUnit];
  } else if (category === 'lengthToMw') {
    // DNA bp -> g/mol (660 per bp)
    if (fromUnit === 'bp' && toUnit === 'g/mol') result = val * 660;
    else if (fromUnit === 'g/mol' && toUnit === 'bp') result = val / 660;
    // RNA nt -> g/mol (340 per nt)
    else if (fromUnit === 'nt' && toUnit === 'g/mol') result = val * 340;
    // Protein aa -> Da (110 Da per aa)
    else if (fromUnit === 'aa' && toUnit === 'Da') result = val * 110;
    else if (fromUnit === 'aa' && toUnit === 'kDa') result = (val * 110) / 1000;
  } else {
    return { error: 'Unsupported conversion units.' };
  }

  return {
    result: round2(result),
    summary: `${val} ${fromUnit} = ${round2(result)} ${toUnit}`
  };
};

// 19. pH & pH Adjustment Calculator
export const calculatePhAdjustment = (volumeL, currentPh, targetPh, titrantConcM = 1.0) => {
  const vol = parseFloat(volumeL);
  const curPh = parseFloat(currentPh);
  const tarPh = parseFloat(targetPh);
  const titConc = parseFloat(titrantConcM) || 1.0;

  if (isNaN(vol) || isNaN(curPh) || isNaN(tarPh) || isNaN(titConc) || vol <= 0 || titConc <= 0) {
    return { error: 'Volume, target concentration, and pH values must be valid.' };
  }

  if (curPh < 0 || curPh > 14 || tarPh < 0 || tarPh > 14) {
    return { error: 'pH must be between 0.00 and 14.00.' };
  }

  const hCurrent = Math.pow(10, -curPh);
  const hTarget = Math.pow(10, -tarPh);

  // Δ[H+] = hTarget - hCurrent
  const deltaH = Math.abs(hTarget - hCurrent);
  const molesNeeded = deltaH * vol;
  const titrantVolL = molesNeeded / titConc;
  const titrantVolUl = titrantVolL * 1e6;

  let titrantType = 'Acid (e.g. 1M HCl)';
  if (tarPh > curPh) {
    titrantType = 'Base (e.g. 1M NaOH)';
  }

  return {
    volumeL: round2(vol),
    currentPh: round2(curPh),
    targetPh: round2(tarPh),
    titrantType,
    titrantVolUl: round2(titrantVolUl),
    titrantVolMl: round2(titrantVolUl / 1000),
    summary: `Add ${round2(titrantVolUl)} µL (${round2(titrantVolUl / 1000)} mL) of ${titrantType} to adjust ${round2(vol)} L from pH ${round2(curPh)} to pH ${round2(tarPh)}.`
  };
};

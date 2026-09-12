/**
 * InveniqLab Scientific Calculator Formulas Suite
 * Complete Developer-Ready Implementation covering all 9 Categories:
 * 1. Molecular Biology
 * 2. Primer & Sequence
 * 3. PCR, qPCR & LAMP
 * 4. Cell Biology
 * 5. Solutions & Buffers
 * 6. Cloning & Genetic Engineering
 * 7. Protein & Biochemistry
 * 8. Analytics & Statistics
 * 9. Standalone Unit Converter
 */

// Format numbers nicely: round to given decimals or return formatted
export const round2 = (val, decimals = 2) => {
  if (val === null || val === undefined || isNaN(val)) return '0.00';
  return Number(val).toFixed(decimals);
};

export const formatSciOrNum = (num, sigFigs = 4) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.001 && num !== 0)) {
    return Number(num).toExponential(sigFigs - 1);
  }
  return Number(num.toPrecision(sigFigs)).toString();
};

// =============================================================================
// CATEGORY 1: MOLECULAR BIOLOGY
// =============================================================================

/**
 * 1.1 DNA/RNA Concentration Calculator (Beer-Lambert Absorbance)
 * @param {number} a260 - Absorbance at 260 nm
 * @param {number} dilutionFactor - Sample dilution factor
 * @param {number} pathLengthCm - Spectrophotometer path length (cm)
 * @param {string} nucleicType - 'dsDNA' (50), 'RNA' (40), 'ssDNA' (33), 'oligo' (30)
 * @param {number|null} a280 - Absorbance at 280 nm (optional for purity)
 * @param {number|null} a230 - Absorbance at 230 nm (optional for secondary purity)
 */
export const calculateDnaRnaConcentration = (
  a260,
  dilutionFactor = 1,
  pathLengthCm = 1,
  nucleicType = 'dsDNA',
  a280 = null,
  a230 = null
) => {
  const abs = parseFloat(a260);
  const dil = parseFloat(dilutionFactor) || 1;
  const path = parseFloat(pathLengthCm) || 1;
  const abs280 = a280 ? parseFloat(a280) : null;
  const abs230 = a230 ? parseFloat(a230) : null;

  if (isNaN(abs) || abs < 0) {
    return { error: 'A260 absorbance must be a non-negative number.' };
  }
  if (dil <= 0 || path <= 0) {
    return { error: 'Dilution factor and path length must be greater than 0.' };
  }

  // Conversion factors in (µg/mL per A260 unit at 1 cm)
  const factors = {
    dsDNA: 50,
    RNA: 40,
    ssDNA: 33,
    oligo: 30
  };
  const factor = factors[nucleicType] || 50;

  // Concentration in ng/µL (which is identically µg/mL)
  const concNgUl = (abs * factor * dil) / path;
  const concUgMl = concNgUl;
  const concMgMl = concNgUl / 1000;

  let ratio260280 = 'N/A';
  let purity260280 = 'Provide A280 to evaluate protein purity';
  if (abs280 && abs280 > 0) {
    const r280 = abs / abs280;
    ratio260280 = round2(r280);
    if (nucleicType === 'RNA') {
      if (r280 >= 1.9 && r280 <= 2.1) purity260280 = 'Pure RNA (~2.0)';
      else if (r280 < 1.9) purity260280 = 'Protein/phenol contamination (<2.0)';
      else purity260280 = 'High A260/A280 ratio (>2.1)';
    } else {
      if (r280 >= 1.75 && r280 <= 1.85) purity260280 = 'Pure dsDNA (~1.8)';
      else if (r280 < 1.75) purity260280 = 'Protein/phenol carryover (<1.8)';
      else purity260280 = 'Potential RNA carryover (>1.85)';
    }
  }

  let ratio260230 = 'N/A';
  let purity260230 = 'Provide A230 to evaluate salt/solvent purity';
  if (abs230 && abs230 > 0) {
    const r230 = abs / abs230;
    ratio260230 = round2(r230);
    if (r230 >= 2.0 && r230 <= 2.2) purity260230 = 'Pure nucleic acid (~2.0-2.2)';
    else if (r230 < 2.0) purity260230 = 'Potential salt/EDTA/carbohydrate carryover (<2.0)';
    else purity260230 = 'High ratio';
  }

  return {
    concNgUl: round2(concNgUl),
    concUgMl: round2(concUgMl),
    concMgMl: round2(concMgMl, 4),
    nucleicType,
    factorUsed: `${factor} µg/mL per A260`,
    ratio260280,
    purity260280,
    ratio260230,
    purity260230,
    summary: `${round2(concNgUl)} ng/µL (${nucleicType}) | A260/A280: ${ratio260280}`
  };
};

// Aliases for backwards compatibility
export const calculateDnaConcentration = (a260, dilution = 1, path = 1, a280 = null) =>
  calculateDnaRnaConcentration(a260, dilution, path, 'dsDNA', a280);

export const calculateRnaConcentration = (a260, dilution = 1, path = 1, a280 = null) =>
  calculateDnaRnaConcentration(a260, dilution, path, 'RNA', a280);

/**
 * 1.2 DNA/RNA Dilution Calculator (C1V1 = C2V2)
 */
export const calculateNucleicAcidDilution = (stockConc, desiredConc, finalVol, concUnit = 'ng/µL', volUnit = 'µL') => {
  const c1 = parseFloat(stockConc);
  const c2 = parseFloat(desiredConc);
  const v2 = parseFloat(finalVol);

  if (isNaN(c1) || isNaN(c2) || isNaN(v2) || c1 <= 0 || c2 <= 0 || v2 <= 0) {
    return { error: 'Stock concentration, desired concentration, and final volume must be positive.' };
  }
  if (c2 > c1) {
    return { error: 'Desired working concentration (C2) cannot exceed stock concentration (C1).' };
  }

  const v1 = (c2 * v2) / c1;
  const diluent = v2 - v1;
  const totalMass = c2 * v2;

  return {
    stockVol: round2(v1),
    diluentVol: round2(diluent),
    finalVol: round2(v2),
    finalConc: round2(c2),
    concUnit,
    volUnit,
    totalMass: round2(totalMass),
    summary: `Pipette ${round2(v1)} ${volUnit} of stock and ${round2(diluent)} ${volUnit} of diluent buffer for ${round2(v2)} ${volUnit} at ${round2(c2)} ${concUnit}.`
  };
};

export const calculateDnaNormalization = calculateNucleicAcidDilution;

/**
 * 1.3 Molarity Calculator
 * Supports: Mass, Molecular Weight, Volume, Molarity
 */
export const calculateMolarityGeneral = ({
  target = 'mass', // 'mass' | 'molarity' | 'volume'
  mass = null,
  massUnit = 'g', // 'g' | 'mg' | 'µg'
  mw = null,
  volume = null,
  volUnit = 'mL', // 'L' | 'mL' | 'µL'
  molarity = null,
  molUnit = 'mM' // 'M' | 'mM' | 'µM' | 'nM'
}) => {
  const mwVal = parseFloat(mw);
  if (isNaN(mwVal) || mwVal <= 0) {
    return { error: 'Molecular weight must be a positive number.' };
  }

  // Unit normalizers to base (g, L, M)
  const massToG = { g: 1, mg: 1e-3, 'µg': 1e-6 };
  const volToL = { L: 1, mL: 1e-3, 'µL': 1e-6 };
  const molToM = { M: 1, mM: 1e-3, 'µM': 1e-6, nM: 1e-9 };

  if (target === 'mass') {
    const vL = (parseFloat(volume) || 0) * (volToL[volUnit] || 1e-3);
    const mM = (parseFloat(molarity) || 0) * (molToM[molUnit] || 1e-3);
    if (vL <= 0 || mM <= 0) return { error: 'Volume and molarity must be > 0.' };

    const grams = mM * vL * mwVal;
    const resultInSelectedUnit = grams / (massToG[massUnit] || 1);

    return {
      result: round2(resultInSelectedUnit, 4),
      unit: massUnit,
      formula: 'Mass = Molarity × Volume × MW',
      summary: `Weigh ${round2(resultInSelectedUnit, 4)} ${massUnit} of solute to prepare ${volume} ${volUnit} of ${molarity} ${molUnit} solution.`
    };
  } else if (target === 'molarity') {
    const g = (parseFloat(mass) || 0) * (massToG[massUnit] || 1);
    const vL = (parseFloat(volume) || 0) * (volToL[volUnit] || 1e-3);
    if (g <= 0 || vL <= 0) return { error: 'Mass and volume must be > 0.' };

    const molar = g / (mwVal * vL);
    const resultInSelectedUnit = molar / (molToM[molUnit] || 1e-3);

    return {
      result: round2(resultInSelectedUnit, 4),
      unit: molUnit,
      formula: 'Molarity = Mass / (MW × Volume)',
      summary: `Concentration is ${round2(resultInSelectedUnit, 4)} ${molUnit}.`
    };
  } else {
    // target === 'volume'
    const g = (parseFloat(mass) || 0) * (massToG[massUnit] || 1);
    const mM = (parseFloat(molarity) || 0) * (molToM[molUnit] || 1e-3);
    if (g <= 0 || mM <= 0) return { error: 'Mass and molarity must be > 0.' };

    const liters = g / (mwVal * mM);
    const resultInSelectedUnit = liters / (volToL[volUnit] || 1e-3);

    return {
      result: round2(resultInSelectedUnit, 4),
      unit: volUnit,
      formula: 'Volume = Mass / (MW × Molarity)',
      summary: `Dissolve into a final volume of ${round2(resultInSelectedUnit, 4)} ${volUnit}.`
    };
  }
};

export const calculateMolarity = (mass, molecularWeight, volumeMl) => {
  const res = calculateMolarityGeneral({
    target: 'molarity',
    mass,
    massUnit: 'g',
    mw: molecularWeight,
    volume: volumeMl,
    volUnit: 'mL',
    molUnit: 'M'
  });
  return res.error ? null : res.result;
};

/**
 * 1.4 DNA/RNA Copy Number Calculator
 * @param {number} amountNg - Mass of nucleic acid (ng)
 * @param {number} lengthBp - Sequence length in bp or nt
 * @param {string} moleculeType - 'dsDNA' | 'ssDNA' | 'RNA'
 */
export const calculateDnaCopyNumber = (amountNg, lengthBp, moleculeType = 'dsDNA') => {
  const ng = parseFloat(amountNg);
  const bp = parseFloat(lengthBp);

  if (isNaN(ng) || isNaN(bp) || ng <= 0 || bp <= 0) {
    return { error: 'Nucleic acid mass (ng) and length (bp) must be positive values.' };
  }

  const avogadro = 6.02214076e23;
  const weights = {
    dsDNA: 660, // g/mol per bp
    ssDNA: 330, // g/mol per nt
    RNA: 340    // g/mol per nt
  };
  const mwPerUnit = weights[moleculeType] || 660;
  const molecularWeight = bp * mwPerUnit;
  const massG = ng * 1e-9;
  const moles = massG / molecularWeight;
  const copies = moles * avogadro;
  const fmol = moles * 1e15;

  return {
    copiesExp: copies.toExponential(3),
    copiesFormatted: Math.round(copies).toLocaleString(),
    fmol: round2(fmol, 2),
    molecularWeight: round2(molecularWeight),
    moleculeType,
    summary: `${copies.toExponential(3)} copies (${round2(fmol, 2)} fmol) in ${ng} ng of ${bp} bp ${moleculeType}.`
  };
};

/**
 * 1.5 Transformation Efficiency Calculator
 * @param {number} colonyCount - Number of colonies counted (CFU)
 * @param {number} dnaMassNg - DNA mass added to cells (ng)
 * @param {number} recoveryVolUl - Total transformation recovery volume (µL)
 * @param {number} platedVolUl - Volume of cell suspension plated (µL)
 * @param {number} dilutionFactor - Plating dilution factor (e.g. 1 for neat, 10 for 1:10)
 */
export const calculateTransformationEfficiency = (
  colonyCount,
  dnaMassNg,
  recoveryVolUl = 1000,
  platedVolUl = 100,
  dilutionFactor = 1
) => {
  const cfu = parseFloat(colonyCount);
  const massNg = parseFloat(dnaMassNg);
  const recVol = parseFloat(recoveryVolUl);
  const plateVol = parseFloat(platedVolUl);
  const dil = parseFloat(dilutionFactor) || 1;

  if (isNaN(cfu) || isNaN(massNg) || isNaN(recVol) || isNaN(plateVol) || cfu < 0 || massNg <= 0 || recVol <= 0 || plateVol <= 0 || dil <= 0) {
    return { error: 'Please enter valid positive values for colonies, DNA mass, and volumes.' };
  }
  if (plateVol > recVol) {
    return { error: 'Plated volume cannot exceed total recovery volume.' };
  }

  const dnaMassUg = massNg / 1000;
  // Fraction of total recovery volume plated
  const fractionPlated = (plateVol / recVol) / dil;
  const dnaPlatedUg = dnaMassUg * fractionPlated;

  if (dnaPlatedUg <= 0) {
    return { error: 'Effective DNA plated is zero or invalid.' };
  }

  const efficiency = cfu / dnaPlatedUg;

  let rating = 'Standard Laboratory Competence';
  if (efficiency >= 1e9) rating = 'Super-competent (>10^9 CFU/µg)';
  else if (efficiency >= 1e8) rating = 'High Efficiency Cloning Grade (10^8 - 10^9 CFU/µg)';
  else if (efficiency >= 1e6) rating = 'Routine Subcloning Grade (10^6 - 10^8 CFU/µg)';
  else rating = 'Low Efficiency (<10^6 CFU/µg) - Check heat shock or antibiotic';

  return {
    efficiencyExp: efficiency.toExponential(2) + ' CFU/µg',
    efficiencyFormatted: Math.round(efficiency).toLocaleString() + ' CFU/µg',
    dnaPlatedUg: formatSciOrNum(dnaPlatedUg, 3) + ' µg',
    cfu,
    rating,
    summary: `Transformation Efficiency: ${efficiency.toExponential(2)} CFU/µg DNA (${rating})`
  };
};

// =============================================================================
// CATEGORY 2: PRIMER & SEQUENCE
// =============================================================================

/**
 * 2.1 Primer Length, Tm, Ta & GC Content
 * Implements Wallace Rule: Tm = 2*(A+T) + 4*(G+C) for < 14 bp,
 * and Nearest-Neighbor / Marmur formula for >= 14 bp.
 */
export const calculatePrimerTmTa = (sequence) => {
  if (!sequence || typeof sequence !== 'string') {
    return { error: 'Primer sequence cannot be empty.' };
  }

  const cleanSeq = sequence.toUpperCase().replace(/[^ATGC]/g, '');
  if (cleanSeq.length === 0) {
    return { error: 'Invalid DNA sequence. Only A, T, G, and C nucleotides allowed.' };
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

  // Wallace Rule (< 14 bp): Tm = 2*(A+T) + 4*(G+C)
  const wallaceTm = 2 * atCount + 4 * gcCount;
  // Marmur / nearest-neighbor approximation (>= 14 bp)
  const marmurTm = 64.9 + (41 * (gcCount - 16.4)) / len;

  const tm = len < 14 ? wallaceTm : marmurTm;
  const ta = tm - 5;

  return {
    sequence: cleanSeq,
    length: len,
    gcPercent: round2(gcPercent),
    wallaceTm: round2(wallaceTm),
    tm: round2(tm),
    ta: round2(ta),
    taRange: `${round2(tm - 5)} °C to ${round2(tm - 3)} °C`,
    summary: `Length: ${len} nt | GC: ${round2(gcPercent)}% | Tm: ${round2(tm)} °C | Suggested Ta: ${round2(ta)} °C`
  };
};

export const calculatePrimerGcContent = (sequence) => {
  const res = calculatePrimerTmTa(sequence);
  if (res.error) return res;
  return {
    sequence: res.sequence,
    length: res.length,
    gcPercent: res.gcPercent,
    summary: `Sequence Length: ${res.length} bp | GC Content: ${res.gcPercent}%`
  };
};

/**
 * 2.2 Primer Reconstitution Calculator
 * Volume (µL) = (Amount in nmol * 1000) / Desired Concentration (µM)
 */
export const calculatePrimerReconstitution = (amountVal, desiredConcVal, amountUnit = 'nmol', concUnit = 'µM') => {
  const amt = parseFloat(amountVal);
  const conc = parseFloat(desiredConcVal);

  if (isNaN(amt) || isNaN(conc) || amt <= 0 || conc <= 0) {
    return { error: 'Primer amount and desired concentration must be positive numbers.' };
  }

  // Convert amount to nmol
  const nmol = amountUnit === 'µmol' ? amt * 1000 : amt;
  // Convert conc to µM
  const concUm = concUnit === 'mM' ? conc * 1000 : conc;

  const volUl = (nmol * 1000) / concUm;
  const volMl = volUl / 1000;

  return {
    volumeUl: round2(volUl),
    volumeMl: round2(volMl, 4),
    amountNmol: round2(nmol),
    targetConcUm: round2(concUm),
    summary: `Add ${round2(volUl)} µL (${round2(volMl, 3)} mL) of TE buffer or NFW to obtain ${round2(concUm)} µM stock.`
  };
};

/**
 * 2.3 Primer Dilution Calculator (C1V1 = C2V2)
 */
export const calculatePrimerDilution = (stockConc, desiredConc, finalVol, concUnit = 'µM', volUnit = 'µL') => {
  const c1 = parseFloat(stockConc);
  const c2 = parseFloat(desiredConc);
  const v2 = parseFloat(finalVol);

  if (isNaN(c1) || isNaN(c2) || isNaN(v2) || c1 <= 0 || c2 <= 0 || v2 <= 0) {
    return { error: 'Stock concentration, desired concentration, and final volume must be > 0.' };
  }
  if (c2 > c1) {
    return { error: 'Working concentration (C2) cannot exceed stock concentration (C1).' };
  }

  const v1 = (c2 * v2) / c1;
  const diluent = v2 - v1;

  return {
    stockVol: round2(v1),
    diluentVol: round2(diluent),
    finalVol: round2(v2),
    finalConc: round2(c2),
    concUnit,
    volUnit,
    summary: `Pipette ${round2(v1)} ${volUnit} of primer stock into ${round2(diluent)} ${volUnit} of diluent for ${round2(v2)} ${volUnit} at ${round2(c2)} ${concUnit}.`
  };
};

export const calculateDilution = calculatePrimerDilution;

/**
 * 2.4 Reverse Complement Tool
 */
export const calculateReverseComplement = (sequence) => {
  if (!sequence || typeof sequence !== 'string') {
    return { error: 'Sequence cannot be empty.' };
  }

  const cleanSeq = sequence.toUpperCase().replace(/[^ATGCU]/g, '');
  if (cleanSeq.length === 0) {
    return { error: 'Please enter valid nucleotide bases (A, T, G, C, U).' };
  }

  const complementMap = { A: 'T', T: 'A', U: 'A', G: 'C', C: 'G' };
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
    gcPercent: round2(gcPercent),
    summary: `Original: ${cleanSeq.slice(0, 16)}... → RevComp: ${reverseComplement.slice(0, 16)}... (${cleanSeq.length} nt)`
  };
};

// =============================================================================
// CATEGORY 3: PCR, qPCR & LAMP
// =============================================================================

/**
 * 3.1 PCR Master Mix Calculator
 */
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
    components,
    summary: `Prepared ${round2(totalVol * multiplier)} µL master mix for ${rxns} reactions (+${overage}% excess).`
  };
};

/**
 * 3.2 qPCR Master Mix Calculator
 */
export const calculateQpcrMix = (numRxns, extraPercent = 10, rxnVol = 20, mm2x = 10, fwdPrimer = 0.4, revPrimer = 0.4, template = 2, probe = 0) => {
  const n = parseFloat(numRxns);
  const extra = parseFloat(extraPercent);
  const totalV = parseFloat(rxnVol);
  const mm = parseFloat(mm2x);
  const fwd = parseFloat(fwdPrimer);
  const rev = parseFloat(revPrimer);
  const temp = parseFloat(template);
  const prb = parseFloat(probe) || 0;

  if (isNaN(n) || n <= 0 || isNaN(totalV) || totalV <= 0) {
    return { error: 'Reactions and reaction volume must be > 0.' };
  }

  const sumReagents = mm + fwd + rev + temp + prb;
  if (sumReagents > totalV) {
    return { error: 'Reagent volumes exceed total reaction volume.' };
  }

  const waterPerRxn = totalV - sumReagents;
  const multiplier = n * (1 + extra / 100);

  const items = [
    { name: 'Nuclease-Free Water', perRxn: waterPerRxn },
    { name: '2X qPCR Master Mix', perRxn: mm },
    { name: 'Forward Primer (10 µM)', perRxn: fwd },
    { name: 'Reverse Primer (10 µM)', perRxn: rev }
  ];
  if (prb > 0) items.push({ name: 'Probe (10 µM)', perRxn: prb });
  items.push({ name: 'cDNA / DNA Template', perRxn: temp });

  return {
    totalReactions: round2(multiplier),
    totalVolume: round2(totalV * multiplier),
    components: items.map(i => ({
      name: i.name,
      perRxn: round2(i.perRxn),
      total: round2(i.perRxn * multiplier),
      unit: 'µL'
    })),
    summary: `Prepared ${round2(totalV * multiplier)} µL qPCR mix for ${n} reactions.`
  };
};

/**
 * 3.3 LAMP Master Mix Calculator
 */
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
    })),
    summary: `LAMP Reaction Setup: ${round2(totalV * multiplier)} µL total for ${n} rxns.`
  };
};

/**
 * 3.4 Template Dilution Calculator
 */
export const calculateTemplateDilution = (stockConc, desiredConc, finalVol, concUnit = 'ng/µL', volUnit = 'µL') => {
  return calculateNucleicAcidDilution(stockConc, desiredConc, finalVol, concUnit, volUnit);
};

/**
 * 3.5 Primer Concentration Calculator
 * Mode A: nmol & µL -> Conc (µM)
 * Mode B: Target Conc (µM) & Vol (µL) -> Amount (nmol)
 */
export const calculatePrimerConcentration = ({
  mode = 'calculateConc', // 'calculateConc' | 'calculateAmount'
  amountNmol = 25,
  volumeUl = 250,
  targetConcUm = 100
}) => {
  if (mode === 'calculateConc') {
    const nmol = parseFloat(amountNmol);
    const vol = parseFloat(volumeUl);
    if (isNaN(nmol) || isNaN(vol) || nmol <= 0 || vol <= 0) {
      return { error: 'Amount (nmol) and Volume (µL) must be positive values.' };
    }
    // Conc (µM) = (Amount in nmol / Volume in µL) * 1000
    const concUm = (nmol / vol) * 1000;
    return {
      concUm: round2(concUm),
      concMm: round2(concUm / 1000, 4),
      amountNmol: round2(nmol),
      volumeUl: round2(vol),
      formula: 'Concentration (µM) = (nmol / µL) × 1000',
      summary: `Primer Concentration: ${round2(concUm)} µM (${round2(concUm / 1000, 3)} mM)`
    };
  } else {
    const conc = parseFloat(targetConcUm);
    const vol = parseFloat(volumeUl);
    if (isNaN(conc) || isNaN(vol) || conc <= 0 || vol <= 0) {
      return { error: 'Target concentration and volume must be positive numbers.' };
    }
    // Amount (nmol) = Conc (µM) * Volume (µL) / 1000
    const nmol = (conc * vol) / 1000;
    return {
      amountNmol: round2(nmol),
      amountUmol: round2(nmol / 1000, 4),
      targetConcUm: round2(conc),
      volumeUl: round2(vol),
      formula: 'Amount (nmol) = (µM × µL) / 1000',
      summary: `Required Primer Amount: ${round2(nmol)} nmol (${round2(nmol / 1000, 4)} µmol)`
    };
  }
};

// =============================================================================
// CATEGORY 4: CELL BIOLOGY
// =============================================================================

/**
 * 4.1 Cell Counting & Concentration Calculator
 * @param {number} cellCount - Total cells counted across squares
 * @param {number} squaresCounted - Number of hemocytometer squares counted
 * @param {number} dilutionFactor - Trypan blue or sample dilution factor
 * @param {number} chamberFactor - Hemocytometer constant (default 10,000)
 * @param {number} suspensionVolMl - Total cell suspension volume (mL)
 */
export const calculateCellCounting = (
  cellCount,
  squaresCounted = 4,
  dilutionFactor = 2,
  chamberFactor = 10000,
  suspensionVolMl = null
) => {
  const count = parseFloat(cellCount);
  const squares = parseFloat(squaresCounted);
  const dil = parseFloat(dilutionFactor) || 1;
  const chamber = parseFloat(chamberFactor) || 10000;
  const volMl = suspensionVolMl ? parseFloat(suspensionVolMl) : null;

  if (isNaN(count) || count < 0 || isNaN(squares) || squares <= 0) {
    return { error: 'Cells counted must be >= 0 and squares counted must be > 0.' };
  }

  const avgPerSquare = count / squares;
  const cellsPerMl = avgPerSquare * dil * chamber;

  let totalCells = null;
  let totalCellsFormatted = 'Provide suspension volume';
  if (volMl && volMl > 0) {
    totalCells = cellsPerMl * volMl;
    totalCellsFormatted = `${formatSciOrNum(totalCells)} cells (in ${volMl} mL)`;
  }

  return {
    avgPerSquare: round2(avgPerSquare),
    cellsPerMl: formatSciOrNum(cellsPerMl),
    cellsPerMlExp: cellsPerMl.toExponential(2) + ' cells/mL',
    totalCells: totalCells ? formatSciOrNum(totalCells) : 'N/A',
    totalCellsFormatted,
    summary: `Cell Concentration: ${cellsPerMl.toExponential(2)} cells/mL ${totalCells ? `| Total: ${totalCells.toExponential(2)} cells` : ''}`
  };
};

/**
 * 4.2 Cell Viability Calculator
 * Trypan Blue / Fluorescent viability
 */
export const calculateCellViability = (viableCount, deadCount) => {
  const viable = parseFloat(viableCount);
  const dead = parseFloat(deadCount);

  if (isNaN(viable) || isNaN(dead) || viable < 0 || dead < 0) {
    return { error: 'Viable and dead cell counts must be non-negative numbers.' };
  }

  const total = viable + dead;
  if (total === 0) {
    return { error: 'Total cell count cannot be zero.' };
  }

  const viabilityPct = (viable / total) * 100;
  const deadPct = (dead / total) * 100;

  return {
    totalCells: total,
    viableCells: viable,
    deadCells: dead,
    viabilityPct: round2(viabilityPct),
    deadPct: round2(deadPct),
    summary: `Viability: ${round2(viabilityPct)}% (${viable} viable / ${total} total cells)`
  };
};

/**
 * 4.3 Seeding Density Calculator
 * Predefined vessels or custom area
 */
export const calculateSeedingDensity = (
  vesselKey = '6-well',
  customArea = null,
  targetDensity = 100000,
  densityUnit = 'cells/cm²', // 'cells/cm²' | 'cells/well'
  numberOfWells = 6
) => {
  const vesselAreas = {
    '6-well': 9.6,
    '12-well': 3.8,
    '24-well': 1.9,
    '48-well': 0.95,
    '96-well': 0.32,
    'T25': 25.0,
    'T75': 75.0,
    'T175': 175.0,
    'custom': parseFloat(customArea) || 10.0
  };

  const area = vesselKey === 'custom' ? (parseFloat(customArea) || 10.0) : (vesselAreas[vesselKey] || 9.6);
  const density = parseFloat(targetDensity);
  const numWells = parseInt(numberOfWells, 10) || 1;

  if (isNaN(density) || density <= 0 || isNaN(numWells) || numWells <= 0 || area <= 0) {
    return { error: 'Please enter valid positive values for density, area, and vessel count.' };
  }

  let cellsPerWell = 0;
  if (densityUnit === 'cells/cm²') {
    cellsPerWell = density * area;
  } else {
    cellsPerWell = density;
  }

  const totalCells = cellsPerWell * numWells;

  return {
    vessel: vesselKey === 'custom' ? `Custom (${area} cm²)` : vesselKey,
    areaPerWellCm2: round2(area),
    cellsPerWell: formatSciOrNum(cellsPerWell),
    numberOfWells: numWells,
    totalCellsRequired: formatSciOrNum(totalCells),
    summary: `Seed ${formatSciOrNum(cellsPerWell)} cells/well across ${numWells} wells (${formatSciOrNum(totalCells)} cells total).`
  };
};

/**
 * 4.4 Cell Dilution Calculator (C1V1 = C2V2 for cell cultures)
 */
export const calculateCellDilution = (currentConc, desiredConc, finalVolMl) => {
  const c1 = parseFloat(currentConc);
  const c2 = parseFloat(desiredConc);
  const v2 = parseFloat(finalVolMl);

  if (isNaN(c1) || isNaN(c2) || isNaN(v2) || c1 <= 0 || c2 <= 0 || v2 <= 0) {
    return { error: 'Current concentration, desired concentration, and final volume must be > 0.' };
  }
  if (c2 > c1) {
    return { error: 'Desired concentration cannot be higher than starting cell concentration using dilution alone.' };
  }

  const v1Ml = (c2 * v2) / c1;
  const v1Ul = v1Ml * 1000;
  const mediumMl = v2 - v1Ml;
  const mediumUl = mediumMl * 1000;

  return {
    cellSuspensionMl: round2(v1Ml, 3),
    cellSuspensionUl: round2(v1Ul),
    cultureMediumMl: round2(mediumMl, 3),
    cultureMediumUl: round2(mediumUl),
    finalVolMl: round2(v2),
    finalConc: formatSciOrNum(c2),
    summary: `Mix ${round2(v1Ml, 3)} mL (${round2(v1Ul)} µL) cell suspension with ${round2(mediumMl, 3)} mL medium for ${round2(v2)} mL total.`
  };
};

/**
 * 4.5 MOI (Multiplicity of Infection) Calculator
 * Required Viral Units = Target Cells * Desired MOI
 * Virus Volume = Required Units / Titer
 */
export const calculateMoi = (targetCells, desiredMoi, viralTiter, titerUnit = 'TU/mL') => {
  const cells = parseFloat(targetCells);
  const moi = parseFloat(desiredMoi);
  const titer = parseFloat(viralTiter);

  if (isNaN(cells) || isNaN(moi) || isNaN(titer) || cells <= 0 || moi <= 0 || titer <= 0) {
    return { error: 'Cell count, desired MOI, and viral titer must be positive numbers.' };
  }

  const viralUnits = cells * moi;
  const volMl = viralUnits / titer;
  const volUl = volMl * 1000;

  return {
    targetCells: formatSciOrNum(cells),
    desiredMoi: round2(moi),
    requiredViralUnits: formatSciOrNum(viralUnits),
    viralTiter: `${formatSciOrNum(titer)} ${titerUnit}`,
    virusVolUl: round2(volUl, 2),
    virusVolMl: round2(volMl, 4),
    disclaimer: 'MOI is a theoretical exposure ratio. Actual transduction or infection efficiency varies with cell type, envelope tropism, and protocol.',
    summary: `Add ${round2(volUl, 2)} µL of viral stock (${formatSciOrNum(viralUnits)} units) for MOI ${round2(moi)} on ${formatSciOrNum(cells)} cells.`
  };
};

// =============================================================================
// CATEGORY 5: SOLUTIONS & BUFFERS
// =============================================================================

/**
 * 5.1 Molarity and Normality Calculator
 * Supports: Molarity Mode, Normality Mode (with valency factor n)
 */
export const calculateMolarityNormality = (massG, mwGmol, volumeMl, nFactor = 1, mode = 'molarity') => {
  const mass = parseFloat(massG);
  const mw = parseFloat(mwGmol);
  const volMl = parseFloat(volumeMl);
  const n = parseFloat(nFactor) || 1;

  if (isNaN(mass) || isNaN(mw) || isNaN(volMl) || mass <= 0 || mw <= 0 || volMl <= 0) {
    return { error: 'Mass, Molecular Weight, and Volume must be positive numbers.' };
  }
  if (n <= 0) {
    return { error: 'Valency n-factor must be greater than 0.' };
  }

  const volL = volMl / 1000;
  const molarity = mass / (mw * volL);
  const normality = molarity * n;
  const equivalentWeight = mw / n;

  return {
    molarity: round2(molarity, 4),
    normality: round2(normality, 4),
    equivalentWeight: round2(equivalentWeight),
    volL: round2(volL, 4),
    nFactor: round2(n),
    summary: `Molarity = ${round2(molarity, 4)} M | Normality = ${round2(normality, 4)} N (for n=${round2(n)})`
  };
};

/**
 * 5.2 C1V1 Dilution Calculator
 */
export const calculateC1V1Dilution = (c1, c2, v2, unitConc = 'mM', unitVol = 'mL') => {
  return calculateDilution(c1, c2, v2, unitConc, unitVol);
};

/**
 * 5.3 Serial Dilution Calculator
 */
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
  let cumulativeFactor = 1;

  for (let i = 1; i <= tubes; i++) {
    currentConc = currentConc / factor;
    cumulativeFactor *= factor;
    tubeSteps.push({
      tube: i,
      conc: round2(currentConc, 4),
      dilutionFactor: `${factor}X`,
      cumulativeFactor: `${cumulativeFactor}X`,
      transferVol: round2(transferVol, 3),
      diluentVol: round2(diluentVol, 3)
    });
  }

  return {
    initialConc: round2(conc0),
    dilutionFactor: round2(factor),
    totalDilutionFactor: `${cumulativeFactor}X`,
    transferVol: round2(transferVol, 3),
    diluentVol: round2(diluentVol, 3),
    steps: tubeSteps,
    summary: `Prepared ${tubes} serial dilution tubes (Factor: ${factor}X, Cumulative: ${cumulativeFactor}X).`
  };
};

/**
 * 5.4 Percentage Solution Calculator
 * Modes: % w/v (g/100 mL), % w/w (g/100 g), % v/v (mL/100 mL)
 */
export const calculatePercentageSolution = (type = 'wv', percentVal, finalAmountVal) => {
  const pct = parseFloat(percentVal);
  const amt = parseFloat(finalAmountVal);

  if (isNaN(pct) || isNaN(amt) || pct <= 0 || amt <= 0) {
    return { error: 'Percentage and final solution quantity must be greater than 0.' };
  }

  if (type === 'wv') {
    // Mass(g) = (% w/v * Volume(mL)) / 100
    const massG = (pct * amt) / 100;
    return {
      type: '% w/v',
      soluteRequired: `${round2(massG, 3)} g`,
      solventVolume: `${round2(amt)} mL`,
      summary: `Dissolve ${round2(massG, 3)} g of solute in water and bring to a final volume of ${round2(amt)} mL.`
    };
  } else if (type === 'ww') {
    // Solute mass = (% w/w * Total Mass) / 100
    const soluteG = (pct * amt) / 100;
    const solventG = amt - soluteG;
    return {
      type: '% w/w',
      soluteRequired: `${round2(soluteG, 3)} g`,
      solventMass: `${round2(solventG, 3)} g`,
      summary: `Mix ${round2(soluteG, 3)} g of solute with ${round2(solventG, 3)} g of solvent for ${round2(amt)} g total solution.`
    };
  } else {
    // % v/v
    const soluteMl = (pct * amt) / 100;
    const solventMl = amt - soluteMl;
    return {
      type: '% v/v',
      soluteVolume: `${round2(soluteMl, 3)} mL`,
      solventVolume: `~${round2(solventMl, 3)} mL (bring to final volume)`,
      summary: `Add ${round2(soluteMl, 3)} mL of liquid solute and bring to ${round2(amt)} mL with solvent.`
    };
  }
};

/**
 * 5.5 pH Adjustment & Buffer Calculator
 * Mode A: Buffer Henderson-Hasselbalch (approximate titrant volume)
 * Mode B: Simple educational pH calculation from [H+]
 */
export const calculatePhAdjustment = (volumeL, currentPh, targetPh, titrantConcM = 1.0, mode = 'simple') => {
  const vol = parseFloat(volumeL);
  const curPh = parseFloat(currentPh);
  const tarPh = parseFloat(targetPh);
  const titConc = parseFloat(titrantConcM) || 1.0;

  if (isNaN(vol) || isNaN(curPh) || isNaN(tarPh) || isNaN(titConc) || vol <= 0 || titConc <= 0) {
    return { error: 'Volume, target concentration, and pH values must be valid.' };
  }
  if (curPh < 0 || curPh > 14 || tarPh < 0 || tarPh > 14) {
    return { error: 'pH values must remain between 0.00 and 14.00.' };
  }

  const hCurrent = Math.pow(10, -curPh);
  const hTarget = Math.pow(10, -tarPh);

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
    titrantVolMl: round2(titrantVolUl / 1000, 3),
    educationalWarning: 'Actual required buffer titrant volume depends on buffer capacity and temperature. Always verify experimentally using a calibrated pH meter.',
    summary: `Add ~${round2(titrantVolUl)} µL (${round2(titrantVolUl / 1000, 3)} mL) of ${titrantType} to adjust ${round2(vol)} L from pH ${round2(curPh)} to pH ${round2(tarPh)}.`
  };
};

// =============================================================================
// CATEGORY 6: CLONING & GENETIC ENGINEERING
// =============================================================================

/**
 * 6.1 Restriction Digestion Calculator
 */
export const calculateRestrictionDigest = (
  totalVolumeUl = 50,
  dnaMassUg = 1,
  dnaConcNgUl = 100,
  enz1Vol = 1.0,
  enz2Vol = 0.0,
  bufferConcentrationX = 10,
  extraPercent = 10,
  reactions = 1
) => {
  const totalV = parseFloat(totalVolumeUl);
  const massUg = parseFloat(dnaMassUg);
  const concNg = parseFloat(dnaConcNgUl);
  const e1 = parseFloat(enz1Vol) || 0;
  const e2 = parseFloat(enz2Vol) || 0;
  const bufX = parseFloat(bufferConcentrationX) || 10;
  const rxns = parseFloat(reactions) || 1;
  const extra = parseFloat(extraPercent) || 0;

  if (isNaN(totalV) || totalV <= 0 || isNaN(massUg) || massUg <= 0 || isNaN(concNg) || concNg <= 0) {
    return { error: 'Total volume, DNA mass, and DNA conc must be > 0.' };
  }

  const dnaMassNg = massUg * 1000;
  const vDna = dnaMassNg / concNg;
  const vBuffer = totalV / bufX;

  const sumComponents = vDna + vBuffer + e1 + e2;
  if (sumComponents > totalV) {
    return { error: `Component volumes (${round2(sumComponents)} µL) exceed reaction volume (${totalV} µL)!` };
  }

  const vWater = totalV - sumComponents;
  const multiplier = rxns * (1 + extra / 100);

  const totalEnzyme = e1 + e2;
  const enzymePercent = (totalEnzyme / totalV) * 100;
  let enzymeWarning = null;
  if (enzymePercent > 10) {
    enzymeWarning = `Total enzyme is ${round2(enzymePercent)}% of reaction volume (>10%). Excess glycerol may cause star activity.`;
  }

  const components = [
    { name: 'Nuclease-Free Water', perRxn: round2(vWater), total: round2(vWater * multiplier), unit: 'µL' },
    { name: `${bufX}X Reaction Buffer`, perRxn: round2(vBuffer), total: round2(vBuffer * multiplier), unit: 'µL' },
    { name: `Substrate DNA (${massUg} µg)`, perRxn: round2(vDna), total: round2(vDna * multiplier), unit: 'µL' },
    { name: 'Restriction Enzyme 1', perRxn: round2(e1), total: round2(e1 * multiplier), unit: 'µL' }
  ];
  if (e2 > 0) {
    components.push({ name: 'Restriction Enzyme 2', perRxn: round2(e2), total: round2(e2 * multiplier), unit: 'µL' });
  }

  return {
    totalVolume: round2(totalV),
    totalPreparationVolume: round2(totalV * multiplier),
    multiplier: round2(multiplier),
    components,
    waterVolume: round2(vWater),
    enzymeWarning,
    summary: `Digestion setup: ${dnaMassUg} µg DNA in ${totalV} µL volume (${round2(vWater)} µL water).`
  };
};

/**
 * 6.2 DNA Ligation Calculator
 * Insert Mass (ng) = Vector Mass (ng) * (Insert Size / Vector Size) * Molar Ratio
 */
export const calculateDnaLigation = (
  vectorBp,
  vectorMassNg,
  insertBp,
  molarRatio = 3,
  vectorConcNgUl = null,
  insertConcNgUl = null,
  rxnVolUl = 20
) => {
  const vBp = parseFloat(vectorBp);
  const vNg = parseFloat(vectorMassNg);
  const iBp = parseFloat(insertBp);
  const ratio = parseFloat(molarRatio);
  const vConc = vectorConcNgUl ? parseFloat(vectorConcNgUl) : null;
  const iConc = insertConcNgUl ? parseFloat(insertConcNgUl) : null;
  const totalVol = parseFloat(rxnVolUl) || 20;

  if (isNaN(vBp) || isNaN(vNg) || isNaN(iBp) || isNaN(ratio) || vBp <= 0 || vNg <= 0 || iBp <= 0 || ratio <= 0) {
    return { error: 'Vector size, vector mass, insert size, and ratio must be > 0.' };
  }

  const insertMassNg = (iBp / vBp) * vNg * ratio;

  let vectorVol = null;
  let insertVol = null;
  let waterVol = null;

  if (vConc && vConc > 0) vectorVol = vNg / vConc;
  if (iConc && iConc > 0) insertVol = insertMassNg / iConc;

  const bufVol = totalVol * 0.1; // 10X buffer = 2 µL in 20 µL
  const ligaseVol = 1.0;

  if (vectorVol !== null && insertVol !== null) {
    waterVol = totalVol - (vectorVol + insertVol + bufVol + ligaseVol);
  }

  return {
    insertMassNg: round2(insertMassNg),
    vectorMassNg: round2(vNg),
    molarRatio: `${round2(ratio)}:1`,
    vectorVol: vectorVol ? round2(vectorVol) : null,
    insertVol: insertVol ? round2(insertVol) : null,
    bufVol: round2(bufVol),
    ligaseVol: round2(ligaseVol),
    waterVol: waterVol !== null ? round2(Math.max(0, waterVol)) : null,
    totalVol: round2(totalVol),
    summary: `Required Insert DNA: ${round2(insertMassNg)} ng for ${round2(vNg)} ng Vector (${round2(ratio)}:1 ratio).`
  };
};

/**
 * 6.3 Insert : Vector Ratio Calculator
 */
export const calculateInsertVectorRatio = (vectorMassNg, vectorBp, insertBp, molarRatio = 3, insertConc = null) => {
  return calculateDnaLigation(vectorBp, vectorMassNg, insertBp, molarRatio, null, insertConc);
};

/**
 * 6.4 DNA Mass ↔ Molar Amount Calculator
 * Uses dsDNA 660 g/mol per bp
 */
export const calculateDnaMassMolar = ({
  direction = 'massToMoles', // 'massToMoles' | 'molesToMass'
  lengthBp = 5000,
  massNg = 100,
  molesPmol = 30
}) => {
  const bp = parseFloat(lengthBp);
  if (isNaN(bp) || bp <= 0) {
    return { error: 'DNA length in base pairs must be > 0.' };
  }

  const mwPerBp = 660; // g/mol
  const mw = bp * mwPerBp;

  if (direction === 'massToMoles') {
    const ng = parseFloat(massNg);
    if (isNaN(ng) || ng <= 0) return { error: 'DNA mass (ng) must be > 0.' };

    // pmol = [Mass(ng) * 10^6] / [bp * 660]
    const pmol = (ng * 1e6) / (bp * mwPerBp);
    const fmol = pmol * 1000;

    return {
      lengthBp: bp,
      massNg: round2(ng),
      molesPmol: round2(pmol, 2),
      molesFmol: round2(fmol, 2),
      molecularWeight: round2(mw),
      formula: 'pmol = [Mass(ng) × 10⁶] / [Length(bp) × 660 g/mol]',
      summary: `${round2(ng)} ng of ${bp} bp dsDNA ≈ ${round2(pmol, 2)} pmol (${round2(fmol, 1)} fmol).`
    };
  } else {
    const pmol = parseFloat(molesPmol);
    if (isNaN(pmol) || pmol <= 0) return { error: 'Molar amount (pmol) must be > 0.' };

    // Mass(ng) = pmol * bp * 660 / 10^6
    const ng = (pmol * bp * mwPerBp) / 1e6;

    return {
      lengthBp: bp,
      molesPmol: round2(pmol),
      massNg: round2(ng, 2),
      molecularWeight: round2(mw),
      formula: 'Mass(ng) = pmol × Length(bp) × 660 / 10⁶',
      summary: `${round2(pmol)} pmol of ${bp} bp dsDNA ≈ ${round2(ng, 2)} ng.`
    };
  }
};

/**
 * 6.5 Agarose Gel Preparation Calculator
 */
export const calculateAgaroseGel = (gelPercent, finalVolumeMl, bufferType = '1X TAE', bufferStock = '50X') => {
  const pct = parseFloat(gelPercent);
  const vol = parseFloat(finalVolumeMl);

  if (isNaN(pct) || isNaN(vol) || pct <= 0 || vol <= 0) {
    return { error: 'Gel percentage and volume must be > 0.' };
  }

  // Agarose mass (g) = (Gel% * Volume (mL)) / 100
  const agaroseGrams = (pct * vol) / 100;

  let stockVolMl = null;
  let waterVolMl = null;
  if (bufferStock === '50X') {
    stockVolMl = vol / 50;
    waterVolMl = vol - stockVolMl;
  } else if (bufferStock === '10X') {
    stockVolMl = vol / 10;
    waterVolMl = vol - stockVolMl;
  }

  return {
    agaroseGrams: round2(agaroseGrams),
    bufferVolumeMl: round2(vol),
    bufferType,
    bufferStock,
    stockVolMl: stockVolMl ? round2(stockVolMl, 2) : null,
    waterVolMl: waterVolMl ? round2(waterVolMl, 1) : null,
    summary: `Weigh ${round2(agaroseGrams)} g of agarose into ${round2(vol)} mL of ${bufferType} buffer.`
  };
};

// =============================================================================
// CATEGORY 7: PROTEIN & BIOCHEMISTRY
// =============================================================================

/**
 * 7.1 Protein Concentration Calculator
 * Mode A: Mass + Volume -> Conc
 * Mode B: Absorbance A280, Extinction coeff ε, Path length l -> c = A / (ε * l)
 */
export const calculateProteinConcentration = ({
  mode = 'absorbance', // 'absorbance' | 'massVolume'
  a280 = 1.25,
  extinctionCoeff = 1.0, // (mg/mL)^-1 cm^-1 or M^-1 cm^-1
  pathLengthCm = 1.0,
  dilutionFactor = 1.0,
  massMg = 5.0,
  volumeMl = 2.5
}) => {
  if (mode === 'massVolume') {
    const m = parseFloat(massMg);
    const v = parseFloat(volumeMl);
    if (isNaN(m) || isNaN(v) || m <= 0 || v <= 0) {
      return { error: 'Mass and volume must be positive numbers.' };
    }
    const conc = m / v;
    return {
      concMgMl: round2(conc, 3),
      concUgMl: round2(conc * 1000),
      formula: 'Concentration = Mass / Volume',
      summary: `Protein Concentration: ${round2(conc, 3)} mg/mL (${round2(conc * 1000)} µg/mL)`
    };
  } else {
    const abs = parseFloat(a280);
    const ec = parseFloat(extinctionCoeff);
    const l = parseFloat(pathLengthCm) || 1.0;
    const dil = parseFloat(dilutionFactor) || 1.0;

    if (isNaN(abs) || isNaN(ec) || abs < 0 || ec <= 0 || l <= 0 || dil <= 0) {
      return { error: 'Absorbance, extinction coefficient, and path length must be valid numbers.' };
    }

    // c = (A / (ε * l)) * Dilution
    const conc = (abs / (ec * l)) * dil;
    return {
      concMgMl: round2(conc, 3),
      concUgMl: round2(conc * 1000),
      a280: round2(abs, 3),
      formula: 'c = (A280 / (ε × l)) × Dilution Factor',
      summary: `Protein Concentration: ${round2(conc, 3)} mg/mL (Beer-Lambert method)`
    };
  }
};

/**
 * 7.2 BCA Assay Calculator (Standard Curve Regression)
 */
export const calculateBcaAssay = (
  standards = [
    { conc: 0, abs: 0.05 },
    { conc: 125, abs: 0.18 },
    { conc: 250, abs: 0.32 },
    { conc: 500, abs: 0.61 },
    { conc: 750, abs: 0.89 },
    { conc: 1000, abs: 1.18 }
  ],
  unknownAbs = 0.54,
  dilutionFactor = 1.0,
  blankAbs = null
) => {
  const unk = parseFloat(unknownAbs);
  const dil = parseFloat(dilutionFactor) || 1.0;
  if (isNaN(unk) || unk < 0) {
    return { error: 'Unknown absorbance must be a non-negative number.' };
  }

  // Blank correction
  const blank = blankAbs !== null ? parseFloat(blankAbs) : (standards[0]?.abs || 0);
  const netStandards = standards.map(s => ({
    conc: parseFloat(s.conc),
    netAbs: Math.max(0, parseFloat(s.abs) - blank)
  })).filter(s => !isNaN(s.conc) && !isNaN(s.netAbs));

  if (netStandards.length < 3) {
    return { error: 'At least 3 valid standards are required for linear regression.' };
  }

  // Linear regression y = mx + b (netAbs = m * conc + b)
  const n = netStandards.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let s of netStandards) {
    sumX += s.conc;
    sumY += s.netAbs;
    sumXY += s.conc * s.netAbs;
    sumX2 += s.conc * s.conc;
    sumY2 += s.netAbs * s.netAbs;
  }

  const denominator = (n * sumX2) - (sumX * sumX);
  if (denominator === 0) return { error: 'Invalid standard concentrations (denominator 0).' };

  const slope = ((n * sumXY) - (sumX * sumY)) / denominator;
  const intercept = (sumY - (slope * sumX)) / n;

  // R² calculation
  const ssTot = sumY2 - (sumY * sumY) / n;
  const ssRes = netStandards.reduce((acc, s) => {
    const yPred = slope * s.conc + intercept;
    return acc + Math.pow(s.netAbs - yPred, 2);
  }, 0);
  const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 1;

  // Unknown net abs
  const netUnk = Math.max(0, unk - blank);
  const unknownConc = slope !== 0 ? (netUnk - intercept) / slope : 0;
  const correctedConc = unknownConc * dil;

  // Range warning
  const minConc = Math.min(...netStandards.map(s => s.conc));
  const maxConc = Math.max(...netStandards.map(s => s.conc));
  let warning = null;
  if (unknownConc < minConc || unknownConc > maxConc) {
    warning = `Calculated sample conc (${round2(unknownConc)} µg/mL) is outside the standard curve range (${minConc} - ${maxConc} µg/mL).`;
  }

  return {
    slope: round2(slope, 6),
    intercept: round2(intercept, 4),
    r2: round2(r2, 4),
    unknownConc: round2(Math.max(0, unknownConc), 2),
    correctedConc: round2(Math.max(0, correctedConc), 2),
    dilutionFactor: dil,
    warning,
    summary: `BCA Result: ${round2(Math.max(0, correctedConc), 2)} µg/mL (R² = ${round2(r2, 4)})`
  };
};

/**
 * 7.3 Bradford Assay Calculator
 */
export const calculateBradfordAssay = (standards, unknownAbs, dilutionFactor = 1.0, blankAbs = null) => {
  const res = calculateBcaAssay(standards, unknownAbs, dilutionFactor, blankAbs);
  if (res.error) return res;
  return {
    ...res,
    summary: `Bradford Result: ${res.correctedConc} µg/mL (R² = ${res.r2})`
  };
};

/**
 * 7.4 Protein Dilution Calculator
 */
export const calculateProteinDilution = (c1, c2, v2, concUnit = 'mg/mL', volUnit = 'µL') => {
  return calculateDilution(c1, c2, v2, concUnit, volUnit);
};

/**
 * 7.5 Enzyme Activity Calculator
 * Rate = ΔA / Δt
 * Activity (U/mL) = [(ΔA/min) / (ε * l)] * (Vrxn / Venz) * Dilution
 * Specific Activity (U/mg) = Activity (U/mL) / Protein Conc (mg/mL)
 */
export const calculateEnzymeActivity = (
  deltaA,
  deltaTimeMin,
  extinctionCoeff = 6220, // e.g. NADH = 6220 M^-1 cm^-1
  pathLengthCm = 1.0,
  rxnVolumeMl = 1.0,
  enzymeVolumeMl = 0.1,
  dilutionFactor = 1.0,
  proteinConcMgMl = null
) => {
  const da = parseFloat(deltaA);
  const dt = parseFloat(deltaTimeMin);
  const ec = parseFloat(extinctionCoeff);
  const l = parseFloat(pathLengthCm) || 1.0;
  const vrxn = parseFloat(rxnVolumeMl);
  const venz = parseFloat(enzymeVolumeMl);
  const dil = parseFloat(dilutionFactor) || 1.0;
  const prot = proteinConcMgMl ? parseFloat(proteinConcMgMl) : null;

  if (isNaN(da) || isNaN(dt) || dt <= 0 || ec <= 0 || l <= 0 || vrxn <= 0 || venz <= 0) {
    return { error: 'Please verify that time, extinction coefficient, and volumes are > 0.' };
  }

  const daPerMin = da / dt;
  // Convert M^-1 cm^-1 to µmol/mL/cm
  // 1 M = 1000 µmol/mL -> Rate (µmol/min/mL) = (daPerMin / (ec * l)) * 10^6 / 1000 = (daPerMin * 1000) / (ec * l)
  // Standard enzyme unit U = 1 µmol substrate transformed per minute
  const rateUPerMlInCuvette = (daPerMin * 1e6) / (ec * l * 1000);
  const activityUPerMl = rateUPerMlInCuvette * (vrxn / venz) * dil;

  let specificActivity = null;
  if (prot && prot > 0) {
    specificActivity = activityUPerMl / prot;
  }

  return {
    daPerMin: round2(daPerMin, 4),
    activityUPerMl: round2(activityUPerMl, 3),
    specificActivityUPerMg: specificActivity !== null ? round2(specificActivity, 2) : 'N/A',
    summary: `Enzyme Activity: ${round2(activityUPerMl, 3)} U/mL ${specificActivity ? `| Specific: ${round2(specificActivity, 2)} U/mg` : ''}`
  };
};

// =============================================================================
// CATEGORY 8: ANALYTICS & STATISTICS
// =============================================================================

/**
 * 8.1 Descriptive Statistics Calculator (Mean, Median, Mode, SD, SEM, Range)
 */
export const calculateStats = (numbersString, sdType = 'sample') => {
  if (!numbersString || typeof numbersString !== 'string') {
    return { error: 'Please enter numerical observations separated by commas, spaces, or lines.' };
  }

  const numbers = numbersString
    .replace(/\n/g, ',')
    .replace(/\s+/g, ',')
    .split(',')
    .map(x => parseFloat(x.trim()))
    .filter(x => !isNaN(x));

  if (numbers.length === 0) return { error: 'No valid numeric observations detected.' };

  const n = numbers.length;
  const sum = numbers.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Sorted copy for median and range
  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  // Median
  let median = 0;
  if (n % 2 === 1) {
    median = sorted[Math.floor(n / 2)];
  } else {
    median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  }

  // Mode
  const frequency = {};
  let maxFreq = 0;
  for (let num of numbers) {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) maxFreq = frequency[num];
  }

  let modes = [];
  if (maxFreq > 1) {
    for (let key in frequency) {
      if (frequency[key] === maxFreq) modes.push(Number(key));
    }
  }
  const modeStr = modes.length === 0 ? 'No mode' : modes.join(', ');

  // Standard Deviation
  if (n === 1) {
    return {
      n,
      mean: round2(mean, 4),
      median: round2(median, 4),
      mode: modeStr,
      stdDev: '0.0000',
      sem: '0.0000',
      min: round2(min, 4),
      max: round2(max, 4),
      range: '0.0000',
      summary: `n = 1 | Mean = ${round2(mean, 4)}`
    };
  }

  const ss = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const variance = sdType === 'sample' ? ss / (n - 1) : ss / n;
  const stdDev = Math.sqrt(variance);
  const sem = stdDev / Math.sqrt(n);

  return {
    n,
    mean: round2(mean, 4),
    median: round2(median, 4),
    mode: modeStr,
    stdDev: round2(stdDev, 4),
    variance: round2(variance, 4),
    sem: round2(sem, 4),
    min: round2(min, 4),
    max: round2(max, 4),
    range: round2(range, 4),
    sdType: sdType === 'sample' ? 'Sample SD (n-1)' : 'Population SD (N)',
    summary: `Mean = ${round2(mean, 4)} ± ${round2(sem, 4)} SEM (SD = ${round2(stdDev, 4)}, n = ${n})`
  };
};

/**
 * 8.2 CV% Calculator (Coefficient of Variation)
 * Formula: CV% = (SD / Mean) * 100
 */
export const calculateCvPercent = ({
  mode = 'meanSd', // 'meanSd' | 'rawData'
  mean = 100,
  stdDev = 5,
  rawData = ''
}) => {
  if (mode === 'rawData') {
    const stats = calculateStats(rawData);
    if (stats.error) return stats;
    const m = parseFloat(stats.mean);
    const sd = parseFloat(stats.stdDev);
    if (m === 0) return { error: 'Arithmetic mean is zero; CV% is mathematically undefined.' };
    const cv = (sd / Math.abs(m)) * 100;
    return {
      mean: stats.mean,
      stdDev: stats.stdDev,
      cvPercent: round2(cv, 2) + '%',
      n: stats.n,
      interpretation: cv < 5 ? 'Excellent precision (<5% CV)' : cv < 15 ? 'Good laboratory reproducibility (5-15% CV)' : 'High relative variability (>15% CV)',
      summary: `CV = ${round2(cv, 2)}% (Mean = ${stats.mean}, SD = ${stats.stdDev}, n = ${stats.n})`
    };
  } else {
    const m = parseFloat(mean);
    const sd = parseFloat(stdDev);
    if (isNaN(m) || isNaN(sd)) return { error: 'Please enter numeric values for Mean and SD.' };
    if (m === 0) return { error: 'Mean cannot be zero.' };
    if (sd < 0) return { error: 'Standard deviation cannot be negative.' };

    const cv = (sd / Math.abs(m)) * 100;
    return {
      mean: round2(m, 4),
      stdDev: round2(sd, 4),
      cvPercent: round2(cv, 2) + '%',
      interpretation: cv < 5 ? 'Excellent precision (<5% CV)' : cv < 15 ? 'Good reproducibility (5-15% CV)' : 'High relative variability (>15% CV)',
      summary: `CV = ${round2(cv, 2)}% for Mean ${round2(m, 2)} and SD ${round2(sd, 2)}.`
    };
  }
};

/**
 * 8.3 Radioactive Decay / Half-Life Calculator
 * N = N0 * (1/2)^(t / tHalf)
 * λ = ln(2) / tHalf
 */
export const calculateHalfLifeDecay = ({
  mode = 'remaining', // 'remaining' | 'halfLife' | 'elapsedTime' | 'decayConstant'
  initialAmount = 1000,
  halfLife = 5,
  elapsedTime = 15,
  remainingAmount = 125,
  unitTime = 'hours'
}) => {
  const n0 = parseFloat(initialAmount);
  const thalf = parseFloat(halfLife);
  const t = parseFloat(elapsedTime);
  const nRem = parseFloat(remainingAmount);

  if (mode === 'remaining') {
    if (isNaN(n0) || isNaN(thalf) || isNaN(t) || n0 <= 0 || thalf <= 0 || t < 0) {
      return { error: 'Initial amount, half-life, and elapsed time must be positive numbers.' };
    }
    const numHalfLives = t / thalf;
    const remaining = n0 * Math.pow(0.5, numHalfLives);
    const decayed = n0 - remaining;
    const pctRemaining = (remaining / n0) * 100;
    const pctDecayed = 100 - pctRemaining;
    const decayConstant = Math.LN2 / thalf;

    return {
      initialAmount: round2(n0),
      remaining: round2(remaining, 4),
      decayed: round2(decayed, 4),
      pctRemaining: round2(pctRemaining, 2) + '%',
      pctDecayed: round2(pctDecayed, 2) + '%',
      numHalfLives: round2(numHalfLives, 2),
      decayConstant: decayConstant.toExponential(3) + ` ${unitTime}⁻¹`,
      summary: `${round2(remaining, 4)} remaining (${round2(pctRemaining, 2)}%) after ${round2(t)} ${unitTime}.`
    };
  } else if (mode === 'halfLife') {
    if (isNaN(n0) || isNaN(nRem) || isNaN(t) || n0 <= 0 || nRem <= 0 || t <= 0) {
      return { error: 'Initial amount, remaining amount, and elapsed time must be > 0.' };
    }
    if (nRem > n0) return { error: 'Remaining amount cannot exceed initial amount for decay.' };
    // tHalf = t * ln(2) / ln(n0 / nRem)
    const th = (t * Math.LN2) / Math.log(n0 / nRem);
    return {
      halfLife: round2(th, 3) + ` ${unitTime}`,
      decayConstant: (Math.LN2 / th).toExponential(3) + ` ${unitTime}⁻¹`,
      summary: `Half-life: ${round2(th, 3)} ${unitTime}.`
    };
  } else if (mode === 'elapsedTime') {
    if (isNaN(n0) || isNaN(nRem) || isNaN(thalf) || n0 <= 0 || nRem <= 0 || thalf <= 0) {
      return { error: 'Initial amount, remaining amount, and half-life must be > 0.' };
    }
    if (nRem > n0) return { error: 'Remaining amount cannot exceed initial amount.' };
    const tElapsed = (thalf * Math.log(n0 / nRem)) / Math.LN2;
    return {
      elapsedTime: round2(tElapsed, 3) + ` ${unitTime}`,
      summary: `Elapsed time: ${round2(tElapsed, 3)} ${unitTime}.`
    };
  } else {
    // decayConstant
    if (isNaN(thalf) || thalf <= 0) return { error: 'Half-life must be > 0.' };
    const lambda = Math.LN2 / thalf;
    return {
      decayConstant: lambda.toExponential(4) + ` ${unitTime}⁻¹`,
      summary: `Decay constant λ = ${lambda.toExponential(4)} ${unitTime}⁻¹.`
    };
  }
};

// =============================================================================
// CATEGORY 9: SCIENTIFIC UNIT CONVERTER
// =============================================================================

/**
 * 9. Standalone Laboratory Unit Converter
 * Categories:
 * - Mass: g, mg, µg, ng
 * - Volume: L, mL, µL
 * - Concentration: M, mM, µM, nM
 * - DNA Length: bp, kb
 * - Amount of Substance: mol, mmol, µmol, nmol, pmol
 */
export const calculateUnitConversion = (value, category, fromUnit, toUnit, precision = 4) => {
  const val = parseFloat(value);
  if (isNaN(val)) return { error: 'Please enter a valid numeric value to convert.' };

  // Base factor maps
  const conversionMaps = {
    mass: {
      g: 1,
      mg: 1e-3,
      'µg': 1e-6,
      ng: 1e-9
    },
    volume: {
      L: 1,
      mL: 1e-3,
      'µL': 1e-6
    },
    concentration: {
      M: 1,
      mM: 1e-3,
      'µM': 1e-6,
      nM: 1e-9
    },
    dnaLength: {
      bp: 1,
      kb: 1000
    },
    amount: {
      mol: 1,
      mmol: 1e-3,
      'µmol': 1e-6,
      nmol: 1e-9,
      pmol: 1e-12
    }
  };

  const map = conversionMaps[category];
  if (!map) return { error: `Unsupported unit category: ${category}.` };

  const fromFactor = map[fromUnit];
  const toFactor = map[toUnit];

  if (fromFactor === undefined || toFactor === undefined) {
    return { error: `Incompatible units for ${category}: ${fromUnit} → ${toUnit}` };
  }

  // Step 1: Convert input value to base unit
  const baseValue = val * fromFactor;
  // Step 2: Convert base value to target unit
  const result = baseValue / toFactor;

  // Format with dynamic precision or scientific if very small
  let formattedResult = '';
  if (Math.abs(result) < 1e-4 && result !== 0) {
    formattedResult = result.toExponential(precision);
  } else {
    // Avoid trailing zeros if integer
    formattedResult = Number(result.toFixed(precision)).toString();
  }

  return {
    inputValue: val,
    fromUnit,
    toUnit,
    category,
    result: formattedResult,
    rawResult: result,
    summary: `${val} ${fromUnit} = ${formattedResult} ${toUnit}`
  };
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculatePcrMix,
  calculateQpcrMix,
  calculateLampMix,
  calculatePrimerReconstitution,
  calculateDilution,
  calculatePrimerTmTa,
  calculatePrimerGcContent,
  calculateDnaConcentration,
  calculateRnaConcentration,
  calculateDnaCopyNumber,
  calculateDnaNormalization,
  calculateRestrictionDigest,
  calculateDnaLigation,
  calculateAgaroseGel,
  calculateReverseComplement,
  calculateSerialDilution,
  calculateMolarityNormality,
  calculateUnitConversion,
  calculatePhAdjustment,
  calculateHalfLifeDecay,
  calculateStats,
  round2
} from '../utils/calculatorFormulas';
import {
  Calculator,
  Beaker,
  Dna,
  FlaskConical,
  TestTube,
  Layers,
  History,
  Clipboard,
  Check,
  Search,
  FolderPlus,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Scale
} from 'lucide-react';

export default function CalculatorsPage() {
  const { calcHistory, addCalcHistory, projects } = useApp();

  const [activeCategory, setActiveCategory] = useState('pcr'); // pcr | primers | quant | cloning | solutions | analytical
  const [selectedCalc, setSelectedCalc] = useState('pcr_mix');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [calcResult, setCalcResult] = useState(null);
  const [calcError, setCalcError] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // INPUT STATES FOR ALL 19 CALCULATORS
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. PCR Master Mix
  const [pcrRxns, setPcrRxns] = useState('10');
  const [pcrExtra, setPcrExtra] = useState('10');
  const [pcrVol, setPcrVol] = useState('50');

  // 2. qPCR Master Mix
  const [qpcrRxns, setQpcrRxns] = useState('24');
  const [qpcrExtra, setQpcrExtra] = useState('10');
  const [qpcrVol, setQpcrVol] = useState('20');
  const [qpcrMm, setQpcrMm] = useState('10');
  const [qpcrFwd, setQpcrFwd] = useState('0.4');
  const [qpcrRev, setQpcrRev] = useState('0.4');
  const [qpcrTemplate, setQpcrTemplate] = useState('2');

  // 3. LAMP Master Mix
  const [lampRxns, setLampRxns] = useState('24');
  const [lampExtra, setLampExtra] = useState('10');
  const [lampVol, setLampVol] = useState('25');
  const [lampMm, setLampMm] = useState('12.5');
  const [lampFipBip, setLampFipBip] = useState('2.5');
  const [lampF3B3, setLampF3B3] = useState('0.5');
  const [lampLoop, setLampLoop] = useState('1.0');
  const [lampTemplate, setLampTemplate] = useState('2.0');

  // 4. Primer Reconstitution
  const [reconNmol, setReconNmol] = useState('25');
  const [reconConc, setReconConc] = useState('100');

  // 5. Dilution (C1V1 = C2V2)
  const [dilC1, setDilC1] = useState('100');
  const [dilC2, setDilC2] = useState('10');
  const [dilV2, setDilV2] = useState('100');

  // 6. Primer Tm and Ta
  const [tmSeq, setTmSeq] = useState('ATGCGATCGATCGATCGATC');

  // 7. Primer GC Content
  const [gcSeq, setGcSeq] = useState('GCATCGATCGATCGATC');

  // 8. DNA Concentration
  const [dnaA260, setDnaA260] = useState('0.85');
  const [dnaDil, setDnaDil] = useState('1');
  const [dnaPath, setDnaPath] = useState('1');
  const [dnaA280, setDnaA280] = useState('0.47');

  // 9. RNA Concentration
  const [rnaA260, setRnaA260] = useState('0.62');
  const [rnaDil, setRnaDil] = useState('1');
  const [rnaPath, setRnaPath] = useState('1');
  const [rnaA280, setRnaA280] = useState('0.31');

  // 10. DNA Copy Number
  const [copyNg, setCopyNg] = useState('50');
  const [copyBp, setCopyBp] = useState('4000');

  // 11. DNA Normalization
  const [normC1, setNormC1] = useState('150');
  const [normC2, setNormC2] = useState('20');
  const [normV2, setNormV2] = useState('50');

  // 12. Restriction Digest
  const [digVol, setDigVol] = useState('50');
  const [digMass, setDigMass] = useState('1');
  const [digConc, setDigConc] = useState('100');
  const [digEnz1, setDigEnz1] = useState('1.0');
  const [digEnz2, setDigEnz2] = useState('0.0');

  // 13. DNA Ligation
  const [ligVecBp, setLigVecBp] = useState('4000');
  const [ligVecNg, setLigVecNg] = useState('50');
  const [ligInsBp, setLigInsBp] = useState('1000');
  const [ligRatio, setLigRatio] = useState('3');

  // 14. Agarose Gel Preparation
  const [gelPct, setGelPct] = useState('1.5');
  const [gelVol, setGelVol] = useState('100');

  // 15. Reverse Complement
  const [revSeq, setRevSeq] = useState('ATGCGATCGATCGATC');

  // 16. Serial Dilution
  const [serC0, setSerC0] = useState('100');
  const [serFactor, setSerFactor] = useState('2');
  const [serTubes, setSerTubes] = useState('5');
  const [serVol, setSerVol] = useState('1000');

  // 17. Molarity & Normality
  const [molMass, setMolMass] = useState('5.84');
  const [molMw, setMolMw] = useState('58.44');
  const [molVol, setMolVol] = useState('100');
  const [molNFactor, setMolNFactor] = useState('1');

  // 18. Unit Converter
  const [unitVal, setUnitVal] = useState('1000');
  const [unitCat, setUnitCat] = useState('mass');
  const [unitFrom, setUnitFrom] = useState('ng');
  const [unitTo, setUnitTo] = useState('µg');

  // 19. pH Adjustment
  const [phVol, setPhVol] = useState('1.0');
  const [phCur, setPhCur] = useState('7.4');
  const [phTar, setPhTar] = useState('6.8');
  const [phTitConc, setPhTitConc] = useState('1.0');

  // Additional physics & stats
  const [hlAmount, setHlAmount] = useState('100');
  const [hlPeriod, setHlPeriod] = useState('8');
  const [hlTime, setHlTime] = useState('24');
  const [statsData, setStatsData] = useState('12.4, 15.6, 14.2, 18.9, 13.5');

  // Categories list
  const categories = [
    { id: 'pcr', name: '🧬 PCR & Amplification', desc: 'PCR, qPCR & LAMP setups' },
    { id: 'primers', name: '🧬 Primers & Oligos', desc: 'Reconstitution, Tm, GC & RevComp' },
    { id: 'quant', name: '🧪 Quantitation', desc: 'DNA/RNA conc, Copies & Normalization' },
    { id: 'cloning', name: '🔬 Cloning & Gels', desc: 'Restriction digest, Ligation & Agarose' },
    { id: 'solutions', name: '🧫 Solutions & Dilutions', desc: 'C1V1, Serial dilution & Molarity' },
    { id: 'analytical', name: '⚛ pH & Analytics', desc: 'pH titrations, Half-life & Statistics' }
  ];

  // Calculators per category
  const calculatorsMap = {
    pcr: [
      { id: 'pcr_mix', name: 'PCR Master Mix Calculator', formula: 'Total = Rxns * (1 + Extra%)' },
      { id: 'qpcr_mix', name: 'qPCR Master Mix Calculator', formula: '2X Master Mix & Primer balance' },
      { id: 'lamp_mix', name: 'LAMP Master Mix Calculator', formula: 'Isothermal FIP/BIP/Loop recipe' }
    ],
    primers: [
      { id: 'primer_recon', name: 'Primer Reconstitution', formula: 'Vol = (nmol * 1000) / Conc(µM)' },
      { id: 'primer_dil', name: 'Primer Dilution (C1V1 = C2V2)', formula: 'V1 = (C2 * V2) / C1' },
      { id: 'primer_tm', name: 'Primer Tm & Ta Calculator', formula: 'Wallace Rule & Nearest Neighbor' },
      { id: 'primer_gc', name: 'Primer GC Content', formula: 'GC% = (G+C)/Total * 100' },
      { id: 'rev_comp', name: 'Reverse Complement', formula: '5\' to 3\' Complement & Reverse' }
    ],
    quant: [
      { id: 'dna_conc', name: 'DNA Concentration (A260)', formula: 'Conc = A260 * 50 * Dilution' },
      { id: 'rna_conc', name: 'RNA Concentration (A260)', formula: 'Conc = A260 * 40 * Dilution' },
      { id: 'dna_copies', name: 'DNA Copy Number Estimator', formula: 'Copies = (Mass * N_A)/(bp * 1e9 * 660)' },
      { id: 'dna_norm', name: 'DNA Normalization', formula: 'V_dna = (C2 * V2) / C1' }
    ],
    cloning: [
      { id: 'restriction_digest', name: 'Restriction Digest', formula: 'Water = Total - (DNA + Buf + Enz)' },
      { id: 'dna_ligation', name: 'DNA Ligation Calculator', formula: 'Insert = (Insert/Vector) * Mass * Ratio' },
      { id: 'agarose_gel', name: 'Agarose Gel Preparation', formula: 'Agarose(g) = Gel% * Vol(mL) / 100' }
    ],
    solutions: [
      { id: 'serial_dilution', name: 'Serial Dilution Calculator', formula: 'C_i = C_0 / Factor^i' },
      { id: 'molarity_norm', name: 'Molarity & Normality', formula: 'Mass = M * MW * Vol; N = M * n' },
      { id: 'unit_converter', name: 'Molecular Unit Converter', formula: 'Mass, Volume, Conc & bp to MW' }
    ],
    analytical: [
      { id: 'ph_calc', name: 'pH & pH Adjustment', formula: 'Titrant Vol = Δ[H+] * Vol / Molarity' },
      { id: 'half_life', name: 'Radioactive Decay (Half-Life)', formula: 'N(t) = N0 * (0.5)^(t / T_half)' },
      { id: 'sample_stats', name: 'Sample Statistics', formula: 'Mean, Std Dev, Variance' }
    ]
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const saveToLedger = (name, formula, inputStr, resultStr, inputJson, outputJson) => {
    addCalcHistory({
      type: name,
      calculator_name: name,
      formula: formula,
      input: inputStr,
      result: resultStr,
      input_json: inputJson,
      output_json: outputJson,
      project_id: selectedProjectId || null
    });
  };

  // Handler runners
  const runCalculator = (e) => {
    e.preventDefault();
    setCalcError(null);
    setCalcResult(null);

    let res = null;

    switch (selectedCalc) {
      case 'pcr_mix': {
        res = calculatePcrMix(pcrRxns, pcrExtra, pcrVol);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'PCR Master Mix Calculator',
          'Total = Rxns * (1 + Extra%)',
          `Rxns: ${pcrRxns}, Extra: ${pcrExtra}%, RxnVol: ${pcrVol}µL`,
          `Total Mix Vol: ${res.totalMixVolume} µL`,
          { reactions: pcrRxns, extra: pcrExtra, rxnVolume: pcrVol },
          res
        );
        break;
      }
      case 'qpcr_mix': {
        res = calculateQpcrMix(qpcrRxns, qpcrExtra, qpcrVol, qpcrMm, qpcrFwd, qpcrRev, qpcrTemplate);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'qPCR Master Mix Calculator',
          'Water = Vol - Sum(Reagents)',
          `Rxns: ${qpcrRxns}, Extra: ${qpcrExtra}%, TotalVol: ${qpcrVol}µL`,
          `Total Master Mix: ${res.totalVolume} µL`,
          { numRxns: qpcrRxns, extraPercent: qpcrExtra, rxnVol: qpcrVol },
          res
        );
        break;
      }
      case 'lamp_mix': {
        res = calculateLampMix(lampRxns, lampExtra, lampVol, lampMm, lampFipBip, lampF3B3, lampLoop, lampTemplate);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'LAMP Master Mix Calculator',
          'Isothermal Lamp Reagents Scaling',
          `Rxns: ${lampRxns}, Extra: ${lampExtra}%, RxnVol: ${lampVol}µL`,
          `Total LAMP Mix: ${res.totalVolume} µL`,
          { numRxns: lampRxns, extraPercent: lampExtra },
          res
        );
        break;
      }
      case 'primer_recon': {
        res = calculatePrimerReconstitution(reconNmol, reconConc);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Primer Reconstitution',
          'Vol (µL) = (nmol * 1000) / Conc(µM)',
          `Amount: ${reconNmol} nmol, Target Conc: ${reconConc} µM`,
          `Solvent Volume: ${res.volumeUl} µL`,
          { amountNmol: reconNmol, desiredConcUm: reconConc },
          res
        );
        break;
      }
      case 'primer_dil': {
        res = calculateDilution(dilC1, dilC2, dilV2);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Primer Dilution (C1V1 = C2V2)',
          'V1 = (C2 * V2) / C1',
          `Stock C1: ${dilC1}, Target C2: ${dilC2}, Target V2: ${dilV2}µL`,
          `Stock Vol V1: ${res.v1} µL, Diluent: ${res.diluent} µL`,
          { c1: dilC1, c2: dilC2, v2: dilV2 },
          res
        );
        break;
      }
      case 'primer_tm': {
        res = calculatePrimerTmTa(tmSeq);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Primer Tm & Ta Calculator',
          'Wallace Rule & Nearest-Neighbor',
          `Seq: ${tmSeq}`,
          `Tm: ${res.tm} °C, Ta: ${res.taMin} - ${res.taMax} °C`,
          { sequence: tmSeq },
          res
        );
        break;
      }
      case 'primer_gc': {
        res = calculatePrimerGcContent(gcSeq);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Primer GC Content',
          'GC% = (G+C)/Len * 100',
          `Seq: ${gcSeq}`,
          `GC: ${res.gcPercent}%, Len: ${res.length} bp`,
          { sequence: gcSeq },
          res
        );
        break;
      }
      case 'dna_conc': {
        res = calculateDnaConcentration(dnaA260, dnaDil, dnaPath, dnaA280);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'DNA Concentration (A260)',
          'Conc = A260 * 50 * Dilution',
          `A260: ${dnaA260}, Dilution: ${dnaDil}x, A280: ${dnaA280 || 'N/A'}`,
          `DNA Conc: ${res.concNgUl} ng/µL (260/280: ${res.ratio260280})`,
          { a260: dnaA260, dilutionFactor: dnaDil, a280: dnaA280 },
          res
        );
        break;
      }
      case 'rna_conc': {
        res = calculateRnaConcentration(rnaA260, rnaDil, rnaPath, rnaA280);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'RNA Concentration (A260)',
          'Conc = A260 * 40 * Dilution',
          `A260: ${rnaA260}, Dilution: ${rnaDil}x, A280: ${rnaA280 || 'N/A'}`,
          `RNA Conc: ${res.concNgUl} ng/µL (260/280: ${res.ratio260280})`,
          { a260: rnaA260, dilutionFactor: rnaDil, a280: rnaA280 },
          res
        );
        break;
      }
      case 'dna_copies': {
        res = calculateDnaCopyNumber(copyNg, copyBp);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'DNA Copy Number Estimator',
          'Copies = (Mass * N_A)/(bp * 1e9 * 660)',
          `Mass: ${copyNg} ng, Length: ${copyBp} bp`,
          `${res.copiesExp} copies (${res.copiesFormatted})`,
          { amountNg: copyNg, lengthBp: copyBp },
          res
        );
        break;
      }
      case 'dna_norm': {
        res = calculateDnaNormalization(normC1, normC2, normV2);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'DNA Normalization',
          'V_dna = (C2 * V2) / C1',
          `Stock C1: ${normC1} ng/µL, Target C2: ${normC2} ng/µL, Target V2: ${normV2} µL`,
          `DNA Vol: ${res.vDna} µL, Diluent: ${res.vDiluent} µL`,
          { c1: normC1, c2: normC2, v2: normV2 },
          res
        );
        break;
      }
      case 'restriction_digest': {
        res = calculateRestrictionDigest(digVol, digMass, digConc, digEnz1, digEnz2);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Restriction Digest',
          'Water = Total - (DNA + Buffer + Enzymes)',
          `Total Vol: ${digVol}µL, DNA Mass: ${digMass}µg, Conc: ${digConc}ng/µL`,
          `Water: ${res.waterVolume} µL`,
          { totalVolume: digVol, dnaMass: digMass, dnaConc: digConc },
          res
        );
        break;
      }
      case 'dna_ligation': {
        res = calculateDnaLigation(ligVecBp, ligVecNg, ligInsBp, ligRatio);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'DNA Ligation Calculator',
          'Insert = (Insert/Vector) * VectorMass * Ratio',
          `Vector: ${ligVecBp}bp (${ligVecNg}ng), Insert: ${ligInsBp}bp, Ratio: ${ligRatio}:1`,
          `Insert Mass Needed: ${res.insertMassNg} ng`,
          { vectorBp: ligVecBp, vectorNg: ligVecNg, insertBp: ligInsBp, ratio: ligRatio },
          res
        );
        break;
      }
      case 'agarose_gel': {
        res = calculateAgaroseGel(gelPct, gelVol);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Agarose Gel Preparation',
          'Agarose(g) = Gel% * Vol(mL) / 100',
          `Gel: ${gelPct}%, Volume: ${gelVol} mL`,
          `Agarose Powder: ${res.agaroseGrams} g`,
          { gelPercent: gelPct, finalVolume: gelVol },
          res
        );
        break;
      }
      case 'rev_comp': {
        res = calculateReverseComplement(revSeq);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Reverse Complement',
          'Complement & Reverse DNA/RNA',
          `Original: ${revSeq}`,
          `RevComp: ${res.reverseComplement}`,
          { sequence: revSeq },
          res
        );
        break;
      }
      case 'serial_dilution': {
        res = calculateSerialDilution(serC0, serFactor, serTubes, serVol);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Serial Dilution Calculator',
          'C_i = C_0 / Factor^i',
          `Initial C0: ${serC0}, Factor: ${serFactor}x, Tubes: ${serTubes}`,
          `Transfer Vol: ${res.transferVol} µL, Diluent: ${res.diluentVol} µL`,
          { c0: serC0, dilutionFactor: serFactor, numTubes: serTubes },
          res
        );
        break;
      }
      case 'molarity_norm': {
        res = calculateMolarityNormality(molMass, molMw, molVol, molNFactor);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Molarity & Normality',
          'M = Mass / (MW * V_L); N = M * n',
          `Mass: ${molMass}g, MW: ${molMw}g/mol, Vol: ${molVol}mL, n-factor: ${molNFactor}`,
          `Molarity: ${res.molarity} M | Normality: ${res.normality} N`,
          { mass: molMass, mw: molMw, volume: molVol, nFactor: molNFactor },
          res
        );
        break;
      }
      case 'unit_converter': {
        res = calculateUnitConversion(unitVal, unitCat, unitFrom, unitTo);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Molecular Unit Converter',
          `${unitFrom} -> ${unitTo}`,
          `Input: ${unitVal} ${unitFrom}`,
          `Output: ${res.result} ${unitTo}`,
          { value: unitVal, from: unitFrom, to: unitTo, category: unitCat },
          res
        );
        break;
      }
      case 'ph_calc': {
        res = calculatePhAdjustment(phVol, phCur, phTar, phTitConc);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'pH & pH Adjustment',
          'Δ[H+] Titration Formula',
          `Vol: ${phVol}L, Current pH: ${phCur}, Target pH: ${phTar}, Titrant M: ${phTitConc}M`,
          `Titrant Volume: ${res.titrantVolUl} µL (${res.titrantType})`,
          { volume: phVol, currentPh: phCur, targetPh: phTar },
          res
        );
        break;
      }
      case 'half_life': {
        res = calculateHalfLifeDecay(hlAmount, hlPeriod, hlTime);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Radioactive Decay',
          'N(t) = N0 * 0.5^(t / T_half)',
          `Initial: ${hlAmount}g, Half-Life: ${hlPeriod}h, Time: ${hlTime}h`,
          `Remaining: ${res.remaining} g (${res.percentage}%)`,
          { amount: hlAmount, halfLife: hlPeriod, time: hlTime },
          res
        );
        break;
      }
      case 'sample_stats': {
        res = calculateStats(statsData);
        if (res.error) return setCalcError(res.error);
        setCalcResult(res);
        saveToLedger(
          'Sample Statistics',
          'Mean & Standard Deviation',
          `Dataset: [${statsData}]`,
          `Mean: ${res.mean}, StdDev: ${res.stdDev}`,
          { dataset: statsData },
          res
        );
        break;
      }
      default:
        break;
    }
  };

  // Filtered calculators by search bar
  const allCalculatorsList = Object.keys(calculatorsMap).flatMap(cat =>
    calculatorsMap[cat].map(calc => ({ ...calc, category: cat }))
  );

  const filteredCalculators = searchQuery.trim()
    ? allCalculatorsList.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.formula.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : calculatorsMap[activeCategory] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: Calculators Area */}
      <div className="lg:col-span-8 space-y-6">

        {/* Top Bar: Search + Project Selector */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search among 19 molecular biology calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus-ring text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus-ring"
            >
              <option value="">-- Associate Run with Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.code}: {p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs (shown if search query is empty) */}
        {!searchQuery && (
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedCalc(calculatorsMap[cat.id][0].id);
                  setCalcResult(null);
                  setCalcError(null);
                }}
                className={`flex-1 min-w-[130px] text-left p-3 rounded-xl border transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-50 border-blue-300 shadow-xs scale-[1.01]'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <h3 className="font-extrabold text-slate-800 text-xs">{cat.name}</h3>
                <p className="text-[10px] text-slate-500 mt-1">{cat.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Sub-tabs / Calculator Selection Pills */}
        <div className="flex flex-wrap gap-2">
          {filteredCalculators.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCalc(c.id);
                setCalcResult(null);
                setCalcError(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCalc === c.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* CALCULATOR WORKSPACE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs min-h-[350px] space-y-6">

          {/* Validation Error Banner */}
          {calcError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span className="font-medium">{calcError}</span>
            </div>
          )}

          {/* 1. PCR Master Mix */}
          {selectedCalc === 'pcr_mix' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">PCR Master Mix Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculate total reagent breakdown with excess overage scaling.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Number of Samples</label>
                  <input type="number" min="1" value={pcrRxns} onChange={e => setPcrRxns(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Extra Overage (%)</label>
                  <input type="number" min="0" max="50" value={pcrExtra} onChange={e => setPcrExtra(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Reaction Volume (µL)</label>
                  <input type="number" min="1" value={pcrVol} onChange={e => setPcrVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate PCR Mix</button>
              </div>
            </form>
          )}

          {/* 2. qPCR Master Mix */}
          {selectedCalc === 'qpcr_mix' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">qPCR Master Mix Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Scale 2X SYBR/TaqMan master mix, primers, and cDNA template with water balance.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Number of Reactions</label>
                  <input type="number" min="1" value={qpcrRxns} onChange={e => setQpcrRxns(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Extra Mix (%)</label>
                  <input type="number" min="0" max="50" value={qpcrExtra} onChange={e => setQpcrExtra(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Total Vol (µL/rxn)</label>
                  <input type="number" value={qpcrVol} onChange={e => setQpcrVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">2X Master Mix (µL/rxn)</label>
                  <input type="number" step="any" value={qpcrMm} onChange={e => setQpcrMm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Forward Primer (µL/rxn)</label>
                  <input type="number" step="any" value={qpcrFwd} onChange={e => setQpcrFwd(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Reverse Primer (µL/rxn)</label>
                  <input type="number" step="any" value={qpcrRev} onChange={e => setQpcrRev(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">cDNA Template (µL/rxn)</label>
                  <input type="number" step="any" value={qpcrTemplate} onChange={e => setQpcrTemplate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Compile qPCR Mix</button>
              </div>
            </form>
          )}

          {/* 3. LAMP Master Mix */}
          {selectedCalc === 'lamp_mix' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">LAMP Master Mix Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Loop-mediated isothermal amplification recipe with FIP/BIP and Loop primer ratios.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Reactions Count</label>
                  <input type="number" min="1" value={lampRxns} onChange={e => setLampRxns(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Extra Mix (%)</label>
                  <input type="number" value={lampExtra} onChange={e => setLampExtra(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Reaction Vol (µL)</label>
                  <input type="number" value={lampVol} onChange={e => setLampVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">2X Isothermal Mix (µL)</label>
                  <input type="number" step="any" value={lampMm} onChange={e => setLampMm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">FIP / BIP Mix (µL)</label>
                  <input type="number" step="any" value={lampFipBip} onChange={e => setLampFipBip(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">F3 / B3 Mix (µL)</label>
                  <input type="number" step="any" value={lampF3B3} onChange={e => setLampF3B3(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Loop Primers (µL)</label>
                  <input type="number" step="any" value={lampLoop} onChange={e => setLampLoop(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Template DNA/RNA (µL)</label>
                  <input type="number" step="any" value={lampTemplate} onChange={e => setLampTemplate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Compile LAMP Mix</button>
              </div>
            </form>
          )}

          {/* 4. Primer Reconstitution */}
          {selectedCalc === 'primer_recon' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Primer Reconstitution Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculate TE/Water volume needed to resuspend lyophilized oligo powder to target stock concentration.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Lyophilized Primer Amount (nmol)</label>
                  <input type="number" step="any" value={reconNmol} onChange={e => setReconNmol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Desired Stock Concentration (µM)</label>
                  <input type="number" step="any" value={reconConc} onChange={e => setReconConc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Solvent Volume</button>
              </div>
            </form>
          )}

          {/* 5. Primer Dilution (C1V1 = C2V2) */}
          {selectedCalc === 'primer_dil' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Primer & Solution Dilution (C1V1 = C2V2)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Determine required stock volume (V1) and diluent volume for working solutions.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Stock Conc C1 (µM or mM)</label>
                  <input type="number" step="any" value={dilC1} onChange={e => setDilC1(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Target Conc C2 (µM or mM)</label>
                  <input type="number" step="any" value={dilC2} onChange={e => setDilC2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Target Volume V2 (µL)</label>
                  <input type="number" step="any" value={dilV2} onChange={e => setDilV2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Solve Dilution</button>
              </div>
            </form>
          )}

          {/* 6. Primer Tm & Ta */}
          {selectedCalc === 'primer_tm' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Primer Tm and Ta Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Estimate melting temperature (Tm) and annealing temperature (Ta) using Wallace rule and Nearest Neighbor thermodynamics.</p>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Primer Sequence (5' → 3')</label>
                <input type="text" value={tmSeq} onChange={e => setTmSeq(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono uppercase" placeholder="e.g. ATGCGATCGATCGATCGATC" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Tm & Ta</button>
              </div>
            </form>
          )}

          {/* 7. Primer GC Content */}
          {selectedCalc === 'primer_gc' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Primer GC Content Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Analyze GC percentage, base distribution, and molecular weight of oligonucleotides.</p>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Primer Sequence (DNA)</label>
                <input type="text" value={gcSeq} onChange={e => setGcSeq(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono uppercase" placeholder="e.g. GCATCGATCGATCGATC" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Analyze GC Content</button>
              </div>
            </form>
          )}

          {/* 8. DNA Concentration */}
          {selectedCalc === 'dna_conc' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">DNA Concentration Calculator (A260)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Spectrophotometry (NanoDrop / UV Absorbance) dsDNA concentration & A260/A280 purity ratio.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">A260 Absorbance</label>
                  <input type="number" step="any" value={dnaA260} onChange={e => setDnaA260(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Dilution Factor</label>
                  <input type="number" step="any" value={dnaDil} onChange={e => setDnaDil(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Path Length (cm)</label>
                  <input type="number" step="any" value={dnaPath} onChange={e => setDnaPath(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">A280 Absorbance (Optional)</label>
                  <input type="number" step="any" value={dnaA280} onChange={e => setDnaA280(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate DNA Conc</button>
              </div>
            </form>
          )}

          {/* 9. RNA Concentration */}
          {selectedCalc === 'rna_conc' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">RNA Concentration Calculator (A260)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Determine RNA concentration (1 A260 unit = 40 µg/mL) and A260/A280 purity ratio.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">A260 Absorbance</label>
                  <input type="number" step="any" value={rnaA260} onChange={e => setRnaA260(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Dilution Factor</label>
                  <input type="number" step="any" value={rnaDil} onChange={e => setRnaDil(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Path Length (cm)</label>
                  <input type="number" step="any" value={rnaPath} onChange={e => setRnaPath(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">A280 Absorbance (Optional)</label>
                  <input type="number" step="any" value={rnaA280} onChange={e => setRnaA280(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate RNA Conc</button>
              </div>
            </form>
          )}

          {/* 10. DNA Copy Number */}
          {selectedCalc === 'dna_copies' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">DNA Copy Number Estimator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Determine template copy count based on double-stranded DNA mass and base pair length.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">DNA Mass (ng)</label>
                  <input type="number" step="any" value={copyNg} onChange={e => setCopyNg(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Length of Template (bp)</label>
                  <input type="number" step="any" value={copyBp} onChange={e => setCopyBp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Copy Count</button>
              </div>
            </form>
          )}

          {/* 11. DNA Normalization */}
          {selectedCalc === 'dna_norm' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">DNA Normalization Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Normalize variable concentration stock samples to uniform concentration and volume for library prep / sequencing.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Stock Conc C1 (ng/µL)</label>
                  <input type="number" step="any" value={normC1} onChange={e => setNormC1(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Target Conc C2 (ng/µL)</label>
                  <input type="number" step="any" value={normC2} onChange={e => setNormC2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Target Volume V2 (µL)</label>
                  <input type="number" step="any" value={normV2} onChange={e => setNormV2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Solve Normalization</button>
              </div>
            </form>
          )}

          {/* 12. Restriction Digest */}
          {selectedCalc === 'restriction_digest' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Restriction Digestion Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculate DNA, buffer, enzyme(s), and nuclease-free water volumes for enzymatic cleavage.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Total Rxn Volume (µL)</label>
                  <input type="number" value={digVol} onChange={e => setDigVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">DNA Amount (µg)</label>
                  <input type="number" step="any" value={digMass} onChange={e => setDigMass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">DNA Conc (ng/µL)</label>
                  <input type="number" step="any" value={digConc} onChange={e => setDigConc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Enzyme 1 Vol (µL)</label>
                  <input type="number" step="any" value={digEnz1} onChange={e => setDigEnz1(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Enzyme 2 Vol (µL, optional)</label>
                  <input type="number" step="any" value={digEnz2} onChange={e => setDigEnz2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Digest Mix</button>
              </div>
            </form>
          )}

          {/* 13. DNA Ligation */}
          {selectedCalc === 'dna_ligation' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">DNA Ligation Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculate insert DNA mass (ng) required for target insert:vector molar ratios (e.g. 3:1, 5:1).</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Vector Size (bp)</label>
                  <input type="number" value={ligVecBp} onChange={e => setLigVecBp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Vector DNA Mass (ng)</label>
                  <input type="number" step="any" value={ligVecNg} onChange={e => setLigVecNg(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Insert Size (bp)</label>
                  <input type="number" value={ligInsBp} onChange={e => setLigInsBp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Insert:Vector Molar Ratio (e.g. 3 for 3:1)</label>
                  <input type="number" step="any" value={ligRatio} onChange={e => setLigRatio(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Ligation Ratio</button>
              </div>
            </form>
          )}

          {/* 14. Agarose Gel Preparation */}
          {selectedCalc === 'agarose_gel' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Agarose Gel Preparation Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Determine agarose powder mass (g) for target gel concentration percentage and buffer volume.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Gel Percentage (%)</label>
                  <input type="number" step="any" value={gelPct} onChange={e => setGelPct(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Final Gel Volume (mL)</label>
                  <input type="number" value={gelVol} onChange={e => setGelVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Agarose Powder</button>
              </div>
            </form>
          )}

          {/* 15. Reverse Complement */}
          {selectedCalc === 'rev_comp' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Reverse Complement Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Generate complement, reverse, and reverse complement of nucleotide sequence strings.</p>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Nucleotide Sequence (5' → 3')</label>
                <textarea rows="3" value={revSeq} onChange={e => setRevSeq(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono uppercase" placeholder="e.g. ATGCGATCGATCGATC"></textarea>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Generate Reverse Complement</button>
              </div>
            </form>
          )}

          {/* 16. Serial Dilution */}
          {selectedCalc === 'serial_dilution' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Serial Dilution Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculate step-by-step concentrations, transfer volumes, and diluent volumes across tube series.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Initial Conc C0</label>
                  <input type="number" step="any" value={serC0} onChange={e => setSerC0(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Dilution Factor (e.g. 2, 10)</label>
                  <input type="number" step="any" value={serFactor} onChange={e => setSerFactor(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Number of Tubes</label>
                  <input type="number" value={serTubes} onChange={e => setSerTubes(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Final Vol / Tube (µL)</label>
                  <input type="number" value={serVol} onChange={e => setSerVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Serial Series</button>
              </div>
            </form>
          )}

          {/* 17. Molarity & Normality */}
          {selectedCalc === 'molarity_norm' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Molarity & Normality Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Determine solution molarity (M) and normality (N) based on solute mass, MW, and volume.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Mass (g)</label>
                  <input type="number" step="any" value={molMass} onChange={e => setMolMass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Molecular Weight (g/mol)</label>
                  <input type="number" step="any" value={molMw} onChange={e => setMolMw(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Target Volume (mL)</label>
                  <input type="number" step="any" value={molVol} onChange={e => setMolVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">n-Factor (Equivalence)</label>
                  <input type="number" step="any" value={molNFactor} onChange={e => setMolNFactor(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Molarity & Normality</button>
              </div>
            </form>
          )}

          {/* 18. Unit Converter */}
          {selectedCalc === 'unit_converter' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Molecular Biology Unit Converter</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Convert between mass, volume, molar concentrations, and nucleotide length to molecular weight.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Category</label>
                  <select
                    value={unitCat}
                    onChange={e => {
                      const cat = e.target.value;
                      setUnitCat(cat);
                      if (cat === 'mass') { setUnitFrom('ng'); setUnitTo('µg'); }
                      else if (cat === 'volume') { setUnitFrom('µL'); setUnitTo('mL'); }
                      else if (cat === 'conc') { setUnitFrom('µM'); setUnitTo('mM'); }
                      else if (cat === 'lengthToMw') { setUnitFrom('bp'); setUnitTo('g/mol'); }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="mass">Mass (g, mg, µg, ng, pg)</option>
                    <option value="volume">Volume (L, mL, µL, nL)</option>
                    <option value="conc">Concentration (M, mM, µM, nM, pM)</option>
                    <option value="lengthToMw">Nucleotide bp/nt → MW (g/mol)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Value</label>
                  <input type="number" step="any" value={unitVal} onChange={e => setUnitVal(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">From Unit</label>
                  <input type="text" value={unitFrom} onChange={e => setUnitFrom(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">To Unit</label>
                  <input type="text" value={unitTo} onChange={e => setUnitTo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Convert Units</button>
              </div>
            </form>
          )}

          {/* 19. pH & pH Adjustment */}
          {selectedCalc === 'ph_calc' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">pH Adjustment Calculator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculate acid or base titrant volume required to adjust buffer solution pH.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Solution Vol (L)</label>
                  <input type="number" step="any" value={phVol} onChange={e => setPhVol(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Current pH</label>
                  <input type="number" step="any" min="0" max="14" value={phCur} onChange={e => setPhCur(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Target pH</label>
                  <input type="number" step="any" min="0" max="14" value={phTar} onChange={e => setPhTar(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Titrant Conc (M)</label>
                  <input type="number" step="any" value={phTitConc} onChange={e => setPhTitConc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Titrant Volume</button>
              </div>
            </form>
          )}

          {/* Half Life Decay */}
          {selectedCalc === 'half_life' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Radioactive Isotope Decay Solver</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculate remaining isotope activity and decay mass over elapsed time.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Initial Mass (g)</label>
                  <input type="number" step="any" value={hlAmount} onChange={e => setHlAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Half-Life (Hours)</label>
                  <input type="number" step="any" value={hlPeriod} onChange={e => setHlPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Elapsed Time (Hours)</label>
                  <input type="number" step="any" value={hlTime} onChange={e => setHlTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Decay State</button>
              </div>
            </form>
          )}

          {/* Sample Stats */}
          {selectedCalc === 'sample_stats' && (
            <form onSubmit={runCalculator} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Sample Statistics Solver</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Determine mean, sample variance, standard deviation, and min/max range.</p>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Dataset Values (separated by commas)</label>
                <input type="text" value={statsData} onChange={e => setStatsData(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono" placeholder="e.g. 12.4, 15.6, 14.2, 18.9, 13.5" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">Calculate Statistics</button>
              </div>
            </form>
          )}


          {/* RESULTS DISPLAY PANEL */}
          {calcResult && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-4 text-xs animate-fade-in-up">
              
              <div className="flex justify-between items-center border-b border-blue-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-extrabold text-blue-900 text-xs uppercase tracking-wider">Calculation Results</span>
                </div>
                {selectedProjectId && (
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
                    Linked to Project
                  </span>
                )}
              </div>

              {/* Text Summary if present */}
              {calcResult.summary && (
                <div className="p-3 bg-white border border-blue-150 rounded-xl text-slate-800 font-semibold shadow-xs flex justify-between items-center">
                  <span>{calcResult.summary}</span>
                  <button
                    onClick={() => handleCopy(calcResult.summary, 'res-summary')}
                    className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                  >
                    {copiedId === 'res-summary' ? <Check className="w-4 h-4 text-green-600" /> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Recipe / Reagents Table if present (PCR, qPCR, LAMP, Restriction Digest) */}
              {calcResult.components && (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Total Mix Volume: {calcResult.totalMixVolume || calcResult.totalVolume} µL</span>
                    {calcResult.totalReactions && <span>Total Reactions: {calcResult.totalReactions}x</span>}
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 font-bold text-[9px] uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <th className="p-3">Component / Reagent</th>
                        <th className="p-3">Per Reaction</th>
                        <th className="p-3 font-bold text-blue-700">Total Mix Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calcResult.components.map((c, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                          <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                          <td className="p-3 text-slate-500">{c.perRxn || c.volume} {c.unit || 'µL'}</td>
                          <td className="p-3 font-black text-blue-700">{c.total || c.volume} {c.unit || 'µL'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Serial Dilution Tube Table */}
              {calcResult.steps && (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
                    Serial Dilution Step Table (Transfer: {calcResult.transferVol} µL, Diluent: {calcResult.diluentVol} µL)
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 font-bold text-[9px] uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <th className="p-3">Tube #</th>
                        <th className="p-3">Concentration</th>
                        <th className="p-3">Transfer Vol</th>
                        <th className="p-3">Diluent Vol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calcResult.steps.map((s) => (
                        <tr key={s.tube} className="border-b border-slate-100 last:border-0">
                          <td className="p-3 font-bold text-slate-700">Tube {s.tube}</td>
                          <td className="p-3 font-black text-blue-700">{s.conc}</td>
                          <td className="p-3 text-slate-500">{s.transferVol} µL</td>
                          <td className="p-3 text-slate-500">{s.diluentVol} µL</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Key Values Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {calcResult.volumeUl && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Solvent Vol</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.volumeUl} µL</span>
                  </div>
                )}
                {calcResult.v1 && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Stock Vol (V1)</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.v1} µL</span>
                  </div>
                )}
                {calcResult.diluent && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Diluent Vol</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.diluent} µL</span>
                  </div>
                )}
                {calcResult.tm && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Melting Temp (Tm)</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.tm} °C</span>
                  </div>
                )}
                {calcResult.taMin && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Ta Range</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.taMin} - {calcResult.taMax} °C</span>
                  </div>
                )}
                {calcResult.gcPercent && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">GC Content</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.gcPercent}%</span>
                  </div>
                )}
                {calcResult.concNgUl && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Concentration</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.concNgUl} ng/µL</span>
                  </div>
                )}
                {calcResult.ratio260280 && calcResult.ratio260280 !== 'N/A' && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">A260/A280 Ratio</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.ratio260280}</span>
                  </div>
                )}
                {calcResult.insertMassNg && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Insert DNA Mass</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.insertMassNg} ng</span>
                  </div>
                )}
                {calcResult.agaroseGrams && (
                  <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-xs">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Agarose Powder</span>
                    <span className="font-black text-slate-800 mt-1 block">{calcResult.agaroseGrams} g</span>
                  </div>
                )}
                {calcResult.reverseComplement && (
                  <div className="col-span-2 sm:col-span-4 bg-white p-3 rounded-xl border border-blue-150 shadow-xs space-y-1">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Reverse Complement Sequence</span>
                    <span className="font-mono font-bold text-slate-800 text-xs break-all block">{calcResult.reverseComplement}</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* RIGHT: Calculation History Ledger */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-400" /> Calculation Ledger
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {calcHistory.length} Saved Runs
          </span>
        </div>

        <div className="space-y-3.5 max-h-[600px] overflow-y-auto no-scrollbar">
          {calcHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No calculations saved yet.<br />Run any calculator to log to ledger.
            </div>
          ) : (
            calcHistory.map((item) => (
              <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[10px] text-slate-600 shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                  <span className="font-extrabold text-slate-850 uppercase">{item.calculator_name || item.type}</span>
                  <span className="text-[9px] text-slate-400 font-bold">{item.date || item.timestamp}</span>
                </div>
                {item.project_name && (
                  <div className="inline-block bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-150">
                    Project: {item.project_name}
                  </div>
                )}
                {item.formula && (
                  <div className="font-mono bg-white p-1.5 rounded border border-slate-200 text-slate-500 overflow-x-auto text-[9px]">
                    Formula: {item.formula}
                  </div>
                )}
                <div className="text-[9px] text-slate-500">
                  Inputs: {item.input}
                </div>
                <div className="font-black text-blue-750 text-xs pt-1">
                  Result: {item.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

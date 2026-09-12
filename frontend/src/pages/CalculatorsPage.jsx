import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  // Category 1: Molecular Biology
  calculateDnaRnaConcentration,
  calculateNucleicAcidDilution,
  calculateMolarityGeneral,
  calculateDnaCopyNumber,
  calculateTransformationEfficiency,

  // Category 2: Primer & Sequence
  calculatePrimerTmTa,
  calculatePrimerReconstitution,
  calculatePrimerDilution,
  calculateReverseComplement,

  // Category 3: PCR, qPCR & LAMP
  calculatePcrMix,
  calculateQpcrMix,
  calculateLampMix,
  calculateTemplateDilution,
  calculatePrimerConcentration,

  // Category 4: Cell Biology
  calculateCellCounting,
  calculateCellViability,
  calculateSeedingDensity,
  calculateCellDilution,
  calculateMoi,

  // Category 5: Solutions & Buffers
  calculateMolarityNormality,
  calculateC1V1Dilution,
  calculateSerialDilution,
  calculatePercentageSolution,
  calculatePhAdjustment,

  // Category 6: Cloning & Genetic Engineering
  calculateRestrictionDigest,
  calculateDnaLigation,
  calculateInsertVectorRatio,
  calculateDnaMassMolar,
  calculateAgaroseGel,

  // Category 7: Protein & Biochemistry
  calculateProteinConcentration,
  calculateBcaAssay,
  calculateBradfordAssay,
  calculateProteinDilution,
  calculateEnzymeActivity,

  // Category 8: Analytics & Statistics
  calculateStats,
  calculateCvPercent,
  calculateHalfLifeDecay,

  // Category 9: Unit Converter
  calculateUnitConversion,
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
  Scale,
  ArrowRightLeft,
  Activity,
  FileText,
  Sliders,
  ChevronRight,
  TrendingUp,
  X,
  Copy,
  CheckCircle2,
  Atom,
  Scissors,
  Microscope,
  Binary,
  BookOpen
} from 'lucide-react';

export default function CalculatorsPage() {
  const { calcHistory, addCalcHistory, projects, notebookEntries } = useApp();

  // Navigation & Filtering
  const [activeCategory, setActiveCategory] = useState('molbio');
  const [selectedCalc, setSelectedCalc] = useState('dna_rna_conc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('calculator'); // 'calculator' | 'ledger'

  // Results & Errors
  const [calcResult, setCalcResult] = useState(null);
  const [calcError, setCalcError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Save to Ledger Modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveCalcName, setSaveCalcName] = useState('');
  const [saveCalcNotes, setSaveCalcNotes] = useState('');
  const [saveProjectId, setSaveProjectId] = useState('');
  const [saveEntryId, setSaveEntryId] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. MOLECULAR BIOLOGY STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [dnaA260, setDnaA260] = useState('0.85');
  const [dnaDil, setDnaDil] = useState('1');
  const [dnaPath, setDnaPath] = useState('1.0');
  const [dnaNucleicType, setDnaNucleicType] = useState('dsDNA');
  const [dnaA280, setDnaA280] = useState('0.47');
  const [dnaA230, setDnaA230] = useState('0.39');

  const [naDilC1, setNaDilC1] = useState('150');
  const [naDilC2, setNaDilC2] = useState('20');
  const [naDilV2, setNaDilV2] = useState('50');
  const [naDilConcUnit, setNaDilConcUnit] = useState('ng/µL');
  const [naDilVolUnit, setNaDilVolUnit] = useState('µL');

  const [molTarget, setMolTarget] = useState('mass');
  const [molMass, setMolMass] = useState('5.84');
  const [molMassUnit, setMolMassUnit] = useState('g');
  const [molMw, setMolMw] = useState('58.44');
  const [molVol, setMolVol] = useState('100');
  const [molVolUnit, setMolVolUnit] = useState('mL');
  const [molMolarity, setMolMolarity] = useState('1.0');
  const [molMolUnit, setMolMolUnit] = useState('M');

  const [copyMassNg, setCopyMassNg] = useState('50');
  const [copyLengthBp, setCopyLengthBp] = useState('4000');
  const [copyType, setCopyType] = useState('dsDNA');

  const [tfCfu, setTfCfu] = useState('180');
  const [tfDnaMassNg, setTfDnaMassNg] = useState('0.5');
  const [tfRecVol, setTfRecVol] = useState('1000');
  const [tfPlateVol, setTfPlateVol] = useState('100');
  const [tfDil, setTfDil] = useState('1');

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PRIMER & SEQUENCE STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [seqTmInput, setSeqTmInput] = useState('ATGCGATCGATCGATCGATC');
  const [reconNmol, setReconNmol] = useState('25');
  const [reconConc, setReconConc] = useState('100');
  const [reconAmountUnit, setReconAmountUnit] = useState('nmol');
  const [reconConcUnit, setReconConcUnit] = useState('µM');

  const [pDilC1, setPDilC1] = useState('100');
  const [pDilC2, setPDilC2] = useState('10');
  const [pDilV2, setPDilV2] = useState('500');

  const [revSeqInput, setRevSeqInput] = useState('ATGCCGTA');

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PCR, QPCR & LAMP STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [pcrRxns, setPcrRxns] = useState('10');
  const [pcrExtra, setPcrExtra] = useState('10');
  const [pcrVol, setPcrVol] = useState('50');

  const [qpcrRxns, setQpcrRxns] = useState('24');
  const [qpcrExtra, setQpcrExtra] = useState('10');
  const [qpcrVol, setQpcrVol] = useState('20');
  const [qpcrMm, setQpcrMm] = useState('10');
  const [qpcrFwd, setQpcrFwd] = useState('0.4');
  const [qpcrRev, setQpcrRev] = useState('0.4');
  const [qpcrTemplate, setQpcrTemplate] = useState('2');
  const [qpcrProbe, setQpcrProbe] = useState('0.2');

  const [lampRxns, setLampRxns] = useState('12');
  const [lampExtra, setLampExtra] = useState('10');
  const [lampVol, setLampVol] = useState('25');
  const [lampMm, setLampMm] = useState('12.5');
  const [lampFipBip, setLampFipBip] = useState('2.5');
  const [lampF3B3, setLampF3B3] = useState('0.5');
  const [lampLoop, setLampLoop] = useState('1.0');
  const [lampTemplate, setLampTemplate] = useState('2.0');

  const [tempDilC1, setTempDilC1] = useState('100');
  const [tempDilC2, setTempDilC2] = useState('10');
  const [tempDilV2, setTempDilV2] = useState('100');

  const [pConcMode, setPConcMode] = useState('calculateConc');
  const [pConcNmol, setPConcNmol] = useState('25');
  const [pConcVolUl, setPConcVolUl] = useState('250');
  const [pConcTargetUm, setPConcTargetUm] = useState('100');

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. CELL BIOLOGY STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [ccCount, setCcCount] = useState('85');
  const [ccSquares, setCcSquares] = useState('4');
  const [ccDilution, setCcDilution] = useState('2');
  const [ccChamber, setCcChamber] = useState('10000');
  const [ccSuspVol, setCcSuspVol] = useState('5.0');

  const [cvViable, setCvViable] = useState('85');
  const [cvDead, setCvDead] = useState('15');

  const [sdVessel, setSdVessel] = useState('6-well');
  const [sdCustomArea, setSdCustomArea] = useState('9.6');
  const [sdTargetDensity, setSdTargetDensity] = useState('100000');
  const [sdDensityUnit, setSdDensityUnit] = useState('cells/cm²');
  const [sdNumWells, setSdNumWells] = useState('6');

  const [cdStartConc, setCdStartConc] = useState('2000000');
  const [cdDesiredConc, setCdDesiredConc] = useState('500000');
  const [cdFinalVol, setCdFinalVol] = useState('10');

  const [moiCells, setMoiCells] = useState('1000000');
  const [moiDesired, setMoiDesired] = useState('5');
  const [moiTiter, setMoiTiter] = useState('100000000');
  const [moiTiterUnit, setMoiTiterUnit] = useState('TU/mL');

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. SOLUTIONS & BUFFERS STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [solMassG, setSolMassG] = useState('5.844');
  const [solMw, setSolMw] = useState('58.44');
  const [solVolMl, setSolVolMl] = useState('100');
  const [solNFactor, setSolNFactor] = useState('1');

  const [c1v1C1, setC1v1C1] = useState('100');
  const [c1v1C2, setC1v1C2] = useState('10');
  const [c1v1V2, setC1v1V2] = useState('50');

  const [serC0, setSerC0] = useState('1000');
  const [serFactor, setSerFactor] = useState('10');
  const [serTubes, setSerTubes] = useState('4');
  const [serVol, setSerVol] = useState('1.0');

  const [pctType, setPctType] = useState('wv');
  const [pctVal, setPctVal] = useState('5');
  const [pctAmt, setPctAmt] = useState('500');

  const [phVol, setPhVol] = useState('1.0');
  const [phCur, setPhCur] = useState('7.4');
  const [phTar, setPhTar] = useState('6.8');
  const [phTitConc, setPhTitConc] = useState('1.0');

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. CLONING & GENETIC ENGINEERING STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [digRxnVol, setDigRxnVol] = useState('50');
  const [digMassUg, setDigMassUg] = useState('1');
  const [digConcNg, setDigConcNg] = useState('200');
  const [digEnz1, setDigEnz1] = useState('1.0');
  const [digEnz2, setDigEnz2] = useState('0.0');
  const [digBufX, setDigBufX] = useState('10');
  const [digRxns, setDigRxns] = useState('1');
  const [digExtra, setDigExtra] = useState('10');

  const [ligVecBp, setLigVecBp] = useState('5000');
  const [ligVecNg, setLigVecNg] = useState('50');
  const [ligInsBp, setLigInsBp] = useState('1000');
  const [ligRatio, setLigRatio] = useState('3');
  const [ligVecConc, setLigVecConc] = useState('25');
  const [ligInsConc, setLigInsConc] = useState('10');
  const [ligRxnVol, setLigRxnVol] = useState('20');

  const [ratioVecMass, setRatioVecMass] = useState('50');
  const [ratioVecBp, setRatioVecBp] = useState('5000');
  const [ratioInsBp, setRatioInsBp] = useState('1000');
  const [ratioMolar, setRatioMolar] = useState('3');
  const [ratioInsConc, setRatioInsConc] = useState('10');

  const [dmmDir, setDmmDir] = useState('massToMoles');
  const [dmmLengthBp, setDmmLengthBp] = useState('5000');
  const [dmmMassNg, setDmmMassNg] = useState('100');
  const [dmmPmol, setDmmPmol] = useState('30.3');

  const [gelPct, setGelPct] = useState('1.0');
  const [gelVol, setGelVol] = useState('100');
  const [gelBufType, setGelBufType] = useState('1X TAE');
  const [gelBufStock, setGelBufStock] = useState('50X');

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. PROTEIN & BIOCHEMISTRY STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [protMode, setProtMode] = useState('absorbance');
  const [protA280, setProtA280] = useState('1.25');
  const [protEc, setProtEc] = useState('1.0');
  const [protPath, setProtPath] = useState('1.0');
  const [protDil, setProtDil] = useState('1.0');
  const [protMass, setProtMass] = useState('5.0');
  const [protVol, setProtVol] = useState('2.5');

  const [bcaUnkAbs, setBcaUnkAbs] = useState('0.54');
  const [bcaDil, setBcaDil] = useState('1.0');
  const [bcaBlank, setBcaBlank] = useState('0.05');

  const [bradUnkAbs, setBradUnkAbs] = useState('0.48');
  const [bradDil, setBradDil] = useState('2.0');
  const [bradBlank, setBradBlank] = useState('0.08');

  const [protDilC1, setProtDilC1] = useState('10');
  const [protDilC2, setProtDilC2] = useState('2');
  const [protDilV2, setProtDilV2] = useState('1000');

  const [enzDa, setEnzDa] = useState('0.25');
  const [enzDt, setEnzDt] = useState('2.0');
  const [enzEc, setEnzEc] = useState('6220');
  const [enzPath, setEnzPath] = useState('1.0');
  const [enzVrxn, setEnzVrxn] = useState('1.0');
  const [enzVenz, setEnzVenz] = useState('0.1');
  const [enzDil, setEnzDil] = useState('1.0');
  const [enzProtConc, setEnzProtConc] = useState('0.5');

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. ANALYTICS & STATISTICS STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [statsInput, setStatsInput] = useState('10, 12, 15, 11, 14, 13');
  const [statsSdType, setStatsSdType] = useState('sample');

  const [cvMode, setCvMode] = useState('meanSd');
  const [cvMean, setCvMean] = useState('100');
  const [cvSd, setCvSd] = useState('5');
  const [cvRawData, setCvRawData] = useState('98, 102, 100, 101, 99');

  const [hlMode, setHlMode] = useState('remaining');
  const [hlInitial, setHlInitial] = useState('1000');
  const [hlHalfLife, setHlHalfLife] = useState('5');
  const [hlElapsed, setHlElapsed] = useState('15');
  const [hlRem, setHlRem] = useState('125');
  const [hlUnitTime, setHlUnitTime] = useState('hours');

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. STANDALONE UNIT CONVERTER STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [ucCategory, setUcCategory] = useState('mass');
  const [ucValue, setUcValue] = useState('5');
  const [ucFrom, setUcFrom] = useState('mg');
  const [ucTo, setUcTo] = useState('µg');
  const [ucPrecision, setUcPrecision] = useState(4);

  // Unit Converter options mapping
  const ucUnitsMap = {
    mass: [
      { id: 'g', label: 'g – Gram' },
      { id: 'mg', label: 'mg – Milligram' },
      { id: 'µg', label: 'µg – Microgram' },
      { id: 'ng', label: 'ng – Nanogram' }
    ],
    volume: [
      { id: 'L', label: 'L – Liter' },
      { id: 'mL', label: 'mL – Milliliter' },
      { id: 'µL', label: 'µL – Microliter' }
    ],
    concentration: [
      { id: 'M', label: 'M – Molar' },
      { id: 'mM', label: 'mM – Millimolar' },
      { id: 'µM', label: 'µM – Micromolar' },
      { id: 'nM', label: 'nM – Nanomolar' }
    ],
    dnaLength: [
      { id: 'bp', label: 'bp – Base Pair' },
      { id: 'kb', label: 'kb – Kilobase (1,000 bp)' }
    ],
    amount: [
      { id: 'mol', label: 'mol – Mole' },
      { id: 'mmol', label: 'mmol – Millimole' },
      { id: 'µmol', label: 'µmol – Micromole' },
      { id: 'nmol', label: 'nmol – Nanomole' },
      { id: 'pmol', label: 'pmol – Picomole' }
    ]
  };

  // Switch category defaults
  const handleUcCategoryChange = (cat) => {
    setUcCategory(cat);
    const units = ucUnitsMap[cat];
    if (units && units.length >= 2) {
      setUcFrom(units[1].id);
      setUcTo(units[2] ? units[2].id : units[0].id);
    }
  };

  const handleSwapUnits = () => {
    const temp = ucFrom;
    setUcFrom(ucTo);
    setUcTo(temp);
  };

  // Live Unit Conversion Calculation
  const unitConversionResult = useMemo(() => {
    return calculateUnitConversion(ucValue, ucCategory, ucFrom, ucTo, ucPrecision);
  }, [ucValue, ucCategory, ucFrom, ucTo, ucPrecision]);

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORIES DEFINITION (ALL 9 CATEGORIES)
  // ─────────────────────────────────────────────────────────────────────────────
  const categories = [
    { id: 'molbio', name: 'Molecular Biology', icon: Dna, count: 5 },
    { id: 'primers', name: 'Primer & Sequence', icon: Binary, count: 4 },
    { id: 'pcr', name: 'PCR, qPCR & LAMP', icon: TestTube, count: 5 },
    { id: 'cellbio', name: 'Cell Biology', icon: Microscope, count: 5 },
    { id: 'solutions', name: 'Solutions & Buffers', icon: FlaskConical, count: 5 },
    { id: 'cloning', name: 'Cloning & Genetic Eng', icon: Scissors, count: 5 },
    { id: 'protein', name: 'Protein & Biochemistry', icon: Beaker, count: 5 },
    { id: 'analytics', name: 'Analytics & Statistics', icon: Activity, count: 3 },
    { id: 'converter', name: 'Unit Converter', icon: Scale, count: 5 }
  ];

  // Map of all calculators per category
  const calculatorsMap = {
    molbio: [
      { id: 'dna_rna_conc', name: 'DNA/RNA Concentration Calculator', desc: 'Nucleic acid conc from absorbance with A260/A280 & A260/A230 purity' },
      { id: 'dna_rna_dilution', name: 'DNA/RNA Dilution Calculator', desc: 'Calculate stock and diluent volumes for desired concentrations (C1V1 = C2V2)' },
      { id: 'molarity_calc', name: 'Molarity Calculator', desc: 'Calculate molarity, mass, molecular weight and volume with unit flexibility' },
      { id: 'copy_number', name: 'DNA/RNA Copy Number Calculator', desc: 'Calculate copy number from mass/concentration and base pair length' },
      { id: 'trans_efficiency', name: 'Transformation Efficiency Calculator', desc: 'Calculate competent cell efficiency in CFU/µg DNA' }
    ],
    primers: [
      { id: 'primer_tm_ta', name: 'Primer Length, Tm, Ta & GC Content', desc: 'Calculate length, Tm (Wallace rule), Ta and GC% from DNA sequence' },
      { id: 'primer_recon', name: 'Primer Reconstitution Calculator', desc: 'Calculate volume of water/buffer required to reconstitute dried primers' },
      { id: 'primer_dilution', name: 'Primer Dilution Calculator', desc: 'Calculate working primer preparation from concentrated stock' },
      { id: 'rev_comp', name: 'Reverse Complement Tool', desc: 'Generate 5\' to 3\' reverse-complementary DNA sequence' }
    ],
    pcr: [
      { id: 'pcr_mix', name: 'PCR Master Mix Calculator', desc: 'Calculate reagent volumes for single and multi-reaction PCR mixes' },
      { id: 'qpcr_mix', name: 'qPCR Mix Calculator', desc: 'Calculate qPCR reaction components, primers, and fluorescent probes' },
      { id: 'lamp_mix', name: 'LAMP Reaction Calculator', desc: 'Calculate isothermal LAMP reaction master mixes with FIP, BIP, and loop primers' },
      { id: 'template_dilution', name: 'Template Dilution Calculator', desc: 'Dilute stock DNA/RNA template down to required working concentrations' },
      { id: 'primer_conc', name: 'Primer Concentration Calculator', desc: 'Calculate primer concentration from nmol amount and solution volume' }
    ],
    cellbio: [
      { id: 'cell_counting', name: 'Cell Counting & Concentration', desc: 'Hemocytometer calculation of cells/mL and total cells in suspension' },
      { id: 'cell_viability', name: 'Cell Viability Calculator', desc: 'Calculate viable and dead cell percentages using Trypan Blue staining' },
      { id: 'seeding_density', name: 'Seeding Density Calculator', desc: 'Determine cell count required for plates (6-96 well) and T-flasks' },
      { id: 'cell_dilution', name: 'Cell Dilution Calculator', desc: 'Calculate cell suspension volume and medium required for target concentration' },
      { id: 'moi_calc', name: 'MOI (Multiplicity of Infection) Calculator', desc: 'Calculate viral amount required for desired target cell exposure' }
    ],
    solutions: [
      { id: 'molarity_normality', name: 'Molarity & Normality Calculator', desc: 'Solution preparation based on MW, concentration, volume and valency n-factor' },
      { id: 'c1v1_dilution', name: 'C1V1 Dilution Calculator', desc: 'Stock-to-working solution calculation for liquid reagents' },
      { id: 'serial_dilution', name: 'Serial Dilution Calculator', desc: 'Calculate concentrations and transfer volumes across sequential dilution steps' },
      { id: 'percent_solution', name: 'Percentage Solution Calculator', desc: 'Prepare % w/v, % w/w, and % v/v laboratory solutions' },
      { id: 'ph_adjustment', name: 'pH & Buffer Adjustment Calculator', desc: 'Estimate acid/base titration volumes to adjust solution pH' }
    ],
    cloning: [
      { id: 'restriction_digest', name: 'Restriction Digestion Calculator', desc: 'Calculate DNA, buffer, and enzyme volumes for single/double digestions' },
      { id: 'dna_ligation', name: 'DNA Ligation Calculator', desc: 'Calculate vector and insert amounts for ligation based on molar ratio' },
      { id: 'insert_vector_ratio', name: 'Insert : Vector Ratio Calculator', desc: 'Calculate required insert amount for a chosen molar ratio' },
      { id: 'dna_mass_molar', name: 'DNA Mass ↔ Molar Amount Calculator', desc: 'Convert DNA mass (ng) to moles (pmol) and vice versa using bp length' },
      { id: 'agarose_gel', name: 'Agarose Gel Preparation Calculator', desc: 'Calculate agarose powder and buffer volume for gel electrophoresis' }
    ],
    protein: [
      { id: 'protein_conc', name: 'Protein Concentration Calculator', desc: 'Calculate protein concentration via mass/volume or Beer-Lambert A280' },
      { id: 'bca_assay', name: 'BCA Assay Standard Curve Calculator', desc: 'Linear regression standard curve to quantify unknown protein concentrations' },
      { id: 'bradford_assay', name: 'Bradford Assay Calculator', desc: 'Protein quantification from Coomassie G-250 absorbance standard curves' },
      { id: 'protein_dilution', name: 'Protein Dilution Calculator', desc: 'Prepare target protein working concentrations from concentrated stocks' },
      { id: 'enzyme_activity', name: 'Enzyme Activity Calculator', desc: 'Calculate enzyme activity (U/mL) and specific activity (U/mg) from ΔA/min' }
    ],
    analytics: [
      { id: 'descriptive_stats', name: 'Mean / Median / Mode / SD / SEM', desc: 'Basic descriptive statistics and standard error of experimental datasets' },
      { id: 'cv_percent', name: 'CV% (Coefficient of Variation) Calculator', desc: 'Measure relative experimental variability and reproducibility' },
      { id: 'half_life', name: 'Radioactive Decay / Half-Life Calculator', desc: 'Calculate remaining quantity, half-life, or elapsed time' }
    ],
    converter: [
      { id: 'unit_converter', name: 'Scientific Laboratory Unit Converter', desc: 'Convert Mass, Volume, Concentration, DNA Length, and Amount of Substance' }
    ]
  };

  // Flattened list of all calculators for global search
  const allCalculators = useMemo(() => {
    const list = [];
    Object.keys(calculatorsMap).forEach(catId => {
      calculatorsMap[catId].forEach(calc => {
        list.push({ ...calc, categoryId: catId });
      });
    });
    return list;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allCalculators.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }, [searchQuery, allCalculators]);

  // Handle calculator selection
  const handleSelectCalculator = (calcId, catId) => {
    setSelectedCalc(calcId);
    if (catId) setActiveCategory(catId);
    setCalcResult(null);
    setCalcError(null);
  };

  // Copy handler
  const handleCopy = (text, id = 'res') => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Save to Ledger Modal
  const openSaveModal = (calcName) => {
    setSaveCalcName(calcName);
    setSaveCalcNotes('');
    setSavedSuccess(false);
    setSaveModalOpen(true);
  };

  // Confirm Save to Ledger
  const handleConfirmSave = (e) => {
    e.preventDefault();
    if (!calcResult) return;

    addCalcHistory({
      type: activeCategory,
      calculator_name: saveCalcName || selectedCalc,
      formula: calcResult.formula || calcResult.summary || 'Laboratory computation',
      input: JSON.stringify(calcResult),
      result: calcResult.summary || JSON.stringify(calcResult),
      input_json: {
        selectedCalc,
        notes: saveCalcNotes || '',
        entry_id: saveEntryId ? String(saveEntryId) : null,
        timestamp: new Date().toISOString()
      },
      output_json: calcResult,
      project_id: saveProjectId ? String(saveProjectId) : null
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSaveModalOpen(false);
    }, 1500);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RUN CALCULATOR ENGINE
  // ─────────────────────────────────────────────────────────────────────────────
  const runCalculation = (e) => {
    e?.preventDefault();
    setCalcError(null);
    setCalcResult(null);

    let res = null;

    switch (selectedCalc) {
      // 1. Molecular Biology
      case 'dna_rna_conc':
        res = calculateDnaRnaConcentration(dnaA260, dnaDil, dnaPath, dnaNucleicType, dnaA280, dnaA230);
        break;
      case 'dna_rna_dilution':
        res = calculateNucleicAcidDilution(naDilC1, naDilC2, naDilV2, naDilConcUnit, naDilVolUnit);
        break;
      case 'molarity_calc':
        res = calculateMolarityGeneral({
          target: molTarget,
          mass: molMass,
          massUnit: molMassUnit,
          mw: molMw,
          volume: molVol,
          volUnit: molVolUnit,
          molarity: molMolarity,
          molUnit: molMolUnit
        });
        break;
      case 'copy_number':
        res = calculateDnaCopyNumber(copyMassNg, copyLengthBp, copyType);
        break;
      case 'trans_efficiency':
        res = calculateTransformationEfficiency(tfCfu, tfDnaMassNg, tfRecVol, tfPlateVol, tfDil);
        break;

      // 2. Primer & Sequence
      case 'primer_tm_ta':
        res = calculatePrimerTmTa(seqTmInput);
        break;
      case 'primer_recon':
        res = calculatePrimerReconstitution(reconNmol, reconConc, reconAmountUnit, reconConcUnit);
        break;
      case 'primer_dilution':
        res = calculatePrimerDilution(pDilC1, pDilC2, pDilV2);
        break;
      case 'rev_comp':
        res = calculateReverseComplement(revSeqInput);
        break;

      // 3. PCR, qPCR & LAMP
      case 'pcr_mix':
        res = calculatePcrMix(pcrRxns, pcrExtra, pcrVol);
        break;
      case 'qpcr_mix':
        res = calculateQpcrMix(qpcrRxns, qpcrExtra, qpcrVol, qpcrMm, qpcrFwd, qpcrRev, qpcrTemplate, qpcrProbe);
        break;
      case 'lamp_mix':
        res = calculateLampMix(lampRxns, lampExtra, lampVol, lampMm, lampFipBip, lampF3B3, lampLoop, lampTemplate);
        break;
      case 'template_dilution':
        res = calculateTemplateDilution(tempDilC1, tempDilC2, tempDilV2);
        break;
      case 'primer_conc':
        res = calculatePrimerConcentration({
          mode: pConcMode,
          amountNmol: pConcNmol,
          volumeUl: pConcVolUl,
          targetConcUm: pConcTargetUm
        });
        break;

      // 4. Cell Biology
      case 'cell_counting':
        res = calculateCellCounting(ccCount, ccSquares, ccDilution, ccChamber, ccSuspVol);
        break;
      case 'cell_viability':
        res = calculateCellViability(cvViable, cvDead);
        break;
      case 'seeding_density':
        res = calculateSeedingDensity(sdVessel, sdCustomArea, sdTargetDensity, sdDensityUnit, sdNumWells);
        break;
      case 'cell_dilution':
        res = calculateCellDilution(cdStartConc, cdDesiredConc, cdFinalVol);
        break;
      case 'moi_calc':
        res = calculateMoi(moiCells, moiDesired, moiTiter, moiTiterUnit);
        break;

      // 5. Solutions & Buffers
      case 'molarity_normality':
        res = calculateMolarityNormality(solMassG, solMw, solVolMl, solNFactor);
        break;
      case 'c1v1_dilution':
        res = calculateC1V1Dilution(c1v1C1, c1v1C2, c1v1V2);
        break;
      case 'serial_dilution':
        res = calculateSerialDilution(serC0, serFactor, serTubes, serVol);
        break;
      case 'percent_solution':
        res = calculatePercentageSolution(pctType, pctVal, pctAmt);
        break;
      case 'ph_adjustment':
        res = calculatePhAdjustment(phVol, phCur, phTar, phTitConc);
        break;

      // 6. Cloning & Genetic Engineering
      case 'restriction_digest':
        res = calculateRestrictionDigest(digRxnVol, digMassUg, digConcNg, digEnz1, digEnz2, digBufX, digExtra, digRxns);
        break;
      case 'dna_ligation':
        res = calculateDnaLigation(ligVecBp, ligVecNg, ligInsBp, ligRatio, ligVecConc, ligInsConc, ligRxnVol);
        break;
      case 'insert_vector_ratio':
        res = calculateInsertVectorRatio(ratioVecMass, ratioVecBp, ratioInsBp, ratioMolar, ratioInsConc);
        break;
      case 'dna_mass_molar':
        res = calculateDnaMassMolar({
          direction: dmmDir,
          lengthBp: dmmLengthBp,
          massNg: dmmMassNg,
          molesPmol: dmmPmol
        });
        break;
      case 'agarose_gel':
        res = calculateAgaroseGel(gelPct, gelVol, gelBufType, gelBufStock);
        break;

      // 7. Protein & Biochemistry
      case 'protein_conc':
        res = calculateProteinConcentration({
          mode: protMode,
          a280: protA280,
          extinctionCoeff: protEc,
          pathLengthCm: protPath,
          dilutionFactor: protDil,
          massMg: protMass,
          volumeMl: protVol
        });
        break;
      case 'bca_assay':
        res = calculateBcaAssay(undefined, bcaUnkAbs, bcaDil, bcaBlank);
        break;
      case 'bradford_assay':
        res = calculateBradfordAssay(undefined, bradUnkAbs, bradDil, bradBlank);
        break;
      case 'protein_dilution':
        res = calculateProteinDilution(protDilC1, protDilC2, protDilV2);
        break;
      case 'enzyme_activity':
        res = calculateEnzymeActivity(enzDa, enzDt, enzEc, enzPath, enzVrxn, enzVenz, enzDil, enzProtConc);
        break;

      // 8. Analytics & Statistics
      case 'descriptive_stats':
        res = calculateStats(statsInput, statsSdType);
        break;
      case 'cv_percent':
        res = calculateCvPercent({
          mode: cvMode,
          mean: cvMean,
          stdDev: cvSd,
          rawData: cvRawData
        });
        break;
      case 'half_life':
        res = calculateHalfLifeDecay({
          mode: hlMode,
          initialAmount: hlInitial,
          halfLife: hlHalfLife,
          elapsedTime: hlElapsed,
          remainingAmount: hlRem,
          unitTime: hlUnitTime
        });
        break;

      // 9. Unit Converter
      case 'unit_converter':
        res = unitConversionResult;
        break;

      default:
        res = { error: 'Unknown calculator selection.' };
    }

    if (res?.error) {
      setCalcError(res.error);
    } else {
      setCalcResult(res);
    }
  };

  // Currently active calculator definition
  const currentCalcDef = allCalculators.find(c => c.id === selectedCalc) || allCalculators[0];

  return (
    <div className="space-y-6 pb-16">
      {/* ─────────────────────────────────────────────────────────────────────────────
          TOP BANNER HERO
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-teal-400" />
              PRECISION BIOMOLECULAR & ANALYTICAL ENGINES
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Scientific Calculators & Laboratory Tools
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Standardized, verifiable computational modules for molecular biology, cell culture, buffer stoichiometry, cloning, enzymology, and statistics.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setActiveView(activeView === 'calculator' ? 'ledger' : 'calculator')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                activeView === 'ledger'
                  ? 'bg-teal-500 text-slate-950 shadow-teal-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Calculation Ledger ({calcHistory?.length || 0})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          GLOBAL SEARCH BAR (SEARCH ALL CALCULATORS)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs p-1">
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search across all 40+ calculators (e.g. 'molarity', 'restriction digest', 'trypan blue', 'copy number', 'BCA')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-2.5 pl-11 pr-10 text-xs font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {searchQuery.trim() && (
          <div className="absolute z-30 left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-100">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No scientific calculators matched "{searchQuery}".
              </div>
            ) : (
              searchResults.map(calc => (
                <button
                  key={calc.id}
                  onClick={() => {
                    handleSelectCalculator(calc.id, calc.categoryId);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-3.5 hover:bg-teal-50/60 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{calc.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{calc.desc}</div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {categories.find(c => c.id === calc.categoryId)?.name}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW: CALCULATION LEDGER (HISTORY)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeView === 'ledger' ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-teal-600" />
                InveniqLab Calculation Ledger & Audit Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographically tracked computational history linked to research projects and electronic notebook entries.
              </p>
            </div>
            <button
              onClick={() => setActiveView('calculator')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
            >
              <span>Back to Calculators</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {(calcHistory || []).length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Calculator className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No calculations recorded in ledger yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Run any scientific calculation and click <span className="font-bold text-teal-600">Save Calculation</span> to associate it with a project or experiment.
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {calcHistory.map((item, idx) => (
                <div key={item.id || idx} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{item.calculator_name || item.type}</span>
                      {item.project_id && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold">
                          Project #{item.project_id}
                        </span>
                      )}
                      {item.input_json?.entry_id && (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700 text-[10px] font-bold">
                          Experiment #{item.input_json.entry_id}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-mono text-[11px]">{item.result || item.formula}</p>
                    {(item.notes || item.input_json?.notes) && (
                      <p className="text-slate-400 text-[11px] italic">Note: "{item.notes || item.input_json?.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : 'Saved entry'}
                    </span>
                    <button
                      onClick={() => handleCopy(item.result || item.formula, `ledger-${idx}`)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-teal-600 cursor-pointer"
                      title="Copy result"
                    >
                      {copiedId === `ledger-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────────────────────
            VIEW: CALCULATOR ENGINE
        ───────────────────────────────────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const firstCalc = calculatorsMap[cat.id]?.[0];
                    if (firstCalc) setSelectedCalc(firstCalc.id);
                    setCalcResult(null);
                    setCalcError(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/90'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-navigation: Calculators under active category */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {(calculatorsMap[activeCategory] || []).map(calc => {
              const isSelected = selectedCalc === calc.id;
              return (
                <button
                  key={calc.id}
                  onClick={() => handleSelectCalculator(calc.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-400 text-teal-950 shadow-xs ring-1 ring-teal-400/30'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-extrabold text-xs leading-snug line-clamp-2">{calc.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">{calc.desc}</span>
                </button>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────────────────────
              ACTIVE CALCULATOR CANVAS
          ───────────────────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Input Form Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
              {/* Header */}
              <div className="border-b border-slate-150 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase font-bold text-teal-600 mb-1">
                  <span>{categories.find(c => c.id === activeCategory)?.name}</span>
                  <span>•</span>
                  <span>Precision Tool</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {currentCalcDef.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {currentCalcDef.desc}
                </p>
              </div>

              {/* Form Body for Selected Calculator */}
              <form onSubmit={runCalculation} className="space-y-4.5 text-xs">
                {/* 1.1 DNA/RNA Concentration */}
                {selectedCalc === 'dna_rna_conc' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">A260 Absorbance *</label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={dnaA260}
                          onChange={(e) => setDnaA260(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Nucleic Acid Type</label>
                        <select
                          value={dnaNucleicType}
                          onChange={(e) => setDnaNucleicType(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        >
                          <option value="dsDNA">dsDNA (50 µg/mL per A260)</option>
                          <option value="RNA">RNA (40 µg/mL per A260)</option>
                          <option value="ssDNA">ssDNA (33 µg/mL per A260)</option>
                          <option value="oligo">ssOligo (30 µg/mL per A260)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Dilution Factor</label>
                        <input
                          type="number"
                          step="any"
                          value={dnaDil}
                          onChange={(e) => setDnaDil(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Path Length (cm)</label>
                        <input
                          type="number"
                          step="any"
                          value={dnaPath}
                          onChange={(e) => setDnaPath(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">A280 (Optional for Protein Purity)</label>
                        <input
                          type="number"
                          step="any"
                          value={dnaA280}
                          onChange={(e) => setDnaA280(e.target.value)}
                          placeholder="e.g. 0.47"
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">A230 (Optional for Salt Purity)</label>
                        <input
                          type="number"
                          step="any"
                          value={dnaA230}
                          onChange={(e) => setDnaA230(e.target.value)}
                          placeholder="e.g. 0.39"
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.2 DNA/RNA Dilution */}
                {selectedCalc === 'dna_rna_dilution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Stock Conc (C1)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={naDilC1}
                        onChange={(e) => setNaDilC1(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Conc (C2)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={naDilC2}
                        onChange={(e) => setNaDilC2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Volume (V2)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={naDilV2}
                        onChange={(e) => setNaDilV2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 1.3 Molarity Calculator */}
                {selectedCalc === 'molarity_calc' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-slate-100 pb-3">
                      {['mass', 'molarity', 'volume'].map(target => (
                        <button
                          key={target}
                          type="button"
                          onClick={() => setMolTarget(target)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer transition-colors ${
                            molTarget === target ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Calculate {target}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Molecular Weight (g/mol) *</label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={molMw}
                          onChange={(e) => setMolMw(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>

                      {molTarget !== 'mass' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Mass of Solute</label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="number"
                              step="any"
                              value={molMass}
                              onChange={(e) => setMolMass(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                            />
                            <select
                              value={molMassUnit}
                              onChange={(e) => setMolMassUnit(e.target.value)}
                              className="bg-slate-100 border border-slate-200 rounded-xl px-2 text-xs font-bold"
                            >
                              <option value="g">g</option>
                              <option value="mg">mg</option>
                              <option value="µg">µg</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {molTarget !== 'volume' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Solution Volume</label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="number"
                              step="any"
                              value={molVol}
                              onChange={(e) => setMolVol(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                            />
                            <select
                              value={molVolUnit}
                              onChange={(e) => setMolVolUnit(e.target.value)}
                              className="bg-slate-100 border border-slate-200 rounded-xl px-2 text-xs font-bold"
                            >
                              <option value="L">L</option>
                              <option value="mL">mL</option>
                              <option value="µL">µL</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {molTarget !== 'molarity' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Molarity</label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="number"
                              step="any"
                              value={molMolarity}
                              onChange={(e) => setMolMolarity(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                            />
                            <select
                              value={molMolUnit}
                              onChange={(e) => setMolMolUnit(e.target.value)}
                              className="bg-slate-100 border border-slate-200 rounded-xl px-2 text-xs font-bold"
                            >
                              <option value="M">M</option>
                              <option value="mM">mM</option>
                              <option value="µM">µM</option>
                              <option value="nM">nM</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 1.4 DNA/RNA Copy Number */}
                {selectedCalc === 'copy_number' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Nucleic Acid Mass (ng) *</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={copyMassNg}
                        onChange={(e) => setCopyMassNg(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Length (bp / nt) *</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={copyLengthBp}
                        onChange={(e) => setCopyLengthBp(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Molecule Type</label>
                      <select
                        value={copyType}
                        onChange={(e) => setCopyType(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      >
                        <option value="dsDNA">Plasmid / dsDNA (660 g/mol/bp)</option>
                        <option value="ssDNA">ssDNA (330 g/mol/nt)</option>
                        <option value="RNA">ssRNA (340 g/mol/nt)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 1.5 Transformation Efficiency */}
                {selectedCalc === 'trans_efficiency' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Colonies Counted (CFU) *</label>
                      <input
                        type="number"
                        required
                        value={tfCfu}
                        onChange={(e) => setTfCfu(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">DNA Mass Used (ng) *</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={tfDnaMassNg}
                        onChange={(e) => setTfDnaMassNg(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Total Recovery Vol (µL)</label>
                      <input
                        type="number"
                        value={tfRecVol}
                        onChange={(e) => setTfRecVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Volume Plated (µL)</label>
                      <input
                        type="number"
                        value={tfPlateVol}
                        onChange={(e) => setTfPlateVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 2.1 Primer Tm & Ta */}
                {selectedCalc === 'primer_tm_ta' && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Oligo Sequence (5' to 3') *</label>
                    <textarea
                      rows={3}
                      required
                      value={seqTmInput}
                      onChange={(e) => setSeqTmInput(e.target.value)}
                      placeholder="e.g. ATGCGATCGATCGATCGATC"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold focus-ring uppercase"
                    />
                    <span className="text-[10px] text-slate-400">Accepts standard A, T, G, C nucleotides (case insensitive).</span>
                  </div>
                )}

                {/* 2.2 Primer Reconstitution */}
                {selectedCalc === 'primer_recon' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Primer Amount (nmol) *</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={reconNmol}
                        onChange={(e) => setReconNmol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Concentration (µM) *</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={reconConc}
                        onChange={(e) => setReconConc(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 2.3 Primer Dilution */}
                {selectedCalc === 'primer_dilution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Stock Conc (C1, µM)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={pDilC1}
                        onChange={(e) => setPDilC1(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Working Conc (C2, µM)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={pDilC2}
                        onChange={(e) => setPDilC2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Vol (V2, µL)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={pDilV2}
                        onChange={(e) => setPDilV2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 2.4 Reverse Complement */}
                {selectedCalc === 'rev_comp' && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Input Sequence *</label>
                    <textarea
                      rows={3}
                      required
                      value={revSeqInput}
                      onChange={(e) => setRevSeqInput(e.target.value)}
                      placeholder="e.g. ATGCCGTA"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold focus-ring uppercase"
                    />
                  </div>
                )}

                {/* 3.1 PCR Master Mix */}
                {selectedCalc === 'pcr_mix' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Reactions Count</label>
                      <input
                        type="number"
                        required
                        value={pcrRxns}
                        onChange={(e) => setPcrRxns(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Reaction Vol (µL)</label>
                      <input
                        type="number"
                        value={pcrVol}
                        onChange={(e) => setPcrVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Pipetting Excess (%)</label>
                      <input
                        type="number"
                        value={pcrExtra}
                        onChange={(e) => setPcrExtra(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 3.2 qPCR Mix */}
                {selectedCalc === 'qpcr_mix' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Reactions Count</label>
                      <input
                        type="number"
                        value={qpcrRxns}
                        onChange={(e) => setQpcrRxns(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Reaction Vol (µL)</label>
                      <input
                        type="number"
                        value={qpcrVol}
                        onChange={(e) => setQpcrVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Excess (%)</label>
                      <input
                        type="number"
                        value={qpcrExtra}
                        onChange={(e) => setQpcrExtra(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 3.3 LAMP Mix */}
                {selectedCalc === 'lamp_mix' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Reactions Count</label>
                      <input
                        type="number"
                        value={lampRxns}
                        onChange={(e) => setLampRxns(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Reaction Vol (µL)</label>
                      <input
                        type="number"
                        value={lampVol}
                        onChange={(e) => setLampVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Excess (%)</label>
                      <input
                        type="number"
                        value={lampExtra}
                        onChange={(e) => setLampExtra(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 3.4 Template Dilution */}
                {selectedCalc === 'template_dilution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Stock Conc (C1)</label>
                      <input
                        type="number"
                        value={tempDilC1}
                        onChange={(e) => setTempDilC1(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Conc (C2)</label>
                      <input
                        type="number"
                        value={tempDilC2}
                        onChange={(e) => setTempDilC2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Vol (V2, µL)</label>
                      <input
                        type="number"
                        value={tempDilV2}
                        onChange={(e) => setTempDilV2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 3.5 Primer Concentration */}
                {selectedCalc === 'primer_conc' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        onClick={() => setPConcMode('calculateConc')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          pConcMode === 'calculateConc' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Calculate Concentration (µM)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPConcMode('calculateAmount')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          pConcMode === 'calculateAmount' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Calculate Required Amount (nmol)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pConcMode === 'calculateConc' ? (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Primer Amount (nmol) *</label>
                            <input
                              type="number"
                              step="any"
                              value={pConcNmol}
                              onChange={(e) => setPConcNmol(e.target.value)}
                              className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Solution Volume (µL) *</label>
                            <input
                              type="number"
                              step="any"
                              value={pConcVolUl}
                              onChange={(e) => setPConcVolUl(e.target.value)}
                              className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Conc (µM) *</label>
                            <input
                              type="number"
                              step="any"
                              value={pConcTargetUm}
                              onChange={(e) => setPConcTargetUm(e.target.value)}
                              className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Volume (µL) *</label>
                            <input
                              type="number"
                              step="any"
                              value={pConcVolUl}
                              onChange={(e) => setPConcVolUl(e.target.value)}
                              className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 4.1 Cell Counting */}
                {selectedCalc === 'cell_counting' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Total Cells Counted *</label>
                      <input
                        type="number"
                        required
                        value={ccCount}
                        onChange={(e) => setCcCount(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Squares Counted</label>
                      <input
                        type="number"
                        value={ccSquares}
                        onChange={(e) => setCcSquares(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Dilution Factor</label>
                      <input
                        type="number"
                        value={ccDilution}
                        onChange={(e) => setCcDilution(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Chamber Factor</label>
                      <input
                        type="number"
                        value={ccChamber}
                        onChange={(e) => setCcChamber(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Total Suspension Volume (mL, Optional)</label>
                      <input
                        type="number"
                        step="any"
                        value={ccSuspVol}
                        onChange={(e) => setCcSuspVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 4.2 Cell Viability */}
                {selectedCalc === 'cell_viability' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Viable Cells Count *</label>
                      <input
                        type="number"
                        required
                        value={cvViable}
                        onChange={(e) => setCvViable(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Dead Cells Count *</label>
                      <input
                        type="number"
                        required
                        value={cvDead}
                        onChange={(e) => setCvDead(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 4.3 Seeding Density */}
                {selectedCalc === 'seeding_density' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Culture Vessel</label>
                        <select
                          value={sdVessel}
                          onChange={(e) => setSdVessel(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        >
                          <option value="6-well">6-well plate (9.6 cm²)</option>
                          <option value="12-well">12-well plate (3.8 cm²)</option>
                          <option value="24-well">24-well plate (1.9 cm²)</option>
                          <option value="48-well">48-well plate (0.95 cm²)</option>
                          <option value="96-well">96-well plate (0.32 cm²)</option>
                          <option value="T25">T25 Flask (25 cm²)</option>
                          <option value="T75">T75 Flask (75 cm²)</option>
                          <option value="T175">T175 Flask (175 cm²)</option>
                          <option value="custom">Custom Surface Area</option>
                        </select>
                      </div>

                      {sdVessel === 'custom' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Custom Area (cm²)</label>
                          <input
                            type="number"
                            step="any"
                            value={sdCustomArea}
                            onChange={(e) => setSdCustomArea(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Density</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="number"
                            value={sdTargetDensity}
                            onChange={(e) => setSdTargetDensity(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                          <select
                            value={sdDensityUnit}
                            onChange={(e) => setSdDensityUnit(e.target.value)}
                            className="bg-slate-100 border border-slate-200 rounded-xl px-2 text-xs font-bold"
                          >
                            <option value="cells/cm²">cells/cm²</option>
                            <option value="cells/well">cells/well</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Number of Wells / Vessels</label>
                        <input
                          type="number"
                          value={sdNumWells}
                          onChange={(e) => setSdNumWells(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4.4 Cell Dilution */}
                {selectedCalc === 'cell_dilution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Current Conc (cells/mL)</label>
                      <input
                        type="number"
                        value={cdStartConc}
                        onChange={(e) => setCdStartConc(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Conc (cells/mL)</label>
                      <input
                        type="number"
                        value={cdDesiredConc}
                        onChange={(e) => setCdDesiredConc(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Volume (mL)</label>
                      <input
                        type="number"
                        value={cdFinalVol}
                        onChange={(e) => setCdFinalVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 4.5 MOI Calculator */}
                {selectedCalc === 'moi_calc' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Cells Count *</label>
                      <input
                        type="number"
                        value={moiCells}
                        onChange={(e) => setMoiCells(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired MOI *</label>
                      <input
                        type="number"
                        step="any"
                        value={moiDesired}
                        onChange={(e) => setMoiDesired(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Viral Titer *</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="number"
                          step="any"
                          value={moiTiter}
                          onChange={(e) => setMoiTiter(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                        <select
                          value={moiTiterUnit}
                          onChange={(e) => setMoiTiterUnit(e.target.value)}
                          className="bg-slate-100 border border-slate-200 rounded-xl px-2 text-xs font-bold"
                        >
                          <option value="TU/mL">TU/mL</option>
                          <option value="PFU/mL">PFU/mL</option>
                          <option value="IU/mL">IU/mL</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5.1 Molarity & Normality */}
                {selectedCalc === 'molarity_normality' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Solute Mass (g) *</label>
                      <input
                        type="number"
                        step="any"
                        value={solMassG}
                        onChange={(e) => setSolMassG(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Molecular Weight (g/mol) *</label>
                      <input
                        type="number"
                        step="any"
                        value={solMw}
                        onChange={(e) => setSolMw(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Solution Volume (mL) *</label>
                      <input
                        type="number"
                        step="any"
                        value={solVolMl}
                        onChange={(e) => setSolVolMl(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Valency / n-factor (for Normality)</label>
                      <input
                        type="number"
                        step="any"
                        value={solNFactor}
                        onChange={(e) => setSolNFactor(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 5.2 C1V1 Dilution */}
                {selectedCalc === 'c1v1_dilution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Stock Conc (C1)</label>
                      <input
                        type="number"
                        value={c1v1C1}
                        onChange={(e) => setC1v1C1(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Conc (C2)</label>
                      <input
                        type="number"
                        value={c1v1C2}
                        onChange={(e) => setC1v1C2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Volume (V2)</label>
                      <input
                        type="number"
                        value={c1v1V2}
                        onChange={(e) => setC1v1V2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 5.3 Serial Dilution */}
                {selectedCalc === 'serial_dilution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Initial Conc (C0) *</label>
                      <input
                        type="number"
                        value={serC0}
                        onChange={(e) => setSerC0(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Dilution Factor (e.g. 2 for 1:2, 10 for 1:10)</label>
                      <input
                        type="number"
                        value={serFactor}
                        onChange={(e) => setSerFactor(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Number of Tubes</label>
                      <input
                        type="number"
                        value={serTubes}
                        onChange={(e) => setSerTubes(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Volume per Tube (mL)</label>
                      <input
                        type="number"
                        step="any"
                        value={serVol}
                        onChange={(e) => setSerVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 5.4 Percentage Solution */}
                {selectedCalc === 'percent_solution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Solution Type</label>
                      <select
                        value={pctType}
                        onChange={(e) => setPctType(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      >
                        <option value="wv">% w/v (g in 100 mL)</option>
                        <option value="ww">% w/w (g in 100 g)</option>
                        <option value="vv">% v/v (mL in 100 mL)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Percentage (%)</label>
                      <input
                        type="number"
                        step="any"
                        value={pctVal}
                        onChange={(e) => setPctVal(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Quantity ({pctType === 'ww' ? 'g' : 'mL'})</label>
                      <input
                        type="number"
                        step="any"
                        value={pctAmt}
                        onChange={(e) => setPctAmt(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 5.5 pH Adjustment */}
                {selectedCalc === 'ph_adjustment' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Solution Volume (L)</label>
                      <input
                        type="number"
                        step="any"
                        value={phVol}
                        onChange={(e) => setPhVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Titrant Conc (M, e.g. 1M HCl/NaOH)</label>
                      <input
                        type="number"
                        step="any"
                        value={phTitConc}
                        onChange={(e) => setPhTitConc(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Current pH</label>
                      <input
                        type="number"
                        step="any"
                        value={phCur}
                        onChange={(e) => setPhCur(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Target pH</label>
                      <input
                        type="number"
                        step="any"
                        value={phTar}
                        onChange={(e) => setPhTar(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 6.1 Restriction Digest */}
                {selectedCalc === 'restriction_digest' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Total Rxn Vol (µL)</label>
                      <input
                        type="number"
                        value={digRxnVol}
                        onChange={(e) => setDigRxnVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">DNA Amount (µg)</label>
                      <input
                        type="number"
                        step="any"
                        value={digMassUg}
                        onChange={(e) => setDigMassUg(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">DNA Conc (ng/µL)</label>
                      <input
                        type="number"
                        step="any"
                        value={digConcNg}
                        onChange={(e) => setDigConcNg(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Enzyme 1 Vol (µL)</label>
                      <input
                        type="number"
                        step="any"
                        value={digEnz1}
                        onChange={(e) => setDigEnz1(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 6.2 DNA Ligation */}
                {selectedCalc === 'dna_ligation' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Vector Length (bp) *</label>
                      <input
                        type="number"
                        value={ligVecBp}
                        onChange={(e) => setLigVecBp(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Vector Mass (ng) *</label>
                      <input
                        type="number"
                        value={ligVecNg}
                        onChange={(e) => setLigVecNg(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Insert Length (bp) *</label>
                      <input
                        type="number"
                        value={ligInsBp}
                        onChange={(e) => setLigInsBp(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Insert : Vector Molar Ratio</label>
                      <select
                        value={ligRatio}
                        onChange={(e) => setLigRatio(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      >
                        <option value="1">1:1 Molar Ratio</option>
                        <option value="2">2:1 Molar Ratio</option>
                        <option value="3">3:1 Molar Ratio (Standard)</option>
                        <option value="5">5:1 Molar Ratio</option>
                        <option value="7">7:1 Molar Ratio</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 6.3 Insert: Vector Ratio */}
                {selectedCalc === 'insert_vector_ratio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Vector Mass (ng)</label>
                      <input
                        type="number"
                        value={ratioVecMass}
                        onChange={(e) => setRatioVecMass(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Vector Size (bp)</label>
                      <input
                        type="number"
                        value={ratioVecBp}
                        onChange={(e) => setRatioVecBp(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Insert Size (bp)</label>
                      <input
                        type="number"
                        value={ratioInsBp}
                        onChange={(e) => setRatioInsBp(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Ratio</label>
                      <input
                        type="number"
                        step="any"
                        value={ratioMolar}
                        onChange={(e) => setRatioMolar(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 6.4 DNA Mass ↔ Molar Amount */}
                {selectedCalc === 'dna_mass_molar' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        onClick={() => setDmmDir('massToMoles')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          dmmDir === 'massToMoles' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Mass (ng) → Moles (pmol)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDmmDir('molesToMass')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          dmmDir === 'molesToMass' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Moles (pmol) → Mass (ng)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">DNA Length (bp) *</label>
                        <input
                          type="number"
                          value={dmmLengthBp}
                          onChange={(e) => setDmmLengthBp(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                        />
                      </div>
                      {dmmDir === 'massToMoles' ? (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">DNA Mass (ng) *</label>
                          <input
                            type="number"
                            step="any"
                            value={dmmMassNg}
                            onChange={(e) => setDmmMassNg(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Molar Amount (pmol) *</label>
                          <input
                            type="number"
                            step="any"
                            value={dmmPmol}
                            onChange={(e) => setDmmPmol(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6.5 Agarose Gel */}
                {selectedCalc === 'agarose_gel' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Gel Concentration (% w/v) *</label>
                      <input
                        type="number"
                        step="any"
                        value={gelPct}
                        onChange={(e) => setGelPct(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Gel Volume (mL) *</label>
                      <input
                        type="number"
                        step="any"
                        value={gelVol}
                        onChange={(e) => setGelVol(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 7.1 Protein Concentration */}
                {selectedCalc === 'protein_conc' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        onClick={() => setProtMode('absorbance')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          protMode === 'absorbance' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Beer-Lambert Absorbance (A280)
                      </button>
                      <button
                        type="button"
                        onClick={() => setProtMode('massVolume')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          protMode === 'massVolume' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Mass & Volume
                      </button>
                    </div>

                    {protMode === 'absorbance' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">A280 Absorbance *</label>
                          <input
                            type="number"
                            step="any"
                            value={protA280}
                            onChange={(e) => setProtA280(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Extinction Coeff (ε)</label>
                          <input
                            type="number"
                            step="any"
                            value={protEc}
                            onChange={(e) => setProtEc(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Protein Mass (mg) *</label>
                          <input
                            type="number"
                            step="any"
                            value={protMass}
                            onChange={(e) => setProtMass(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Solution Volume (mL) *</label>
                          <input
                            type="number"
                            step="any"
                            value={protVol}
                            onChange={(e) => setProtVol(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 7.2 BCA Assay */}
                {selectedCalc === 'bca_assay' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Sample Absorbance (A562) *</label>
                      <input
                        type="number"
                        step="any"
                        value={bcaUnkAbs}
                        onChange={(e) => setBcaUnkAbs(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Blank Absorbance</label>
                      <input
                        type="number"
                        step="any"
                        value={bcaBlank}
                        onChange={(e) => setBcaBlank(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Dilution Factor</label>
                      <input
                        type="number"
                        step="any"
                        value={bcaDil}
                        onChange={(e) => setBcaDil(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 7.3 Bradford Assay */}
                {selectedCalc === 'bradford_assay' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Sample Absorbance (A595) *</label>
                      <input
                        type="number"
                        step="any"
                        value={bradUnkAbs}
                        onChange={(e) => setBradUnkAbs(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Blank Absorbance</label>
                      <input
                        type="number"
                        step="any"
                        value={bradBlank}
                        onChange={(e) => setBradBlank(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Dilution Factor</label>
                      <input
                        type="number"
                        step="any"
                        value={bradDil}
                        onChange={(e) => setBradDil(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 7.4 Protein Dilution */}
                {selectedCalc === 'protein_dilution' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Stock Conc (mg/mL)</label>
                      <input
                        type="number"
                        value={protDilC1}
                        onChange={(e) => setProtDilC1(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Conc (mg/mL)</label>
                      <input
                        type="number"
                        value={protDilC2}
                        onChange={(e) => setProtDilC2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Final Volume (µL)</label>
                      <input
                        type="number"
                        value={protDilV2}
                        onChange={(e) => setProtDilV2(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 7.5 Enzyme Activity */}
                {selectedCalc === 'enzyme_activity' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">ΔAbsorbance (ΔA) *</label>
                      <input
                        type="number"
                        step="any"
                        value={enzDa}
                        onChange={(e) => setEnzDa(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Time Interval (min) *</label>
                      <input
                        type="number"
                        step="any"
                        value={enzDt}
                        onChange={(e) => setEnzDt(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Extinction Coeff (M⁻¹ cm⁻¹)</label>
                      <input
                        type="number"
                        value={enzEc}
                        onChange={(e) => setEnzEc(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Reaction Vol (mL)</label>
                      <input
                        type="number"
                        step="any"
                        value={enzVrxn}
                        onChange={(e) => setEnzVrxn(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 8.1 Descriptive Statistics */}
                {selectedCalc === 'descriptive_stats' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Observations (comma, space, or newline-separated) *</label>
                      <textarea
                        rows={3}
                        required
                        value={statsInput}
                        onChange={(e) => setStatsInput(e.target.value)}
                        placeholder="e.g. 10, 12, 15, 11, 14, 13"
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold focus-ring"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStatsSdType('sample')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          statsSdType === 'sample' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Sample SD (n-1, Standard)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatsSdType('population')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          statsSdType === 'population' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Population SD (N)
                      </button>
                    </div>
                  </div>
                )}

                {/* 8.2 CV% Calculator */}
                {selectedCalc === 'cv_percent' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        onClick={() => setCvMode('meanSd')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          cvMode === 'meanSd' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Mean + Standard Deviation
                      </button>
                      <button
                        type="button"
                        onClick={() => setCvMode('rawData')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          cvMode === 'rawData' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Raw Replicate Observations
                      </button>
                    </div>

                    {cvMode === 'meanSd' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Arithmetic Mean *</label>
                          <input
                            type="number"
                            step="any"
                            value={cvMean}
                            onChange={(e) => setCvMean(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Standard Deviation *</label>
                          <input
                            type="number"
                            step="any"
                            value={cvSd}
                            onChange={(e) => setCvSd(e.target.value)}
                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Enter Raw Replicate Values</label>
                        <textarea
                          rows={3}
                          value={cvRawData}
                          onChange={(e) => setCvRawData(e.target.value)}
                          placeholder="e.g. 98, 102, 100, 101, 99"
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold focus-ring"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 8.3 Radioactive Decay / Half-Life */}
                {selectedCalc === 'half_life' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Initial Amount (N0) *</label>
                      <input
                        type="number"
                        step="any"
                        value={hlInitial}
                        onChange={(e) => setHlInitial(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Half-Life (t½) *</label>
                      <input
                        type="number"
                        step="any"
                        value={hlHalfLife}
                        onChange={(e) => setHlHalfLife(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Elapsed Time (t) *</label>
                      <input
                        type="number"
                        step="any"
                        value={hlElapsed}
                        onChange={(e) => setHlElapsed(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* 9. Standalone Unit Converter */}
                {selectedCalc === 'unit_converter' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { id: 'mass', label: 'Mass' },
                          { id: 'volume', label: 'Volume' },
                          { id: 'concentration', label: 'Concentration' },
                          { id: 'dnaLength', label: 'DNA Length' },
                          { id: 'amount', label: 'Amount' }
                        ].map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleUcCategoryChange(c.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              ucCategory === c.id
                                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">From Value & Unit</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="number"
                            step="any"
                            value={ucValue}
                            onChange={(e) => setUcValue(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring font-mono"
                          />
                          <select
                            value={ucFrom}
                            onChange={(e) => setUcFrom(e.target.value)}
                            className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 text-xs font-bold shrink-0"
                          >
                            {(ucUnitsMap[ucCategory] || []).map(u => (
                              <option key={u.id} value={u.id}>{u.id}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-2 flex justify-center pt-5">
                        <button
                          type="button"
                          onClick={handleSwapUnits}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-600 text-slate-600 transition-colors cursor-pointer border border-slate-200"
                          title="Swap From and To units"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">To Target Unit</label>
                        <select
                          value={ucTo}
                          onChange={(e) => setUcTo(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus-ring"
                        >
                          {(ucUnitsMap[ucCategory] || []).map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {calcError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{calcError}</span>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcResult(null);
                      setCalcError(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Reset Fields
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-teal-700/20 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Now</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Results & Verification Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Computation Result
                  </h3>
                  {calcResult && (
                    <button
                      onClick={() => handleCopy(calcResult.summary || JSON.stringify(calcResult))}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                    >
                      {copiedId === 'res' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'res' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {!calcResult ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Calculator className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-500">Ready to Compute</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Enter experimental parameters and click <span className="text-teal-600 font-bold">Calculate Now</span> to generate verifiable outputs.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    {/* Primary Highlight Banner */}
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50/50 border border-teal-200/80 rounded-2xl p-4">
                      <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider">
                        Primary Result
                      </span>
                      <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono break-words">
                        {calcResult.summary || calcResult.result || 'Calculated successfully'}
                      </div>
                    </div>

                    {/* Breakdown Key-Values */}
                    <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50/60 divide-y divide-slate-100 text-xs">
                      {Object.entries(calcResult)
                        .filter(([k]) => !['error', 'summary', 'components', 'steps'].includes(k))
                        .slice(0, 6)
                        .map(([key, val]) => (
                          <div key={key} className="py-1.5 flex items-center justify-between gap-2">
                            <span className="text-slate-500 font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="font-mono font-bold text-slate-800 text-right">{String(val)}</span>
                          </div>
                        ))}
                    </div>

                    {/* Component Table for PCR / Mix Calculators */}
                    {calcResult.components && (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                            <tr>
                              <th className="p-2.5">Reagent</th>
                              <th className="p-2.5 text-right">Per Rxn</th>
                              <th className="p-2.5 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                            {calcResult.components.map((c, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="p-2 font-sans text-slate-800">{c.name}</td>
                                <td className="p-2 text-right text-slate-600">{c.perRxn || c.volume} µL</td>
                                <td className="p-2 text-right font-bold text-teal-700">{c.total || c.volume} µL</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Action: Save to Ledger */}
                    <button
                      onClick={() => openSaveModal(currentCalcDef.name)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4 text-teal-400" />
                      <span>Save to Calculation Ledger</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          SAVE TO CALCULATION LEDGER MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setSaveModalOpen(false)}
          />

          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative w-full max-w-md p-6 sm:p-7 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Save to Calculation Ledger</h3>
              </div>
              <button
                onClick={() => setSaveModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Calculation Name *</label>
                <input
                  type="text"
                  required
                  value={saveCalcName}
                  onChange={(e) => setSaveCalcName(e.target.value)}
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Associate with Project</label>
                <select
                  value={saveProjectId}
                  onChange={(e) => setSaveProjectId(e.target.value)}
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                >
                  <option value="">No Project Association</option>
                  {(projects || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Associate with Experiment / Notebook Entry</label>
                <select
                  value={saveEntryId}
                  onChange={(e) => setSaveEntryId(e.target.value)}
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                >
                  <option value="">No Experiment Association</option>
                  {(notebookEntries || []).map(entry => (
                    <option key={entry.id} value={entry.id}>
                      {entry.title} ({entry.status || 'Draft'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Protocol Notes / Observations</label>
                <textarea
                  rows={2}
                  value={saveCalcNotes}
                  onChange={(e) => setSaveCalcNotes(e.target.value)}
                  placeholder="e.g. Prepared for run #3 of Cas9 endonuclease titration."
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus-ring resize-none"
                />
              </div>

              {savedSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Calculation saved to ledger successfully!</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Save to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

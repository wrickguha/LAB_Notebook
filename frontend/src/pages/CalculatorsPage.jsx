import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculateMolarity,
  calculateDnaCopyNumber,
  calculatePcrMix,
  calculateHalfLifeDecay,
  calculateStats
} from '../utils/calculatorFormulas';
import {
  Calculator,
  Beaker,
  TrendingUp,
  History,
  BookOpen,
  Clipboard,
  Check,
  Search,
  Settings,
  Cpu,
  RefreshCw
} from 'lucide-react';

export default function CalculatorsPage() {
  const { calcHistory, addCalcHistory } = useApp();
  const [activeTab, setActiveTab] = useState('biotech'); // 'biotech' | 'chemistry' | 'physics' | 'stats'
  const [copiedId, setCopiedId] = useState(null);

  // Molarity Inputs
  const [molMass, setMolMass] = useState('5.84');
  const [molMw, setMolMw] = useState('58.44');
  const [molVol, setMolVol] = useState('100');
  const [molarityResult, setMolarityResult] = useState('');

  // DNA Copy Inputs
  const [dnaNg, setDnaNg] = useState('50');
  const [dnaBp, setDnaBp] = useState('4000');
  const [dnaResult, setDnaResult] = useState('');

  // PCR Master Mix Inputs
  const [pcrReactions, setPcrReactions] = useState('10');
  const [pcrOverage, setPcrOverage] = useState('10');
  const [pcrResult, setPcrResult] = useState(null);

  // Half-Life Inputs
  const [hlAmount, setHlAmount] = useState('100');
  const [hlTime, setHlTime] = useState('24');
  const [hlPeriod, setHlPeriod] = useState('8'); // e.g. Iodine-131 half-life
  const [hlResult, setHlResult] = useState(null);

  // Statistics Inputs
  const [statsData, setStatsData] = useState('12.4, 15.6, 14.2, 18.9, 13.5');
  const [statsResult, setStatsResult] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Run Molarity calculation
  const runMolarity = (e) => {
    e.preventDefault();
    const res = calculateMolarity(molMass, molMw, molVol);
    if (res) {
      setMolarityResult(`${res} M (mol/L)`);
      addCalcHistory({
        type: 'Molarity Dilution',
        formula: 'M = m / (MW * V)',
        input: `Mass: ${molMass}g, MW: ${molMw}g/mol, Vol: ${molVol}mL`,
        result: `${res} M`,
      });
    }
  };

  // Run DNA Copy calculation
  const runDnaCopies = (e) => {
    e.preventDefault();
    const res = calculateDnaCopyNumber(dnaNg, dnaBp);
    if (res) {
      setDnaResult(`${res} copies`);
      addCalcHistory({
        type: 'DNA Copy Estimation',
        formula: 'Copies = (ng * N_A) / (bp * 1e9 * 660)',
        input: `DNA: ${dnaNg}ng, Length: ${dnaBp}bp`,
        result: `${res} copies`,
      });
    }
  };

  // Run PCR recipe scale
  const runPcrMix = (e) => {
    e.preventDefault();
    const res = calculatePcrMix(pcrReactions, pcrOverage);
    if (res) {
      setPcrResult(res);
      addCalcHistory({
        type: 'PCR Master Mix scale',
        formula: 'Volume * Multiplier',
        input: `Reactions: ${pcrReactions}, Overage: ${pcrOverage}%`,
        result: `Total Mix Vol: ${res.totalVolume} µL`,
      });
    }
  };

  // Run Half Life Decay
  const runHalfLife = (e) => {
    e.preventDefault();
    const res = calculateHalfLifeDecay(hlAmount, hlPeriod, hlTime);
    if (res) {
      setHlResult(res);
      addCalcHistory({
        type: 'Radioactive Decay',
        formula: 'N(t) = N0 * 0.5^(t/T)',
        input: `Initial: ${hlAmount}g, Half-Life: ${hlPeriod}h, Time: ${hlTime}h`,
        result: `${res.remaining}g remaining (${res.percentage}%)`,
      });
    }
  };

  // Run Stats
  const runStats = (e) => {
    e.preventDefault();
    const res = calculateStats(statsData);
    if (res) {
      setStatsResult(res);
      addCalcHistory({
        type: 'Sample Standard Deviation',
        formula: 'Sigma standard deviation algorithm',
        input: `Dataset: [${statsData}]`,
        result: `Std Dev: ${res.stdDev}, Mean: ${res.mean}`,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: Calculators Area */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Toggle Categories Tabs */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-wrap gap-2">
          {[
            { id: 'biotech', name: '🧪 Biotechnology', desc: 'DNA copy counts, PCR setups' },
            { id: 'chemistry', name: '🧫 Chemistry', desc: 'Molarity & Dilutions' },
            { id: 'physics', name: '⚛ Physics & Half-Life', desc: 'Radioactive decay logs' },
            { id: 'stats', name: '📊 Statistics', desc: 'Sample deviations & variance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-left p-3 rounded-xl border transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-50 border-blue-300 shadow-xs scale-[1.01]'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <h3 className="font-extrabold text-slate-800 text-xs">{tab.name}</h3>
              <p className="text-[10px] text-slate-450 mt-1">{tab.desc}</p>
            </button>
          ))}
        </div>

        {/* Tab content widgets */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[300px]">
          
          {/* CHEMISTRY TAB: Molarity Solver */}
          {activeTab === 'chemistry' && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Molarity Solution Calculator</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Determine the molarity of a solute dissolved in a specific volume.</p>
                <div className="text-[10px] bg-slate-50 text-slate-500 font-mono p-2 rounded border border-slate-150 mt-2">
                  Formula: M = m / (MW * V) where V is in liters.
                </div>
              </div>

              <form onSubmit={runMolarity} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Solute Mass (g)</label>
                  <input
                    type="number"
                    step="any"
                    value={molMass}
                    onChange={(e) => setMolMass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Molecular Weight (g/mol)</label>
                  <input
                    type="number"
                    step="any"
                    value={molMw}
                    onChange={(e) => setMolMw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Target Volume (mL)</label>
                  <input
                    type="number"
                    step="any"
                    value={molVol}
                    onChange={(e) => setMolVol(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="sm:col-span-3 pt-3 flex justify-end">
                  <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">
                    Solve Molarity
                  </button>
                </div>
              </form>

              {molarityResult && (
                <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-blue-650 font-bold block uppercase tracking-wider">Solution Concentration</span>
                    <span className="font-black text-slate-800 mt-1 block">{molarityResult}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(molarityResult, 'chem')}
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-650 transition-colors"
                  >
                    {copiedId === 'chem' ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BIOTECH TAB: DNA Copies & PCR Scales */}
          {activeTab === 'biotech' && (
            <div className="space-y-8 animate-fade-in-up">
              {/* DNA Copy Number widget */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">DNA Copy Number Estimator</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Determine the total template copy count based on double-stranded DNA mass and base pair length.</p>
                </div>

                <form onSubmit={runDnaCopies} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">DNA Mass (ng)</label>
                    <input
                      type="number"
                      step="any"
                      value={dnaNg}
                      onChange={(e) => setDnaNg(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Length of Template (bp)</label>
                    <input
                      type="number"
                      step="any"
                      value={dnaBp}
                      onChange={(e) => setDnaBp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-2 flex justify-end">
                    <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">
                      Calculate Copy Count
                    </button>
                  </div>
                </form>

                {dnaResult && (
                  <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-blue-650 font-bold block uppercase tracking-wider">Estimated Copy Quantity</span>
                      <span className="font-black text-slate-800 mt-1 block">{dnaResult}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(dnaResult, 'dna')}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-655"
                    >
                      {copiedId === 'dna' ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* PCR recipe scaler widget */}
              <div className="border-t border-slate-150 pt-6 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">PCR Master Mix Scaler</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Scale default Taq polymerase assay formulas to custom run counts with overages.</p>
                </div>

                <form onSubmit={runPcrMix} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Number of Reactions</label>
                    <input
                      type="number"
                      value={pcrReactions}
                      onChange={(e) => setPcrReactions(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Overage Percentage (%)</label>
                    <input
                      type="number"
                      value={pcrOverage}
                      onChange={(e) => setPcrOverage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-2 flex justify-end">
                    <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">
                      Compile PCR Mix Sheet
                    </button>
                  </div>
                </form>

                {pcrResult && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50/50">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between text-xs font-bold text-slate-650">
                      <span>Total Scaled Reactions: {pcrResult.multiplier}x (Incl. {pcrOverage}% overage)</span>
                      <span>Total volume: {pcrResult.totalVolume} µL</span>
                    </div>
                    <table className="w-full text-left border-collapse text-xs bg-white">
                      <thead>
                        <tr className="border-b border-slate-150 font-bold text-[9px] uppercase tracking-wider text-slate-450 bg-slate-50/30">
                          <th className="p-3">Component Reagent</th>
                          <th className="p-3">Vol per reaction</th>
                          <th className="p-3 font-bold text-blue-650">Total Mix Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pcrResult.components.map((c, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                            <td className="p-3 text-slate-700 font-semibold">{c.name}</td>
                            <td className="p-3 text-slate-400">{c.perRxn} {c.unit}</td>
                            <td className="p-3 font-black text-blue-750">{c.total} {c.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PHYSICS TAB: Radioactive Decay Half-Life */}
          {activeTab === 'physics' && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Radioactive Isotope Decay Solver</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Calculate the remaining mass of a radioactive sample over time.</p>
              </div>

              <form onSubmit={runHalfLife} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Initial Mass (g)</label>
                  <input
                    type="number"
                    step="any"
                    value={hlAmount}
                    onChange={(e) => setHlAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Isotope Half-Life (Hours)</label>
                  <input
                    type="number"
                    step="any"
                    value={hlPeriod}
                    onChange={(e) => setHlPeriod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Elapsed Time (Hours)</label>
                  <input
                    type="number"
                    step="any"
                    value={hlTime}
                    onChange={(e) => setHlTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="sm:col-span-3 pt-3 flex justify-end">
                  <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">
                    Solve Decay State
                  </button>
                </div>
              </form>

              {hlResult && (
                <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl grid grid-cols-3 gap-4 text-xs text-slate-800">
                  <div>
                    <span className="text-[10px] text-blue-650 font-bold block uppercase">Remaining Quantity</span>
                    <span className="font-black text-slate-700 mt-1 block">{hlResult.remaining} g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-655 font-bold block uppercase">Decayed Quantity</span>
                    <span className="font-black text-slate-700 mt-1 block">{hlResult.decayed} g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-655 font-bold block uppercase">Retention %</span>
                    <span className="font-black text-slate-700 mt-1 block">{hlResult.percentage} %</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATISTICS TAB: Deviations calculator */}
          {activeTab === 'stats' && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">Sample Standard Deviation Solver</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Determine the mean, variance, and standard deviation of a dataset. Input values separated by commas.</p>
              </div>

              <form onSubmit={runStats} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Dataset Values (separated by commas)</label>
                  <input
                    type="text"
                    value={statsData}
                    onChange={(e) => setStatsData(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    placeholder="e.g. 1.2, 1.5, 1.4, 1.9, 2.1"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow">
                    Solve Statistics
                  </button>
                </div>
              </form>

              {statsResult && (
                <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-850">
                  <div>
                    <span className="text-[10px] text-blue-650 font-bold block uppercase">Mean Average</span>
                    <span className="font-black text-slate-700 mt-1 block">{statsResult.mean}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-650 font-bold block uppercase">Std Deviation</span>
                    <span className="font-black text-slate-700 mt-1 block">{statsResult.stdDev}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-655 font-bold block uppercase">Variance (S^2)</span>
                    <span className="font-black text-slate-700 mt-1 block">{statsResult.variance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-655 font-bold block uppercase">Min / Max Range</span>
                    <span className="font-black text-slate-700 mt-1 block">{statsResult.min} - {statsResult.max}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* RIGHT: History Ledger */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <History className="w-4 h-4 text-slate-450" /> Calculation Ledger Logs
        </h3>

        <div className="space-y-3.5 max-h-[450px] overflow-y-auto no-scrollbar">
          {calcHistory.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-[10px] text-slate-650">
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                <span className="font-bold text-slate-850 uppercase">{item.type}</span>
                <span className="text-[9px] text-slate-400">{item.date}</span>
              </div>
              <div className="font-mono bg-white p-1 rounded border border-slate-100 text-slate-500 overflow-x-auto">
                Formula: {item.formula}
              </div>
              <div className="text-[9px] text-slate-500">
                Inputs: {item.input}
              </div>
              <div className="font-bold text-blue-750 text-xs">
                Result: {item.result}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

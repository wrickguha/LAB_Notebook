"""
Scientific Calculators Router — server-side computation
Mirrors calculatorFormulas.js on the backend so results can be logged server-side.

  POST /api/calculators/molarity
  POST /api/calculators/dna-copy-number
  POST /api/calculators/pcr-mix
  POST /api/calculators/half-life-decay
  POST /api/calculators/statistics
"""

import math
from typing import List

from fastapi import APIRouter, HTTPException
from app.schemas import (
    MolarityRequest, MolarityResponse,
    DnaCopyRequest, DnaCopyResponse,
    PcrMixRequest, PcrMixResponse, PcrComponent,
    HalfLifeRequest, HalfLifeResponse,
    StatisticsRequest, StatisticsResponse,
)

router = APIRouter(prefix="/api/calculators", tags=["calculators"])


# ── 1. Molarity ────────────────────────────────────────────────────────────

@router.post("/molarity", response_model=MolarityResponse)
def calc_molarity(body: MolarityRequest):
    """
    Molarity (M) = mass_g / (MW_g_mol * volume_L)
    Mirrors calculateMolarity() in calculatorFormulas.js.
    """
    vol_l = body.volume_ml / 1000
    if body.molecular_weight == 0 or vol_l == 0:
        raise HTTPException(status_code=422, detail="Molecular weight and volume must be non-zero.")

    molarity = body.mass / (body.molecular_weight * vol_l)
    return MolarityResponse(
        molarity=round(molarity, 5),
        formatted=f"{molarity:.5f} M (mol/L)",
    )


# ── 2. DNA Copy Number ─────────────────────────────────────────────────────

AVOGADRO = 6.02214076e23
BP_WEIGHT = 660  # average g/mol per base pair (dsDNA)
NG_TO_G = 1e9    # 1 g = 1e9 ng


@router.post("/dna-copy-number", response_model=DnaCopyResponse)
def calc_dna_copy_number(body: DnaCopyRequest):
    """
    Copies = (amount_ng * Avogadro) / (length_bp * 1e9 * 660)
    Mirrors calculateDnaCopyNumber() in calculatorFormulas.js.
    """
    if body.length_bp == 0:
        raise HTTPException(status_code=422, detail="Length must be non-zero.")

    copies = (body.amount_ng * AVOGADRO) / (body.length_bp * NG_TO_G * BP_WEIGHT)
    return DnaCopyResponse(
        copies_float=copies,
        copies_scientific=f"{copies:.4e}",
    )


# ── 3. PCR Master Mix Scaler ───────────────────────────────────────────────

_PCR_RECIPE = [
    {"name": "Nuclease-Free Water",          "perRxn": 28.9, "unit": "µL"},
    {"name": "10X Taq Buffer",               "perRxn": 5.0,  "unit": "µL"},
    {"name": "dNTP Mix (10 mM)",             "perRxn": 1.0,  "unit": "µL"},
    {"name": "Forward Primer (10 µM)",       "perRxn": 2.5,  "unit": "µL"},
    {"name": "Reverse Primer (10 µM)",       "perRxn": 2.5,  "unit": "µL"},
    {"name": "Taq DNA Polymerase (5 U/µL)", "perRxn": 0.1,  "unit": "µL"},
    {"name": "DNA Template (<1,000 ng)",     "perRxn": 10.0, "unit": "µL"},
]


@router.post("/pcr-mix", response_model=PcrMixResponse)
def calc_pcr_mix(body: PcrMixRequest):
    """
    Scale PCR reagent volumes for N reactions + overage %.
    Mirrors calculatePcrMix() in calculatorFormulas.js.
    """
    if body.reactions <= 0:
        raise HTTPException(status_code=422, detail="Reactions must be a positive integer.")

    multiplier = body.reactions * (1 + body.overage_percent / 100)
    components = [
        PcrComponent(
            name=c["name"],
            perRxn=c["perRxn"],
            total=round(c["perRxn"] * multiplier, 2),
            unit=c["unit"],
        )
        for c in _PCR_RECIPE
    ]
    return PcrMixResponse(
        multiplier=round(multiplier, 2),
        total_volume=round(50.0 * multiplier, 2),
        components=components,
    )


# ── 4. Radioactive Decay / Half-Life ──────────────────────────────────────

@router.post("/half-life-decay", response_model=HalfLifeResponse)
def calc_half_life(body: HalfLifeRequest):
    """
    N(t) = N0 * (1/2)^(t / t_half)
    Mirrors calculateHalfLifeDecay() in calculatorFormulas.js.
    """
    if body.half_life_hours == 0:
        raise HTTPException(status_code=422, detail="Half-life must be non-zero.")

    remaining = body.initial_amount * math.pow(0.5, body.elapsed_hours / body.half_life_hours)
    decayed = body.initial_amount - remaining
    percentage = (remaining / body.initial_amount) * 100 if body.initial_amount != 0 else 0

    return HalfLifeResponse(
        remaining=round(remaining, 4),
        decayed=round(decayed, 4),
        percentage=round(percentage, 2),
    )


# ── 5. Sample Statistics ───────────────────────────────────────────────────

@router.post("/statistics", response_model=StatisticsResponse)
def calc_statistics(body: StatisticsRequest):
    """
    Compute mean, sample variance, std dev, min, max.
    Mirrors calculateStats() in calculatorFormulas.js.
    """
    values = body.values
    if not values:
        raise HTTPException(status_code=422, detail="Values list must not be empty.")

    n = len(values)
    mean = sum(values) / n

    if n == 1:
        return StatisticsResponse(
            count=1,
            mean=round(mean, 4),
            variance=0.0,
            std_dev=0.0,
            minimum=round(values[0], 4),
            maximum=round(values[0], 4),
        )

    variance = sum((v - mean) ** 2 for v in values) / (n - 1)
    std_dev = math.sqrt(variance)

    return StatisticsResponse(
        count=n,
        mean=round(mean, 4),
        variance=round(variance, 4),
        std_dev=round(std_dev, 4),
        minimum=round(min(values), 4),
        maximum=round(max(values), 4),
    )

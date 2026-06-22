"""
Analytics Router — static/derived chart data used by AnalyticsPage.jsx
  GET /api/analytics/productivity  — weekly workload area chart data
  GET /api/analytics/resources     — equipment usage bar chart data
  GET /api/analytics/pipeline      — publication pipeline stacked chart data
"""

from typing import List
from fastapi import APIRouter
from app.schemas import (
    AnalyticsProductivityResponse,
    AnalyticsResourcesResponse,
    AnalyticsPipelineResponse,
    ProductivityDataPoint,
    ResourceAllocationItem,
    PipelineStatItem,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

# Static data (same as the hardcoded arrays in AnalyticsPage.jsx)
_WORKLOAD_WEEKLY = [
    {"day": "Wk 1", "lab_hours": 45, "data_entries": 12},
    {"day": "Wk 2", "lab_hours": 50, "data_entries": 18},
    {"day": "Wk 3", "lab_hours": 62, "data_entries": 22},
    {"day": "Wk 4", "lab_hours": 55, "data_entries": 15},
    {"day": "Wk 5", "lab_hours": 70, "data_entries": 30},
    {"day": "Wk 6", "lab_hours": 68, "data_entries": 28},
]

_RESOURCE_ALLOCATION = [
    {"name": "Ultracentrifuge X-80",  "hours": 142, "cost": 2400},
    {"name": "HPLC Mass Spec",        "hours": 98,  "cost": 4800},
    {"name": "Confocal Microscope",   "hours": 110, "cost": 5500},
    {"name": "Biosafety Cabinet B2",  "hours": 180, "cost": 1200},
    {"name": "PCR Thermal Cycler",    "hours": 220, "cost": 1100},
]

_PIPELINE_STATS = [
    {"name": "CRISPR Gene Edit",    "drafts": 3, "reviews": 1, "signed": 2},
    {"name": "Scaffold Hydrogels",  "drafts": 1, "reviews": 2, "signed": 1},
    {"name": "PCR Assay Panel",     "drafts": 4, "reviews": 0, "signed": 0},
    {"name": "Microglial Clearing", "drafts": 0, "reviews": 0, "signed": 4},
]


@router.get("/productivity", response_model=AnalyticsProductivityResponse)
def get_productivity():
    """Weekly laboratory output data for the area chart."""
    return AnalyticsProductivityResponse(
        data=[ProductivityDataPoint(**d) for d in _WORKLOAD_WEEKLY]
    )


@router.get("/resources", response_model=AnalyticsResourcesResponse)
def get_resources():
    """Equipment usage hours / cost for the horizontal bar chart."""
    return AnalyticsResourcesResponse(
        data=[ResourceAllocationItem(**d) for d in _RESOURCE_ALLOCATION]
    )


@router.get("/pipeline", response_model=AnalyticsPipelineResponse)
def get_pipeline():
    """Publication pipeline stages breakdown for the stacked bar chart."""
    return AnalyticsPipelineResponse(
        data=[PipelineStatItem(**d) for d in _PIPELINE_STATS]
    )

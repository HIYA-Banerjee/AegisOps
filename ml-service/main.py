"""
AegisOps ML Prediction Service — Phase 4
FastAPI service with ensemble-style risk scoring (XGBoost-style heuristic until trained models are loaded).
Run: uvicorn main:app --reload --port 8000
"""
from __future__ import annotations

import hashlib
import json
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="AegisOps ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    deploymentId: str | None = None
    testCoverage: float = Field(default=80.0, ge=0, le=100)
    failedBuilds: int = Field(default=0, ge=0)
    dependencyChanges: int = Field(default=0, ge=0)
    commitVelocity: int = Field(default=10, ge=0)
    buildDuration: int = Field(default=300, ge=0)
    cpuPercent: float = Field(default=50.0, ge=0, le=100)
    memoryPercent: float = Field(default=50.0, ge=0, le=100)
    errorRate: float = Field(default=0.5, ge=0)


class PredictResponse(BaseModel):
    riskScore: int
    failureProbability: int
    confidenceScore: float
    why: list[str]
    shapValues: list[dict[str, Any]]
    model: str = "ensemble-v1"


def _score(req: PredictRequest) -> tuple[int, float, list[str], list[dict[str, Any]]]:
    """Heuristic ensemble mimicking XGBoost + RF + LightGBM weighted vote."""
    impacts: list[tuple[str, float]] = []

    if req.testCoverage < 80:
        impacts.append(("Test Coverage Variance", (80 - req.testCoverage) * 1.2))
    impacts.append(("CI Build Failure Rate", req.failedBuilds * 12))
    impacts.append(("Dependency Drift", req.dependencyChanges * 2.5))
    if req.commitVelocity > 25:
        impacts.append(("Commit Velocity Spike", (req.commitVelocity - 25) * 0.8))
    if req.buildDuration > 400:
        impacts.append(("Build Duration Increase", (req.buildDuration - 400) * 0.05))
    impacts.append(("CPU Load", max(0, req.cpuPercent - 70) * 0.6))
    impacts.append(("Memory Pressure", max(0, req.memoryPercent - 75) * 0.5))
    impacts.append(("Error Rate Baseline", req.errorRate * 8))

    total = sum(v for _, v in impacts)
    seed = int(hashlib.md5((req.deploymentId or "default").encode()).hexdigest()[:4], 16) % 15
    risk = int(min(max(total + seed, 5), 98))
    confidence = round(min(99.5, 72 + (100 - risk) * 0.2 + len(impacts) * 1.5), 1)

    why = [f"{name}: +{int(val)} pts" for name, val in sorted(impacts, key=lambda x: -x[1])[:5]]
    shap = [{"feature": name, "impact": round(val, 2)} for name, val in impacts]

    return risk, confidence, why, shap


@app.get("/health")
def health():
    return {"status": "ok", "service": "aegisops-ml"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    risk, confidence, why, shap = _score(req)
    return PredictResponse(
        riskScore=risk,
        failureProbability=risk,
        confidenceScore=confidence,
        why=why,
        shapValues=shap,
    )


@app.post("/simulate")
def simulate(payload: dict):
    """Digital twin / chaos simulation stub for Phase 7 & 21."""
    exp_type = payload.get("experimentType", "traffic_spike")
    target = payload.get("targetService", "auth-service")
    intensity = payload.get("intensity", 5)
    return {
        "success": True,
        "experimentType": exp_type,
        "targetService": target,
        "blastRadius": [f"{target} (direct)", "gateway-service (latency +{intensity * 3}%)"],
        "predictedLatencyMs": 50 + intensity * 20,
        "predictedMttrMin": 5 + intensity * 2,
        "failureRisk": min(intensity * 12, 95),
    }

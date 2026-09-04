from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="MortgageOps AI Service",
    version="0.1.0",
    description="Document intelligence and analyst-assistance boundary for MortgageOps.",
)


class DocumentAnalysisRequest(BaseModel):
    document_type: str = Field(min_length=1)
    text: str = Field(default="", max_length=250_000)


class DocumentAnalysisResponse(BaseModel):
    document_type: str
    fields: dict[str, str]
    flags: list[str]
    model_status: str = "placeholder"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "mortgageops-ai"}


@app.post("/v1/documents/analyze", response_model=DocumentAnalysisResponse)
def analyze_document(request: DocumentAnalysisRequest) -> DocumentAnalysisResponse:
    # AI/OCR providers will be plugged in behind this stable contract.
    # The service deliberately returns no credit decision and performs no financial posting.
    return DocumentAnalysisResponse(
        document_type=request.document_type,
        fields={},
        flags=[],
    )

FROM python:3.13-slim

WORKDIR /app

COPY services/ai/pyproject.toml ./pyproject.toml
COPY services/ai/app ./app

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir fastapi==0.141.1 pydantic==2.13.5 uvicorn==0.52.4

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

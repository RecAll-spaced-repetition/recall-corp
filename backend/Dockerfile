# Build stage
FROM python:3.12.10 AS builder

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN curl -sSL https://install.python-poetry.org | python3 - --version 1.8.1

# Add Poetry to PATH
ENV PATH="/root/.local/bin:$PATH" \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1

WORKDIR /code
COPY pyproject.toml poetry.lock ./

# Install Poetry dependencies
RUN poetry install --only main --no-interaction --no-ansi


# Runtime stage
FROM python:3.12.10 AS runtime

ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONOPTIMIZE=1 \
    PYTHONGCSTATS=1 \
    PYTHONGIL=0 \
    VIRTUAL_ENV=/code/.venv \
    PATH="/code/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

EXPOSE 8000

COPY ./config ./config
COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--limit-max-requests", "1000"]


# Amharic DBpedia Website

Standalone Amharic DBpedia web and automation project consolidated from the
`AmharicDBpediaChapter` sibling repository.

The repository contains the major maintained product components without legacy static
pages, generated RDF dumps, Python virtual environments, or build caches:

- `apps/web/`: Vite-powered vanilla TypeScript website.
- `packages/core/`: typed RDF, IRI, SPARQL, and graph helpers.
- `packages/content/`: multilingual chapter content and query examples.
- `backend/`: FastAPI automation service and tests.
- `extraction/`: wrappers and configuration for a sibling DBpedia Extraction Framework.
- `data/`: empty runtime directories for dumps, reports, and extraction runs.
- `docs/`: architecture, contributor, pipeline, and API demo documentation.

## Prerequisites

- Node.js 22+
- pnpm 10+
- Python 3.12+
- [uv](https://docs.astral.sh/uv/)
- Optional for real extraction runs: `../extraction-framework`

## Run Locally

Install frontend and backend dependencies:

```bash
just setup
```

Run FastAPI:

```bash
just api
```

Run the website in another terminal:

```bash
just dev
```

Open:

- Website: <http://127.0.0.1:5174>
- Automation page: <http://127.0.0.1:5174/automation>
- FastAPI OpenAPI UI: <http://127.0.0.1:8000/api/docs>

Vite proxies `/api` to FastAPI during local development. For separate production
origins, set `VITE_AMDB_API_BASE`.

## Verification

```bash
just check
```

Run `just --list` to see the individual frontend, backend, and extraction commands.

## Extraction Framework Boundary

The backend expects the DBpedia Extraction Framework checkout at
`../extraction-framework` by default. Override it when needed:

```bash
export AMDB_DEF_DIR=/absolute/path/to/extraction-framework
```

The web application consumes published RDF through the Amharic SPARQL endpoint and
Databus. It does not bundle generated RDF dumps into the browser.

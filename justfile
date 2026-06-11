set dotenv-load := true

default:
    @just --list

setup:
    pnpm install --frozen-lockfile
    cd backend && uv sync --python 3.12

dev:
    pnpm dev

api:
    pnpm dev:api

format:
    pnpm format

lint:
    pnpm lint

typecheck:
    pnpm typecheck

test:
    pnpm test
    pnpm test:api

test-e2e:
    pnpm test:e2e

build:
    pnpm build

check:
    pnpm format:check
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build
    pnpm check:api

sanitize input output:
    cd backend && uv run python -m amdb.cli.sanitize --input "{{input}}" --output "{{output}}"

pipeline input *args:
    cd backend && uv run python -m amdb.cli.pipeline --input "{{input}}" {{args}}

statistics source *args:
    cd backend && uv run python -m amdb.cli.statistics --source-dir "{{source}}" {{args}}

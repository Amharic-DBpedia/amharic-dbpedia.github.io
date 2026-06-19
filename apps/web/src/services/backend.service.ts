import { env } from "../app/env";

export interface BackendHealth {
  readonly status: string;
}

export function backendUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${env.apiBase.replace(/\/$/, "")}${normalizedPath}`;
}

export async function loadBackendHealth(signal?: AbortSignal): Promise<BackendHealth> {
  const response = await fetch(backendUrl("/api/health"), {
    headers: { Accept: "application/json" },
    signal: signal ?? null,
  });
  if (!response.ok) {
    throw new Error(`Automation API returned HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("status" in payload) ||
    typeof payload.status !== "string"
  ) {
    throw new Error("Automation API returned an invalid health response");
  }
  return { status: payload.status };
}

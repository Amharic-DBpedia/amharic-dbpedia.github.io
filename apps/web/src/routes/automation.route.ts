import type { AppLayout } from "../app/layout";
import { clear, externalLink } from "../dom/html";
import { backendUrl, loadBackendHealth } from "../services/backend.service";

const apiCapabilities = [
  {
    method: "POST",
    path: "/api/sanitizer/run",
    description: "Conservatively sanitize a MediaWiki XML dump and write an audit report.",
  },
  {
    method: "POST",
    path: "/api/pipeline/preview",
    description: "Inspect templates and generate mapping-property candidates for a small dump.",
  },
  {
    method: "POST",
    path: "/api/extraction/run-def",
    description: "Stage a sanitized dump and run the sibling DBpedia Extraction Framework.",
  },
  {
    method: "POST",
    path: "/api/statistics/generate",
    description: "Scan RDF outputs and generate a reusable statistics report.",
  },
] as const;

export function renderAutomation(layout: AppLayout): void {
  clear(layout.main);

  const section = document.createElement("section");
  section.className = "page-section";

  const title = document.createElement("h1");
  title.textContent = "Automation API";
  const intro = document.createElement("p");
  intro.className = "lead";
  intro.textContent =
    "The FastAPI backend supports dump sanitization, mapping-candidate analysis, DBpedia Extraction Framework runs, and RDF statistics.";

  const healthPanel = document.createElement("section");
  healthPanel.className = "endpoint-panel";
  const healthTitle = document.createElement("h2");
  healthTitle.textContent = "Backend health";
  const healthStatus = document.createElement("p");
  healthStatus.className = "status";
  const refresh = document.createElement("button");
  refresh.type = "button";
  refresh.textContent = "Check API health";
  refresh.addEventListener("click", () => {
    void updateHealth(healthStatus);
  });
  healthPanel.append(healthTitle, healthStatus, refresh);

  const capabilities = document.createElement("section");
  capabilities.className = "endpoint-panel";
  const capabilitiesTitle = document.createElement("h2");
  capabilitiesTitle.textContent = "Major backend capabilities";
  const list = document.createElement("ul");
  list.className = "api-capability-list";
  for (const capability of apiCapabilities) {
    const item = document.createElement("li");
    const endpoint = document.createElement("code");
    endpoint.textContent = `${capability.method} ${capability.path}`;
    const description = document.createElement("p");
    description.textContent = capability.description;
    item.append(endpoint, description);
    list.append(item);
  }
  capabilities.append(capabilitiesTitle, list);

  const apiDocs = externalLink(backendUrl("/api/docs"), "Open interactive FastAPI documentation");
  apiDocs.className = "button-link button-link--primary";

  section.append(title, intro, healthPanel, capabilities, apiDocs);
  layout.main.append(section);
  void updateHealth(healthStatus);
}

async function updateHealth(status: HTMLElement): Promise<void> {
  status.textContent = "Checking API...";
  status.className = "status";

  try {
    const health = await loadBackendHealth();
    status.textContent =
      health.status === "ok" ? "API is available" : `API reported status: ${health.status}`;
    status.className = health.status === "ok" ? "status status--ok" : "status status--error";
  } catch (error) {
    status.textContent =
      error instanceof Error ? error.message : "Could not connect to the Automation API";
    status.className = "status status--error";
  }
}

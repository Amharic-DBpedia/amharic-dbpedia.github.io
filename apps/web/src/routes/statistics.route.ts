import { chapterMetrics, mappingStatistics, researchHighlights } from "@amdb/content";
import { pickLocalized } from "@amdb/core";
import type { AppLayout } from "../app/layout";
import { clear } from "../dom/html";

interface MetricInsight {
  readonly title: string;
  readonly body: string;
  readonly sourceLabel: string;
  readonly sourceHref: string;
}

const metricInsights: readonly MetricInsight[] = [
  {
    title: "Mapped templates",
    body: "Templates are reusable infobox structures from Amharic Wikipedia. A mapped template means the chapter has connected that Amharic template to DBpedia's shared ontology so its facts can become structured RDF.",
    sourceLabel: "Open Amharic mappings",
    sourceHref: "https://mappings.dbpedia.org/index.php/Mapping_am",
  },
  {
    title: "Property coverage",
    body: "Property coverage shows how many distinct infobox fields were matched to DBpedia ontology properties. For example, a local Amharic field for birthplace or date is connected to a standard DBpedia property.",
    sourceLabel: "Open DBpedia ontology example",
    sourceHref: "https://mappings.dbpedia.org/index.php/OntologyClass%3APerson",
  },
  {
    title: "Property occurrences",
    body: "Occurrences count real uses of those fields across Amharic Wikipedia pages. This number answers how much of the data actually appearing in articles is covered by mappings.",
    sourceLabel: "Open Amharic mappings",
    sourceHref: "https://mappings.dbpedia.org/index.php/Mapping_am",
  },
  {
    title: "Unique triples",
    body: "A triple is one structured fact: subject, predicate, and object. Unique triples are the deduplicated facts in the released Amharic DBpedia knowledge graph.",
    sourceLabel: "Open Databus collection",
    sourceHref: "https://databus.dbpedia.org/purplebee/collections/am_chapter/",
  },
];

export function renderStatistics(layout: AppLayout): void {
  clear(layout.main);

  const language = layout.getLanguage();
  const section = document.createElement("section");
  section.className = "page-section";

  const title = document.createElement("h1");
  title.textContent = "Chapter statistics";
  const intro = document.createElement("p");
  intro.className = "lead";
  intro.textContent =
    "Review the published Amharic DBpedia research and GSoC mapping baseline. Select a number to see what it means and open its source.";

  const baselineTitle = document.createElement("h2");
  baselineTitle.textContent = "Published research baseline";
  const metrics = document.createElement("div");
  metrics.className = "metric-grid metric-grid--wide";

  for (const [index, metric] of chapterMetrics.entries()) {
    const insight = metricInsights[index];
    const article = document.createElement("article");
    article.className = `metric metric--${metric.tone ?? "primary"} metric--interactive`;
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const label = document.createElement("span");
    label.textContent = pickLocalized(metric.label, language) ?? "";
    const detail = document.createElement("p");
    detail.textContent = insight
      ? "Select to define this number and open its source."
      : (pickLocalized(metric.detail, language) ?? "");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "metric__button";
    button.append(value, label, detail);
    if (insight) button.addEventListener("click", () => openMetricDialog(insight));
    article.append(button);
    metrics.append(article);
  }

  const table = document.createElement("table");
  table.className = "stats-table";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const heading of ["Statistic", "Coverage", "Count", "Meaning"]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = heading;
    headerRow.append(th);
  }
  thead.append(headerRow);
  const tbody = document.createElement("tbody");
  for (const stat of mappingStatistics) {
    const row = document.createElement("tr");
    for (const value of [stat.label, stat.percentage, stat.count, stat.description]) {
      const cell = document.createElement(value === stat.label ? "th" : "td");
      if (cell instanceof HTMLTableCellElement && value === stat.label) cell.scope = "row";
      cell.textContent = value;
      row.append(cell);
    }
    tbody.append(row);
  }
  table.append(thead, tbody);

  const highlights = document.createElement("div");
  highlights.className = "insight-grid";
  const heading = document.createElement("h2");
  heading.textContent = "Research implementation notes";
  highlights.append(heading);
  for (const item of researchHighlights) {
    const card = document.createElement("article");
    card.className = "insight-card";
    const cardTitle = document.createElement("h3");
    cardTitle.textContent = pickLocalized(item.title, language) ?? "";
    const cardBody = document.createElement("p");
    cardBody.textContent = pickLocalized(item.body, language) ?? "";
    card.append(cardTitle, cardBody);
    highlights.append(card);
  }

  section.append(title, intro, baselineTitle, metrics, table, highlights);
  layout.main.append(section);
}

function openMetricDialog(insight: MetricInsight): void {
  const existing = document.querySelector("dialog.metric-dialog");
  existing?.remove();

  const dialog = document.createElement("dialog");
  dialog.className = "metric-dialog";
  dialog.ariaLabel = insight.title;
  const title = document.createElement("h2");
  title.textContent = insight.title;
  const body = document.createElement("p");
  body.textContent = insight.body;
  const actions = document.createElement("div");
  actions.className = "metric-dialog__actions";
  const source = document.createElement("a");
  source.className = "button-link button-link--primary";
  source.href = insight.sourceHref;
  source.target = "_blank";
  source.rel = "noreferrer";
  source.textContent = insight.sourceLabel;
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.addEventListener("click", () => dialog.close());
  actions.append(source, close);
  dialog.append(title, body, actions);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}

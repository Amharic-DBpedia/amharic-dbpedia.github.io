import { expect, test } from "@playwright/test";

const configuredBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5174";
const configuredBasePath = new URL(configuredBaseURL).pathname;

function appPath(path: string): string {
  const basePath = configuredBasePath.endsWith("/") ? configuredBasePath : `${configuredBasePath}/`;
  return basePath === "/" ? path : `${basePath}${path.replace(/^\//, "")}`;
}

test("renders chapter homepage and resource search", async ({ page }) => {
  await page.goto(appPath("/"));
  await expect(page.getByRole("heading", { name: "Amharic DBpedia Chapter" })).toBeVisible();
  await expect(page.getByLabel("Resource title or IRI")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest news" })).toBeVisible();
  await expect(page.locator(".news-item")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "News", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/AmharicDBpedia",
  );
});

test("renders a dedicated news destination from the primary navigation", async ({ page }) => {
  await page.goto(appPath("/"));
  await page.getByRole("link", { name: "News", exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`${appPath("/news")}$`));
  await expect(page.getByRole("heading", { name: "News and project updates" })).toBeVisible();
  await expect(page.getByText("Latest update")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Earlier updates" })).toBeVisible();
});

test("embeds Tentris inside the SPARQL page", async ({ page }) => {
  await page.goto(appPath("/sparql"));

  await expect(page.getByRole("heading", { name: "Tentris query workspace" })).toBeVisible();
  await expect(page.getByTitle("Amharic DBpedia Tentris query interface")).toHaveAttribute(
    "src",
    "https://am.dbpedia.data.dice-research.org/ui",
  );
});

test("renders the non-technical about page", async ({ page }) => {
  await page.goto(appPath("/about"));

  await expect(page.getByRole("heading", { name: "About Amharic DBpedia" })).toBeVisible();
  await expect(page.getByText("The idea in plain language")).toBeVisible();
  await expect(page.getByText("Why Amharic needs its own chapter")).toBeVisible();
});

test("renders static statistics with clickable definitions", async ({ page }) => {
  await page.goto(appPath("/statistics"));

  await expect(page.getByText("Latest generated extraction statistics")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "How to read these numbers" })).toHaveCount(0);
  await expect(page.getByText("97")).toBeVisible();
  await page.getByRole("button", { name: /97\s+Mapped templates/i }).click();
  await expect(page.getByRole("dialog", { name: "Mapped templates" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Amharic mappings" })).toHaveAttribute(
    "href",
    "https://mappings.dbpedia.org/index.php/Mapping_am",
  );
  await page.mouse.click(8, 8);
  await expect(page.getByRole("dialog", { name: "Mapped templates" })).toHaveCount(0);
  await page.getByRole("button", { name: /77.29%\s+Property coverage/i }).click();
  await expect(page.getByRole("link", { name: "Open DBpedia ontology example" })).toHaveAttribute(
    "href",
    "https://mappings.dbpedia.org/index.php/OntologyClass%3APerson",
  );
});

test("renders a dedicated resource landing page", async ({ page }) => {
  await page.goto(appPath("/resource"));

  await expect(page.getByRole("heading", { name: "Resource explorer" })).toBeVisible();
  await expect(page.getByLabel("Resource title or IRI")).toBeVisible();
  await expect(page.getByPlaceholder("ዳኛቸው ወርቁ")).toBeVisible();
  await expect(page.getByRole("link", { name: "አዲስ አበባ" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ደብረ ብርሃን" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ኢትዮጵያ" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ፓውል ሃርዲንግ" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ዳኛቸው ወርቁ" })).toBeVisible();
});

test("resource route keeps Amharic titles readable when endpoint has no triples", async ({
  page,
}) => {
  await page.route("**/sparql?**", async (route) => {
    await route.fulfill({
      contentType: "application/sparql-results+json",
      body: JSON.stringify({ head: { vars: ["predicate", "object"] }, results: { bindings: [] } }),
    });
  });

  await page.goto(appPath("/resource/ዳኛቸው ወርቁ"));

  await expect(
    page.getByRole("link", { name: "http://am.dbpedia.org/resource/ዳኛቸው_ወርቁ" }),
  ).toBeVisible();
  await expect(page.getByText("No triples returned")).toBeVisible();
  await expect(page.getByText("%25E1")).toHaveCount(0);
});

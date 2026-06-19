import { describe, expect, it } from "vitest";
import { appHref, appRoutePath } from "../app/paths";

describe("application paths", () => {
  it("prefixes internal links for a GitHub Pages project site", () => {
    expect(appHref("/news", "/website/")).toBe("/website/news");
    expect(appHref("/", "/website/")).toBe("/website/");
  });

  it("preserves external links", () => {
    expect(appHref("https://dbpedia.org", "/website/")).toBe("https://dbpedia.org");
  });

  it("removes the project base before route matching", () => {
    expect(appRoutePath("/website/resource/example", "/website/")).toBe("/resource/example");
    expect(appRoutePath("/website/", "/website/")).toBe("/");
    expect(appRoutePath("/other", "/website/")).toBeNull();
  });
});

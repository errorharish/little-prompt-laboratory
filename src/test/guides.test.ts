import { describe, expect, it } from "vitest";
import { GUIDES, NO_PAGE_GUIDE, pageGuide, type Guide } from "@/lib/eo/guides";
import { PAGES } from "@/lib/eo/registry";

const all = Object.entries(GUIDES) as [string, Guide][];

describe("Contextual optimization guides", () => {
  it("gives every optimization page a guide; only overview/info pages have none", () => {
    for (const p of PAGES) {
      const exempt = (NO_PAGE_GUIDE as readonly string[]).includes(p.slug);
      expect(pageGuide(p.slug) !== null, p.slug).toBe(!exempt);
    }
  });

  it("never treats a section guide id as a page guide", () => {
    expect(pageGuide("auto.tasks")).toBeNull();
    expect(pageGuide("system-info")).toBeNull();
    expect(pageGuide("auto-optimize")).toBe("auto-optimize");
  });

  it("explains what, why, how, when, benefit and limits for every guide", () => {
    for (const [id, g] of all) {
      for (const k of ["title", "what", "why", "how", "when", "benefit", "limits"] as const) {
        expect(g[k].trim().length, `${id}.${k}`).toBeGreaterThan(5);
      }
    }
  });

  it("never promises guaranteed or measured results", () => {
    const banned = /guarantee|100%|always faster|instantly|verified on this pc|boosts? fps by/i;
    for (const [id, g] of all) expect(JSON.stringify(g), id).not.toMatch(banned);
  });

  it("marks Recycle Bin emptying and storage cleanup as not reversible", () => {
    expect(GUIDES["storage.recycle"].reversible).toBe("No");
    expect(GUIDES["storage.clean"].reversible).toBe("No");
  });

  it("states browser cleanup is cache-only in the Auto Optimize guides", () => {
    expect(GUIDES["auto-optimize"].limits).toMatch(/cache only/i);
    expect(GUIDES["auto.tasks"].limits).toMatch(/cache only/i);
  });
});

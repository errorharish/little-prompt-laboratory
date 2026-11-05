import { describe, expect, it } from "vitest";
import {
  INPUT_OPTIONS,
  isEditableMode,
  optionsFor,
  parseMode,
  recommendedFor,
} from "@/lib/eo/inputModes";
import { eligibleSelection, isDefaultEligible } from "@/lib/eo/selection";

describe("Input Optimizer modes", () => {
  it("Normal selects every applicable, recommended normal item only", () => {
    expect([...recommendedFor("NORMAL")].sort()).toEqual(
      ["hover-time", "kb-repeat-delay", "kb-repeat-rate"].sort(),
    );
  });

  it("Advanced adds recommended advanced items but never high-risk, incompatible or applied ones", () => {
    const adv = recommendedFor("ADVANCED");
    for (const id of recommendedFor("NORMAL")) expect(adv.has(id)).toBe(true);
    expect(adv.has("kb-queue")).toBe(true);
    expect(adv.has("timer-request")).toBe(true);
    expect(adv.has("usb-suspend")).toBe(true);
    expect(adv.has("timer-lock")).toBe(false);
    expect(adv.has("pen-feedback")).toBe(false);
    expect(adv.has("mouse-queue")).toBe(false);
  });

  it("Normal shows normal items only; Advanced and Custom show both groups", () => {
    expect(optionsFor("NORMAL").every((o) => o.tier === "normal")).toBe(true);
    expect(optionsFor("ADVANCED").length).toBe(INPUT_OPTIONS.length);
    expect(optionsFor("CUSTOM").length).toBe(INPUT_OPTIONS.length);
  });

  it("only Custom is editable", () => {
    expect(isEditableMode("NORMAL")).toBe(false);
    expect(isEditableMode("ADVANCED")).toBe(false);
    expect(isEditableMode("CUSTOM")).toBe(true);
  });

  it("falls back to Normal for unknown saved modes", () => {
    expect(parseMode("ADVANCED")).toBe("ADVANCED");
    expect(parseMode("bogus")).toBe("NORMAL");
    expect(parseMode(null)).toBe("NORMAL");
  });
});

describe("Global default: applicable + recommended", () => {
  it("never auto-selects not-recommended or incompatible items", () => {
    expect(isDefaultEligible({ id: "a", risk: "LOW", recommended: false })).toBe(false);
    expect(isDefaultEligible({ id: "b", risk: "LOW", incompatible: true })).toBe(false);
    expect(isDefaultEligible({ id: "c", risk: "LOW" })).toBe(true);
    expect([
      ...eligibleSelection([
        { id: "x", risk: "SAFE" },
        { id: "y", risk: "MEDIUM", recommended: false },
        { id: "z", risk: "LOW", incompatible: true },
      ]),
    ]).toEqual(["x"]);
  });
});

import { describe, expect, it } from "vitest";
import {
  resolveTelegramAutoSelectFamilyDecision,
  resolveTelegramForceCurlDecision,
} from "./network-config.js";

describe("resolveTelegramAutoSelectFamilyDecision", () => {
  it("prefers env enable over env disable", () => {
    const decision = resolveTelegramAutoSelectFamilyDecision({
      env: {
        OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY: "1",
        OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY: "1",
      },
      nodeMajor: 22,
    });
    expect(decision).toEqual({
      value: true,
      source: "env:OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY",
    });
  });

  it("uses env disable when set", () => {
    const decision = resolveTelegramAutoSelectFamilyDecision({
      env: { OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY: "1" },
      nodeMajor: 22,
    });
    expect(decision).toEqual({
      value: false,
      source: "env:OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY",
    });
  });

  it("prefers env enable over config", () => {
    const decision = resolveTelegramAutoSelectFamilyDecision({
      env: { OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY: "1" },
      network: { autoSelectFamily: false },
      nodeMajor: 22,
    });
    expect(decision).toEqual({
      value: true,
      source: "env:OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY",
    });
  });

  it("prefers env disable over config", () => {
    const decision = resolveTelegramAutoSelectFamilyDecision({
      env: { OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY: "1" },
      network: { autoSelectFamily: true },
      nodeMajor: 22,
    });
    expect(decision).toEqual({
      value: false,
      source: "env:OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY",
    });
  });

  it("uses config override when provided", () => {
    const decision = resolveTelegramAutoSelectFamilyDecision({
      env: {},
      network: { autoSelectFamily: true },
      nodeMajor: 22,
    });
    expect(decision).toEqual({ value: true, source: "config" });
  });

  it("defaults to enable on Node 22", () => {
    const decision = resolveTelegramAutoSelectFamilyDecision({ env: {}, nodeMajor: 22 });
    expect(decision).toEqual({ value: true, source: "default-node22" });
  });

  it("returns null when no decision applies", () => {
    const decision = resolveTelegramAutoSelectFamilyDecision({ env: {}, nodeMajor: 20 });
    expect(decision).toEqual({ value: null });
  });
});

describe("resolveTelegramForceCurlDecision", () => {
  it("prefers env force over env disable", () => {
    const decision = resolveTelegramForceCurlDecision({
      env: {
        OPENCLAW_TELEGRAM_FORCE_CURL: "1",
        OPENCLAW_TELEGRAM_DISABLE_CURL: "1",
      },
    });
    expect(decision).toEqual({
      value: true,
      source: "env:OPENCLAW_TELEGRAM_FORCE_CURL",
    });
  });

  it("uses env disable when set", () => {
    const decision = resolveTelegramForceCurlDecision({
      env: { OPENCLAW_TELEGRAM_DISABLE_CURL: "1" },
    });
    expect(decision).toEqual({
      value: false,
      source: "env:OPENCLAW_TELEGRAM_DISABLE_CURL",
    });
  });

  it("uses config when provided", () => {
    const decision = resolveTelegramForceCurlDecision({
      env: {},
      network: { forceCurl: true },
    });
    expect(decision).toEqual({ value: true, source: "config" });
  });

  it("defaults to disabled", () => {
    const decision = resolveTelegramForceCurlDecision({ env: {} });
    expect(decision).toEqual({ value: false, source: "default" });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "../_core/context";

const dbMock = vi.hoisted(() => ({
  assignPortfolioAssetSlot: vi.fn(),
  createPortfolioAsset: vi.fn(),
  getActivePortfolioAssets: vi.fn(),
  listPortfolioAssets: vi.fn(),
}));
const storageMock = vi.hoisted(() => ({ storagePut: vi.fn() }));

vi.mock("../db", () => dbMock);
vi.mock("../storage", () => storageMock);

import { assetsRouter } from "./assets";

function context(role: "admin" | "user" | null): TrpcContext {
  return {
    user: role ? {
      id: 7,
      openId: "owner-open-id",
      name: "Portfolio Owner",
      email: "owner@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } : null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("assetsRouter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("exposes only the latest asset per public portfolio slot", async () => {
    dbMock.getActivePortfolioAssets.mockResolvedValue([
      { id: 2, slot: "hero", url: "/manus-storage/new-hero.webp" },
      { id: 1, slot: "hero", url: "/manus-storage/old-hero.webp" },
      { id: 3, slot: "projects", url: "/manus-storage/projects.webp" },
    ]);

    const result = await assetsRouter.createCaller(context(null)).currentSlots();

    expect(result.hero.url).toBe("/manus-storage/new-hero.webp");
    expect(result.projects.url).toBe("/manus-storage/projects.webp");
  });

  it("rejects asset-library access for a non-owner", async () => {
    await expect(assetsRouter.createCaller(context("user")).listMine()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("stores an allowed image in the owner's namespace", async () => {
    storageMock.storagePut.mockResolvedValue({ key: "portfolio-assets/7/hero_a1.webp", url: "/manus-storage/hero_a1.webp" });
    dbMock.createPortfolioAsset.mockResolvedValue({ id: 9, slot: "hero", url: "/manus-storage/hero_a1.webp" });

    const result = await assetsRouter.createCaller(context("admin")).upload({
      label: "Hero portrait",
      slot: "hero",
      fileName: "hero portrait.webp",
      mimeType: "image/webp",
      dataBase64: Buffer.from("image-binary").toString("base64"),
    });

    expect(storageMock.storagePut).toHaveBeenCalledWith(expect.stringContaining("portfolio-assets/7/"), expect.any(Buffer), "image/webp");
    expect(result.url).toBe("/manus-storage/hero_a1.webp");
  });

  it("assigns a stored asset to an owner-scoped portfolio slot", async () => {
    dbMock.assignPortfolioAssetSlot.mockResolvedValue({ id: 14, slot: "skills", url: "/manus-storage/skills.webp" });

    const result = await assetsRouter.createCaller(context("admin")).assignSlot({ assetId: 14, slot: "skills" });

    expect(dbMock.assignPortfolioAssetSlot).toHaveBeenCalledWith(7, 14, "skills");
    expect(result.slot).toBe("skills");
  });
});

import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { assignPortfolioAssetSlot, createPortfolioAsset, getActivePortfolioAssets, listPortfolioAssets } from "../db";
import { portfolioSlotValues } from "../../drizzle/schema";
import { storagePut } from "../storage";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export const assetsRouter = router({
  listMine: adminProcedure.query(({ ctx }) => listPortfolioAssets(ctx.user.id)),
  currentSlots: publicProcedure.query(async () => {
    const assets = await getActivePortfolioAssets();
    const assigned = new Map<string, (typeof assets)[number]>();
    for (const asset of assets) {
      if (!assigned.has(asset.slot)) assigned.set(asset.slot, asset);
    }
    return Object.fromEntries(assigned);
  }),
  upload: adminProcedure.input(z.object({
    label: z.string().trim().min(2).max(140),
    slot: z.enum(portfolioSlotValues),
    fileName: z.string().trim().min(1).max(255),
    mimeType: z.enum(allowedMimeTypes),
    dataBase64: z.string().min(1).max(8_500_000),
  })).mutation(async ({ ctx, input }) => {
    const buffer = Buffer.from(input.dataBase64, "base64");
    if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
      throw new Error("Image must be between 1 byte and 6 MB");
    }
    const safeFileName = sanitizeFileName(input.fileName);
    const { key, url } = await storagePut(`portfolio-assets/${ctx.user.id}/${Date.now()}-${safeFileName}`, buffer, input.mimeType);
    return createPortfolioAsset({
      ownerId: ctx.user.id,
      label: input.label,
      fileName: safeFileName,
      fileKey: key,
      url,
      mimeType: input.mimeType,
      byteSize: buffer.length,
      slot: input.slot,
    });
  }),
  assignSlot: adminProcedure.input(z.object({
    assetId: z.number().int().positive(),
    slot: z.enum(portfolioSlotValues),
  })).mutation(({ ctx, input }) => assignPortfolioAssetSlot(ctx.user.id, input.assetId, input.slot)),
});

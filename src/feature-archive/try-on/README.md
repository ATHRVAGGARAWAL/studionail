This folder stores the paused try-on and fit-guidance feature so it can be restored later.

Archived pieces:
- `FitQuizModal.tsx`
- `NailPreviewOverlay.tsx`
- `TryOnHandCanvas.tsx`
- `TryOnStudioModal.tsx`
- `productGuidance.ts`

To re-enable later:
- move these files back into the active `src/components` and `src/lib` folders, or update imports to point here
- reattach the shop and quick-shop UI entry points
- reintroduce the optional admin metadata inputs if needed

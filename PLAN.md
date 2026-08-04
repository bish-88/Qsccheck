# Implementation Plan

1. Keep the existing Next.js App Router / TypeScript / Tailwind / IndexedDB PWA foundation.
2. Replace the seed inspection master with the requested 33-question structure:
   - コンプライアンス 3 questions, 9 points, clearly marked as placeholders.
   - Q：売場 10 questions, 37 points.
   - S：接客 6 questions, 26 points.
   - C：清掃 14 questions, 28 points.
3. Make questions data-driven with per-question score options instead of hardcoded OK/NG scoring.
4. Update the inspection flow to show category/dashboard status, numeric score buttons, autosave, and auto-next.
5. Add final comment and touch/mouse signature support before report generation.
6. Update the report to show company/group, score totals, 1-33 score grid, photos, comment, and signature.
7. Keep admin editing/import/export in the existing item-management screen and preserve JSON support.
8. Validate with unit tests and `npm run build`.

import { revalidatePath } from "next/cache";
import { after } from "next/server";

/** Next.js forbids `revalidatePath` during RSC render; defer to after the response (e.g. sync during page load). */
export function revalidatePathsAfterResponse(paths: readonly string[]) {
  const deduped = [...new Set(paths.filter(Boolean))];
  if (deduped.length === 0) return;
  after(() => {
    for (const p of deduped) {
      revalidatePath(p);
    }
  });
}

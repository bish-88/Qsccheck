"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { categoryLabels } from "@/types/inspection";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingState from "@/components/LoadingState";
import ReviewSummary from "@/components/ReviewSummary";
import SignaturePad from "@/components/SignaturePad";
import { useInspection } from "@/hooks/useInspection";
import { useInspectionIdFromLocation } from "@/hooks/useInspectionIdFromLocation";
import { inspectionRepository } from "@/lib/db/inspectionRepository";
import { getReviewCounts } from "@/lib/validation/inspectionValidation";
import { inspectionPath, inspectionReportPath } from "@/lib/utils/routes";

export default function ReviewPage() {
  const { id } = useInspectionIdFromLocation();
  const router = useRouter();
  const { inspection, setInspection, loading, error } = useInspection(id);
  if (loading || !id) return <LoadingState />;
  if (error || !inspection) return <ErrorMessage message={error || "巡回データが見つかりません。"} />;
  const complete = async () => {
    const counts = getReviewCounts(inspection);
    if ((counts.empty > 0 || counts.ngMissingPhoto > 0) && !window.confirm("未入力または写真未登録のNGがあります。巡回を完了しますか？")) return;
    const now = new Date().toISOString();
    await inspectionRepository.save({ ...inspection, status: "completed", completedAt: now, submittedAt: now, signedAt: inspection.signatureDataUrl ? now : undefined });
    router.push(inspectionReportPath(inspection.id));
  };
  const updateInspection = async (patch: Partial<typeof inspection>) => {
    const next = { ...inspection, ...patch, updatedAt: new Date().toISOString() };
    setInspection(next);
    await inspectionRepository.save(next);
  };
  const ngAnswers = inspection.answers.filter((answer) => answer.result === "ng").sort((a, b) => a.itemNumber - b.itemNumber);
  return (
    <main className="min-h-dvh bg-slate-100 pb-24">
      <AppHeader title="巡回終了前確認" backHref={inspectionPath(id)} />
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <ReviewSummary inspection={inspection} />
        <section className="rounded-2xl bg-white p-4 shadow-soft">
          <h2 className="font-black text-slate-900">NG項目まとめ</h2>
          {ngAnswers.length ? (
            <div className="mt-3 space-y-2">
              {ngAnswers.map((answer) => (
                <Link key={answer.id} href={inspectionPath(inspection.id, inspection.answers.findIndex((item) => item.id === answer.id))} className="block rounded-2xl border border-red-100 bg-red-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-red-700">× NG　{categoryLabels[answer.category]}　No.{answer.itemNumber}</p>
                      <p className="mt-1 font-black text-slate-950">{answer.code}　{answer.title}</p>
                    </div>
                    <p className="shrink-0 text-lg font-black text-red-700">0点</p>
                  </div>
                  {answer.failedCriteria && answer.failedCriteria.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm font-bold text-red-800">
                      {answer.failedCriteria.map((criterion) => <li key={criterion}>× {criterion}</li>)}
                    </ul>
                  )}
                  {(answer.problemLocation || answer.currentCondition || answer.comment) && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{[answer.problemLocation, answer.currentCondition, answer.comment].filter(Boolean).join("\n")}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-center font-black text-emerald-700">NG項目はありません。</p>
          )}
        </section>
        <SignaturePad value={inspection.signatureDataUrl} onChange={(signatureDataUrl) => updateInspection({ signatureDataUrl })} />
        <button type="button" className="btn-primary w-full justify-center" onClick={complete}>巡回を完了する</button>
        <Link href={inspectionReportPath(id)} className="btn-secondary w-full justify-center">結果報告書を作成する</Link>
        <Link href={inspectionPath(id)} className="btn-secondary w-full justify-center">入力内容を修正</Link>
      </section>
    </main>
  );
}

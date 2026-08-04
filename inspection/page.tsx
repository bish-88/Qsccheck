"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardList, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AutoSaveStatus from "@/components/AutoSaveStatus";
import ErrorMessage from "@/components/ErrorMessage";
import InspectionItemCard from "@/components/InspectionItemCard";
import InspectionProgress from "@/components/InspectionProgress";
import LoadingState from "@/components/LoadingState";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useInspection } from "@/hooks/useInspection";
import { useInspectionIdFromLocation } from "@/hooks/useInspectionIdFromLocation";
import { inspectionRepository } from "@/lib/db/inspectionRepository";
import { canMoveNext } from "@/lib/validation/inspectionValidation";
import { inspectionItemsPath, inspectionReportPath, inspectionReviewPath } from "@/lib/utils/routes";

export default function InspectionPage() {
  const { id, item } = useInspectionIdFromLocation();
  const router = useRouter();
  const { inspection, setInspection, loading, error } = useInspection(id);
  const [index, setIndex] = useState(item);
  const save = useCallback((next: NonNullable<typeof inspection>) => inspectionRepository.save(next), []);
  const status = useAutoSave(inspection, save, 550);

  useEffect(() => setIndex(item), [item]);

  useEffect(() => {
    if (inspection && index !== inspection.currentItemIndex) {
      setInspection({ ...inspection, currentItemIndex: index });
    }
  }, [index]);

  useEffect(() => {
    if (inspection?.status === "completed") router.replace(inspectionReportPath(inspection.id));
  }, [inspection?.status, inspection?.id, router]);

  const answer = useMemo(() => inspection?.answers[index], [inspection, index]);
  if (loading || !id) return <LoadingState />;
  if (error || !inspection || !answer) return <main className="p-4"><ErrorMessage message={error || "項目が見つかりません。"} /></main>;
  if (inspection.status === "completed") return <LoadingState />;

  const updateAnswer = (nextAnswer: typeof answer) => {
    const nextAnswers = inspection.answers.map((itemAnswer, itemIndex) => (itemIndex === index ? nextAnswer : itemAnswer));
    setInspection({ ...inspection, answers: nextAnswers, currentItemIndex: index, updatedAt: new Date().toISOString() });
  };

  const saveAndAdvance = async (nextAnswer: typeof answer) => {
    const nextIndex = index >= inspection.answers.length - 1 ? index : index + 1;
    const nextAnswers = inspection.answers.map((itemAnswer, itemIndex) => (itemIndex === index ? nextAnswer : itemAnswer));
    const nextInspection = { ...inspection, answers: nextAnswers, currentItemIndex: nextIndex, updatedAt: new Date().toISOString() };
    setInspection(nextInspection);
    await inspectionRepository.save(nextInspection);
    if (localStorage.getItem("audit-auto-next") === "off") return;
    if (index >= inspection.answers.length - 1) router.push(inspectionReviewPath(inspection.id));
    else setIndex(nextIndex);
  };

  return (
    <main className="min-h-dvh bg-slate-100 pb-32">
      <InspectionProgress inspection={inspection} index={index} />
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <div className="flex items-center justify-between"><AutoSaveStatus status={status} /><Link href={inspectionItemsPath(id)} className="text-sm font-black text-blue-700">項目一覧</Link></div>
        <InspectionItemCard answer={answer} onChange={updateAnswer} onResultSelected={saveAndAdvance} />
      </section>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] gap-2">
          <button type="button" className="btn-secondary justify-center" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>前の項目</button>
          <Link href={inspectionItemsPath(id)} className="grid size-14 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700" aria-label="項目一覧"><ClipboardList size={22} /></Link>
          <button type="button" className="btn-primary justify-center" onClick={async () => {
            const validation = canMoveNext(answer);
            if (!validation.ok && !window.confirm(`${validation.message}\nこのまま保存しますか？`)) return;
            await inspectionRepository.save(inspection);
          }}><Save size={18} />一時保存</button>
        </div>
      </div>
    </main>
  );
}

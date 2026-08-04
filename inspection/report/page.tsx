"use client";

import Link from "next/link";
import { Download, Printer, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingState from "@/components/LoadingState";
import ReportPreview from "@/components/ReportPreview";
import { useInspection } from "@/hooks/useInspection";
import { useInspectionIdFromLocation } from "@/hooks/useInspectionIdFromLocation";
import { exportToImage } from "@/lib/reports/exportToImage";
import { printReport } from "@/lib/reports/printReport";
import { shareReport } from "@/lib/reports/shareReport";
import { inspectionPath } from "@/lib/utils/routes";
import { ImageSplitMode } from "@/types/inspection";

export default function ReportPage() {
  const { id } = useInspectionIdFromLocation();
  const { inspection, loading, error } = useInspection(id);
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ImageSplitMode>("single");
  const [message, setMessage] = useState("");
  if (loading || !id) return <LoadingState />;
  if (error || !inspection) return <ErrorMessage message={error || "巡回データが見つかりません。"} />;
  const filename = `QSC結果報告_${inspection.storeName}`;
  return (
    <main className="min-h-dvh bg-slate-100 print:bg-white">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
          <Link href={inspectionPath(id)} className="btn-secondary">編集へ戻る</Link>
          <button type="button" className="btn-secondary" onClick={printReport}><Printer size={18} />印刷・PDF保存</button>
          <select className="field mt-0 w-auto min-h-11" value={mode} onChange={(event) => setMode(event.target.value as ImageSplitMode)}>
            <option value="single">1枚の縦長画像</option>
            <option value="byItem">NG・要改善項目ごと</option>
            <option value="byPage">ページ単位</option>
          </select>
          <button type="button" className="btn-secondary" onClick={() => ref.current && exportToImage(ref.current, mode, filename)}><Download size={18} />画像として保存</button>
          <button type="button" className="btn-primary" onClick={async () => {
            if (!ref.current) return;
            const shared = await shareReport(ref.current, filename);
            setMessage(shared ? "共有しました" : "この端末では共有できません。画像保存を使用してください。");
          }}><Share2 size={18} />共有</button>
        </div>
        {message && <p className="mx-auto mt-2 max-w-3xl text-xs font-bold text-slate-500">{message}</p>}
      </div>
      <div ref={ref}>
        <ReportPreview inspection={inspection} />
      </div>
    </main>
  );
}

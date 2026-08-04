"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import EmptyState from "@/components/EmptyState";
import { inspectionRepository } from "@/lib/db/inspectionRepository";
import { calculateTotalScore } from "@/lib/scoring/calculateScore";
import { inspectionPath, inspectionReportPath } from "@/lib/utils/routes";
import { getReviewCounts } from "@/lib/validation/inspectionValidation";
import { Inspection } from "@/types/inspection";

export default function HistoryPage() {
  const [items, setItems] = useState<Inspection[]>([]);
  const [query, setQuery] = useState("");
  const load = () => inspectionRepository.list().then(setItems);
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => items.filter((item) => `${item.storeName} ${item.inspectorName} ${item.inspectionDate}`.includes(query)), [items, query]);
  const storeAverages = useMemo(() => {
    const grouped = new Map<string, number[]>();
    filtered.forEach((inspection) => {
      const total = calculateTotalScore(inspection.answers, inspection.uncheckedMode).convertedScore;
      grouped.set(inspection.storeName, [...(grouped.get(inspection.storeName) || []), total]);
    });
    return Array.from(grouped.entries()).map(([store, scores]) => ({ store, average: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) }));
  }, [filtered]);
  const zeroQuestions = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((inspection) => inspection.answers.filter((answer) => answer.result && answer.score === 0).forEach((answer) => counts.set(`${answer.code} ${answer.title}`, (counts.get(`${answer.code} ${answer.title}`) || 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filtered]);
  const exportCsv = () => {
    const rows = [["store", "date", "inspector", "score", "rank", "status"], ...filtered.map((inspection) => {
      const total = calculateTotalScore(inspection.answers, inspection.uncheckedMode);
      return [inspection.storeName, inspection.inspectionDate, inspection.inspectorName, String(total.convertedScore), total.rank, inspection.status];
    })];
    const blob = new Blob([rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "store-audit-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <main className="min-h-dvh bg-slate-100 pb-24">
      <AppHeader title="過去の巡回一覧" backHref="/" />
      <section className="mx-auto max-w-2xl space-y-3 px-4 py-5">
        <input className="field" placeholder="店舗名・日付・担当者で検索" value={query} onChange={(event) => setQuery(event.target.value)} />
        <button type="button" className="btn-secondary w-full justify-center" onClick={exportCsv}>CSVを書き出す</button>
        {(storeAverages.length > 0 || zeroQuestions.length > 0) && (
          <section className="rounded-2xl bg-white p-4 shadow-soft">
            <h2 className="font-black text-slate-950">簡易分析</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm font-black text-slate-600">店舗別平均点</p>
                {storeAverages.map((item) => <p key={item.store} className="mt-1 text-sm font-bold">{item.store}: {item.average}点</p>)}
              </div>
              <div>
                <p className="text-sm font-black text-slate-600">0点が多い項目</p>
                {zeroQuestions.map(([label, count]) => <p key={label} className="mt-1 text-sm font-bold">{label}: {count}回</p>)}
              </div>
            </div>
          </section>
        )}
        {!filtered.length && <EmptyState title="巡回履歴がありません" />}
        {filtered.map((inspection) => {
          const total = calculateTotalScore(inspection.answers, inspection.uncheckedMode);
          const counts = getReviewCounts(inspection);
          return (
            <article key={inspection.id} className="rounded-2xl bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-950">{inspection.storeName}</h2>
                  <p className="text-sm font-bold text-slate-500">{inspection.inspectionDate}　{inspection.inspectorName}</p>
                  <p className="mt-1 text-sm font-black text-blue-700">{total.convertedScore}点 / {total.rank}　OK {counts.ok}・要改善 {counts.improvement}・NG {counts.ng}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${inspection.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{inspection.status === "completed" ? "完了" : "下書き"}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link className="btn-secondary justify-center" href={inspectionPath(inspection.id)}>再開・詳細</Link>
                <Link className="btn-secondary justify-center" href={inspectionReportPath(inspection.id)}>報告書</Link>
                <button type="button" className="btn-secondary justify-center" onClick={async () => { const copy = await inspectionRepository.duplicate(inspection); location.href = inspectionPath(copy.id); }}>複製</button>
                <button type="button" className="btn-danger justify-center" onClick={async () => { if (confirm("巡回データを削除しますか？")) { await inspectionRepository.delete(inspection.id); load(); } }}>削除</button>
              </div>
            </article>
          );
        })}
      </section>
      <BottomNavigation />
    </main>
  );
}

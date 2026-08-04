"use client";

import { useEffect, useRef, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { categoryLabels, InspectionCategory, InspectionItem } from "@/types/inspection";
import { itemRepository } from "@/lib/db/itemRepository";
import { createId } from "@/lib/utils/id";

const categories = Object.keys(categoryLabels) as InspectionCategory[];

const createItem = (): InspectionItem => ({
  id: createId("item"),
  itemNumber: 1,
  code: "NEW",
  category: "cleaning",
  title: "",
  checkPoint: "",
  evaluationCriteria: "",
  criteria: [],
  rule: "",
  maxScore: 2,
  scoreOptions: [2, 0],
  sortOrder: 999,
  isActive: true,
  defaultImprovementAction: "",
});

export default function ItemsPage() {
  const [items, setItems] = useState<InspectionItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const load = () => itemRepository.list(true).then(setItems);
  useEffect(() => { load(); }, []);
  const saveItem = async (item: InspectionItem) => { await itemRepository.save(item); load(); };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qsc-items.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  const importJson = async (file?: File) => {
    if (!file) return;
    const json = JSON.parse(await file.text()) as InspectionItem[];
    await itemRepository.importItems(json);
    load();
  };
  return (
    <main className="min-h-dvh bg-slate-100 pb-24">
      <AppHeader title="チェック項目管理" backHref="/" />
      <section className="mx-auto max-w-3xl space-y-3 px-4 py-5">
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-primary justify-center" onClick={() => setItems([createItem(), ...items])}>項目を追加</button>
          <button className="btn-secondary justify-center" onClick={exportJson}>JSON書き出し</button>
          <button className="btn-secondary justify-center" onClick={() => fileRef.current?.click()}>JSON読み込み</button>
          <button className="btn-danger justify-center" onClick={async () => { if (confirm("初期状態へ戻しますか？")) { await itemRepository.reset(); load(); } }}>初期状態へ戻す</button>
          <input ref={fileRef} className="hidden" type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0])} />
        </div>
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-4 shadow-soft">
            <div className="grid grid-cols-2 gap-2">
              <input className="field" type="number" value={item.itemNumber} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, itemNumber: Number(event.target.value) } : next))} placeholder="項目番号" />
              <input className="field" value={item.code} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, code: event.target.value } : next))} placeholder="コード" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select className="field" value={item.category} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, category: event.target.value as InspectionCategory } : next))}>
                {categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
              </select>
              <input className="field" type="number" value={item.sortOrder} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, sortOrder: Number(event.target.value) } : next))} placeholder="表示順" />
            </div>
            <input className="field" value={item.title} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, title: event.target.value } : next))} placeholder="項目名" />
            <textarea className="field min-h-24" value={item.checkPoint} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, checkPoint: event.target.value } : next))} placeholder="確認ポイント" />
            <textarea className="field min-h-20" value={item.evaluationCriteria} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, evaluationCriteria: event.target.value } : next))} placeholder="評価基準" />
            <textarea className="field min-h-20" value={item.criteria?.join("\n") || ""} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, criteria: event.target.value.split("\n").filter(Boolean), evaluationCriteria: event.target.value } : next))} placeholder="詳細基準（1行1基準）" />
            <input className="field" value={item.rule || ""} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, rule: event.target.value } : next))} placeholder="出来栄え基準・採点ルール" />
            <input className="field" type="number" value={item.maxScore} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, maxScore: Number(event.target.value) } : next))} placeholder="満点" />
            <input className="field" value={item.scoreOptions.join(",")} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, scoreOptions: event.target.value.split(",").map((score) => Number(score.trim())).filter((score) => Number.isFinite(score)) } : next))} placeholder="採点選択肢 例：4,2,0" />
            <textarea className="field min-h-24" value={item.defaultImprovementAction || ""} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, defaultImprovementAction: event.target.value } : next))} placeholder="初期改善策" />
            <label className="mt-3 flex min-h-11 items-center gap-2 font-bold"><input type="checkbox" checked={item.isActive} onChange={(event) => setItems(items.map((next) => next.id === item.id ? { ...next, isActive: event.target.checked } : next))} />有効</label>
            <button className="btn-secondary mt-3 w-full justify-center" onClick={() => saveItem(item)}>保存</button>
          </article>
        ))}
      </section>
      <BottomNavigation />
    </main>
  );
}

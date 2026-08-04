"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { clearStore } from "@/lib/db/database";

export default function SettingsPage() {
  const [uncheckedMode, setUncheckedMode] = useState("exclude");
  const [autoNext, setAutoNext] = useState("on");
  useEffect(() => {
    setUncheckedMode(localStorage.getItem("qsc-unchecked-mode") || "exclude");
    setAutoNext(localStorage.getItem("audit-auto-next") || "on");
  }, []);
  return (
    <main className="min-h-dvh bg-slate-100 pb-24">
      <AppHeader title="設定" backHref="/" />
      <section className="mx-auto max-w-md space-y-4 px-4 py-5">
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <h2 className="font-black">未確認項目の点数計算</h2>
          <select className="field" value={uncheckedMode} onChange={(event) => { setUncheckedMode(event.target.value); localStorage.setItem("qsc-unchecked-mode", event.target.value); }}>
            <option value="exclude">点数計算から除外</option>
            <option value="zero">0点として扱う</option>
          </select>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <h2 className="font-black">採点後の自動移動</h2>
          <select className="field" value={autoNext} onChange={(event) => { setAutoNext(event.target.value); localStorage.setItem("audit-auto-next", event.target.value); }}>
            <option value="on">オン：スコア選択後に次の質問へ進む</option>
            <option value="off">オフ：スコア選択後も同じ質問に残る</option>
          </select>
        </div>
        <button className="btn-danger w-full justify-center" onClick={async () => {
          if (!confirm("全データを削除しますか？")) return;
          await Promise.all([clearStore("inspections"), clearStore("stores"), clearStore("items")]);
          location.href = "/";
        }}>全データ削除</button>
      </section>
      <BottomNavigation />
    </main>
  );
}

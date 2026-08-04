"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { storeRepository } from "@/lib/db/storeRepository";
import { Store } from "@/types/inspection";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const load = () => storeRepository.list().then(setStores);
  useEffect(() => { load(); }, []);
  return (
    <main className="min-h-dvh bg-slate-100 pb-24">
      <AppHeader title="店舗管理" backHref="/" />
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <h2 className="font-black">店舗を追加</h2>
          <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="店舗名" />
          <input className="field" value={code} onChange={(event) => setCode(event.target.value)} placeholder="店舗コード" />
          <button className="btn-primary mt-3 w-full justify-center" onClick={async () => { if (name) { await storeRepository.create(name, code); setName(""); setCode(""); load(); } }}>追加</button>
        </div>
        {stores.map((store) => (
          <article key={store.id} className="rounded-2xl bg-white p-4 shadow-soft">
            <input className="field" value={store.name} onChange={(event) => setStores(stores.map((item) => item.id === store.id ? { ...item, name: event.target.value } : item))} />
            <input className="field" value={store.code || ""} onChange={(event) => setStores(stores.map((item) => item.id === store.id ? { ...item, code: event.target.value } : item))} />
            <label className="mt-3 flex min-h-11 items-center gap-2 font-bold"><input type="checkbox" checked={store.isActive} onChange={(event) => setStores(stores.map((item) => item.id === store.id ? { ...item, isActive: event.target.checked } : item))} />有効</label>
            <button className="btn-secondary mt-3 w-full justify-center" onClick={async () => { await storeRepository.save(store); load(); }}>保存</button>
          </article>
        ))}
      </section>
      <BottomNavigation />
    </main>
  );
}

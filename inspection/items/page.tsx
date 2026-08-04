"use client";

import AppHeader from "@/components/AppHeader";
import InspectionItemList from "@/components/InspectionItemList";
import LoadingState from "@/components/LoadingState";
import ErrorMessage from "@/components/ErrorMessage";
import { useInspection } from "@/hooks/useInspection";
import { useInspectionIdFromLocation } from "@/hooks/useInspectionIdFromLocation";
import { inspectionPath } from "@/lib/utils/routes";

export default function ItemsPage() {
  const { id } = useInspectionIdFromLocation();
  const { inspection, loading, error } = useInspection(id);
  if (loading || !id) return <LoadingState />;
  return (
    <main className="min-h-dvh bg-slate-100 pb-8">
      <AppHeader title="全項目一覧" backHref={inspectionPath(id)} />
      <section className="mx-auto max-w-2xl px-4 py-5">
        {error || !inspection ? <ErrorMessage message={error || "巡回データが見つかりません。"} /> : <InspectionItemList inspection={inspection} />}
      </section>
    </main>
  );
}

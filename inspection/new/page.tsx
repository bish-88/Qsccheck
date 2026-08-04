"use client";

import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import InspectionStartForm from "@/components/InspectionStartForm";
import OfflineBanner from "@/components/OfflineBanner";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import LoadingState from "@/components/LoadingState";
import ErrorMessage from "@/components/ErrorMessage";

export default function NewInspectionPage() {
  const { ready, error } = useIndexedDB();
  return (
    <main className="min-h-dvh bg-slate-100 pb-24">
      <OfflineBanner />
      <AppHeader title="新しい巡回を開始" backHref="/" />
      <section className="mx-auto max-w-md px-4 py-5">
        {error && <ErrorMessage message={error} />}
        {!ready ? <LoadingState /> : <InspectionStartForm />}
      </section>
      <BottomNavigation />
    </main>
  );
}

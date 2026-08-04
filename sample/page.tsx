import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import ReportPreview from "@/components/ReportPreview";
import { sampleInspection } from "@/data/sampleInspection";

export default function SamplePage() {
  return (
    <main className="min-h-dvh bg-slate-100 pb-8">
      <AppHeader title="サンプル結果報告" backHref="/" />
      <div className="mx-auto max-w-[760px] px-3 py-4 sm:px-6">
        <div className="mb-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-soft">
          <p className="text-sm font-bold text-slate-600">GitHub Pagesで確認できる見本ページです。</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link href="/inspection/new" className="flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-4 font-black text-white">
              新しい巡回を作成
            </Link>
            <Link href="/" className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 font-black text-slate-700">
              ホームへ戻る
            </Link>
          </div>
        </div>
      </div>
      <ReportPreview inspection={sampleInspection} />
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import WorksheetPreview from "@/components/WorksheetPreview";
import type { Difficulty, Worksheet } from "@/lib/types";

const grades = Array.from({ length: 10 }, (_, i) => `الصف ${i + 1}`);

const subjects = [
  "اللغة العربية",
  "الرياضيات",
  "العلوم",
  "الدراسات الاجتماعية",
  "التربية الإسلامية",
  "اللغة الإنجليزية",
  "مهارات تقنية/حاسوب",
  "مهارات حياتية",
];

const counts = [5, 10, 15, 20];

export default function Page() {
  const [grade, setGrade] = useState<string>("الصف 3");
  const [subject, setSubject] = useState<string>("اللغة العربية");
  const [topic, setTopic] = useState<string>("");
  const [count, setCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("متوسط");
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Worksheet | null>(null);
  const [error, setError] = useState<string>("");

  const canGenerate = useMemo(() => topic.trim().length >= 2, [topic]);

  async function generate() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, subject, topic, count, difficulty, includeAnswers }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "فشل التوليد");

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="rounded-3xl bg-white border shadow-sm p-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            مبادرة تعليمية رقمية
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-blue-700">
            منصة توليد أوراق العمل الذكية
          </h1>

          <p className="mt-3 text-slate-600 leading-7">
            اكتبي موضوع الدرس، اختاري الصف والمادة وعدد الأسئلة، وسيتم توليد ورقة عمل
            <b> بأسئلة متنوعة تلقائيًا</b> ومناسبة للمنهاج العُماني.
          </p>

          <div className="mt-4 text-sm text-slate-600">
            إعداد وتصميم: <b>ثريا العمري</b> — متوافقة مع المنهاج العُماني
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 grid gap-4 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-800">الصف الدراسي</label>
              <select
                className="mt-2 w-full rounded-2xl border bg-white px-4 py-3"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {grades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800">المادة</label>
              <select
                className="mt-2 w-full rounded-2xl border bg-white px-4 py-3"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-800">موضوع الدرس</label>
            <input
              className="mt-2 w-full rounded-2xl border bg-white px-4 py-3"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: التفكير الناقد / دورة الماء / جمع الكسور / النص القرائي..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-bold text-slate-800">عدد الأسئلة</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {counts.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                      count === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700"
                    }`}
                    type="button"
                  >
                    {c} سؤالًا
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800">مستوى الصعوبة</label>
              <div className="mt-2 grid gap-2">
                {(["سهل", "متوسط", "صعب"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                      difficulty === d ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700"
                    }`}
                    type="button"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800">الخط</label>
              <div className="mt-2 rounded-2xl border bg-white px-4 py-4">
                <input
                  type="range"
                  min={0.9}
                  max={1.3}
                  step={0.05}
                  value={fontScale}
                  onChange={(e) => setFontScale(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 text-xs text-slate-600">
                  حجم الخط: <b>{fontScale.toFixed(2)}x</b>
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeAnswers}
                    onChange={(e) => setIncludeAnswers(e.target.checked)}
                  />
                  تضمين مفتاح الإجابات
                </label>
              </div>
            </div>
          </div>

          <button
            disabled={!canGenerate || loading}
            onClick={generate}
            className={`rounded-2xl px-5 py-4 text-lg font-extrabold text-white ${
              !canGenerate || loading ? "bg-slate-300" : "bg-blue-700 hover:bg-blue-800"
            }`}
            type="button"
          >
            {loading ? "جاري إنشاء ورقة العمل..." : "إنشاء ورقة العمل"}
          </button>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
              {error}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="mt-6">
          <WorksheetPreview data={data} fontScale={fontScale} showAnswers={includeAnswers} />
        </div>
      </div>
    </div>
  );
}

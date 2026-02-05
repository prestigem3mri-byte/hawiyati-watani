"use client";

import { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [grade, setGrade] = useState("1");
  const [lesson, setLesson] = useState("");
  const [questions, setQuestions] = useState("10");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generateWorksheet = async () => {
    const cleanLesson = lesson.trim();
    if (!cleanLesson) {
      alert("الرجاء إدخال عنوان الدرس");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, lesson: cleanLesson, questions }),
      });

      const raw = await res.text();
      if (!res.ok) {
        setResult(`خطأ من السيرفر (${res.status}):\n${raw}`);
        return;
      }

      const data = JSON.parse(raw);
      setResult(data.text || "لم يتم توليد محتوى");
    } catch (error: any) {
      setResult(`حدث خطأ أثناء الاتصال:\n${String(error?.message ?? error)}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadWord = async () => {
    if (!result.trim()) {
      alert("لا يوجد محتوى لتحميله.");
      return;
    }

    const title = `هوية وطني – أوراق عمل ذكية (الصف ${grade})`;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ children: [new TextRun({ text: title, bold: true })] }),
            new Paragraph({ text: `عنوان الدرس: ${lesson || "-"}` }),
            new Paragraph({ text: `عدد الأسئلة: ${questions}` }),
            new Paragraph({ text: "" }),
            ...result.split("\n").map((line) => new Paragraph({ text: line })),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    const safeLesson = (lesson.trim() || "worksheet")
      .replace(/[\\/:*?"<>|]/g, "-")
      .slice(0, 50);

    downloadBlob(`هوية_وطني_${grade}_${safeLesson}.docx`, blob);
  };

  const downloadPDF = () => {
    if (!result.trim()) {
      alert("لا يوجد محتوى لتحميله.");
      return;
    }
    window.print(); // من نافذة الطباعة اختاري Save as PDF
  };

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>هوية وطني – أوراق عمل ذكية 🇴🇲</h1>

      {/* اسمك في الواجهة فقط */}
      <p style={{ textAlign: "center", marginTop: 6 }}>
        إعداد وتصميم: <strong>ثريا المعمري</strong>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
        <div>
          <label>الصف الدراسي</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            <option value="1">الصف الأول</option>
            <option value="2">الصف الثاني</option>
            <option value="3">الصف الثالث</option>
            <option value="4">الصف الرابع</option>
          </select>
        </div>

        <div>
          <label>عدد الأسئلة</label>
          <select
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <label>عنوان الدرس</label>
        <input
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          placeholder="مثال: حب الوطن"
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />
      </div>

      <button
        onClick={generateWorksheet}
        style={{
          width: "100%",
          marginTop: 14,
          padding: 14,
          background: "#0a5c36",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 10,
        }}
      >
        {loading ? "جاري الإنشاء..." : "إنشاء ورقة العمل"}
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        <button
          onClick={downloadWord}
          disabled={!result.trim()}
          style={{
            padding: 12,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            opacity: result.trim() ? 1 : 0.5,
            fontWeight: 700,
            borderRadius: 10,
          }}
        >
          تحميل Word
        </button>

        <button
          onClick={downloadPDF}
          disabled={!result.trim()}
          style={{
            padding: 12,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            opacity: result.trim() ? 1 : 0.5,
            fontWeight: 700,
            borderRadius: 10,
          }}
        >
          تحميل PDF
        </button>
      </div>

      {result && (
        <div
          dir="rtl"
          style={{
            marginTop: 18,
            padding: 18,
            border: "1px solid #ddd",
            borderRadius: 12,
            whiteSpace: "pre-wrap",
            lineHeight: 2.0,
            fontSize: 16,
            fontFamily: "Tahoma, Arial, sans-serif",
            background: "#fff",
          }}
        >
          {result}
        </div>
      )}

      {/* طباعة/PDF: يطبع الورقة فقط */}
      <style>{`
        @media print {
          button, select, input, label, h1, p { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; max-width: none !important; }
          div { border: none !important; padding: 0 !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>
    </main>
  );
}

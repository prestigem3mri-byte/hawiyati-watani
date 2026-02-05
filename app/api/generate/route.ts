import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { grade, lesson, questions } = await req.json();

    if (!grade || !lesson || !questions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not set" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const prompt = `
أنت معلم متخصص في مادة الهوية والمواطنة.
أنشئ ورقة عمل مناسبة للصف ${grade}
بعنوان: ${lesson}
عدد الأسئلة: ${questions}

الشروط:
- لغة عربية مبسطة
- مناسبة لعمر الطلبة
- بدون كتابة الإجابات
- جاهزة للطباعة
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: "server_error", details: String(err.message || err) },
      { status: 500 }
    );
  }
}

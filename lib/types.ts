export type Difficulty = "سهل" | "متوسط" | "صعب";

export type QuestionType = "اختيار من متعدد" | "صح أو خطأ" | "أسئلة قصيرة";

export type Question = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // للاختيار من متعدد
  answer: string;     // الإجابة النموذجية (حتى للصح/خطأ والقصيرة)
};

export type Worksheet = {
  title: string;        // عنوان الورقة
  grade: string;        // الصف
  subject: string;      // المادة
  topic: string;        // الموضوع
  questions: Question[];
  answerKey?: { id: string; answer: string }[];
};

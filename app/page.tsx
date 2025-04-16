"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("⚠️ 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">🔮 피크타로</h1>
      <input
        type="text"
        placeholder="고민이나 질문을 입력하세요"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full max-w-md p-2 border border-gray-400 rounded mb-4"
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "리딩 중..." : "타로 보기"}
      </button>
      {answer && (
        <div className="mt-6 max-w-lg bg-gray-100 p-4 rounded shadow">
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}

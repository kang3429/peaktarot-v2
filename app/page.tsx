"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState("");

  const tarotCards = [
    // 메이저 아르카나 (22장)
    "00-thefool.jpg",
    "01-themagician.jpg",
    "02-thehighpriestess.jpg",
    "03-theempress.jpg",
    "04-theemperor.jpg",
    "05-thehierophant.jpg",
    "06-thelovers.jpg",
    "07-thechariot.jpg",
    "08-strength.jpg",
    "09-thehermit.jpg",
    "10-wheeloffortune.jpg",
    "11-justice.jpg",
    "12-thehangedman.jpg",
    "13-death.jpg",
    "14-temperance.jpg",
    "15-thedevil.jpg",
    "16-thetower.jpg",
    "17-thestar.jpg",
    "18-themoon.jpg",
    "19-thesun.jpg",
    "20-judgement.jpg",
    "21-theworld.jpg",

    // 카드 뒷면
    "cardbacks.jpg",

    // 컵 (Cups)
    "cups01.jpg", "cups02.jpg", "cups03.jpg", "cups04.jpg", "cups05.jpg",
    "cups06.jpg", "cups07.jpg", "cups08.jpg", "cups09.jpg", "cups10.jpg",
    "cups11.jpg", "cups12.jpg", "cups13.jpg", "cups14.jpg",

    // 펜타클 (Pentacles)
    "pentacles01.jpg", "pentacles02.jpg", "pentacles03.jpg", "pentacles04.jpg",
    "pentacles05.jpg", "pentacles06.jpg", "pentacles07.jpg", "pentacles08.jpg",
    "pentacles09.jpg", "pentacles10.jpg", "pentacles11.jpg", "pentacles12.jpg",
    "pentacles13.jpg", "pentacles14.jpg",

    // 소드 (Swords)
    "swords01.jpg", "swords02.jpg", "swords03.jpg", "swords04.jpg", "swords05.jpg",
    "swords06.jpg", "swords07.jpg", "swords08.jpg", "swords09.jpg", "swords10.jpg",
    "swords11.jpg", "swords12.jpg", "swords13.jpg", "swords14.jpg",

    // 완드 (Wands)
    "wands01.jpg", "wands02.jpg", "wands03.jpg", "wands04.jpg", "wands05.jpg",
    "wands06.jpg", "wands07.jpg", "wands08.jpg", "wands09.jpg", "wands10.jpg",
    "wands11.jpg", "wands12.jpg", "wands13.jpg", "wands14.jpg"
  ];

  function getCardName(filename: string): string {
    const name = filename
      .replace(/^\d+-/, "") // 숫자 + 하이픈 제거
      .replace(/\.jpg$/, "") // 확장자 제거
      .replace(/-/g, " ") // 하이픈 → 공백
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()); // 각 단어 첫글자 대문자

    return name;
  }

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");

    const random = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    setCard(random);

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

      {card && (
        <div className="mt-6 flex flex-col items-center">
          <img
            src={`/cards/${card}`}
            alt="타로카드"
            className="w-48 h-auto shadow-xl rounded"
          />
          <p className="mt-2 text-lg font-semibold text-purple-700">
            {getCardName(card)}
          </p>
        </div>
      )}

      {answer && (
        <div className="mt-4 max-w-lg bg-gray-100 p-4 rounded shadow">
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}

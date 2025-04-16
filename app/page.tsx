"use client";

import { useState, useRef } from "react";
import "@fontsource/cinzel-decorative";
import html2canvas from "html2canvas";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<string[]>([]);
  const [isReversedList, setIsReversedList] = useState<boolean[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const tarotCards = [
    "00-thefool.jpg", "01-themagician.jpg", "02-thehighpriestess.jpg", "03-theempress.jpg",
    "04-theemperor.jpg", "05-thehierophant.jpg", "06-thelovers.jpg", "07-thechariot.jpg",
    "08-strength.jpg", "09-thehermit.jpg", "10-wheeloffortune.jpg", "11-justice.jpg",
    "12-thehangedman.jpg", "13-death.jpg", "14-temperance.jpg", "15-thedevil.jpg",
    "16-thetower.jpg", "17-thestar.jpg", "18-themoon.jpg", "19-thesun.jpg",
    "20-judgement.jpg", "21-theworld.jpg",
    "cups01.jpg", "cups02.jpg", "cups03.jpg", "cups04.jpg", "cups05.jpg",
    "cups06.jpg", "cups07.jpg", "cups08.jpg", "cups09.jpg", "cups10.jpg",
    "cups11.jpg", "cups12.jpg", "cups13.jpg", "cups14.jpg",
    "pentacles01.jpg", "pentacles02.jpg", "pentacles03.jpg", "pentacles04.jpg",
    "pentacles05.jpg", "pentacles06.jpg", "pentacles07.jpg", "pentacles08.jpg",
    "pentacles09.jpg", "pentacles10.jpg", "pentacles11.jpg", "pentacles12.jpg",
    "pentacles13.jpg", "pentacles14.jpg",
    "swords01.jpg", "swords02.jpg", "swords03.jpg", "swords04.jpg", "swords05.jpg",
    "swords06.jpg", "swords07.jpg", "swords08.jpg", "swords09.jpg", "swords10.jpg",
    "swords11.jpg", "swords12.jpg", "swords13.jpg", "swords14.jpg",
    "wands01.jpg", "wands02.jpg", "wands03.jpg", "wands04.jpg", "wands05.jpg",
    "wands06.jpg", "wands07.jpg", "wands08.jpg", "wands09.jpg", "wands10.jpg",
    "wands11.jpg", "wands12.jpg", "wands13.jpg", "wands14.jpg"
  ];

  const cardMeanings: Record<string, { upright: string; reversed: string }> = {
    "00-thefool.jpg": { upright: "새로운 시작, 모험, 가능성", reversed: "무모함, 경고, 준비 부족" },
    "01-themagician.jpg": { upright: "의지와 집중, 창의적 실행", reversed: "기만, 속임수, 방향 상실" },
    "02-thehighpriestess.jpg": { upright: "직관, 내면의 지혜", reversed: "혼란, 비밀, 감정 억제" },
    "03-theempress.jpg": { upright: "풍요, 창조성, 모성애", reversed: "의존, 창의성 부족, 억압" },
    "04-theemperor.jpg": { upright: "권위, 안정감, 구조", reversed: "지배, 완고함, 유연성 부족" },
    "05-thehierophant.jpg": { upright: "전통, 조언, 지혜", reversed: "비전통적, 반항, 외면" },
    "06-thelovers.jpg": { upright: "사랑, 조화, 선택", reversed: "불일치, 갈등, 유혹" },
    "07-thechariot.jpg": { upright: "전진, 의지력, 승리", reversed: "방향 상실, 갈등, 통제 부족" },
    "08-strength.jpg": { upright: "용기, 인내, 내면의 힘", reversed: "두려움, 약함, 자신감 부족" },
    "09-thehermit.jpg": { upright: "고독, 내면 탐색, 인도자", reversed: "고립, 외로움, 외면" },
    "10-wheeloffortune.jpg": { upright: "운명의 전환, 행운, 변화", reversed: "불운, 저항, 예기치 못한 변화" },
    "11-justice.jpg": { upright: "공정함, 균형, 책임", reversed: "불공정, 회피, 편견" },
    "12-thehangedman.jpg": { upright: "희생, 새로운 시각, 멈춤", reversed: "저항, 지체, 변화 두려움" },
    "13-death.jpg": { upright: "종말과 시작, 변혁, 해방", reversed: "저항, 미련, 두려움" },
    "14-temperance.jpg": { upright: "조화, 인내, 균형", reversed: "극단, 갈등, 조절 부족" },
    "15-thedevil.jpg": { upright: "유혹, 얽힘, 욕망", reversed: "해방, 의존 탈피, 회복" },
    "16-thetower.jpg": { upright: "충격, 붕괴, 깨달음", reversed: "변화의 저항, 내부 붕괴, 늦은 각성" },
    "17-thestar.jpg": { upright: "희망, 치유, 영감", reversed: "절망, 신념 부족, 혼란" },
    "18-themoon.jpg": { upright: "환상, 직관, 감정", reversed: "혼란, 불안, 왜곡된 인식" },
    "19-thesun.jpg": { upright: "성취, 기쁨, 명확함", reversed: "낙관 부족, 지연, 실망" },
    "20-judgement.jpg": { upright: "부활, 성찰, 각성", reversed: "회피, 자책, 후회" },
    "21-theworld.jpg": { upright: "완성, 통합, 성취", reversed: "미완, 정체, 불균형" },
    "cups01.jpg": { upright: "새로운 감정 시작", reversed: "감정 억제" },
    "cups02.jpg": { upright: "파트너십, 조화", reversed: "불일치, 갈등" },
    "cups03.jpg": { upright: "우정, 축하", reversed: "과잉, 거리감" },
    "cups04.jpg": { upright: "무관심, 명상", reversed: "새로운 기회" },
    "cups05.jpg": { upright: "슬픔, 상실", reversed: "회복, 용서" },
    "cups06.jpg": { upright: "향수, 어린 시절", reversed: "미련, 집착" },
    "cups07.jpg": { upright: "환상, 선택", reversed: "혼란, 현실감각 회복" },
    "cups08.jpg": { upright: "포기, 탐색", reversed: "되돌아옴, 망설임" },
    "cups09.jpg": { upright: "만족, 소원 성취", reversed: "과욕, 불만" },
    "cups10.jpg": { upright: "행복한 가정", reversed: "불화, 실망" },
    "cups11.jpg": { upright: "꿈, 영감", reversed: "망상, 속임수" },
    "cups12.jpg": { upright: "감정적 메시지", reversed: "감정 기복" },
    "cups13.jpg": { upright: "감성 풍부, 이상주의", reversed: "비현실적 기대" },
    "cups14.jpg": { upright: "정서적 균형", reversed: "감정 제어 어려움" },
    "pentacles01.jpg": { upright: "새로운 재정 기회", reversed: "기회의 상실" },
    "pentacles02.jpg": { upright: "균형, 유연성", reversed: "우왕좌왕, 계획 부족" },
    "pentacles03.jpg": { upright: "협업, 기술", reversed: "불화, 품질 부족" },
    "pentacles04.jpg": { upright: "보유, 안전", reversed: "집착, 과도한 절약" },
    "pentacles05.jpg": { upright: "궁핍, 어려움", reversed: "회복, 도움" },
    "pentacles06.jpg": { upright: "나눔, 지원", reversed: "불균형, 조건부 호의" },
    "pentacles07.jpg": { upright: "기다림, 노력의 결과", reversed: "지연, 불안" },
    "pentacles08.jpg": { upright: "노력, 장인정신", reversed: "지루함, 미완성" },
    "pentacles09.jpg": { upright: "자립, 풍요", reversed: "과소비, 의존" },
    "pentacles10.jpg": { upright: "재산, 가문", reversed: "재정 문제, 전통 거부" },
    "pentacles11.jpg": { upright: "기회, 신중함", reversed: "지체, 실수" },
    "pentacles12.jpg": { upright: "계획, 집중", reversed: "방향 상실" },
    "pentacles13.jpg": { upright: "안정, 실용적", reversed: "지루함, 융통성 부족" },
    "pentacles14.jpg": { upright: "현명한 투자, 실리 추구", reversed: "비효율, 욕심" },
    "swords01.jpg": { upright: "진실, 시작", reversed: "혼란, 거짓" },
    "swords02.jpg": { upright: "결단, 선택", reversed: "우유부단, 진실 회피" },
    "swords03.jpg": { upright: "상처, 실연", reversed: "회복, 용서" },
    "swords04.jpg": { upright: "휴식, 재충전", reversed: "불안, 조급함" },
    "swords05.jpg": { upright: "갈등, 승리", reversed: "후회, 패배 인정" },
    "swords06.jpg": { upright: "이동, 변화", reversed: "고착, 미련" },
    "swords07.jpg": { upright: "기만, 전략", reversed: "양심의 가책" },
    "swords08.jpg": { upright: "속박, 무력감", reversed: "자유, 해결" },
    "swords09.jpg": { upright: "불안, 악몽", reversed: "회복, 희망" },
    "swords10.jpg": { upright: "종말, 배신", reversed: "새로운 시작" },
    "swords11.jpg": { upright: "지성, 분석", reversed: "과도한 비판" },
    "swords12.jpg": { upright: "냉철함, 정의", reversed: "단절, 감정 부족" },
    "swords13.jpg": { upright: "논리, 분석", reversed: "혼란, 미결정" },
    "swords14.jpg": { upright: "명확함, 진실 추구", reversed: "혼돈, 불확실성" },
    "wands01.jpg": { upright: "열정, 시작", reversed: "동기 부족, 장애물" },
    "wands02.jpg": { upright: "계획, 미래 전망", reversed: "결정 미룸" },
    "wands03.jpg": { upright: "확장, 진전", reversed: "지연, 한계" },
    "wands04.jpg": { upright: "축하, 안정", reversed: "불안정, 긴장감" },
    "wands05.jpg": { upright: "경쟁, 도전", reversed: "내부 갈등" },
    "wands06.jpg": { upright: "승리, 인식", reversed: "과신, 인정 부족" },
    "wands07.jpg": { upright: "방어, 지위 유지", reversed: "지침, 저항 약화" },
    "wands08.jpg": { upright: "빠른 변화, 소식", reversed: "지연, 혼란" },
    "wands09.jpg": { upright: "지속, 인내", reversed: "의욕 상실" },
    "wands10.jpg": { upright: "책임, 부담", reversed: "해방, 내려놓기" },
    "wands11.jpg": { upright: "비전, 리더십", reversed: "무계획, 지시 부족" },
    "wands12.jpg": { upright: "성장, 추진력", reversed: "중단, 동기 부족" },
    "wands13.jpg": { upright: "창의성, 열정", reversed: "산만함, 추진력 부족" },
    "wands14.jpg": { upright: "통찰력, 비전 실행", reversed: "비현실적 계획" }
  };

  function getCardName(filename: string): string {
    return filename
      .replace(/\.(jpg|png|jpeg)/, "")
      .replace(/^[0-9]+-/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  const getCardName = (filename: string) =>
    filename.replace(/\.(jpg|png|jpeg)/, "").replace(/^[0-9]+-/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");
    setCards([]);
    setIsReversedList([]);
    setSelectedCardIndex(null);

    const selectedCards = Array.from({ length: 3 }, () => tarotCards[Math.floor(Math.random() * tarotCards.length)]);
    const reversedList = selectedCards.map(() => Math.random() < 0.5);

    setCards(selectedCards);
    setIsReversedList(reversedList);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${question} (${reversedList.map(r => r ? "역방향" : "정방향").join(", ")})`
        }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      new Audio("/magic.mp3").play();
    } catch (e) {
      setAnswer("⚠️ 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImage = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current);
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    }
  };

  const selectedCard = selectedCardIndex !== null ? cards[selectedCardIndex] : null;
  const selectedMeaning = selectedCard && cardMeanings[selectedCard]
    ? cardMeanings[selectedCard][isReversedList[selectedCardIndex!] ? "reversed" : "upright"]
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#0d0d23] via-[#1a093e] to-[#0d0d23] text-white font-sans">
      <h1 className="text-5xl font-['Cinzel Decorative'] mb-6 text-purple-300 drop-shadow-lg tracking-wide animate-pulse">
        🔮 피크타로
      </h1>

      <input
        type="text"
        placeholder="고민이나 질문을 입력하세요"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full max-w-md p-3 border border-purple-400 rounded shadow mb-4 bg-black/40 text-white placeholder-gray-400"
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-6 py-2 bg-purple-700 hover:bg-purple-800 hover:scale-105 transition text-white font-semibold rounded disabled:opacity-50"
      >
        {loading ? "리딩 중..." : "타로 보기"}
      </button>

      <div ref={resultRef} className="w-full flex flex-col items-center mt-10 gap-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-2 cursor-pointer transition duration-500 rounded-lg ${
                selectedCardIndex === index ? "bg-purple-800/40 shadow-lg scale-105" : "hover:scale-105"
              }`}
              onClick={() => setSelectedCardIndex(index)}
            >
              <img
                src={`/cards/${card}`}
                alt="타로카드"
                className={`w-32 sm:w-40 h-auto rounded-md shadow-[0_0_25px_rgba(186,113,255,0.4)] transition-transform duration-700 ease-in-out ${
                  isReversedList[index] ? "rotate-[180deg]" : ""
                }`}
              />
              <p className="mt-2 text-sm sm:text-base font-semibold text-purple-200">
                {getCardName(card)} ({isReversedList[index] ? "역방향" : "정방향"})
              </p>
            </div>
          ))}
        </div>

        {selectedCard && selectedMeaning && (
          <div className="max-w-lg bg-black/50 border border-purple-600 p-4 rounded shadow-xl animate-fadeIn mt-4">
            <p className="text-purple-100">{selectedMeaning}</p>
          </div>
        )}

        {answer && (
          <div className="mt-6 max-w-lg bg-black/40 border border-purple-600 p-5 rounded shadow-md animate-fadeIn">
            <p className="text-purple-100 whitespace-pre-line leading-relaxed text-md">{answer}</p>
          </div>
        )}
      </div>

      {answer && (
        <button
          onClick={handleCopyImage}
          className="mt-4 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow transition"
        >
          {copied ? "✅ 클립보드에 복사됨!" : "📸 리딩 결과 이미지 복사"}
        </button>
      )}
    </main>
  );
}
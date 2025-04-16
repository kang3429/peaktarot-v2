import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question } = await req.json();

  // 정/역방향 판단 (문자열 끝에서 괄호 안 확인)
  const isReversed = question.includes("역방향");
  const cleanQuestion = question.replace(/\s*\(.*\)\s*$/, ""); // 질문에서 괄호 제거

  const prompt = `
사용자가 타로 점을 봅니다.
질문: "${cleanQuestion}"
카드는 ${isReversed ? "역방향" : "정방향"}으로 나왔습니다.

${isReversed
    ? `역방향 카드는 일반적인 해석의 반대 의미 또는 내면의 장애, 숨겨진 의미를 암시합니다.
따라서 조심스럽고 경고성 있는 어조로 신비로운 해석을 해주세요.`
    : `정방향 카드는 카드 본래의 의미가 잘 드러나는 상태입니다.
긍정적이고 직관적인 리딩을 신비로운 어조로 제공해주세요.`}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "당신은 신비롭고 직관적인 타로 마스터입니다. 상황에 따라 따뜻하거나 경고하는 어조를 사용하세요." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
    }),
  });

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || "리딩을 가져오는 데 실패했어요.";

  return NextResponse.json({ answer });
}

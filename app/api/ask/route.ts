import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question } = await req.json();

  const prompt = `사용자가 타로 점을 봅니다. 질문: "${question}"\n타로 리딩처럼 신비롭고 신중한 말투로 직관적인 해석을 해주세요.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "당신은 신비로운 타로 마스터입니다. 질문에 신중하고 신비한 어조로 대답하세요." },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
    }),
  });

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || "리딩을 가져오는 데 실패했어요.";

  return NextResponse.json({ answer });
}

import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface QuestionType {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export const buildPrompt = (
  questionTypes: QuestionType[],
  additionalInstructions: string,
  fileContent?: string
): string => {
  const qList = questionTypes
    .map((q) => `- ${q.numberOfQuestions} ${q.type} (${q.marksPerQuestion} marks each)`)
    .join('\n');

  const fileSection = fileContent && fileContent.trim().length > 0
    ? `REFERENCE MATERIAL (base ALL questions strictly on this content):
---
${fileContent}
---

`
    : '';

  return `You are an expert teacher creating a structured exam question paper.

${fileSection}Create a question paper with these requirements:
${qList}

Additional instructions: ${additionalInstructions || 'None'}

Return ONLY valid JSON (no markdown, no backticks, no extra text) in this exact format:
{
  "schoolName": "Delhi Public School",
  "subject": "Science",
  "className": "8th",
  "timeAllowed": "45 minutes",
  "maximumMarks": 16,
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries 2 marks",
      "questions": [
        {
          "text": "Question text here",
          "difficulty": "easy",
          "marks": 2,
          "answer": "Model answer here"
        }
      ]
    }
  ]
}

Rules:
- difficulty must be exactly "easy", "moderate", or "hard"
- Group questions by type into sections (Section A, B, C...)
- Mix difficulties roughly: 40% easy, 40% moderate, 20% hard
- If reference material is provided, ALL questions must be directly based on it
- If no reference material, use the additional instructions to determine subject matter
- Return ONLY the JSON object, nothing else`;
};

export const generateQuestionPaper = async (
  questionTypes: QuestionType[],
  additionalInstructions: string,
  fileContent?: string
) => {
  const prompt = buildPrompt(questionTypes, additionalInstructions, fileContent);

  console.log('File content included in prompt:', !!fileContent && fileContent.trim().length > 0);

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert teacher. Always respond with valid JSON only. No markdown, no backticks, no explanation. If reference material is provided, base ALL questions strictly on that material.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const rawText = completion.choices[0].message.content || '';

  const cleaned = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const parsed = JSON.parse(cleaned);
  return { parsed, rawPrompt: prompt };
};
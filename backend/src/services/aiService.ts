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

  return `You are an expert teacher creating a structured exam question paper.

${fileContent ? `Reference material:\n${fileContent}\n\n` : ''}
Create a question paper with these requirements:
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
- Make questions relevant to the material if provided
- Return ONLY the JSON object, nothing else`;
};

export const generateQuestionPaper = async (
  questionTypes: QuestionType[],
  additionalInstructions: string,
  fileContent?: string
) => {
  const prompt = buildPrompt(questionTypes, additionalInstructions, fileContent);

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert teacher. Always respond with valid JSON only. No markdown, no backticks, no explanation.',
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
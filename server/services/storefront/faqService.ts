import prisma from "../../config/prisma.js";

interface IQuestion {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

export const getFAQ = async (): Promise<IQuestion[]> => {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  });
  return questions.map(q => ({
    ...q,
    _id: q.id,
  } as any));
};

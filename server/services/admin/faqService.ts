import prisma from "../../config/prisma.js";

interface IQuestion {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

/**
 * @desc    Tạo câu hỏi mới (Admin)
 */
export const createQuestion = async (
  questionData: Partial<IQuestion>,
) => {
  return await prisma.question.create({
    data: {
      question: questionData.question || "",
      answer: questionData.answer || "",
      isActive: questionData.isActive !== undefined ? questionData.isActive : true,
      order: questionData.order || 0,
      category: "general"
    }
  });
};

/**
 * @desc    Cập nhật câu hỏi (Admin)
 */
export const updateQuestion = async (
  id: string,
  questionData: Partial<IQuestion>,
) => {
  const data: any = {};
  if (questionData.question !== undefined) data.question = questionData.question;
  if (questionData.answer !== undefined) data.answer = questionData.answer;
  if (questionData.isActive !== undefined) data.isActive = questionData.isActive;
  if (questionData.order !== undefined) data.order = questionData.order;

  return await prisma.question.update({
    where: { id },
    data,
  });
};

/**
 * @desc    Xóa câu hỏi (Admin)
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  await prisma.question.delete({
    where: { id },
  });
};

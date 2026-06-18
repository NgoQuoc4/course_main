import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as faqService from "../../services/storefront/faqService.js";

/**
 * @desc    Lấy danh sách question
 * @route   GET /questions
 * @access  Public
 */
export const getFAQ = catchAsync(async (req: Request, res: Response) => {
  const faqs = await faqService.getFAQ();

  res.status(200).json({
    success: true,
    data: faqs,
  });
});

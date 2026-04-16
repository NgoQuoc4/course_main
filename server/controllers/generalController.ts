import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as generalService from "../services/generalService.js";

/**
 * @desc    Lấy danh sách ảnh gallery
 * @route   GET /galleries
 * @access  Public
 */
export const getGalleries = catchAsync(async (req: Request, res: Response) => {
    const galleries = await generalService.getGalleries(req.query.category as string);

    res.status(200).json({
        success: true,
        data: galleries,
    });
});

/**
 * @desc    Lấy danh sách thành viên đội ngũ
 * @route   GET /teams
 * @access  Public
 */
export const getTeams = catchAsync(async (req: Request, res: Response) => {
    const teams = await generalService.getTeams();

    res.status(200).json({
        success: true,
        data: teams,
    });
});

/**
 * @desc    Lấy danh sách câu hỏi thường gặp
 * @route   GET /questions
 * @access  Public
 */
export const getQuestions = catchAsync(async (req: Request, res: Response) => {
    const questions = await generalService.getQuestions(req.query.category as string);

    res.status(200).json({
        success: true,
        data: questions,
    });
});

/**
 * @desc    Đăng ký nhận tin tức
 * @route   POST /subscribes
 * @access  Public
 */
export const createSubscribe = catchAsync(async (req: Request, res: Response) => {
    const result = await generalService.createSubscribe(req.body);

    res.status(result.resubscribed ? 200 : 201).json({
        success: true,
        message: "Bạn đã đăng ký nhận tin tức thành công!",
    });
});

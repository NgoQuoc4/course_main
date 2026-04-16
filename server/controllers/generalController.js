// controllers/generalController.js
// Controller cho Gallery, Team, Question, Subscribe - LỚP MỎNG gọi Service

const catchAsync = require("../utils/catchAsync");
const generalService = require("../services/generalService");

/**
 * @desc    Lấy danh sách ảnh gallery
 * @route   GET /galleries
 * @access  Public
 */
const getGalleries = catchAsync(async (req, res) => {
    const galleries = await generalService.getGalleries(req.query.category);

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
const getTeams = catchAsync(async (req, res) => {
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
const getQuestions = catchAsync(async (req, res) => {
    const questions = await generalService.getQuestions(req.query.category);

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
const createSubscribe = catchAsync(async (req, res) => {
    const result = await generalService.createSubscribe(req.body);

    res.status(result.resubscribed ? 200 : 201).json({
        success: true,
        message: "Bạn đã đăng ký nhận tin tức thành công!",
    });
});

module.exports = { getGalleries, getTeams, getQuestions, createSubscribe };


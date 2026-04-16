// src/services/generalService.js
// Tầng Business Logic cho Gallery, Team, Question, Subscribe

const Gallery = require("../models/Gallery");
const Team = require("../models/Team");
const Question = require("../models/Question");
const Subscribe = require("../models/Subscribe");

/**
 * Lấy danh sách ảnh gallery
 */
const getGalleries = async (category) => {
    const filter = { isActive: true };
    if (category) {
        filter.category = category;
    }
    return Gallery.find(filter).sort("order");
};

/**
 * Lấy danh sách thành viên đội ngũ
 */
const getTeams = async () => {
    return Team.find({ isActive: true }).sort("order");
};

/**
 * Lấy danh sách câu hỏi thường gặp
 */
const getQuestions = async (category) => {
    const filter = { isActive: true };
    if (category) {
        filter.category = category;
    }
    return Question.find(filter).sort("order");
};

/**
 * Đăng ký nhận tin tức
 */
const createSubscribe = async ({ email, name }) => {
    const existing = await Subscribe.findOne({ email });

    if (existing) {
        if (existing.status === "unsubscribed") {
            await Subscribe.findByIdAndUpdate(existing._id, {
                status: "active",
                name: name || existing.name,
            });
            return { resubscribed: true };
        }

        const error = new Error("Email này đã được đăng ký nhận tin tức.");
        error.statusCode = 400;
        throw error;
    }

    await Subscribe.create({ email, name: name || "" });
    return { created: true };
};

module.exports = { getGalleries, getTeams, getQuestions, createSubscribe };


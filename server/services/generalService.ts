import Gallery from "../models/Gallery.js";
import Team from "../models/Team.js";
import Question from "../models/Question.js";
import Subscribe from "../models/Subscribe.js";

/**
 * Lấy danh sách ảnh gallery
 */
export const getGalleries = async (category?: string) => {
    const filter: any = { isActive: true };
    if (category) {
        filter.category = category;
    }
    return Gallery.find(filter).sort("order");
};

/**
 * Lấy danh sách thành viên đội ngũ
 */
export const getTeams = async () => {
    return Team.find({ isActive: true }).sort("order");
};

/**
 * Lấy danh sách câu hỏi thường gặp
 */
export const getQuestions = async (category?: string) => {
    const filter: any = { isActive: true };
    if (category) {
        filter.category = category;
    }
    return Question.find(filter).sort("order");
};

/**
 * Đăng ký nhận tin tức
 */
export const createSubscribe = async ({ email, name }: { email: string; name?: string }) => {
    const existing = await Subscribe.findOne({ email });

    if (existing) {
        if (existing.status === "unsubscribed") {
            await Subscribe.findByIdAndUpdate(existing._id, {
                status: "active",
                name: name || existing.name,
            });
            return { resubscribed: true };
        }

        throw { message: "Email này đã được đăng ký nhận tin tức.", statusCode: 400 };
    }

    await Subscribe.create({ email, name: name || "" });
    return { created: true };
};

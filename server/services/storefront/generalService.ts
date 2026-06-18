import prisma from "../../config/prisma.js";
import { createNotification } from "../admin/notificationService.js";

/**
 * Lấy danh sách ảnh gallery
 */
export const getGalleries = async (category?: string) => {
    const where: any = { isActive: true };
    if (category) {
        where.category = category;
    }
    const galleries = await prisma.gallery.findMany({
        where,
        orderBy: { order: "asc" }
    });
    return galleries.map(g => ({ ...g, _id: g.id }));
};

/**
 * Lấy danh sách thành viên đội ngũ
 */
export const getTeams = async () => {
    const teams = await prisma.team.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" }
    });
    return teams.map(t => ({ ...t, _id: t.id }));
};

/**
 * Lấy danh sách câu hỏi thường gặp
 */
export const getQuestions = async (category?: string) => {
    const where: any = { isActive: true };
    if (category) {
        where.category = category;
    }
    const questions = await prisma.question.findMany({
        where,
        orderBy: { order: "asc" }
    });
    return questions.map(q => ({ ...q, _id: q.id }));
};

/**
 * Đăng ký nhận tin tức
 */
export const createSubscribe = async ({ email, name }: { email: string; name?: string }) => {
    const existing = await prisma.subscribe.findFirst({
        where: { email }
    });

    if (existing) {
        if (existing.status === "unsubscribed") {
            await prisma.subscribe.update({
                where: { id: existing.id },
                data: {
                    status: "active",
                    name: name || existing.name,
                }
            });
            return { resubscribed: true };
        }

        throw { message: "Email này đã được đăng ký nhận tin tức.", statusCode: 400 };
    }

    const sub = await prisma.subscribe.create({
        data: {
            email,
            name: name || "",
            status: "active",
        }
    });

    // Tạo thông báo cho Admin
    try {
        await createNotification({
            title: "Lượt đăng ký nhận tin mới",
            message: `Học viên ${name || email} vừa đăng ký nhận bản tin (Newsletter).`,
            type: "subscribe",
            referenceId: sub.id,
        });
    } catch (err) {
        console.error("Lỗi tạo thông báo:", err);
    }

    return { created: true };
};

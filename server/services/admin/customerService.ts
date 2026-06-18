import prisma from "../../config/prisma.js";

/**
 * Lấy danh sách người dùng (Admin)
 */
export const getUsers = async ({ search, role, page = 1, limit = 10 }: any) => {
    const where: any = {};
    if (role) {
        if (typeof role === "string" && !role.match(/^[0-9a-fA-F]{24}$/)) {
            const searchSlug = role.toUpperCase() === "CUSTOMER" ? "USER" : role.toUpperCase();
            const roleObj = await prisma.role.findFirst({
                where: { slug: searchSlug as any }
            });
            if (roleObj) where.roleId = roleObj.id;
        } else {
            where.roleId = role;
        }
    }
    if (search) {
        where.OR = [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            include: { role: true },
            orderBy: { createdAt: "desc" },
            skip,
            take,
        }),
        prisma.user.count({ where })
    ]);

    const mappedUsers = users.map(user => ({
        ...user,
        _id: user.id,
        role: user.role ? { ...user.role, _id: user.role.id } : null,
    }));

    return {
        users: mappedUsers,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

/**
 * Cập nhật quyền người dùng (Admin)
 */
export const updateUserRole = async (userId: string, roleInput: string) => {
    let roleId: any = roleInput;

    if (typeof roleInput === "string" && !roleInput.match(/^[0-9a-fA-F]{24}$/)) {
        const searchSlug = roleInput.toUpperCase() === "CUSTOMER" ? "USER" : roleInput.toUpperCase();
        const role = await prisma.role.findFirst({
            where: { slug: searchSlug as any }
        });
        if (role) roleId = role.id;
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { roleId },
        include: { role: true }
    });

    return {
        ...user,
        _id: user.id,
        role: user.role ? { ...user.role, _id: user.role.id } : null,
    };
};

/**
 * Xóa người dùng (Admin)
 */
export const deleteUser = async (userId: string) => {
    return await prisma.user.delete({
        where: { id: userId }
    });
};

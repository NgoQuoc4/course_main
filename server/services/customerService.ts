import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer, { ICustomerDocument } from "../models/Customer.js";
import Role from "../models/Role.js";

/**
 * Tạo cặp token (access + refresh)
 */
export const generateTokens = (id: string | any) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any,
    });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,
    });
    return { accessToken, refreshToken };
};

/**
 * Đăng ký tài khoản mới
 */
export const register = async ({ firstName, lastName, email, password }: any) => {
    // Kiểm tra email trùng
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
        throw { message: "Email đã được sử dụng để đăng ký tài khoản.", statusCode: 403 };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Lấy role mặc định là 'customer'
    const defaultRole = await Role.findOne({ slug: "customer" });

    // Tạo customer
    const customer = await Customer.create({
        firstName,
        lastName: lastName || "",
        email,
        password: hashedPassword,
        role: defaultRole?._id,
    });

    return {
        id: customer._id,
        firstName: customer.firstName,
        email: customer.email,
    };
};

/**
 * Đăng nhập
 */
export const login = async ({ email, password }: any) => {
    const customer = await Customer.findOne({ email })
        .select("+password")
        .populate("role");

    if (!customer) {
        throw { message: "Email hoặc mật khẩu không chính xác.", statusCode: 401 };
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password as string);
    if (!isPasswordMatch) {
        throw { message: "Email hoặc mật khẩu không chính xác.", statusCode: 401 };
    }

    const { accessToken, refreshToken } = generateTokens(customer._id);

    // Lưu refresh token vào DB
    await Customer.findByIdAndUpdate(customer._id, { refreshToken });

    return {
        token: accessToken,
        refreshToken,
        customer: {
            id: customer._id,
            firstName: customer.firstName,
            email: customer.email,
            role: (customer.role as any)?.slug || "customer",
        },
    };
};

/**
 * Làm mới Access Token
 */
export const refresh = async (token: string) => {
    if (!token) {
        throw { message: "Refresh token không được cung cấp.", statusCode: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    const customer = await Customer.findById(decoded.id);

    if (!customer || customer.refreshToken !== token) {
        throw { message: "Refresh token không hợp lệ hoặc đã hết hạn.", statusCode: 401 };
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(customer._id);
    await Customer.findByIdAndUpdate(customer._id, { refreshToken: newRefreshToken });

    return { token: accessToken, refreshToken: newRefreshToken };
};

/**
 * Cập nhật profile
 */
export const updateProfile = async (customerId: string, updateData: any, avatarUrl: string | null = null) => {
    const currentCustomer = await Customer.findById(customerId);
    if (!currentCustomer) {
        throw { message: "Không tìm thấy người dùng.", statusCode: 404 };
    }

    // Kiểm tra email trùng
    if (updateData.email && updateData.email !== currentCustomer.email) {
        const emailExists = await Customer.findOne({
            email: updateData.email,
            _id: { $ne: customerId },
        });
        if (emailExists) {
            throw { message: "Email này đã được sử dụng bởi tài khoản khác.", statusCode: 400 };
        }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
            firstName: updateData.firstName || currentCustomer.firstName,
            lastName: updateData.lastName !== undefined ? updateData.lastName : currentCustomer.lastName,
            email: updateData.email || currentCustomer.email,
            phone: updateData.phone !== undefined ? updateData.phone : currentCustomer.phone,
            introduce: updateData.introduce !== undefined ? updateData.introduce : currentCustomer.introduce,
            facebookURL: updateData.facebookURL !== undefined ? updateData.facebookURL : currentCustomer.facebookURL,
            website: updateData.website !== undefined ? updateData.website : currentCustomer.website,
            avatar: avatarUrl || updateData.avatar || (currentCustomer as any).avatar,
        },
        { new: true, runValidators: true }
    );

    return updatedCustomer;
};

/**
 * Lấy danh sách người dùng (Admin)
 */
export const getUsers = async ({ search, role, page = 1, limit = 10 }: any) => {
    const filter: any = {};
    if (role) {
        if (typeof role === "string" && !role.match(/^[0-9a-fA-F]{24}$/)) {
            const roleObj = await Role.findOne({ slug: role });
            if (roleObj) filter.role = roleObj._id;
        } else {
            filter.role = role;
        }
    }
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Customer.countDocuments(filter);
    const users = await Customer.find(filter)
        .populate("role")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit));

    return {
        users,
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
        const role = await Role.findOne({ slug: roleInput });
        if (role) roleId = role._id;
    }

    const user = await Customer.findByIdAndUpdate(
        userId,
        { role: roleId },
        { new: true, runValidators: true }
    ).populate("role");

    if (!user) {
        throw { message: "Không tìm thấy người dùng.", statusCode: 404 };
    }
    return user;
};

/**
 * Xóa người dùng (Admin)
 */
export const deleteUser = async (userId: string) => {
    const user = await Customer.findByIdAndDelete(userId);
    if (!user) {
        throw { message: "Không tìm thấy người dùng.", statusCode: 404 };
    }
    return user;
};

// src/utils/apiFeatures.js
// Class tiện ích cho việc filter, sort, paginate trên MongoDB query
// ======================================================================
// Dùng chung cho tất cả các Service cần query phức tạp
// Ví dụ: const features = new APIFeatures(Course.find(), req.query)
//            .filter().sort().paginate();
//        const courses = await features.query;
// ======================================================================

class APIFeatures {
    /**
     * @param {import('mongoose').Query} query - Mongoose query object
     * @param {object} queryString - req.query từ Express
     */
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * Lọc kết quả theo các trường hợp lệ
     * Hỗ trợ: ?price[gte]=100&category=frontend
     */
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Thêm $ cho các operator MongoDB (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    /**
     * Sắp xếp kết quả
     * Hỗ trợ: ?sort=price,-createdAt
     */
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    /**
     * Chọn các trường cần trả về
     * Hỗ trợ: ?fields=name,price,slug
     */
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    /**
     * Phân trang
     * Hỗ trợ: ?page=2&limit=10
     */
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    /**
     * Tìm kiếm theo text
     * Hỗ trợ: ?search=react
     */
    search(fields = ["name"]) {
        if (this.queryString.search) {
            const searchRegex = new RegExp(this.queryString.search, "i");
            const searchConditions = fields.map((field) => ({
                [field]: searchRegex,
            }));
            this.query = this.query.find({ $or: searchConditions });
        }
        return this;
    }
}

module.exports = APIFeatures;

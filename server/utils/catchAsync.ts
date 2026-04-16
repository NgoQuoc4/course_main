import { Request, Response, NextFunction } from "express";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Bọc hàm async controller để tự động bắt lỗi
 */
const catchAsync = (fn: AsyncFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;

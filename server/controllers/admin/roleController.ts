import catchAsync from "../../utils/catchAsync.js";
import { Request, Response } from "express";
import * as roleServices from "../../services/admin/roleService.js";

export const createRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleServices.createRole(req.body);
  res.status(201).json({
    success: true,
    message: "Tạo role thành công.",
    data: role,
  });
});

export const getAllRoles = catchAsync(async (req: Request, res: Response) => {
  const roles = await roleServices.getAllRoles();
  res.status(200).json({
    success: true,
    message: "Lấy danh sách role thành công.",
    data: roles,
  });
});

export const getRoleById = catchAsync(async (req: Request, res: Response) => {
  const role = await roleServices.getRoleById(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Lấy thông tin role thành công.",
    data: role,
  });
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleServices.updateRole(req.params.id as string, req.body);
  res.status(200).json({
    success: true,
    message: "Cập nhật role thành công.",
    data: role,
  });
});

export const deleteRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleServices.deleteRole(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Xóa role thành công.",
    data: role,
  });
});

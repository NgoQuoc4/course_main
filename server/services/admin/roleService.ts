import prisma from "../../config/prisma.js";

export const createRole = async (roleData: any) => {
  return await prisma.role.create({
    data: {
      ...roleData,
    },
  });
};

export const getAllRoles = async () => {
  return await prisma.role.findMany();
};

export const getRoleById = async (id: string) => {
  return await prisma.role.findUnique({ where: { id } });
};

export const updateRole = async (id: string, roleData: any) => {
  return await prisma.role.update({ where: { id }, data: roleData });
};

export const deleteRole = async (id: string) => {
  return await prisma.role.delete({ where: { id } });
};

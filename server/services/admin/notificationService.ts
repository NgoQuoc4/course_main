import prisma from "../../config/prisma.js";

interface CreateNotificationInput {
  title: string;
  message: string;
  type: string;
  referenceId?: string;
}

export const createNotification = async (data: CreateNotificationInput) => {
  return await prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
      referenceId: data.referenceId || null,
      isRead: false,
    },
  });
};

export const getNotifications = async () => {
  return await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
};

export const markAsRead = async (id: string) => {
  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

export const markAllAsRead = async () => {
  return await prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
};

export const clearAllNotifications = async () => {
  return await prisma.notification.deleteMany({});
};

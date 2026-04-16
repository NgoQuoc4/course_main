// features/orders/services/orderApi.js
// API calls riêng cho feature Orders

import { orderService } from "@/services/orderService";

export const getPaymentHistoriesApi = () => orderService.getPaymentHistories();
export const getCourseHistoriesApi = () => orderService.getCourseHistories();
export const createOrderApi = (payload) => orderService.createOrder(payload);

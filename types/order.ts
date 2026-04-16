import { ICourse } from "./course";

export type PaymentMethod = 'cash' | 'atm' | 'transfer';
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface IOrderCourse {
    course: string | ICourse;
    price: number;
}

export interface IOrder {
    _id?: string;
    customer: string | any;
    courses: IOrderCourse[];
    totalAmount: number; // Renamed from totalPrice to match orderService.js
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    note?: string;
    name?: string;
    phone?: string;
    email?: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type UserRole = 'admin' | 'teacher' | 'customer';

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string | any; // Referral to Role model or slug
    avatar?: string;
    introduce?: string;
    phone?: string;
    website?: string;
    facebookURL?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAuthContext {
    user: IUser | null;
    courseInfo: any[]; // Will refine once orders are typed
    paymentInfo: any[];
    handleLogin: (data: any) => Promise<void>;
    handleLogout: () => void;
    handleGetProfileCourse: () => Promise<void>;
    handleGetProfilePayment: () => Promise<void>;
}

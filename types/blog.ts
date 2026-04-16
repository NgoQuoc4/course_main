import { IUser } from "./user";

export interface IBlog {
    _id?: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string;
    category?: any; // Will refine or use IBlogCategory
    author?: string | IUser;
    tags?: string[];
    status: 'published' | 'draft';
    viewCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

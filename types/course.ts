export interface ILesson {
    _id?: string;
    title: string;
    duration?: string;
    isPreview?: boolean;
    content?: string;
}

export interface IChapter {
    _id?: string;
    title: string;
    lessons: ILesson[];
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'active' | 'inactive' | 'draft';

export interface ICourse {
    _id?: string;
    title: string;
    slug: string;
    name?: string; // Some parts of FE use 'name' instead of 'title' or as a separate display field
    shortDescription?: string;
    description?: string;
    thumbnail?: string;
    image?: string; // Standardizing image/thumbnail
    price: number;
    salePrice?: number;
    status: CourseStatus;
    level: CourseLevel;
    language?: string;
    chapters: IChapter[];
    requirements?: string[];
    outcomes?: string[];
    tags?: string[];
    enrollCount?: number;
    rating?: number;
    instructor?: any; // Will refine once IUser is defined
    createdAt?: string;
    updatedAt?: string;
}

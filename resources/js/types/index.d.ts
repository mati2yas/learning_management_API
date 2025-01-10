import exp from "constants";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};


export interface Category {
    id: number;
    course_name: string;
    name: string;
}

export interface Grade {
    id: number;
    grade_name: string;
    category_id: number;
    stream: string;
}

export interface Department {
    id: number;
    department_name: string;
    category_id: number;
}


export interface Batch {
    id: number;
    batch_name: string;
    department_id: number;
}

export interface Chapter{
    order: ReactNode;
    id: number;
    title: string;
    description?: string;
    course_id: number;
    contents_count?: number;
}

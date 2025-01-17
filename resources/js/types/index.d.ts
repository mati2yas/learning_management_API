import exp from "constants";
import { QuizQuestion, Content } from '@/types';
import { Course } from './course';
import { Youtube } from 'lucide-react';

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
    estimated_time: ReactNode;
    order: ReactNode;
    id: number;
    title: string;
    description?: string;
    course_id: number;
    contents_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Quiz{
    questions: any;
    questions: any;
    id: number;
    chapter_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface QuizQuestion{
    id: number;
    quiz_id: number;
    text: string;
    question_image_url: string;
    text_explanation: string;
    video_explanation_url: string;
    options: JSON;
    answer: JSON;
    created_at?: string;
    updated_at?: string;
}

export interface Content{
    id: number;
    chapter_id: number;
    name: string;
    order: number;
    url: string;
    created_at?: string;
    updated_at?: string;
}

export interface Course{
    id: number;
    course_name: string;
    thumbnail: string;
    category_id: number;
    grade_id: number;
    department_id: number;
    batch_id: number;
    number_of_chapters: number;
    saves: number;
    likes: number;
    price_one_month: number;
    price_three_month: number;
    price_six_month: number;
    price_one_year: number;
    created_at?: string;
    updated_at?: string;
}

export interface IndexProps {
    auth: any;
    courses: {
      data: Course[]
      links: Array<{
        url: string | null;
        active: boolean;
        label: string;
      }>;
    };
    categories: Array<{ id: number; name: string; course_name: string }>;
    grades: Array<{ id: number; grade_name: string; category_id: number; stream: string }>;
    departments: Array<{ id: number; department_name: string; category_id: number }>;
    batches: Array<{ id: number; batch_name: string; department_id: number }>;
    filters: {
      category: string;
      search: string;
    };
  }


export interface Content{
    id: number;
    chapter_id: number;
    name: string;
    order: number;
    text_content: string;
    youtube_url: string;
    file_path: string;
    created_at?: string;
    updated_at?: string;
}
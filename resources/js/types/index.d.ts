import exp from "constants";
import {  Content } from '@/types';
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
    order: number;
    id: number;
    title: string;
    description?: string;
    course_id: number;
    contents_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Quiz{
    id: number;
    chapter_id: number;
    title: string;
    created_at?: string;
    updated_at?: string;
}

export interface QuizQuestion{
    id: number;
    quiz_id: number;
    question_number: number;
    text: string;
    is_multiple_choice: boolean;
    question_image_url: string;
    text_explanation: string;
    video_explanation_url: string;
    options: JSON;
    answer: JSON;
    created_at?: string;
    updated_at?: string;
}

export interface Content{
    contents_count: ReactNode;
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
    created_at?: string;
    updated_at?: string;
}

export interface YoutubeContent{
    id: number;
    content_id: number;
    title: string;
    url: string;
    created_at?: string;
    updated_at?: string;
}

export interface TextContent{
    id: number;
    content_id: number;
    title: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export interface FileContent{
    id: number;
    content_id: number;
    title: string;
    file_url: string;
    created_at?: string;
    updated_at?: string;
}

export interface ExamCourse{
    id: number;
    exam_year_id: number;
    course_name: string;
    created_at?: string;
    updated_at?: string;
}

export interface ExamChapter{
    id: number;
    exam_grade_id: number;
    title: string;
    sequence_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface ExamYear{
    id: number;
    exam_type_id: number;
    year: string|number;
    created_at?: string;
    updated_at?: string;
}

export interface ExamQuestion{
    exam_grade_id: any;
    text_explanation: string;
    id:number
    exam_course_id: number
    exam_chapter_id:number
    exam_year_id: number
    question_text: string
    video_explanation_url: string
    question_image_url: string
    options: string
    answer: string
    created_at?: string;
    updated_at?: string;
}

export interface ExamType{
    id:number
    name: string
    created_at?: string;
    updated_at?: string;
}

export interface ExamGrade{
    id: number
    grade: number
    exam_year_id: number
    created_at?: string;
    updated_at?: string;
}
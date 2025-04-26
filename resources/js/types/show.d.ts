import { Course } from "./course";

export interface ShowCourseProps {
  course: Course;
  thumbnail: string;
  category_name: string;
  department_name: string;
  batch_name: string;
  chapters: Chapter[];
  categories: Category[];
  grades: Grade[];
  departments: Department[];
  batches: Batch[];
  chaptersCount: number;
  paidCourses: number
  session: string
  canDelete: boolean
  canUpdate: boolean
  canAddChapters: boolean
  canUpdateChapters: boolean
  canDeleteChapters: boolean
}
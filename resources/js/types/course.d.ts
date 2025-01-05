export interface Course {
  id: number;
  course_name: string;
  thumbnail: string;
  category_id: number;
  grade_id?: number;
  department_id?: number;
  batch_id?: number;
  number_of_chapters: number;
}

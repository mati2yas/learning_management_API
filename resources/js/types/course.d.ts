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
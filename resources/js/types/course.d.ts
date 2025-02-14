export interface Course{
  topicsCount: number;
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
  paidCourses: number;
  price_one_month: number;
  on_sale_one_month: number;
  price_three_month: number;
  on_sale_three_month: number;
  price_six_month: number;
  on_sale_six_month: number;
  price_one_year: number;
  on_sale_one_year: number;
  created_at: string;
  updated_at: string;
  stream: null |"natural"|"social"
  created_by:{
    name: string;
  } 
  updated_by:{
    name: string;
  } 
}
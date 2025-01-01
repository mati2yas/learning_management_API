import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { CourseCard } from '@/Components/CourseCard'
import { PageProps } from '@/types'
import { CreateCourseAlert } from './CreateCourseAlert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import Pagination from '@/Components/Pagination';

interface Category {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  name: string;
  category_id: number;
}

interface Department {
  id: number;
  name: string;
  category_id: number;
}

interface Batch {
  id: number;
  name: string;
  department_id: number;
}

interface Course {
  id: number;
  name: string;
  thumbnail: string;
  category_id: number;
  grade_id?: number;
  department_id?: number;
  batch_id?: number;
  number_of_topics: number;
}

interface IndexProps extends PageProps {
  categories: Category[];
  grades: Grade[];
  departments: Department[];
  batches: Batch[];
  courses: Course[];
}

// Dummy data for visualization
const dummyCategories: Category[] = [
  { id: 1, name: 'Lower Grades' },
  { id: 2, name: 'Higher Grades' },
  { id: 3, name: 'University' },
  { id: 4, name: 'Random Courses' },
];

const dummyGrades: Grade[] = [
  { id: 1, name: 'Grade 1', category_id: 1 },
  { id: 2, name: 'Grade 2', category_id: 1 },
  { id: 11, name: 'Grade 11', category_id: 2 },
  { id: 12, name: 'Grade 12', category_id: 2 },
];

const dummyDepartments: Department[] = [
  { id: 1, name: 'Computer Science', category_id: 3 },
  { id: 2, name: 'Freshman', category_id: 3 },
];

const dummyBatches: Batch[] = [
  { id: 1, name: '2nd Year', department_id: 1 },
  { id: 2, name: '3rd Year', department_id: 1 },
];

const dummyCourses: Course[] = [
  {
    id: 1,
    name: 'Introduction to Programming',
    thumbnail: 'https://picsum.photos/200/300',
    category_id: 1,
    grade_id: 1,
    number_of_topics: 10,
  },
  {
    id: 2,
    name: 'Advanced Mathematics',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category_id: 2,
    grade_id: 11,
    number_of_topics: 15,
  },
  {
    id: 3,
    name: 'Data Structures and Algorithms',
    thumbnail: 'https://picsum.photos/200',
    category_id: 3,
    department_id: 1,
    batch_id: 1,
    number_of_topics: 20,
  },
  {
    id: 4,
    name: 'Creative Writing',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category_id: 4,
    number_of_topics: 8,
  },
  {
    id: 4,
    name: 'Marketing',
    thumbnail: 'https://picsum.photos/300',
    category_id: 4,
    number_of_topics: 8,
  },
  {
    id: 4,
    name: 'Water Color Painting',
    thumbnail: 'https://picsum.photos/100',
    category_id: 4,
    number_of_topics: 8,
  },
  {
    id: 4,
    name: 'Intro to Programming',
    thumbnail: 'https://picsum.photos/230',
    category_id: 4,
    number_of_topics: 8,
  },
  {
    id: 4,
    name: 'Accounting',
    thumbnail: 'https://picsum.photos/250',
    category_id: 4,
    number_of_topics: 8,
  },
];

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}




const Index = ({ auth, categories = dummyCategories, grades = dummyGrades, departments = dummyDepartments, batches = dummyBatches, courses = dummyCourses }: IndexProps) => {
  const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || '';
  const getGradeName = (id: number) => grades.find(g => g.id === id)?.name || '';
  const getDepartmentName = (id: number) => departments.find(d => d.id === id)?.name || '';
  const getBatchName = (id: number) => batches.find(b => b.id === id)?.name || '';


  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCourses = courses.filter(course => 
    (selectedCategory === 'all' || course.category_id.toString() === selectedCategory) &&
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    console.log(`Page changed to: ${page}`);
    // Add your pagination logic here
  };

  return (
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <CreateCourseAlert
            categories={categories}
            grades={grades}
            departments={departments}
            batches={batches}
          />
        </div>
      }
    >
      <Head title='Courses' />
      <div className="py-12">
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto">

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto relative">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[300px] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>



          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  name={course.name}
                  thumbnail={course.thumbnail}
                  category={getCategoryName(course.category_id)}
                  grade={course.grade_id ? getGradeName(course.grade_id) : undefined}
                  department={course.department_id ? getDepartmentName(course.department_id) : undefined}
                  batch={course.batch_id ? getBatchName(course.batch_id) : undefined}
                  topicsCount={course.number_of_topics}
                />
              ))}
            </div>
              {courses.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  No courses found matching your criteria.
                </div>
              )}
          </div>
          <div className="mt-6">
            <Pagination
              currentPage={courses.current_page}
              lastPage={courses.last_page}
              total={courses.total}
              from={courses.from}
              to={courses.to}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

   
      </div>
    </AuthenticatedLayout>
  )
}

export default Index


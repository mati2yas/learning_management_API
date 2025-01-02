import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { CreateCourseAlert } from './CreateCourseAlert'
import { CourseCard } from '@/Components/CourseCard'

import { PageProps } from '@/types'
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Search } from 'lucide-react'


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

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface IndexProps extends PageProps {
  categories: Category[];
  grades: Grade[];
  departments: Department[];
  batches: Batch[];
}

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

const generateDummyCourses = (count: number): Course[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Course ${i + 1}`,
    thumbnail: `https://source.unsplash.com/random/800x600?education&sig=${i}`,
    category_id: Math.floor(Math.random() * 4) + 1,
    grade_id: Math.random() > 0.5 ? Math.floor(Math.random() * 12) + 1 : undefined,
    department_id: Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : undefined,
    batch_id: Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : undefined,
    number_of_topics: Math.floor(Math.random() * 20) + 1,
  }));
};

const dummyCourses = generateDummyCourses(50);

const Index = ({ auth, categories = dummyCategories, grades = dummyGrades, departments = dummyDepartments, batches = dummyBatches }: IndexProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedCourses, setPaginatedCourses] = useState<PaginatedData<Course>>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: 1,
    to: 1,
  });

  const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || '';
  const getGradeName = (id: number) => grades.find(g => g.id === id)?.name || '';
  const getDepartmentName = (id: number) => departments.find(d => d.id === id)?.name || '';
  const getBatchName = (id: number) => batches.find(b => b.id === id)?.name || '';

  useEffect(() => {
    const filteredCourses = dummyCourses.filter(course => 
      (selectedCategory === 'all' || course.category_id.toString() === selectedCategory) &&
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const total = filteredCourses.length;
    const lastPage = Math.ceil(total / paginatedCourses.per_page);
    const from = (currentPage - 1) * paginatedCourses.per_page + 1;
    const to = Math.min(currentPage * paginatedCourses.per_page, total);

    setPaginatedCourses({
      data: filteredCourses.slice(from - 1, to),
      current_page: currentPage,
      last_page: lastPage,
      per_page: paginatedCourses.per_page,
      total: total,
      from: from,
      to: to,
    });
  }, [selectedCategory, searchQuery, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
                onChange={handleSearchChange}
                className="w-full sm:w-[300px] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedCourses.data.map((course) => (
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
            {paginatedCourses.data.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                No courses found matching your criteria.
              </div>
            )}
          </div>
          <div className="mt-6">
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Index


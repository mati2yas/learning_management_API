import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { CreateCourseAlert } from './CreateCourseAlert'
import { CourseCard } from '@/Components/CourseCard'
import { PageProps } from '@/types'
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Search } from 'lucide-react'
import { Course } from '@/types/course'


interface Category {
  id: number;
  course_name: string;
  name: string;
}

interface Grade {
  id: number;
  category_id: number;
  grade_name: string;
  stream: string;
}

interface Department {
  id: number;
  department_name: string;
  category_id: number;
}

interface Batch {
  id: number;
  batch_name: string;
  department_id: number;
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
  courses: Course[];
}


const Index = ({
  auth,
  categories = [],
  grades = [],
  departments = [],
  batches = [],
  courses = [],
}: IndexProps) => {

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
  const getGradeName = (id: number) => grades.find(g => g.id === id)?.grade_name || '';
  const getDepartmentName = (id: number) => departments.find(d => d.id === id)?.department_name || '';
  const getBatchName = (id: number) => batches.find(b => b.id === id)?.batch_name || '';

  useEffect(() => {
    const filteredCourses = courses.filter(course => 
      (selectedCategory === 'all' || course.category_id.toString() === selectedCategory) &&
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [selectedCategory, searchQuery, currentPage, courses]);

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
                      {category.name.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
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
                  name={course.course_name}
                  thumbnail={course.thumbnail}
                  category={getCategoryName(course.category_id)}
                  grade={course.grade_id ? getGradeName(course.grade_id) : undefined}
                  department={course.department_id ? getDepartmentName(course.department_id) : undefined}
                  batch={course.batch_id ? getBatchName(course.batch_id) : undefined}
                  topicsCount={course.number_of_chapters}
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



import React from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { CreateCourseAlert } from './CreateCourseAlert'
import { CourseCard } from '@/Components/CourseCard'
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Search } from 'lucide-react'
import { IndexProps } from '@/types/index.d'



const Index: React.FC<IndexProps> = ({
  courses,
  categories,
  grades,
  departments,
  batches,
  filters,
}) => {
 

  const { data, setData } = useForm({
    category: filters.category || '',
    search: filters.search || '',
  });

  const handleCategoryChange = (value: string) => {
    const categoryValue = value === 'all' ? '' : value;
    setData('category', categoryValue);
    updateFilters({ category: categoryValue });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setData('search', query);
    updateFilters({ search: query });
  };

  const updateFilters = (newFilters: Partial<typeof data>) => {
    router.get(route('courses.index'), { ...data, ...newFilters }, {
      preserveState: true,
      preserveScroll: true,
      only: ['courses'],
    });
  };


  const getCategoryName = (id: number) => categories.find((c: { id: number }) => c.id === id)?.name || '';

  const getGradeName = (id: number) => grades.find((g: { id: number }) => g.id === id)?.grade_name || '';


  const getDepartmentName = (id: number) => departments.find((d: { id: number }) => d.id === id)?.department_name || '';


  const getBatchName = (id: number) => batches.find((b: { id: number }) => b.id === id)?.batch_name || '';

  return (
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
          <React.Fragment>
            <h1 className="text-2xl font-semibold">Courses</h1>
            <CreateCourseAlert
            />
          </React.Fragment>
        </div>
      }
    >
      <Head title='Courses' />
      <div className="py-12">
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto">
              <Select value={data.category || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: { id: React.Key | null | undefined; name: string }) => (
                    <SelectItem key={category.id ?? ''} value={(category.id ?? '').toString()}>
                      {category.name.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto relative">
              <Input
                type="text"
                placeholder="Search courses..."
                value={data.search}
                onChange={handleSearchChange}
                className="w-full sm:w-[300px] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {courses.data.map((course) => (
                <CourseCard
                  key={course.id}
                  id={Number(course.id)}
                  name={course.course_name}
                  thumbnail={course.thumbnail}
                  category={getCategoryName(course.category_id)}
                  grade={course.grade_id ? getGradeName(course.grade_id) : undefined}
                  department={course.department_id ? getDepartmentName(course.department_id) : undefined}
                  batch={course.batch_id ? getBatchName(course.batch_id) : undefined}
                  topicsCount={course.topicsCount}
                  saves={course.saves}
                  likes={course.likes} 
                  price_one_month={course.price_one_month} 
                  price_three_month={course.price_three_month} 
                  price_six_month={course.price_six_month} 
                  price_one_year={course.price_one_year} 
                  created_by={course.created_by}
                  updated_by={course.updated_by}
                  created_at={course.created_at}                 
                  />
              ))}
            </div>
            {courses.data.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                No courses found matching your criteria.
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-center items-center space-x-2">
            {courses.meta.links?.map((link: { url: any; active: any; label: any }, index: React.Key | null | undefined) => (
              <Link
                key={index}
                href={link.url || '#'}
                className={`px-4 py-2 border rounded ${
                  link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
                preserveScroll
                preserveState
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
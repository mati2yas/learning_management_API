import { Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, Users, Layers, GraduationCap, Building } from 'lucide-react';
import { EnhancedTableDemo } from "@/Components/TableDemo";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import CreateChapter from './CreateChapter';
import DeleteCourseAlert from "./DeleteCourseAlert";
import { UpdateCourseAlert } from "./UpdateCourseAlert";
import ChapterCard from "@/Components/ChapterCard";
import { ShowCourseProps } from "@/types/show";

const Show = ({
  course, 
  thumbnail, 
  category_name, 
  department_name, 
  batch_name, 
  chapters,
  categories,
  grades,
  departments,
  batches,
}: ShowCourseProps) => {

  const gradeName = grades.find((grade) => grade.id === course.grade_id)?.grade_name || "N/A";

  return (
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-semibold">Courses - {course.course_name}</h1>
        </div>
      }
    >
      <Head title={course.course_name} />
      <div className="py-12">
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Course Details */}
            <Card className="w-full lg:w-2/3">
              <CardContent className="p-0">
                <img 
                  src={thumbnail} 
                  alt={course.course_name} 
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4">{course.course_name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={<BookOpen className="w-5 h-5" />} label="Chapters" value={course.number_of_chapters} />
                    <InfoItem icon={<Layers className="w-5 h-5" />} label="Category" value={category_name.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())} />
                    {course.grade_id && (
                      <InfoItem icon={<GraduationCap className="w-5 h-5" />} label="Grade" value={gradeName} />
                    )}
                    {course.department_id && (
                      <InfoItem icon={<Building className="w-5 h-5" />} label="Department" value={department_name} />
                    )}
                    {course.batch_id && (
                      <InfoItem icon={<Users className="w-5 h-5" />} label="Batch" value={batch_name} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Admin Actions and Statistics */}
            <div className="w-full lg:w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <UpdateCourseAlert 
                    course={course}
                    categories={categories}
                    grades={grades}
                    departments={departments}
                    batches={batches}
                    thumbnail={thumbnail}
                  />
                  
                  <DeleteCourseAlert id={course.id} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <StatItem label="Enrolled Students" value="120" />
                  <StatItem label="Average Rating" value="4.5/5" />
                  <StatItem label="Completion Rate" value="78%" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Part For Chapters */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Chapters</CardTitle>
                <CreateChapter 
                  id={course.id}
                  course_name={course.course_name}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <EnhancedTableDemo chapters={chapters} />
                </TabsContent>
                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {
                      chapters.map((chapter, index) => 
                      <ChapterCard 
                      key={index}
                          chapter={chapter}
                      />)
                    }
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span className="text-gray-600">{label}:</span>
    <span className="font-semibold">{value}</span>
  </div>
)

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}:</span>
    <span className="font-semibold">{value}</span>
  </div>
)


export default Show


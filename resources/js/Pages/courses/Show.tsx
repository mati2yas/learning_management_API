import { Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Course } from "@/types/course";
import { BookOpen, Users, Layers, GraduationCap, Building, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { EnhancedTableDemo } from "@/Components/TableDemo";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

interface ShowProps {
  course: Course;
  thumbnail: string;
  category_name: string;
  department_name: string;
  batch_name: string;
}

const Show = ({course, thumbnail, category_name, department_name, batch_name}: ShowProps) => {
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
                      <InfoItem icon={<GraduationCap className="w-5 h-5" />} label="Grade" value={course.grade_id} />
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
                  <Button 
                    onClick={() => handleUpdate(course)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Pencil className="w-5 h-5 mr-2" />
                    Update Course
                  </Button>
                  <Button 
                    onClick={() => handleDelete(course)}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Course
                  </Button>
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
                <Button>
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Chapter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <EnhancedTableDemo />
                </TabsContent>
                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {[...Array(6)].map((_, index) => (
                      <ChapterCard key={index} />
                    ))}
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

const ChapterCard = () => (
  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold mb-2">Chapter Title</h3>
      <p className="text-sm text-gray-600 mb-4">Brief description of the chapter content goes here.</p>
      <div className="flex justify-between items-center">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">5 lessons</span>
        <Button variant="outline" size="sm">View</Button>
      </div>
    </CardContent>
  </Card>
)

const handleUpdate = (course: Course) => {
  // Implement update logic here
  console.log('Update course:', course.id);
};

const handleDelete = (course: Course) => {
  // Implement delete logic here
  console.log('Delete course:', course.id);
};

export default Show


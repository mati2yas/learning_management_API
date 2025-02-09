import type React from "react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import EditExamCourseAlert from "./EditExamCourseAlert"
import type { ExamGrade, ExamType } from "@/types"
import DeleteExamCourseAlert from "./DeleteExamCourseAlert"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Head, router, useForm } from "@inertiajs/react"
import { SessionToast } from "@/Components/SessionToast"
import ExamChapterView from "./ChapterView"
import CreateExamCourseAlert from "../Exams/CreateExamCourseAlert"
dayjs.extend(relativeTime)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Input } from "@/Components/ui/input"
import { Search } from "lucide-react"

interface IndexProps {
  examCourses: any[]
  canEdit: boolean
  canDelete: boolean
  canView: boolean
  examTypes: ExamType[]
  examGrades: ExamGrade[]
  session: any
  filters: any
}

const Index: React.FC<IndexProps> = ({
  examCourses,
  canEdit,
  canDelete,
  canView,
  examTypes,
  examGrades,
  session,
  filters,
}) => {
  const { data, setData } = useForm({
    examType: filters?.examType || "",
    search: filters?.search || "",
  })

  const updateFilters = (newFilters: Partial<typeof data>) => {
    router.get(
      route("exam-courses.index"),
      { ...data, ...newFilters },
      {
        preserveState: true,
        preserveScroll: true,
      },
    )
  }

  const handleTypeChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      examType: value,
    }))
    updateFilters({ examType: value })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setData("search", query)
    updateFilters({ search: query })
  }

  return (
    <Authenticated header={<h1 className="text-2xl font-semibold">Exam Courses</h1>}>
      <Head title="Exam Courses" />
      {session && <SessionToast message={session} />}
      <div className="py-12">
        <div className="max-w-[1300px] mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <Select value={data.examType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Exam Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Exam Types</SelectItem>
                    {examTypes?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name.replace(/_/g, " ").replace(/\b\w/g, (char: string) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search Exam courses..."
                    value={data.search}
                    onChange={handleSearchChange}
                    className="w-[300px] pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <CreateExamCourseAlert examTypes={examTypes} examGrades={examGrades} />
            </div>

            <Table>
              <TableCaption>A list of exam courses</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Chapters</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examCourses?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.exam_grade.grade}</TableCell>
                    <TableCell>{course.exam_type.name}</TableCell>
                    <TableCell>{dayjs(course.created_at).fromNow()}</TableCell>
                    <TableCell>{dayjs(course.updated_at).fromNow()}</TableCell>
                    <TableCell>
                      <ExamChapterView
                        examChapters={course.exam_chapters}
                        courseName={course.course_name}
                        examCourseId={course.id}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <EditExamCourseAlert examTypes={examTypes} examGrades={examGrades} examCourse={course} />
                      <DeleteExamCourseAlert id={course.id} course_name={course.course_name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

export default Index


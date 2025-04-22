import type React from "react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import EditExamCourseAlert from "./EditExamCourseAlert"
import type { ExamGrade, ExamType } from "@/types"
import DeleteExamCourseAlert from "./DeleteExamCourseAlert"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Head, useForm } from "@inertiajs/react"
import { SessionToast } from "@/Components/SessionToast"
import ExamChapterView from "./ChapterView"
import CreateExamCourseAlert from "../Exams/CreateExamCourseAlert"
dayjs.extend(relativeTime)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Input } from "@/Components/ui/input"
import { Edit2, PlusIcon, Search, Trash2 } from "lucide-react"
import PermissionAlert from "@/Components/PermissionAlert"
import { Badge } from "@/Components/ui/badge"
import { router as route } from "@inertiajs/react"
// import { console } from "inspector"

interface IndexProps {
  examCourses: any[]
  canAddExamCourse: boolean
  canUpdateExamCourse: boolean
  canDeleteExamCourse: boolean
  examTypes: ExamType[]
  examGrades: ExamGrade[]
  session: any
  filters: any
}

const Index: React.FC<IndexProps> = ({
  examCourses,
  canAddExamCourse,
  canUpdateExamCourse,
  canDeleteExamCourse,
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
    route.get(
      "exam-courses.index",
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

              {canAddExamCourse ? (
                <CreateExamCourseAlert examTypes={examTypes} examGrades={examGrades} />
              ) : (
                <PermissionAlert
                  children={"Add Course/Chapter"}
                  permission={"can add course"}
                  buttonVariant={"outline"}
                  className="p-2 text-xs"
                  icon={<PlusIcon className="w-5 h-5 mr-2" />}
                />
              )}
            </div>

            <Table>
              <TableCaption>A list of exam courses</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Grades</TableHead>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Chapters</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examCourses?.map((course) => {
                  // Display grades if they're already loaded with the course
                  const associatedGrades = course.exam_grades || []

                  return (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.course_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {associatedGrades.length > 0 ? (
                            associatedGrades.map((grade: ExamGrade) => (
                              <Badge key={grade.id} variant="outline" className="mr-1">
                                Grade {grade.grade}
                                {grade.stream && <span className="ml-1 capitalize">({grade.stream})</span>}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No grades assigned</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{course.exam_type.name}</TableCell>
                      <TableCell>{dayjs(course.created_at).fromNow()}</TableCell>
                      <TableCell>{dayjs(course.updated_at).fromNow()}</TableCell>
                      <TableCell>
                        
                        {canUpdateExamCourse ? (
                          <ExamChapterView examCourse={course} />
                        ) : (
                          <PermissionAlert
                            children={"Edit"}
                            permission={"can edit an exam course"}
                            buttonSize={"sm"}
                            buttonVariant={"outline"}
                            className={"text-green-600 hover:text-green-700 hover:bg-green-50"}
                            icon={<Edit2 className="h-4 w-4 mr-1" />}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">

                        {canDeleteExamCourse ? (
                          <DeleteExamCourseAlert id={course.id} course_name={course.course_name} />
                        ) : (
                          <PermissionAlert
                            children={"Delete"}
                            permission={"can delete an exam course"}
                            buttonSize={"sm"}
                            buttonVariant={"outline"}
                            className={"text-red-600 hover:text-red-700 hover:bg-red-50"}
                            icon={<Trash2 className="h-4 w-4 mr-1" />}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

export default Index

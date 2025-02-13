import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Head, Link, router, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import type { ExamChapter, ExamCourse, ExamGrade, ExamQuestion, ExamType, ExamYear } from "@/types"
import CreateExamQuestionAlert from "../Exam-Questions/CreateExamQuestionAlert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/Components/ui/input"
import QuestionCard from "./QuestionCard"
import axios from "axios"
import { SessionToast } from "@/Components/SessionToast"
import PermissionAlert from "@/Components/PermissionAlert"
// import { Inertia } from "@inertiajs/react"

interface ExamIndexProps {
  exam_courses: ExamCourse[]
  exam_chapters: ExamChapter[]
  exam_grades: ExamGrade[]
  exam_years: ExamYear[]
  exam_types: ExamType[]
  exam_questions: {
    data: ExamQuestion[]
    links: Array<{
      url: string | null
      active: boolean
      label: string
    }>
  }
  filters: {
    examType: string
    search: string
    year: string
    examCourse: string
    examGrade: string
    examChapter: string
  }
  canAddExamQuestions: boolean,
  canUpdateExamQuestions: boolean,
  canDeleteExamQuestions: boolean,

  session: string
}

const Index: React.FC<ExamIndexProps> = ({
  exam_courses,
  exam_questions,
  exam_chapters,
  exam_years,
  exam_types,
  exam_grades,
  filters,
  canAddExamQuestions,
  canUpdateExamQuestions,
  canDeleteExamQuestions,
  session
}) => {
  
  const { data, setData } = useForm({
    examType: filters?.examType || "",
    search: filters?.search || "",
    year: filters?.year || "",
    examCourse: filters?.examCourse || "",
    examGrade: filters?.examGrade || "",
    examChapter: filters?.examChapter || "",
  })

  const [filteredExamCourses, setFilteredExamCourses] = useState<ExamCourse[]>([])
  const [filteredExamChapters, setFilteredExamChapters] = useState<ExamChapter[]>([])

  const fetchExamCourses = useCallback(async (examTypeId: string) => {
    if (!examTypeId) return
    try {
      const response = await axios.get(`/api/exam-courses/${examTypeId}`)
      setFilteredExamCourses(response.data)
    } catch (error) {
      console.error("Error fetching exam courses:", error)
      setFilteredExamCourses([])
    }
  }, [])

  const fetchExamChapters = useCallback(async (examCourseId: string) => {
    if (!examCourseId) return
    try {
      const response = await axios.get(`/api/exam-chapters/${examCourseId}`)
      setFilteredExamChapters(response.data)
    } catch (error) {
      console.error("Error fetching exam chapters:", error)
      setFilteredExamChapters([])
    }
  }, [])

  const handleTypeChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      examType: value,
      examCourse: "",
      examGrade: "",
      examChapter: "",
    }))
    updateFilters({ examType: value, examCourse: "", examGrade: "", examChapter: "" })
    fetchExamCourses(value)
  }

  const handleYearChange = (value: string) => {
    setData("year", value)
    updateFilters({ year: value })
  }

  const handleExamCourseChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      examCourse: value,
      examChapter: "",
    }))
    updateFilters({ examCourse: value, examChapter: "" })
    fetchExamChapters(value)
  }

  const handleExamGradeChange = (value: string) => {
    setData("examGrade", value)
    updateFilters({ examGrade: value })
  }

  const handleExamChapterChange = (value: string) => {
    setData("examChapter", value)
    updateFilters({ examChapter: value })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setData("search", query)
    updateFilters({ search: query })
  }

  const updateFilters = (newFilters: Partial<typeof data>) => {
    router.get(
      route("exams.index"),
      { ...data, ...newFilters },
      {
        preserveState: true,
        preserveScroll: true,
      },
    )
  }

  useEffect(() => {
    if (data.examType) {
      fetchExamCourses(data.examType)
    }
  }, [data.examType, fetchExamCourses])

  useEffect(() => {
    if (data.examCourse) {
      fetchExamChapters(data.examCourse)
    }
  }, [data.examCourse, fetchExamChapters])

  const showExamGrade = () => {
    const selectedExamType = exam_types?.find((type) => type.id.toString() === data.examType)
    return selectedExamType && !["NGAT", "EXIT",'SAT','UAT','EXAM'].includes(selectedExamType.name.toUpperCase())
  }

  const getExamTypeName = (id: number) => exam_types.find((c) => c.id === id)?.name || ""
  const getExamCourseName = (id: number) => exam_courses.find((c) => c.id === id)?.course_name || ""
  const getChapterTitle = (id: number) => exam_chapters?.find((g) => g.id === id)?.title || ""
  const getExamYear = (id: number) => exam_years.find((d) => d.id === id)?.year || ""

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <div>
          <h1 className="text-2xl font-semibold">Exams</h1>
          </div>
          
          <div className="flex gap-2">
            {
              canAddExamQuestions ? <CreateExamQuestionAlert exam_years={exam_years} exam_types={exam_types} exam_grades={exam_grades} /> : <PermissionAlert children={"Add Exam Questions"} 
              permission={"can add exam questions"}   
              buttonVariant={'outline'}
              icon={<PlusCircle className="mr-2 h-4 w-4" />}             
              />
            }
           
          </div>
        </div>
      }
    >
      <Head title="Exams" />
      {
        session ? <SessionToast message={session} /> : null
      }
      <div className="py-12">
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">

            <div className="flex flex-wrap gap-4">
              <Select value={data.examType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  {exam_types?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name.replace(/_/g, " ").replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {showExamGrade() && (
                <Select value={data.examGrade} onValueChange={handleExamGradeChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {exam_grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id.toString()}>
                        Grade - {grade.grade} {grade.stream? grade.stream : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={data.examCourse} onValueChange={handleExamCourseChange} disabled={!data.examType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {filteredExamCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={data.examChapter} onValueChange={handleExamChapterChange} disabled={!data.examCourse}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {filteredExamChapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id.toString()}>
                      {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={data.year} onValueChange={handleYearChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {exam_years?.map((exam_year) => (
                    <SelectItem key={exam_year.id} value={exam_year.id.toString()}>
                      {exam_year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto relative">
              <Input
                type="text"
                placeholder="Search Exam questions..."
                value={data.search}
                onChange={handleSearchChange}
                className="w-full sm:w-[300px] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exam_questions?.data.map((question) => (
              <QuestionCard
                key={question.id}
                question={{
                  ...question,
                  options: question.options,
                  answer: question.answer,
                }}
                examTypes={exam_types}
                getExamCourseName={getExamCourseName}
                getChapterTitle={getChapterTitle}
                getExamYear={getExamYear} examGrades={exam_grades} examYears={exam_years}  
                canEdit={canUpdateExamQuestions}
                canDelete={canDeleteExamQuestions}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center items-center space-x-2">
            {exam_questions?.links.map((link, index) => (
              <Link
                key={index}
                href={link.url || "#"}
                className={`px-4 py-2 border rounded ${
                  link.active ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                } ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}`}
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


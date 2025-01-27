import React from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { ExamChapter, ExamCourse, ExamGrade, ExamQuestion, ExamType, ExamYear } from '@/types'
import CreateExamQuestionAlert from '../Exam-Questions/CreateExamQuestionAlert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Search } from 'lucide-react'
import { Input } from '@/Components/ui/input'
import QuestionCard from './QuestionCard'

interface ExamIndexProps{
  exam_courses: ExamCourse[]
  exam_chapters: ExamChapter[]
  exam_grades: ExamGrade[]
  exam_years?: ExamYear[]
  exam_types?: ExamType[]
  exam_questions: {
    data: ExamQuestion[]
    links: Array<{
      url: string | null;
      active: boolean;
      label: string;
    }>
  }
  filters:{
    examType: string
    search: string
    year: string
  }
}


const dummyExamQuestions: ExamQuestion[] = [
  {
    id: 1,
    question_text: 'What is the capital of France?',
    exam_course_id: 1,
    exam_chapter_id: 1,
    exam_year_id: 1,
    options: JSON.stringify({ A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' }),
    answer: JSON.stringify(['A']),
  },
  {
    id: 2,
    question_text: 'What is 2 + 2?',
    exam_course_id: 1,
    exam_chapter_id: 1,
    exam_year_id: 1,
    options: JSON.stringify({ A: '3', B: '4', C: '5', D: '6' }),
    answer: JSON.stringify(['B']),
  },
  {
    id: 3,
    question_text: 'What is the largest planet in our solar system?',
    exam_course_id: 1,
    exam_chapter_id: 1,
    exam_year_id: 1,
    options: JSON.stringify({ A: 'Earth', B: 'Mars', C: 'Jupiter', D: 'Saturn' }),
    answer: JSON.stringify(['C']),
  },
  {
    id: 4,
    question_text: 'What is the chemical symbol for water?',
    exam_course_id: 1,
    exam_chapter_id: 1,
    exam_year_id: 1,
    options: JSON.stringify({ A: 'H2O', B: 'O2', C: 'CO2', D: 'NaCl' }),
    answer: JSON.stringify(['A']),
  }
]


const Index: React.FC<ExamIndexProps> = ({
  exam_courses,
  exam_questions = { data: dummyExamQuestions, links: [] },
  exam_chapters,
  exam_years,
  exam_types,
  filters
}) => {

  // console.log(exam_courses)

  const{data, setData} = useForm({
    examType: filters?.examType || '',
    search: filters?.search || '',
    year: filters?.year || '',
  })

  const handleTypeChange = (value: string) => {
    const typeValue = value === 'all' ? '' : value;
    setData('examType', typeValue);
    updateFilters({ examType: typeValue });
  };

  const handleYearChange = (value: string) =>{
    const yearValue = value === 'all' ? '' : value;
    setData('year', yearValue);
    updateFilters({ year: yearValue });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setData('search', query);
    updateFilters({ search: query });
  };


  const updateFilters = (newFilters: Partial<typeof data>) => {
    router.get(route('exams.index'), { ...data, ...newFilters }, {
      preserveState: true,
      preserveScroll: true,
      // only: ['courses'],
    });
  };

  const getExamTypeName = (id: number) => (exam_types ?? []).find((c: { id: number }) => c.id === id)?.name || '';

  const getExamCourseName = (id: number) => exam_courses?.find((c: { id: number }) => c.id === id)?.course_name || '';

  const getChapterTitle = (id: number) => exam_chapters?.find((g: { id: number }) => g.id === id)?.title || '';


  const getExamYear = (id: number) => (exam_years ?? []).find((d: { id: number }) => d.id === id)?.year || '';

  return(
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
          <React.Fragment>
            <h1 className="text-2xl font-semibold">Exams</h1>
            <CreateExamQuestionAlert
              exam_types={exam_types}
            />
          </React.Fragment>
        </div>
        }
      >
        <Head title="Exams" />
        <div className="py-12">
          <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
            
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">

            <div className='flex'>
              <div className="w-full sm:w-auto">
                <Select value={data.examType || 'all'} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Type</SelectItem>
                    {exam_types && exam_types.map((category: { id: React.Key | null | undefined; name: string }) => (
                      <SelectItem key={category.id ?? ''} value={(category.id ?? '').toString()}>
                        {category.name.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='w-full sm:w-auto'>
                <Select value={data.examType || 'all'} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="all">All Type</SelectItem> */}
                    {exam_years && exam_years.map((exam_year) => (
                      <SelectItem key={exam_year.id ?? ''} value={(exam_year.id ?? '').toString()}>
                        {exam_year.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exam_questions.data.map((question) => {
              console.log("Question data in parent:", question)
              return (
                <QuestionCard
                  key={question.id}
                  question={{
                    ...question,
                    options: question.options,
                    answer: question.answer,
                  }}
                  getExamCourseName={getExamCourseName}
                  getChapterTitle={getChapterTitle}
                  getExamYear={getExamYear}
                />
              )
            })}


          </div>


          <div className="mt-6 flex justify-center items-center space-x-2">
            {exam_questions?.links.map((link: { url: any; active: any; label: any }, index: React.Key | null | undefined) => (
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


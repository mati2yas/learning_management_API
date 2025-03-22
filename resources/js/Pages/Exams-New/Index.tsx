import { ErrorToast } from "@/Components/ErrorToast"
import { SessionToast } from "@/Components/SessionToast"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { ExamType } from "@/types"
import { Head, usePage, Link } from "@inertiajs/react"
import { BookOpen, FileText, ArrowUpRight, Users, Calendar, Award, CheckCircle, Clock, Bookmark } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"

interface ExamIndexProps {
  exam_types: ExamType[]
}

const Index = ({ exam_types }: ExamIndexProps) => {

  console.log(exam_types)

  const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } }

  // Function to get a random number for placeholder stats
  const getRandomStat = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Function to get icon config based on exam type name
  const getIconConfig = (name: string) => {
    const configs = [
      {
        icon: BookOpen,
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-600 dark:text-blue-300",
        accentColor: "bg-blue-500/10 dark:bg-blue-500/20",
      },
      {
        icon: FileText,
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        textColor: "text-emerald-600 dark:text-emerald-300",
        accentColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
      },
      {
        icon: Users,
        bgColor: "bg-violet-50 dark:bg-violet-900/20",
        textColor: "text-violet-600 dark:text-violet-300",
        accentColor: "bg-violet-500/10 dark:bg-violet-500/20",
      },
      {
        icon: Calendar,
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        textColor: "text-amber-600 dark:text-amber-300",
        accentColor: "bg-amber-500/10 dark:bg-amber-500/20",
      },
      {
        icon: Award,
        bgColor: "bg-rose-50 dark:bg-rose-900/20",
        textColor: "text-rose-600 dark:text-rose-300",
        accentColor: "bg-rose-500/10 dark:bg-rose-500/20",
      },
    ]

    const index = name.length % configs.length
    return configs[index]
  }

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Exams New</h1>
          </div>

          <div className="flex gap-2"></div>
        </div>
      }
    >
      <Head title="Exams New" />
      {flash.success && <SessionToast message={flash.success} />}
      {flash.error && <ErrorToast message={flash.error} />}

      <div className="py-12">
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exam_types.map((examType) => {

              const iconConfig = getIconConfig(examType.name)
              const { icon: Icon, bgColor, textColor, accentColor } = iconConfig

              return (
                <Link key={examType.id} prefetch href={route('exams-new.show', examType.id)} className="group block h-full">
                  <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-xl relative border-gray-200 dark:border-gray-800 hover:scale-[1.02]">
                    {/* Subtle pattern background */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjUiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTguMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE3Ljl6TTI0IDI2aC0zdjNoM3YtM3ptMCA2aC0zdjNoM3YtM3ptNi02aC0zdjNoM3YtM3ptMCA2aC0zdjNoM3YtM3ptNi02aC0zdjNoM3YtM3ptMCA2aC0zdjNoM3YtM3oiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>

                    <div className="absolute top-4 right-4 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 z-10">
                      <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md group-hover:shadow-lg transition-all duration-300">
                        <ArrowUpRight className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:scale-110" />
                      </div>
                    </div>

                    <CardHeader className="relative z-10 pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${bgColor} shadow-sm`}>
                          <Icon className={`h-7 w-7 ${textColor}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{examType.name}</h3>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className={`${accentColor} ${textColor}`}>
                              ID: {examType.id}
                            </Badge>
                            <Badge variant="outline" className={`${accentColor} ${textColor}`}>
                              {examType.total_years} {examType.total_years === 1 ? "Year" : "Years"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-2">
                      {/* Main stats with visual elements */}
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-full ${accentColor}`}>
                              <FileText className={`h-5 w-5 ${textColor}`} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Questions</span>
                          </div>
                          <div className="text-2xl font-bold">{examType.total_exam_questions}</div>
                          <div
                            className={`absolute bottom-0 left-0 h-1 ${bgColor}`}
                            style={{ width: `${Math.min(100, examType.total_exam_questions * 2)}%` }}
                          ></div>
                        </div>

                        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-full ${accentColor}`}>
                              <BookOpen className={`h-5 w-5 ${textColor}`} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Courses</span>
                          </div>
                          <div className="text-2xl font-bold">{examType.total_exam_courses}</div>
                          <div
                            className={`absolute bottom-0 left-0 h-1 ${bgColor}`}
                            style={{ width: `${Math.min(100, examType.total_exam_courses * 8)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Student stats with circular progress */}
                      <div className="mt-6">
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${accentColor}`}>
                                <Users className={`h-5 w-5 ${textColor}`} />
                              </div>
                              <div>
                                <div className="text-sm font-medium">Enrolled Students</div>
                                <div className="text-2xl font-bold">{examType.total_users}</div>
                              </div>
                            </div>

                            {/* Circular progress indicator */}
                            <div className="relative w-14 h-14">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                  className="text-gray-200 dark:text-gray-700"
                                  strokeWidth="8"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="40"
                                  cx="50"
                                  cy="50"
                                />
                                <circle
                                  className={textColor}
                                  strokeWidth="8"
                                  strokeDasharray={`${Math.min(85, examType.total_users / 10)} 251.2`}
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="40"
                                  cx="50"
                                  cy="50"
                                  transform="rotate(-90 50 50)"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <CheckCircle className={`h-5 w-5 ${textColor}`} />
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Achievement badges */}
                      {/* <div className="mt-6 flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-center"
                          >
                            <div className={`inline-flex p-2 rounded-full ${accentColor} mb-2`}>
                              {i === 0 && <Award className={`h-4 w-4 ${textColor}`} />}
                              {i === 1 && <Clock className={`h-4 w-4 ${textColor}`} />}
                              {i === 2 && <Bookmark className={`h-4 w-4 ${textColor}`} />}
                            </div>
                            <div className="text-xs font-medium">
                              {i === 0 && "Top Rated"}
                              {i === 1 && "Quick Exam"}
                              {i === 2 && "Certified"}
                            </div>
                          </div>
                        ))}
                      </div> */}
                    </CardContent>

                    <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 text-xs text-muted-foreground relative z-10">
                      <div className="flex justify-between w-full">
                        <span>
                          Created:{" "}
                          {examType.created_at ? new Date(examType.created_at).toLocaleDateString() : "Recently"}
                        </span>
                        <span>
                          Updated:{" "}
                          {examType.updated_at ? new Date(examType.updated_at).toLocaleDateString() : "Recently"}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

export default Index


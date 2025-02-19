import type React from "react"
import { CircularChart } from "@/Components/CircularChart"
import { DashboardCards, type StatCardProps } from "@/Components/dashboard-cards"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"
import { ArrowRight, Book, EqualIcon as EqualApproximately } from "lucide-react"
import CreateCourseAlert from "./courses/CreateCourseAlert"
import PermissionAlert from "@/Components/PermissionAlert"
import type { CarouselContent } from "@/types"
import { CarouselContentList } from "./carousel-content/CarouselContentList"

interface CourseData {
  browser: string
  visitors: number
  fill: string
}

interface DashboardProps {
  chapters: number
  examQuestions: number
  courseData: CourseData[]
  pendingSubscriptions: number
  users: number
  canAdd: boolean
  carouselContents: CarouselContent[]
}

export default function Dashboard({
  chapters,
  examQuestions,
  courseData,
  pendingSubscriptions,
  users,
  canAdd,
  carouselContents,
}: DashboardProps) {
  const isPendingPayments = true

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>
          {canAdd ? (
            <CreateCourseAlert />
          ) : (
            <PermissionAlert
              children={"Add Course"}
              permission={"can add a course"}
              buttonVariant={"outline"}
              className="p-2 text-xs"
            />
          )}
        </div>
      }
    >
      <Head title="Dashboard" />
      <div className="py-12">
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 grid grid-cols-2 gap-3">
              <CircularChart courseData={courseData} />
              {/* <PieChartDemo /> */}
              <div className="flex flex-col gap-6">
                <StatCard
                  title="Total Chapters"
                  value={chapters}
                  icon={<Book className="h-4 w-4 text-muted-foreground" />}
                  description="The total number of chapters uploaded"
                />

                <StatCard
                  title="Total Exam Questions"
                  value={examQuestions}
                  icon={<EqualApproximately className="h-4 w-4 text-muted-foreground" />}
                  description="The total number of examination questions"
                />
              </div>
            </div>

            <div className="p-6">
              <DashboardCards
                totalUsers={users}
                pendingItems={pendingSubscriptions}
                isPendingPayments={isPendingPayments}
                onViewPendingItems={() => {}}
              />
            </div>

            <div className="p-6">
              <CarouselContentList carouselContents={carouselContents} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, actionLabel, onAction }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-5xl font-bold">{value.toLocaleString()}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
    {actionLabel && onAction && (
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={onAction}>
          {actionLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    )}
  </Card>
)


import { Card, CardContent, CardFooter } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Link } from "@inertiajs/react"
import { CalendarDays, BookOpen, ThumbsUp, Bookmark, User } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from "react"

dayjs.extend(relativeTime);

interface CourseCardProps {
  id: number
  name: string
  thumbnail: string
  category: string
  grade?: string
  department?: string
  batch?: string
  topicsCount: number
  saves: number
  likes: number
  paidCourses: number
  price_one_month: number
  price_three_month: number
  price_six_month: number
  price_one_year: number
  created_by: {
    name: string
  }
  updated_by: {
    name: string
  }
  created_at: string
}

interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export function CourseCard({
  id,
  name,
  thumbnail,
  category,
  grade,
  department,
  batch,
  topicsCount,
  saves,
  likes,
  paidCourses,
  price_one_month,
  price_three_month,
  price_six_month,
  price_one_year,
  created_at,
  created_by
}: CourseCardProps) {
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 border-0 rounded-xl">
      <div
        className="relative h-64 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${thumbnail?.startsWith("/id") ? `https://picsum.photos${thumbnail}` : "storage/" + thumbnail})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/80 text-black font-semibold px-3 py-1 rounded-full">
            {(() => {
              const categoryNameMap: Record<string, string> = {
                higher_grades: "High School",
                random_courses: "Courses",
              };

              return categoryNameMap[category] || 
                    category.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
            })()}
          </Badge>

        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-2 capitalize">{name}</h3>
          <div className="flex items-center text-sm text-white space-x-4">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {created_by?.name || ''} 
            </span>
            <span className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2" />
              {dayjs(created_at).format('MMMM D, YYYY') || ''}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {[price_one_month, price_three_month, price_six_month, price_one_year].map((price, index) => {
            if (!price) return null
            const duration = ["1 Month", "3 Months", "6 Months", "1 Year"][index]
            return (
              <Badge key={duration} variant="secondary" className="px-3 py-1 rounded-full text-xs">
                {duration} - {price}Birr
              </Badge>
            )
          })}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mx-2.5">
          <span className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {topicsCount} lessons
          </span>
          <span className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {likes} likes
          </span>
          <span className="flex items-center">
            <Bookmark className="w-4 h-4 mr-1" />
            {saves} saves
          </span>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between w-full">
          <div className="space-x-2">
            {batch && <Badge variant="outline">{batch}</Badge>}
            {grade && <Badge variant="outline">{grade}</Badge>}
            {department && <Badge variant="outline">{department}</Badge>}
          </div>
          <Link href={route("courses.show", id)}>
            <Button variant="default" className="rounded-full px-6">
              View Course
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}


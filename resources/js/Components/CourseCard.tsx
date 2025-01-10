import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Link } from "@inertiajs/react"


interface CourseCardProps {
  id: number
  name: string
  thumbnail: string
  category: string
  grade?: string
  department?: string
  batch?: string
  topicsCount: number;
}

export function CourseCard({ id, name, thumbnail, category, grade, department, batch, topicsCount }: CourseCardProps) {
  console.log(id);
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <img
          src={'storage/'+thumbnail}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-semibold line-clamp-2">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">{category.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</Badge>
          {grade && <Badge variant="outline">{grade}</Badge>}
          {department && <Badge variant="outline">{department}</Badge>}
          {batch && <Badge variant="outline">{batch}</Badge>}
        </div>
        <p className="text-sm text-gray-500">{topicsCount} topics</p>
      </CardContent>
      <CardFooter>
      <Link href={route('courses.show', id)}><Button variant="default" className="w-full">View Course</Button></Link>
        
      </CardFooter>
    </Card>
  )
}


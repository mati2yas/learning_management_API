import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Link } from "@inertiajs/react"
import { SVGAttributes } from 'react';


interface CourseCardProps {
  id: number
  name: string
  thumbnail: string
  category: string
  grade?: string
  department?: string
  batch?: string
  topicsCount: number;
  saves: number;
  likes: number;
  price_one_month: number;
  price_three_month: number;
  price_six_month: number;
  price_one_year: number;
}

export function CourseCard(
  { 
    id, 
    name, 
    thumbnail, category, grade, department, batch, topicsCount, saves, likes, price_one_month, price_three_month, price_six_month, price_one_year  
  }: CourseCardProps) {
  
  console.log(topicsCount)
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

          {price_one_month && <Badge variant="outline">1 Month:
          {price_one_month}</Badge>}

          {price_three_month && <Badge variant="outline">3 Month:{price_three_month}</Badge>}

          {price_six_month && <Badge variant="outline">6 Month:{price_six_month}</Badge>}

          {price_one_year && <Badge variant="outline">1 Year:{price_one_year}</Badge>}

          {batch && <Badge variant="outline">{batch}</Badge>}

          {grade && <Badge variant="outline">{grade}</Badge>}

          {department && <Badge variant="outline">{department}</Badge>}



          {saves && <Badge variant="outline">{batch}</Badge>}
          {likes && <Badge variant="outline">{batch}</Badge>}
        </div>
        <p className="text-sm text-gray-500">{topicsCount} topics</p>
      </CardContent>
      <CardFooter>
      <Link href={route('courses.show', id)}><Button variant="default" className="w-full">View Course</Button></Link>
        
      </CardFooter>
    </Card>
  )
}


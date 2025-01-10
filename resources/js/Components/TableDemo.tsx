import { Edit2, Trash2, Eye } from 'lucide-react'
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Chapter } from '@/types';

interface TableDemoProps{
  chapters: Chapter[];
}

// const chapters = [
//   {
//     id: "1",
//     name: "Introduction to Chemistry",
//     totalContent: 5,
 
//   },
//   {
//     id: "2",
//     name: "Chemical Kinetics",
//     totalContent: 3,
 
//   },
//   {
//     id: "3",
//     name: "Electro Chemistry",
//     totalContent: 7,
   
//   },
//   {
//     id: "4",
//     name: "Chemical Bonds",
//     totalContent: 4,
   
//   },
//   {
//     id: "5",
//     name: "Laboratory Cautions",
//     totalContent: 2,
  
//   },
//   {
//     id: "6",
//     name: "Organic Chemistry",
//     totalContent: 6,

//   },
//   {
//     id: "7",
//     name: "Inorganic Chemistry",
//     totalContent: 5,
//   },
// ]



export function EnhancedTableDemo({
  chapters,
}: TableDemoProps) {

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Table>
        <TableCaption className="pb-4">A list of your recent Chapters.</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[100px] font-bold">No.</TableHead>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Contents</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chapters.map((chapter) => (
            <TableRow key={chapter.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium">{chapter.order}</TableCell>
              <TableCell className="font-semibold text-gray-700">{chapter.title}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {chapter.contents_count} items
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800'
    case 'advanced':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}


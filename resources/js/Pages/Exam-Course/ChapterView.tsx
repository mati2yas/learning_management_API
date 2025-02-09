import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Eye } from "lucide-react"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import type { ExamChapter } from "@/types"
import { Link } from "@inertiajs/react"

interface ExamChapterViewProps {
  examChapters: ExamChapter[]
  courseName: string
  examCourseId: number
}

const ExamChapterView = ({ examChapters, courseName, examCourseId }: ExamChapterViewProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Eye className="h-4 w-4 mr-1" />
          View Chapters
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Chapters</DialogTitle>
          <DialogDescription>
            Chapters for course: <span className="font-semibold">{courseName}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-4 h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Sequence Order</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examChapters.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell className="font-medium">{chapter.title}</TableCell>
                  <TableCell>{chapter.sequence_order}</TableCell>
                  <TableCell>{new Date(chapter.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(chapter.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* <div className="mt-4 flex justify-end">
          <Button asChild>
            <Link href={`/user-managements/${user.id}/edit`}>Edit Chapters</Link>
          </Button>
        </div> */}

      </DialogContent>
    </Dialog>
  )
}

export default ExamChapterView


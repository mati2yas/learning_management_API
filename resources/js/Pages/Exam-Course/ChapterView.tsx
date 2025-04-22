import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Eye, Loader2, Edit, Plus, Save, X, Trash, Pencil } from "lucide-react"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import type { ExamChapter, ExamCourse, ExamGrade } from "@/types"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Badge } from "@/Components/ui/badge"
import axios from "axios"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Checkbox } from "@/Components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface ExamChapterViewProps {
  examCourse: ExamCourse
  onCourseUpdate?: (updatedCourse: ExamCourse) => void
}

const ExamChapterView = ({ examCourse, onCourseUpdate }: ExamChapterViewProps) => {
  // console.log("Exam Course", examCourse)

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [grades, setGrades] = useState<ExamGrade[]>([])
  const [availableGrades, setAvailableGrades] = useState<ExamGrade[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [chaptersMap, setChaptersMap] = useState<Record<string, ExamChapter[]>>({})
  const [allChapters, setAllChapters] = useState<ExamChapter[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingChapter, setEditingChapter] = useState<ExamChapter | null>(null)
  const [selectedGrades, setSelectedGrades] = useState<number[]>([])
  const [isAddingChapter, setIsAddingChapter] = useState(false)
  const [newChapter, setNewChapter] = useState<{
    title: string
    sequence_order: number
    exam_grade_id?: number
  }>({
    title: "",
    sequence_order: 1,
  })

  const [chapters, setChapters] = useState<ExamChapter[]>([])
  const [editingCourseTitle, setEditingCourseTitle] = useState(false)
  const [courseTitle, setCourseTitle] = useState(examCourse.course_name)

  // Fetch grades associated with this course when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchGradesForCourse()
      fetchAvailableGrades()
      setCourseTitle(examCourse.course_name)
    }
  }, [isOpen, examCourse.course_name])

  // Fetch all available grades
  const fetchAvailableGrades = async () => {
    try {
      const response = await axios.get(`/api/exam-grades`)
      setAvailableGrades(response.data)
    } catch (error) {
      console.error("Error fetching available grades:", error)
    }
  }

  // Fetch grades associated with this course
  const fetchGradesForCourse = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/exam-courses/${examCourse.id}/grades`)
      const gradesData = response.data
      setGrades(gradesData)
      console.log("Grades Data", gradesData)

      // Set the first grade as active tab if available
      if (gradesData.length > 0) {
        setActiveTab(gradesData[0].id.toString())
      }

      // Initialize selected grades
      setSelectedGrades(gradesData.map((grade: ExamGrade) => grade.id))

      // Fetch chapters for each grade
      await Promise.all(gradesData.map((grade: ExamGrade) => fetchChaptersForGrade(grade.id)))

      // Also fetch all chapters for this course
      await fetchAllChaptersForCourse()
    } catch (error) {
      console.error("Error fetching grades:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch chapters for a specific grade and course
  const fetchChaptersForGrade = async (gradeId: number) => {
    try {
      const response = await axios.get(`/api/exam-courses/${examCourse.id}/grades/${gradeId}/chapters`)
      setChaptersMap((prev) => ({
        ...prev,
        [gradeId]: response.data,
      }))
    } catch (error) {
      console.error(`Error fetching chapters for grade ${gradeId}:`, error)
      setChaptersMap((prev) => ({
        ...prev,
        [gradeId]: [],
      }))
    }
  }

  // Fetch all chapters for this course across all grades
  const fetchAllChaptersForCourse = async () => {
    try {
      const response = await axios.get(`/api/exam-courses/${examCourse.id}/chapters`)
      setAllChapters(response.data)
    } catch (error) {
      console.error("Error fetching all chapters:", error)
      setAllChapters([])
    }
  }

  // Get chapters for the active tab
  const getActiveChapters = () => {
    if (activeTab === "all") {
      return allChapters
    }
    return chaptersMap[activeTab] || []
  }

  // Handle grade selection change
  const handleGradeSelectionChange = (gradeId: number, checked: boolean) => {
    setSelectedGrades((prev) => (checked ? [...prev, gradeId] : prev.filter((id) => id !== gradeId)))
  }

  // Save updated grades
  const saveGradeChanges = async () => {
    try {
      setLoading(true)
      await axios.put(`/api/exam-courses/${examCourse.id}/grades`, {
        exam_grade_ids: selectedGrades,
      })

      toast({
        title: "Grades updated",
        description: "The grades for this course have been updated successfully.",
      })

      // Refresh data
      await fetchGradesForCourse()
    } catch (error) {
      console.error("Error updating grades:", error)
      toast({
        title: "Error",
        description: "Failed to update grades. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle chapter edit
  const handleEditChapter = (chapter: ExamChapter) => {
    setEditingChapter({ ...chapter })
  }

  // Save chapter changes
  const saveChapterChanges = async () => {
    if (!editingChapter) return

    try {
      setLoading(true)
      await axios.put(`/api/exam-chapters/${editingChapter.id}`, {
        title: editingChapter.title,
        sequence_order: editingChapter.sequence_order,
      })

      toast({
        title: "Chapter updated",
        description: "The chapter has been updated successfully.",
      })

      // Refresh data
      await fetchAllChaptersForCourse()
      if (activeTab !== "all") {
        await fetchChaptersForGrade(Number.parseInt(activeTab))
      }

      setEditingChapter(null)
    } catch (error) {
      console.error("Error updating chapter:", error)
      toast({
        title: "Error",
        description: "Failed to update chapter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add new chapter
  const addNewChapter = async () => {
    try {
      setLoading(true)

      const payload = {
        title: newChapter.title,
        sequence_order: newChapter.sequence_order,
        exam_course_id: examCourse.id,
        exam_grade_id: activeTab !== "all" ? Number.parseInt(activeTab) : undefined,
      }

      await axios.post(`/api/exam-chapters`, payload)

      toast({
        title: "Chapter added",
        description: "The new chapter has been added successfully.",
      })

      // Refresh data
      await fetchAllChaptersForCourse()
      if (activeTab !== "all") {
        await fetchChaptersForGrade(Number.parseInt(activeTab))
      }

      // Reset form
      setNewChapter({
        title: "",
        sequence_order: 1,
      })
      setIsAddingChapter(false)
    } catch (error) {
      console.error("Error adding chapter:", error)
      toast({
        title: "Error",
        description: "Failed to add chapter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete chapter
  const deleteChapter = async (chapterId: number) => {
    try {
      setLoading(true)
      await axios.delete(`/api/exam-chapters/${chapterId}`)

      toast({
        title: "Chapter deleted",
        description: "The chapter has been deleted successfully.",
      })

      // Refresh data
      await fetchAllChaptersForCourse()
      if (activeTab !== "all") {
        await fetchChaptersForGrade(Number.parseInt(activeTab))
      }
    } catch (error) {
      console.error("Error deleting chapter:", error)
      toast({
        title: "Error",
        description: "Failed to delete chapter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update course title
  const updateCourseTitle = async () => {
    if (!courseTitle.trim()) {
      toast({
        title: "Error",
        description: "Course title cannot be empty.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const response = await axios.put(`/api/exam-courses/${examCourse.id}`, {
        course_name: courseTitle,
      })

      toast({
        title: "Course updated",
        description: "The course title has been updated successfully.",
      })

      // Call the callback if provided
      if (onCourseUpdate) {
        onCourseUpdate({
          ...examCourse,
          course_name: courseTitle,
        })
      }

      setEditingCourseTitle(false)
    } catch (error) {
      console.error("Error updating course title:", error)
      toast({
        title: "Error",
        description: "Failed to update course title. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Eye className="h-4 w-4 mr-1" />
          Manage Chapters
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] h-[80vh] p-0 overflow-hidden flex flex-col">
        <div className="p-6 pb-2">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {editingCourseTitle ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="text-xl font-semibold"
                      placeholder="Enter course title"
                    />
                    <Button variant="outline" size="sm" onClick={updateCourseTitle}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCourseTitle(false)
                        setCourseTitle(examCourse.course_name)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <DialogTitle className="mr-2">Chapters for {examCourse.course_name}</DialogTitle>
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCourseTitle(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit course title</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <DialogDescription>
              {isEditMode
                ? "Edit chapters and associated grades for this course"
                : "View chapters across all associated grades"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading chapters...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditMode ? "Editing Mode" : "Edit Chapters & Grades"}
                </Button>

                {isEditMode && (
                  <Button variant="outline" size="sm" onClick={() => setIsAddingChapter(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Chapter
                  </Button>
                )}
              </div>

              {isEditMode && (
                <div className="mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-sm font-medium mb-2">Associated Grades</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableGrades.map((grade) => (
                      <div key={grade.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`grade-${grade.id}`}
                          checked={selectedGrades.includes(grade.id)}
                          onCheckedChange={(checked) => handleGradeSelectionChange(grade.id, checked as boolean)}
                        />
                        <Label htmlFor={`grade-${grade.id}`} className="text-sm">
                          Grade {grade.grade}
                          {grade.stream && <span className="ml-1 capitalize">({grade.stream})</span>}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3" onClick={saveGradeChanges}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Grade Changes
                  </Button>
                </div>
              )}

              {isAddingChapter && (
                <div className="mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-sm font-medium mb-2">Add New Chapter</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="chapter-title">Title</Label>
                      <Input
                        id="chapter-title"
                        value={newChapter.title}
                        onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                        placeholder="Enter chapter title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chapter-order">Sequence Order</Label>
                      <Input
                        id="chapter-order"
                        type="number"
                        value={newChapter.sequence_order}
                        onChange={(e) =>
                          setNewChapter({ ...newChapter, sequence_order: Number.parseInt(e.target.value) })
                        }
                        min={1}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="default" size="sm" onClick={addNewChapter} disabled={!newChapter.title}>
                        <Save className="h-4 w-4 mr-1" />
                        Save Chapter
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsAddingChapter(false)}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="mb-4 flex flex-wrap">
                  {/* <TabsTrigger value="all" className="mr-1 mb-1">
                    All Grades
                  </TabsTrigger> */}
                  {grades.map((grade) => (
                    <TabsTrigger key={grade.id} value={grade.id.toString()} className="mr-1 mb-1">
                      Grade {grade.grade}
                      {grade.stream && <span className="ml-1 capitalize">({grade.stream})</span>}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">
                      {activeTab === "all"
                        ? "All Chapters"
                        : grades.find((g) => g.id.toString() === activeTab)
                          ? `Grade ${grades.find((g) => g.id.toString() === activeTab)?.grade} 
                        ${
                          grades.find((g) => g.id.toString() === activeTab)?.stream
                            ? `(${grades.find((g) => g.id.toString() === activeTab)?.stream})`
                            : ""
                        }`
                          : "Chapters"}
                    </Badge>
                  </div>
                  <div className="border rounded-md overflow-auto">
                    <Table>
                      <TableHeader className="bg-muted sticky top-0">
                        <TableRow>
                          <TableHead className="w-[30%]">Title</TableHead>
                          <TableHead className="w-[15%]">Sequence Order</TableHead>
                          <TableHead className="w-[20%]">Created At</TableHead>
                          <TableHead className="w-[20%]">Updated At</TableHead>
                          {isEditMode && <TableHead className="w-[15%]">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getActiveChapters().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={isEditMode ? 5 : 4} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center">
                                <img src={"/images/Notebook-amico.svg"} alt="No data available" className="w-32 h-32" />
                                <p className="text-gray-500 mt-4">No chapters available for this selection</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          getActiveChapters().map((chapter) => (
                            <TableRow key={chapter.id}>
                              <TableCell className="font-medium">
                                {editingChapter?.id === chapter.id ? (
                                  <Input
                                    value={editingChapter.title}
                                    onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                                  />
                                ) : (
                                  chapter.title
                                )}
                              </TableCell>
                              <TableCell>
                                {editingChapter?.id === chapter.id ? (
                                  <Input
                                    type="number"
                                    value={editingChapter.sequence_order}
                                    onChange={(e) =>
                                      setEditingChapter({
                                        ...editingChapter,
                                        sequence_order: Number.parseInt(e.target.value),
                                      })
                                    }
                                    min={1}
                                    className="w-20"
                                  />
                                ) : (
                                  chapter.sequence_order
                                )}
                              </TableCell>
                              <TableCell>{new Date(chapter.created_at).toLocaleString()}</TableCell>
                              <TableCell>{new Date(chapter.updated_at).toLocaleString()}</TableCell>
                              {isEditMode && (
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {editingChapter?.id === chapter.id ? (
                                      <>
                                        <Button variant="outline" size="sm" onClick={saveChapterChanges}>
                                          <Save className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setEditingChapter(null)}>
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button variant="outline" size="sm" onClick={() => handleEditChapter(chapter)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete this chapter? This action cannot be
                                                undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => deleteChapter(chapter.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExamChapterView

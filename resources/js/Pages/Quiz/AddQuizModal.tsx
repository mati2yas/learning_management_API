import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"

interface AddQuizModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddQuizModal: React.FC<AddQuizModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Quiz</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input id="quiz-title" placeholder="Enter quiz title" />
          </div>
          <div>
            <Label htmlFor="quiz-description">Quiz Description</Label>
            <Textarea id="quiz-description" placeholder="Enter quiz description" />
          </div>
          <Button type="submit">Create Quiz</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddQuizModal


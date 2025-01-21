import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog'

interface AddQuizModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddQuizModal: React.FC<AddQuizModalProps> = ({ isOpen, onClose }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger asChild>
    
      </AlertDialogTrigger>
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
    </AlertDialog>
  )
}

export default AddQuizModal


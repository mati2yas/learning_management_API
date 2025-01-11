import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddContentModal: React.FC<AddContentModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="content-name">Content Name</Label>
            <Input id="content-name" placeholder="Enter content name" />
          </div>
          <div>
            <Label htmlFor="content-type">Content Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="content-url">Content URL</Label>
            <Input id="content-url" placeholder="Enter content URL" />
          </div>
          <Button type="submit">Add Content</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddContentModal


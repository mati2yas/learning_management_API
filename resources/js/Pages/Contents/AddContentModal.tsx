import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Checkbox } from "@/Components/ui/checkbox"
import { Progress } from "@/Components/ui/progress"
import { useForm } from '@inertiajs/react'

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
  chapterId: number
}

const AddContentModal: React.FC<AddContentModalProps> = ({ isOpen, onClose, chapterId }) => {
  const [contentType, setContentType] = useState({
    youtube: false,
    text: false,
    file: false,
  })

  const [uploadProgress, setUploadProgress] = useState(0)

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    order: '',
    youtube_url: '',
    text_content: '',
    file: null as File | null,
    chapter_id: chapterId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(data);

    post(route('contents.store'), {
      onSuccess: () => {
        reset()
        // onClose()
      },
      // preserveState: true,
      // preserveScroll: true,
      // forceFormData: true,
      onProgress: (progress) => {
        setUploadProgress(progress?.percentage ?? 0)
      },
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setData('file', file)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Content Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <Label>Content Type</Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="youtube"
                    checked={contentType.youtube}
                    onCheckedChange={(checked: boolean) => setContentType(prev => ({ ...prev, youtube: checked as boolean }))}
                  />
                  <Label htmlFor="youtube">YouTube</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="text"
                    checked={contentType.text}
                    onCheckedChange={(checked) => setContentType(prev => ({ ...prev, text: checked as boolean }))}
                  />
                  <Label htmlFor="text">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="file"
                    checked={contentType.file}
                    onCheckedChange={(checked) => setContentType(prev => ({ ...prev, file: checked as boolean }))}
                  />
                  <Label htmlFor="file">File</Label>
                </div>
              </div>
            </div>

            {contentType.youtube && (
              <div>
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  value={data.youtube_url}
                  onChange={e => setData('youtube_url', e.target.value)}
                />
                {errors.youtube_url && <p className="text-red-500 text-sm">{errors.youtube_url}</p>}
              </div>
            )}

            {contentType.text && (
              <div>
                <Label htmlFor="text_content">Text Content</Label>
                <Textarea
                  id="text_content"
                  value={data.text_content}
                  onChange={e => setData('text_content', e.target.value)}
                  rows={5}
                />
                {errors.text_content && <p className="text-red-500 text-sm">{errors.text_content}</p>}
              </div>
            )}

            {contentType.file && (
              <div>
                <Label htmlFor="file">File Upload</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                />
                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                {uploadProgress > 0 && (
                  <Progress value={uploadProgress} className="mt-2" />
                )}
              </div>
            )}

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={data.order}
                onChange={e => setData('order', e.target.value)}
                required
              />
              {errors.order && <p className="text-red-500 text-sm">{errors.order}</p>}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={processing}>
              Add Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddContentModal


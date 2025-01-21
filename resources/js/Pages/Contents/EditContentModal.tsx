import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useForm, router } from '@inertiajs/react'

interface Content {
  id: number
  name: string
  url?: string
  content?: string
  type: 'youtube' | 'document' | 'text'
  order: number
}

interface EditContentModalProps {
  isOpen: boolean
  onClose: () => void
  content: Content
}

const EditContentModal: React.FC<EditContentModalProps> = ({ isOpen, onClose, content }) => {
  const [contentType, setContentType] = useState<'youtube' | 'document' | 'text'>(content.type)
  
  const { data, setData, put, processing, errors, reset } = useForm({
    name: content.name,
    type: content.type,
    url: content.url || '',
    content: content.content || '',
    order: content.order,
  })

  useEffect(() => {
    setData({
      name: content.name,
      type: content.type,
      url: content.url || '',
      content: content.content || '',
      order: content.order,
    })
    setContentType(content.type)
  }, [content])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('contents.update', content.id), {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
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
              <Label htmlFor="type">Content Type</Label>
              <Select
                value={contentType}
                onValueChange={(value: 'youtube' | 'document' | 'text') => {
                  setContentType(value)
                  setData('type', value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="text">Text Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {contentType === 'youtube' && (
              <div>
                <Label htmlFor="url">YouTube URL</Label>
                <Input
                  id="url"
                  value={data.url}
                  onChange={e => setData('url', e.target.value)}
                  placeholder="https://youtu.be/example"
                  required
                />
                {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
              </div>
            )}
            {contentType === 'document' && (
              <div>
                <Label htmlFor="document">Upload Document</Label>
                <Input
                  id="document"
                  type="file"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setData('url', URL.createObjectURL(file))
                    }
                  }}
                  accept=".pdf,.doc,.docx"
                />
                {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
              </div>
            )}
            {contentType === 'text' && (
              <div>
                <Label htmlFor="content">Text Content</Label>
                <Textarea
                  id="content"
                  value={data.content}
                  onChange={e => setData('content', e.target.value)}
                  rows={5}
                  required
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
              </div>
            )}
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={data.order}
                onChange={e => setData('order', parseInt(e.target.value))}
                required
              />
              {errors.order && <p className="text-red-500 text-sm">{errors.order}</p>}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={processing}>
              Update Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditContentModal


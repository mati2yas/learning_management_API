'use client'

import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

interface Category {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  grade_name: string;
  category_id: number;
}

interface Department {
  id: number;
  name: string;
  category_id: number;
}

interface Batch {
  id: number;
  name: string;
  department_id: number;
}

interface CreateCourseAlertProps {
  categories: Category[];
  grades: Grade[];
  departments: Department[];
  batches: Batch[];
}

export function CreateCourseAlert({ categories, grades, departments, batches }: CreateCourseAlertProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    category_id: '',
    grade_id: '',
    stream: '',
    department_id: '',
    batch_id: '',
    number_of_topics: '',
    thumbnail: null as File | null,
  });

  const closeDialog = () => {
    setIsOpen(false);
    reset();
  };

  const handleCategoryChange = (value: string) => {
    setData('category_id', value);
    setData('grade_id', '');
    setData('department_id', '');
    setData('batch_id', '');
  };

  const handleGradeChange = (value: string) => {
    setData('grade_id', value);
    setData('department_id', '');
    setData('batch_id', '');
    if (value === '11' || value === '12') {
      setData('stream', 'social');
    } else {
      setData('stream', '');
    }
  };

  const handleDepartmentChange = (value: string) => {
    setData('department_id', value);
    setData('grade_id', '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('thumbnail', e.target.files[0]);
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('courses.store'), {
      onSuccess: () => {
        // toast('A course has been created')
        closeDialog();
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
      },
    });
  };


  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          Add Course
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Course</AlertDialogTitle>
          <AlertDialogDescription>
            Fill all the required data
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center items-center">
          <form onSubmit={submit}>
            <div className="mb-4">
              <InputLabel htmlFor="name" value="Course Name" />
              <TextInput
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="category" value="Category" />
              <Select
                value={data.category_id}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.category_id} className="mt-2" />
            </div>

            {data.category_id && (
              <div className="mb-4">
                <InputLabel htmlFor="grade" value="Grade" />
                <Select
                  value={data.grade_id}
                  onValueChange={handleGradeChange}
                  disabled={!!data.department_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                  {grades
                    .filter((grade) => grade.category_id.toString() === data.category_id)
                    .map((grade) => (
                      <SelectItem key={grade.id} value={grade.id.toString()}>
                        {grade.grade_name || 'Grade'}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
                <InputError message={errors.grade_id} className="mt-2" />
              </div>
            )}

            {(data.grade_id === '11' || data.grade_id === '12') && (
              <div className="mb-4">
                <InputLabel htmlFor="stream" value="Stream" />
                <Select
                  value={data.stream}
                  onValueChange={(value) => setData('stream', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.stream} className="mt-2" />
              </div>
            )}

            {data.category_id && (
              <div className="mb-4">
                <InputLabel htmlFor="department" value="Department" />
                <Select
                  value={data.department_id}
                  onValueChange={handleDepartmentChange}
                  disabled={!!data.grade_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter((dept) => dept.category_id.toString() === data.category_id)
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.department_id} className="mt-2" />
              </div>
            )}

            {data.department_id && (
              <div className="mb-4">
                <InputLabel htmlFor="batch" value="Batch" />
                <Select
                  value={data.batch_id}
                  onValueChange={(value) => setData('batch_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches
                      .filter((batch) => batch.department_id.toString() === data.department_id)
                      .map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.batch_id} className="mt-2" />
              </div>
            )}

            <div className="mb-4">
              <InputLabel htmlFor="number_of_topics" value="Number of Topics" />
              <TextInput
                id="number_of_topics"
                name="number_of_topics"
                type="number"
                value={data.number_of_topics}
                onChange={(e) => setData('number_of_topics', e.target.value)}
                required
              />
              <InputError message={errors.number_of_topics} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="thumbnail" value="Course Thumbnail" />
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full"
              />
              <InputError message={errors.thumbnail} className="mt-2" />
            </div>

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel onClick={closeDialog}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction>
                <PrimaryButton type="submit" disabled={processing}>
                  Add Course
                </PrimaryButton>
              </AlertDialogAction>
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

